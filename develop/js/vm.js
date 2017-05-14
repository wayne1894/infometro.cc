var vm = new Vue({
  el: '#main',
  data: {
    blueprint : [],
    index : [],
    index_blueprint: 0,
    index_line: -1 ,
    key_metro : "",
    action : "load",
    info : [],
    users: [],
    mode : 1,
    pick_master :undefined,
    pick_color :undefined,
	url_info : undefined,
    filter_search:""
  },updated : function(){
    setTimeout(function(){
      $(window).resize();
    },0);
    $("#board_info .ui.active").show();
  },firebase: {
    //watch:key_metro
  },computed: {
   master_line_color: function(){//主線目前一律是line 0
     if(this.blueprint.length==0)return false;
     if(this.pick_color && this.pick_master)return this.pick_color
     return this.get_blueprint().line[0].color;
   },
   line : function(){//載入line
     if(this.blueprint.length==0)return false;
     return this.get_blueprint().line;
   },
   line_name : function(){
     if(this.blueprint.length==0)return "";
     return this.get_line().name;
   },
   line_color : function(){
     if(this.blueprint.length==0)return "";
     if(this.pick_color && !this.pick_master)return this.pick_color
     return this.get_line().color;
   },
   metro : function(){//載入metro
     if(this.blueprint.length==0)return false;
     return this.get_line().metro;
   },
   metro_name : function(){
     if(this.blueprint.length==0)return "";
     return this.get_metro().name;
   },
   metro_create : function(){
     if(this.blueprint.length==0)return "";
     var timestamp= this.get_metro().timestamp;
     if(timestamp==undefined) return "";
     //http://momentjs.com/
     return moment(timestamp).format("lll");
   },
   info_count : function(){
     if(this.blueprint.length==0)return "";
     return this.info.length;
   },
   info_favorites : function(){
     var _info=this.info.filter(function (info) {
       if(info.favorite){
         if(info.url_info){//有網址資訊
           return true
         }else{
           return false
         }
       }
       return false;
     }); 
     if(_info.length==0)return false
     return _info
   },
   info_sort_filter : function(){//資訊的排序
     var _sort=this.info.sort(function(a,b){
         if(a.timestamp>b.timestamp)return 1;//先照timestamp
         return -1;
     });
     _sort=_sort.sort(function(a,b){
         if(a.favorite)return -1;//在照favorite
         return 1;
     });
    return _sort.filter(function(info) {
      return info.message.indexOf(vm.filter_search) > -1
    })

   },
   user_photo: function(){
     var url=this.users.photo;
    //https://semantic-ui.com/views/card.html
    if(!url){
      return "https://semantic-ui.com/images/avatar/large/steve.jpg";
    }
    return url;
   }
  },filters: {
    message_filter : function(message){
      message=message.replace(/\</g,"&lt;");
      message=message.replace(/\>/g,"&gt;");
      message=message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      message=urlify(message);//轉成超連結
      message=message.replace(/ /g, "&nbsp;");
      message=message.replace(/\<a&nbsp;href=/g,"<a href="); 
      setTimeout(function(){
         $("#board_info").find("a").css("color",vm.line_color).attr("target","_blank");
      },5)
      return message;
    }
  },watch: {
    key_metro : function(){
      //https://github.com/vuejs/vuefire
      var _ref=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByKey();
      vm.$bindAsArray('info',_ref);
      var _index= this.index[this.index_blueprint][this.index_line];
      _index.key_metro=this.key_metro;
      vm.index_update();
      
      vm.leave_edit_info();
    }
  },methods: {
      get_favorite_style: function(favorite,color){
          if(favorite){
              return{
                  color: color
              }
          }
          return {}
      },
     is_master :function(){
       if(this.blueprint.length==0)return "";
       if(vm.index_line==0)return true
       return false
     },
    color_gradient :function(color){
      return "linear-gradient(to right, #000 50%, "+color+" 0%)";
    },
    mode_txt:function(){
      if(this.mode==0){ //一般模式
         setTimeout(function(){sortable["metro"].option("disabled", true);},5)
        return "一般模式"
      }else if(this.mode==1){//編輯模式
        setTimeout(function(){sortable["metro"].option("disabled", false);},5)
        return "編輯模式"
      }else if(this.mode==1.5){
        return "編輯模式"
      }else if(this.mode==2){//導覽模式
       setTimeout(function(){sortable["metro"].option("disabled", true);},5)
        return "導覽模式"
      }
    },
    mode_click: function(){
      var mode_num=this.mode;
      mode_num=Math.floor(mode_num+1);
      if(mode_num>1)mode_num=0;
      this.mode=mode_num;
    },
    mode_class: function(){
      if(this.mode==0){ //一般模式
        //male,mouse pointer
        return "male"
      }else if(this.mode==1){//編輯模式
        //wizard
        return "configure"
      }else if(this.mode==1.5){
        return "trash"
      }else if(this.mode==2){//導覽模式
        return "help circle outline"
      }
    },
    index_update : function(){
      DB.ref('users_data/' + user_uid +"/index").set(vm.index);
    },
    更新藍圖 :function (key,data,fn){
      if(key==undefined || data==undefined){
        data=vm.get_blueprint();
        key=data.key;
      }
      DB.ref('blueprint/' + user_uid +"/"+key).update(data).then(fn);
    },get_blueprint : function(index){ //得到當前藍圖
      if(index!=undefined)return this.blueprint[index];
      return this.blueprint[this.index_blueprint];
    },get_index_blueprint : function(){ //得到當前藍圖索引資料
      return vm.index[vm.index_blueprint];
    },get_line : function(){//得到當前支線
      var _blueprint=this.get_blueprint();
      return _blueprint.line[this.index_line];
    },get_index_line : function(){ //得到當前支線索引資料
      return vm.index[vm.index_blueprint][vm.index_line];
    },update_index_line :function(index_array){
      var _index=0;
      for(var i=0;i<index_array.length;i++){
        if(index_array[i].check){
          _index=i;
          break;
        }
      }
      vm.index_line=_index;
    },update_index_blueprint_line_check : function(){
      var index_array=vm.get_index_blueprint();
      for(var i=0;i<index_array.length;i++){
        index_array[i].check=false;
      }
      index_array[vm.index_line].check=true;
      
      
      //更換selection的顏色
      var _color=vm.line_color;
      if(!document.getElementById("selection")){
          var style = document.createElement('style');
          style.id = 'selection';
          style.type = 'text/css';
          document.getElementsByTagName('head')[0].appendChild(style);
      }
      //print(vm.master_line_color)
      document.getElementById("selection").innerHTML="::selection {background: "+_color+";color: #fff;}::-moz-selection {background: "+_color+";color: #fff;}img::selection {background: "+_color+";color: #fff;}img::-moz-selection {background: "+_color+";color: #fff;}";


      
    },update_metro_key : function(index_array){
      var _metro=this.get_line().metro;
      if(index_array.key_metro){//代表有選到的結點
        for(var i=0;i<_metro.length;i++){
          if(_metro[i]._key==index_array.key_metro){
            vm.key_metro=_metro[i]._key;
            break;
          }
        }
      }else{//使用預設
        vm.key_metro=_metro[0]._key;
      }
      
    },new_blueprint : function(){//新增藍圖
      vm.action="new_blueprint";
      var newRef=DB.ref('blueprint/' + user_uid).push();
      var newLine=[];
      newLine.push(line_json("橘線","#FF6900",true));//新增第一條線
      newLine[newLine.length-1].metro.push(metro_json("總站"));//第一條線下面的站
      newRef.set({//將他存到藍圖
        name: "我的地鐵計畫",
        line : newLine
      })
    },delete_blueprint : function (key,index){//刪除藍圖
	  vm.action="delete_blueprint";
      var _line=vm.blueprint[index].line;
      for(var i=0;i<_line.length;i++){
        this.delete_info_line(_line[i]._key);
      }
      vm.index.splice(index,1);
      if(vm.index_blueprint>=index){//刪除到小於自已-就往前倒退索引
        var new_index=index-1;
        if(new_index<0)new_index=0;
        vm.index_blueprint=new_index;//重新安排
      }
      DB.ref('blueprint/' + user_uid+"/"+key).remove();
    },exchange_blueprint : function(index,target){//切換藍圖
      if(event==undefined)return
      if($(event.target).hasClass("blueprint_i"))return;
	  $("#top_tag").stop().fadeOut(0);
      $.cookie("index_blueprint",index);
      var _event=event;
      if($("html").hasClass("re_name")){//解決編輯按兩下的BUG
        return setTimeout(function(){
          _eb();
        },0);
      }
      _eb();
      function _eb(){
        if(_event && _event.target){
          if(_event.target.className!=undefined){
            if(_event.target.className.indexOf("blueprint_a")>-1 || _event.target.className.indexOf("blueprint_i")>-1){
              target=true;
            }
          }
        }
        if(target){
          vm.index_blueprint=index;
          vm.update_index_line(vm.index[index]);
          vm.update_index_blueprint_line_check();
          vm.update_metro_key(vm.index[index][vm.index_line]);
        }
       setTimeout(move_center,0);
      }
    },check_blueprint : function(index){
      if(this.index_blueprint==index){
        return "check";
      }
    },exchange_line : function(index){
      if(vm.index_line==index)return;//重覆就離開
      $("#top_tag").stop().fadeOut(0);
      if($("html").hasClass("re_name")){//解決編輯按兩下的BUG
        return setTimeout(function(){
          _el();
        },0)
      }
      _el();
      function _el(){
        vm.index_line=index;
        if(!vm.get_index_blueprint()[index])vm.replace_index();//重新設定index
        vm.update_index_blueprint_line_check();
        vm.update_metro_key(vm.get_index_blueprint()[index]);
        setTimeout(move_center,0);
      }
    },replace_index :function(){
      var _line=vm.get_blueprint().line;
      var _index_blueprint=vm.get_index_blueprint();
      var j=_line.length-_index_blueprint.length;
      print("重新設定index");
      for(var i=0;i<j;i++){
        _index_blueprint.push([]);//新增line的index陣列
      }
    },check_line : function(index){
      if(this.index_line==index)return "check";
    },new_line : function(){
      vm.action="new_line";
      var data=this.get_blueprint();
      if(!data.line)data.line=[];//如果沒有line就新增一個空陣列
      var get_color= vm.get_default_color(data.line.length);
      var _j=line_json("未命名",get_color);
      _j.metro.push(metro_json("總站"));
      data.line.push(_j);
	  vm.get_index_blueprint().push([]);//新增line的index陣列
      this.更新藍圖(data.key,data);
    },delete_line : function(index){
      var data=this.get_blueprint();
      var key=data.line[index]._key;
      data.line.splice(index,1);
      if(vm.index_line>=index){//刪除到小於自已-就往前倒退索引(同刪除藍圖)
        var new_index=index-1;
        if(new_index<0)new_index=0;
        vm.index_line=new_index;//重新安排
      } 
      vm.get_index_blueprint().splice(index,1);//移除line的index陣列
      vm.update_metro_key(vm.get_index_line())
      this.更新藍圖(data.key,data);
      this.delete_info_line(key);
    },get_line_key :function(){
      return vm.get_line()._key;
    },new_metro : function (order){
      var _metro=metro_json("未命名");
      var data=JSON.parse(JSON.stringify(this.get_blueprint()));//將傳址改為傳值
      data.line[vm.index_line].metro.splice(order,0,_metro);
      this.更新藍圖(data.key,data);
      setTimeout(move_center,0);
    },check_metro : function(key){
      if(vm.key_metro==key){
        var _color=this.get_line().color;
        return "background-color: "+_color;
      }
    },exchange_metro : function(key){
      this.key_metro=key;
    },move_metro : function(index){
      var data=this.get_blueprint();
      var old_metro_key=data.line[this.index_line].metro[index]._key;
      if(data.line[this.index_line].metro.length<=1)return
      var _metro=data.line[this.index_line].metro.splice(index,1);
      if(this.key_metro==old_metro_key){//代表刪到選取的站
        var _index=index-1;
        if(_index<0)_index=0;
        var new_metro_key=data.line[this.index_line].metro[_index]._key;
        this.key_metro=new_metro_key;
      }
      return _metro
    },delete_metro : function(index){//與move_metro雷同
      var data=JSON.parse(JSON.stringify(this.get_blueprint()));//將傳址改為傳值
      var old_metro_key=data.line[this.index_line].metro[index]._key;
      if(data.line[this.index_line].metro.length<=1)return
      data.line[this.index_line].metro.splice(index,1);
      if(this.key_metro==old_metro_key){//代表刪到選取的站
        var _index=index-1;
        if(_index<0)_index=0;
        var new_metro_key=data.line[this.index_line].metro[_index]._key;
        this.key_metro=new_metro_key;
      }
      this.更新藍圖(data.key,data);
      DB.ref("info/" + data.line[this.index_line]._key + "/metro").child(old_metro_key).remove();
    },get_metro : function(){
      var _line=this.get_line();
			var _key_metro=vm.key_metro;
			var _m=_line.metro;
			var _index=0
			for(var i=0;i<_line.metro.length;i++){
				if(_line.metro[i]._key==_key_metro){
					_index=i;
					break;
				}
			}
      return _line.metro[_index];
    },new_info : function(){ //新增資訊
      var board_textarea=$.trim($("#board_textarea").val());
      if(board_textarea=="")return;
      var _data ={
        message : board_textarea ,
        favorite : false ,
        timestamp : firebase.database.ServerValue.TIMESTAMP,
        users : user_uid
      }
      if(vm.url_info)_data.url_info=vm.url_info;
      vm.url_info=undefined ;//清掉
      $("#board_textarea").val("");//清掉
      DB.ref('info/' + vm.get_line_key() + "/metro/"+ vm.key_metro).push(_data);
    },delete_info : function(key){ //刪除資訊
      DB.ref('info/' + vm.get_line_key() + "/metro/"+ vm.key_metro).child(key).remove();
    },delete_info_line : function(_line_key){//從info最上層的line刪除
      DB.ref("info/" + _line_key + "/metro").remove();
      DB.ref("info/" + _line_key + "/root").remove();
    },favorite_info : function(item){
      DB.ref('info/' + vm.get_line_key() + "/metro/"+ vm.key_metro).child(item[".key"]).update({favorite : !item.favorite});
    },edit_info :function(item){
      $("html").addClass("re_name");
      var _key=item[".key"];
      var $target_parent=$(event.target).closest(".board_list");
      $target_parent.addClass("edit");
      var $textarea=$target_parent.find("textarea");
      $textarea.val(item.message).focus();
      $(document.body).on("keyup.textarea",function(event){
        if(event.keyCode==27){
          vm.leave_edit_info($target_parent);
        }
      })
      $target_parent.find("button.send").one("click",function(){
        vm.leave_edit_info($target_parent);
        DB.ref('info/' + vm.get_line_key() + "/metro/"+ vm.key_metro).child(_key).update({
          message : $.trim($textarea.val()),
          update_timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      })
       $target_parent.find("button.cancel").one("click",function(){
          vm.leave_edit_info($target_parent);
       })
     

    },leave_edit_info :function($target){
      if(!$(".board_list").hasClass("edit"))return
      $(document).one("click",function(){//解決出現Chrome英文翻譯的問題
        $("html").removeClass("re_name");
      })
      if($target){
        $target.removeClass("edit");
      }else{
        $(".board_list").removeClass("edit");
      }
      $(document.body).off("keyup.textarea");
    },re_name : function(index,_level){//重新命名(共用)
      if($(event.target).hasClass("blueprint_i"))return;
      $("html").addClass("re_name");
      var $level_list=$(event.target).closest("."+_level+"_list");
      $level_list.addClass("edit");
      if(sortable[_level])sortable[_level].option("disabled", true);
      var _name=get_level().name;
      var $level_list_input=$level_list.find("."+_level+"_input");
      $level_list_input.select().on("keyup."+_level+"_input",function(event){
        if(event.which==13){//enter
          edit_set();
          vm.更新藍圖();
        }else if(event.which==27){//esc
          edit_set();
          get_level().name=_name;
        }
      })
      setTimeout(function(){
        $(document).on("click."+_level+"_input",function(event){
          if(event.target.className.indexOf(""+_level+"_input")==-1){
            edit_set();
            get_level().name=_name;
          };
        })
      },5);
      function get_level(){
        if(_level=="blueprint"){
          return vm.blueprint[index];
        }else if(_level=="line"){
          return vm.get_blueprint().line[index];
        }else if(_level=="metro"){
          return vm.get_line().metro[index];
        }
      }
      function edit_set(){
       $(document).one("click",function(){//解決出現Chrome英文翻譯的問題
         $("html").removeClass("re_name");
       })
        $level_list.removeClass("edit");
        if(sortable[_level])sortable[_level].option("disabled", false);
        $level_list_input.off("keyup."+_level+"_input");
        $(document).off("click."+_level+"_input");
      }
    },get_default_color : function(k){
        var c=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][k];
        if(!c)return "#000000";
        return c;
    },open_color : function(index,color,master){//打開色票選擇器(line)
      color=color.split("#")[1];
      var $et=$(event.target);
      var _left=$et.offset().left;
      var _top=$et.offset().top + $et.height()+2;
      vm.pick_master=master;
      $("#left_color").css({
        "left" : _left,
        "top" : _top
      }).colpickSetColor(color).colpickShow();
      $(".colpick_submit").off("click.op").on("click.op",function(){
        vm.get_blueprint().line[index].color="#"+$("#left_color").val();
        vm.更新藍圖();
        $(this).off("click.op");
      });
    },swap_list : function(oldIndex,newIndex){
	  if(oldIndex==newIndex)return;
	  vm.action="swap_list";
      var data=JSON.parse(JSON.stringify(this.get_blueprint()));//將傳址改為傳值
      var new_line=[];
      var new_index=[];
      $("#line_drag li").each(function(){
        var index_key=get_key($(this).data("key"));
        new_line.push(data.line[index_key]);
        new_index.push(vm.index[vm.index_blueprint][index_key]);
      })
      data.line=new_line;
      vm.index[vm.index_blueprint]=new_index;
	  vm.update_index_line(new_index)
      vm.更新藍圖(data.key,data);
	  function get_key(key){
        for(var i=0;i<data.line.length;i++){
          if(data.line[i]._key==key)return i;
        }
      }
    },swap_metro : function(oldIndex,newIndex){
      if(oldIndex==newIndex)return;
      var data=JSON.parse(JSON.stringify(this.get_blueprint()));//將傳址改為傳值
      var data_metro=data.line[this.index_line].metro
      function get_key(key){
        for(var i=0;i<data_metro.length;i++){
          if(data_metro[i]._key==key)return i;
        }
      };
      var new_metro=[];
      $("#top_tag li").each(function(){
        var index_key=get_key($(this).data("key"));
        new_metro.push(data_metro[index_key]);
      });
      data.line[this.index_line].metro=new_metro;
      vm.更新藍圖(data.key,data);
    }
  }
})
