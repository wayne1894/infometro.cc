var vm_header=new Vue({
	el: '#header_main',
	data: {
	  users: []
	}
})
var vm = new Vue({
  el: '#main',
  data: {
    blueprint: [],
    index: [],
    index_blueprint: 0,
    index_line: 0,
    info_active: "",
    key_metro: "",
    action: "load",
    action_move: 0,
    info: [],
    users: [],
    mode: 0,
    pick_color: undefined,
    url_info: undefined,
    filter_search: "",
    is_nav: false ,
    search_info : [],
    search_metro : [],
    drag_line_key : "",
    drag_metro_key : "",
    lightning : [],
    copy_info : []
  },
  mounted: function () {
    $("#main").css("visibility", "visible");
  },
  updated: function () {
    setTimeout(function () {
      $(window).resize();
    }, 0);
    $("#board_info .ui.active").show();
    if(vm.action_move==1)setTimeout(move_center, 0);
  },
  firebase: {
    //watch:key_metros
    //lightning
  },
  computed: {
    loading_blueprint :function(){
       if (this.blueprint.length >0) return true;
    },
    line_color: function () { //主線目前一律是line 0
      if (this.blueprint.length == 0) return "";
      if (this.pick_color) return this.pick_color;
      return this.get_blueprint().line[0].color;
    },
    line: function () { //載入line
      if (this.blueprint.length == 0) return "";
      return this.get_blueprint().line;
    },
    line_color: function (index) {
      if (this.blueprint.length == 0) return "";
      if (this.pick_color) return this.pick_color
      return this.get_line().color;
    },
    metro: function () { //載入metro
      if (this.blueprint.length == 0) return "";
      var _line=this.get_line();
      if(_line==undefined)vm.exchange_line(0);
      return _line.metro;
    },
    line_name: function(){
      if (this.blueprint.length == 0) return "";
      return this.get_line().name;
    },
    metro_name: function () {
      return this.get_metro().name;
    },
    metro_create: function () {
      if (this.blueprint.length == 0) return "";
      var timestamp = this.get_metro().timestamp;
      if (timestamp == undefined) return "";
      //http://momentjs.com/
      return moment(timestamp).format("lll");
    },
    info_count: function () {
      if (this.blueprint.length == 0) return "";
      return this.info.length;
    },
    info_favorites: function () {
      var _info = this.info.filter(function (info) {
        if (info.favorite) {
          if (info.url_info) { //有網址資訊
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
      if (_info.length == 0) return false;
      return _info;
    },
    info_sort_filter: function () { //資訊的排序與過濾
		if (this.blueprint.length == 0) return "";
	  	var _sort=this.info;
			if(vm.filter_search){
				_sort=_sort.filter(function (info) { //先從濾鏡開始
					return info.message.indexOf(vm.filter_search) > -1
				})
			}
			var favorites_sort=[];
			var new_sort=[];
			for(var i=0;i<_sort.length;i++){
				if(_sort[i].favorite){
					favorites_sort.push(_sort[i]);
				}else{
					new_sort.push(_sort[i]);
				}
			}
//      new_sort = new_sort.sort(function (a, b) {
//        if (a.update_timestamp > b.update_timestamp) return -1; //照timestamp
//        return 1;
//      });
			return [].concat(new_sort,favorites_sort);

    },
    lightning_sort:function(){
      var _sort=this.lightning;
      _sort = _sort.sort(function (a, b) {
        if (a.timestamp > b.timestamp) return -1; //照timestamp
        return 1;
      });
      return _sort;
    }
  },
  filters: {
    message_filter: function (message,target) {
	 if(message==undefined)return
      message = message.replace(/\</g, "&lt;");
      message = message.replace(/\>/g, "&gt;");
      message = urlify(message); //轉成超連結
      message = message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      message = message.replace(/ /g, "&nbsp;");
      message = message.replace(/\<a&nbsp;href=/g, "<a href=");
      setTimeout(function () {
        if(target=="right"){
          $("#right .right_main").find("a").attr("target", "_blank");
        }else{
          $("#board_info .info_message").find("a").css("color", vm.line_color).attr("target", "_blank");
        }
      }, 5);
      return message;
    }
  },
  watch: {
    info_active: function () {
      var _index = this.get_index_line();
      if (!_index.info_active) _index.info_active = [];
      _index.info_active[vm.key_metro] = this.info_active || "";
      vm.index_update();
    },
    key_metro: function () {
      //https://github.com/vuejs/vuefire
      var _ref = DB.ref("info/" + vm.get_line_key() + "/metro/" + vm.key_metro).orderByChild("update_timestamp");
      vm.$bindAsArray('info', _ref);
      var _index = this.get_index_line();
      _index.key_metro = this.key_metro;
      if (_index.info_active) { //等下會更新到，這邊就不用更新了
        var _active = _index.info_active[this.key_metro];
        this.info_active = _active;
        // setTimeout(function(){
        //   $("#"+_active).velocity("scroll",{duration: 0,offset: -250});
        // },50);

      } else {
        vm.index_update();
      }
      vm.leave_edit_info();
      _ref.on("child_added", function (snapshot) { //元件載入後的動作
        setTimeout(function () {
          $("#board_info .dropdown").dropdown("destroy").dropdown();
        }, 5);
      })
    },
    index_blueprint:function(){
        //代入即時資訊
        if (vm.blueprint.length == 0) return "";
//			lighning_bind();
    }
  },
  methods: {
    lightning_create : function (timestamp){
      //http://momentjs.com/
      return moment(timestamp).endOf('hour').fromNow();
    },
    delete_lightning: function (key,event) {
      var $target_parent = $(event.target).closest(".lightning_item");
      var $delete_info = $target_parent.find("._modal_info");
      if(!$delete_info.length){
        $delete_info=$target_parent.append(delete_modal_html());
      }
      $target_parent.find("._modal_but").css("margin-bottom","10px");
      //https://semantic-ui.com/modules/dimmer.html
      //opacity : 0.7,
      $delete_info.dimmer({
        duration: {
          show: 400,
          hide: 0
        }
      }).dimmer('show');
      $delete_info.find(".send").off("click").on("click", function () {
        DB.ref('users_data/' + user_uid +"/lightning/"+vm.get_blueprint().key+"/"+key).remove();
        $delete_info.dimmer('hide');
      });
      $delete_info.find(".cancel").off("click").on("click", function () {
        $delete_info.dimmer('hide');
      })
    },
    lightning_click : function(event){
      var $target=$(event.target).closest(".lightning_item");
      $target.addClass("active").siblings().removeClass("active");
    },
    img_file : function(name){
      if(name=="" || name==undefined)return
      name=name.toLowerCase()
      if(name.indexOf("png")>-1 || name.indexOf("gif")>-1 || name.indexOf("jpg")>-1 || name.indexOf("jpeg")>-1){
        return true;
      }
    },
    get_img_embed_url: function(){//與下面相同
        if(vm.url_info.image){
            var img = new Image();
            img.src = vm.url_info.image;
            img.onload = function(){
              $("#url_info_board").find(".url_img").attr("src", img.src);

              if(Math.abs(img.width / img.height -1)>0.45){//代表長寬比比較大
                  $("#url_info_board").addClass("flex_item");
              }else{
                  $("#url_info_board").addClass("flex_item_row");
              }
            }
        }
    },
    get_img_embed: function (item) {//與上面相同
      if (item.url_info){
        if (item.url_info.youtube) {
          setTimeout(function () {
              //https://semantic-ui.com/modules/embed.html#/definition
              //autoplay: true
              $("#" + item['.key']).find(".ui.embed:not(.active)").embed();
          }, 5);
          return "flex_item youtube"; //順便傳回class
        }else if(item.url_info.image){
          var img = new Image();
          img.src = item.url_info.image;
          img.onload = function(){
              var $f_key=$("#" + item['.key']);
              $f_key.find(".url_img").attr("src", img.src);
              if(Math.abs(img.width / img.height -1)>0.45){//代表長寬比比較大
                $f_key.find(".item_url_info").addClass("flex_item");
              }else{
                $f_key.find(".item_url_info").addClass("flex_item_row");
              }
          }
        }
      }
    },
    get_favorite_style: function (favorite, color) {
      if (favorite) {
        return {
          color: color
        }
      }
      return {}
    },
    color_gradient: function (color) {
      return "linear-gradient(to right, #000 50%, " + color + " 0%)";
    },
    mode_txt: function () {
      if (this.blueprint.length == 0) return "";
      if (this.mode == 0) { //一般模式
//        setTimeout(function () {
//          sortable["metro"].option("disabled", true);
//          sortable["line"].option("disabled", true);
//        }, 5)
        return "一般模式"
      } else if (this.mode == 1) { //編輯模式
//        setTimeout(function () {
//          sortable["metro"].option("disabled", false);
//          sortable["line"].option("disabled", false);
//        }, 5)
        return "編輯模式"
      } else if (this.mode == 1.5) {
        return "編輯模式"
      }
    },
    mode_click: function () {
      var mode_num = this.mode;
      mode_num = Math.floor(mode_num + 1);
      if (mode_num > 1) mode_num = 0;
      this.mode = mode_num;
    },
    mode_class: function () {
      if (this.mode == 0) { //一般模式
        //male,mouse pointer
        return "male"
      } else if (this.mode == 1) { //編輯模式
        //wizard
        return "configure"
      } else if (this.mode == 1.5) {
        return "trash"
      }
    },
    index_update: function () {
      DB.ref("users_data/" + user_uid + "/index").set(vm.index);
    },
    update_blueprint: function (key, data) {
      if (key == undefined || data == undefined) {
        data = vm.get_blueprint();
        key = data.key;
      }
      setTimeout(function () {
        DB.ref('blueprint/' + user_uid + "/" + key).set(data);
      }, 0)

    },
    get_blueprint: function (index) { //得到藍圖(傳入index為其他藍圖)
      if (index != undefined) return this.blueprint[index];
      return this.blueprint[this.index_blueprint];
    },
    get_index_blueprint: function () { //得到當前藍圖索引資料
      return vm.index[vm.index_blueprint];
    },
    get_line: function () {
      return this.get_blueprint().line[this.index_line]
    },
    get_index_line: function () { //得到當前支線索引資料
      var _index=vm.index[vm.index_blueprint][vm.index_line];
      if(typeof _index!="object"){
         print("索引變字串");
         vm.index[vm.index_blueprint][vm.index_line]={}
         vm.index[vm.index_blueprint][vm.index_line].check=false;
        return vm.index[vm.index_blueprint][vm.index_line]
      }else{
        return _index;
      }
    },
    update_index_line: function (index_array) {
      var _index = 0;
      for (var i = 0; i < index_array.length; i++) {
        if (!index_array[i]) {
          index_array[i] = [];
          index_array[i].check = false;
        }
        if (index_array[i].check) {
          _index = i;
          break;
        }
      }
      vm.index_line = _index;
    },
    update_index_line_check: function () {
      var index_array = vm.get_index_blueprint();
      for (var i = 0; i < index_array.length; i++) {
        if (!index_array[i]) index_array[i] = [];
        index_array[i].check = false;
      }
      index_array[vm.index_line].check = true;
    },
    update_selection_color: function () { //更換selection的顏色
      var _color = vm.line_color;
      if (!document.getElementById("selection")) {
        var style = document.createElement('style');
        style.id = 'selection';
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
      }
      document.getElementById("selection").innerHTML = "::selection {background: " + _color + ";color: #fff;}::-moz-selection {background: " + _color + ";color: #fff;}img::selection {background: " + _color + ";color: #fff;}img::-moz-selection {background: " + _color + ";color: #fff;}";
    },
    update_metro_key: function (index_array) {
      var _metro = this.get_line().metro;
      var is_check = false;
      if (index_array.key_metro) { //代表有選到的結點
        for (var i = 0; i < _metro.length; i++) {
          if (_metro[i]._key == index_array.key_metro) {
            vm.key_metro = _metro[i]._key;
            is_check = true;
            break;
          }
        }
        if (!is_check) vm.key_metro = _metro[0]._key; //如果都沒有把第一個給他(或選中間)
      } else { //使用預設		
        vm.key_metro = _metro[0]._key; //如果都沒有把第一個給他(或選中間)
      }

    },
    check_error_index: function (index,_vm_blueprint) { //修補程式(不常發生)
      if (!_vm_blueprint[index]) return ;
      if (_vm_blueprint[index].line.length != vm.index[index].length) {
        var _line = _vm_blueprint[index].line;
        var _index = vm.index[index];
        var index_array = []
        for (var i = 0; i < _line.length; i++) {
          if (vm.index[index][i]!=undefined) {
            index_array.push(vm.index[index][i]);
          } else {
            index_array.push({check:false});
            index_array[index_array.length - 1].check = false;
          }
        }
        print("重新更新索引");
        vm.index[index] = index_array;
      }
    },
    exchange_blueprint: function (index, target, event) { //切換藍圖
      if (vm.action != "load" && vm.index_blueprint == index) {
        if (event && $(event.target).hasClass("blueprint_i")) {
          $(event.target).trigger("customClick");
        };
        return; //重覆就離開
      }    
      vm.check_error_index(index,vm.blueprint);
      if (index >= vm.blueprint.length) index = 0;
      $("#top_tag").stop().fadeOut(0);
      $.cookie("index_blueprint", index);
      if (event && event.target) {
        if (event.target.className != undefined) {
          if (event.target.className.indexOf("blueprint_a") > -1 || event.target.className.indexOf("blueprint_i") > -1) {
            target = true;
          }
        }
      }
      if (target) {
        vm.index_blueprint = index; //重新安排
        vm.update_index_line(vm.index[index]);
        vm.update_index_line_check();
        vm.update_selection_color();
        vm.update_metro_key(vm.index[index][vm.index_line]);
      }
      vm.action_move=1;
      setTimeout(move_center, 0);
    },
    exchange_line: function (index) {
      if (vm.index_line == index) return; //重覆就離開
      $("#top_tag").stop().fadeOut(0);
      if ($("html").hasClass("re_name")) { //解決編輯按兩下的BUG
        return setTimeout(function () {
          _el();
        }, 0)
      }
      _el();

      function _el() {
        vm.index_line = index;
        if (!vm.get_index_blueprint()[index]) vm.replace_index(); //重新設定index
        vm.update_index_line_check();
        vm.update_selection_color();
        vm.update_metro_key(vm.get_index_blueprint()[index]);
        vm.action_move=1;
        setTimeout(move_center,0);
        $(document.body).scrollTop(0);
      }
    },
    replace_index: function () { //修補程式(不常發生)
      var _line = vm.get_blueprint().line;
      var _index_blueprint = vm.get_index_blueprint();
      var j = _line.length - _index_blueprint.length;
      for (var i = 0; i < j; i++) _index_blueprint.push([]); //新增line的index陣列
      print("重新設定了index");
    },
    new_line: function () {
      if(vm.action=="load")return;
      var data = this.get_blueprint();
      var get_index = vm.get_index_blueprint();
			remove_start();
      if (!data.line) data.line = []; //如果沒有line就新增一個空陣列
      var get_color = vm.get_default_color(data.line.length);
      var _j = line_json("未命名", get_color);
      _j.metro.push(metro_json("總站"));
      data.line.push(_j);
      get_index.push({check:false}); //新增line的index陣列
      vm.action = "new_line";
      vm.update_blueprint(data.key, data);
    },
    find_line_index: function(key, data){
        for (var i = 0; i < data.line.length; i++) {
            if (data.line[i]._key == key) return i;
        }
    },
    move_line: function (key) {
      var data = vm.get_blueprint();
      var index= vm.find_line_index(key,data);
      if (index == undefined) return
      if(index==0){//代表只有一筆，刪除整個藍圖
        var _line = data.line;
        vm.delete_blueprint(data.key,"move_delete");
      }else{
        var _line = data.line.splice(index, 1);
        vm.get_index_blueprint().splice(index, 1); //移除line的index索引陣列
        if (vm.index_line >= index) { //刪除到小於自已-就往前倒退索引(同刪除藍圖)
            var new_index = vm.index_line - 1;
            if (new_index < 0) new_index = 0;
            vm.index_line = new_index; //重新安排
        }
        vm.update_metro_key(vm.get_index_line());
        vm.update_blueprint(data.key, data);
      }
      return _line
    },
    delete_line: function (key,_status) {
      var data = vm.get_blueprint();
      var index= vm.find_line_index(key,data);
      if (index == undefined) return
      if(_status=="move_delete" || _status=="metro_one_delete"){
        _fn();
      }else{
        $('.ui.modal').modal("refresh");
        setTimeout(function () {
          $('#line_delete_modal').modal({
            inverted: true,
            closable: false
          }).modal('show');
        }, 0)
        var _color = data.line[index].color;
        $('#line_delete_modal').css("borderTopColor", _color);
        $("#line_delete_button").css("backgroundColor", _color);
//        $(document).on("keydown.line_delete",function(event){
//          if (event.which == 13 ) { //enter
//            _fn();
//          } else if (event.which == 27) { //esc
//            $('#line_delete_modal').modal("hide");
//            $("#line_delete_button").off("click");
//            $(document).off("keydown.line_delete");
//          }
//        })
        $("#line_delete_button").off("click").on("click",_fn);
      }
	  function _fn() {
          if(data.line.length==1){//只勝下一筆就把藍圖也刪了
            vm.delete_blueprint(data.key,"line_one_delete");
          }else{
            data.line.splice(index, 1); //移除line
            vm.get_index_blueprint().splice(index, 1); //移除line的index索引陣列
            if (vm.index_line >= index) { //刪除到自已或小於自已-就往前倒退索引(同刪除藍圖)
              var new_index = vm.index_line - 1;
              if (new_index < 0) new_index = 0;
              vm.index_line = new_index; //重新安排
            }
            vm.update_metro_key(vm.get_index_line());
            vm.action = "delete_line";
            vm.update_blueprint(data.key, data);
            if(_status=="move_delete"){
              
            }else{
              vm.delete_info_line(key);
            }
            
          }
		  $("#line_delete_button").off("click");
		  $("#line_delete_modal").modal("hide");
		  $(document).off("keydown.line_delete");
		}
    },
    get_line_key: function () {
      return vm.get_line()._key;
    },
    new_metro: function (order) {
      var _metro = metro_json("未命名");
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      data.line[vm.index_line].metro.splice(order, 0, _metro);
      vm.action = "new_metro";
      remove_start();
      this.update_blueprint(data.key, data);
    },
    check_metro: function (key) {
      if (vm.key_metro == key) return "active"
    },
    exchange_metro: function (key) {
      this.key_metro = key;
    },
    find_metro_index: function (key, data) {
      var _metro = data.line[this.index_line].metro;
      for (var i = 0; i < _metro.length; i++) {
        if (_metro[i]._key == key) {
          return i
        }
      }
    },
    move_metro: function (move_key, _line_index) {
      var data = this.get_blueprint();
      var _metro = data.line[this.index_line].metro;
			var delete_fn;
      if (_metro.length <= 1) {
				delete_fn=function(){
					vm.delete_line(data.line[vm.index_line]._key, "move_delete");
				}
      } else {
        var index = vm.find_metro_index(move_key, data);
        if (index == undefined) return;
        var _metro = _metro.splice(index, 1);
        if (this.key_metro == move_key) { //代表刪到選取的站,要重新更換key_metro 
          var _index = index - 1;
          if (_index < 0) _index = 0;
          var new_metro_key = data.line[this.index_line].metro[_index]._key;
          this.key_metro = new_metro_key;
        }
      }
			DB.ref("info/" + data.line[this.index_line]._key + "/metro").child(move_key).once("value", function (old_data) {

				DB.ref('info/' + vm.get_blueprint().line[_line_index]._key + "/metro/" + move_key).set(old_data.val());//移動

				DB.ref("info/" + data.line[vm.index_line]._key + "/metro").child(move_key).remove();//移除(可以進行備份)

				if(delete_fn)setTimeout(delete_fn,5);//刪除支線

			}) 
      return _metro
    },
    delete_metro: function (delete_key) { //與move_metro雷同
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      var index = vm.find_metro_index(delete_key, data);
      if (index == undefined) return;
      $('.ui.modal').modal("refresh");
      setTimeout(function () {
        $('#metro_delete_modal').modal({
            inverted: true,
            closable: false
        }).modal('show');
      }, 0);
      var _color = vm.line_color;
      $('#metro_delete_modal').css("borderTopColor", _color);
      $("#metro_delete_button").css("backgroundColor", _color);
      $("#metro_delete_button").off("click").on("click", function () {
          _del_metro();
          $("#metro_delete_button").off("click");
          $("#metro_delete_modal").modal("hide");
      })
      function _del_metro(){
        if (data.line[vm.index_line].metro.length <= 1) {//將整條線也刪除
          vm.delete_line(data.line[vm.index_line]._key,"metro_one_delete");
        }else{
          data.line[vm.index_line].metro.splice(index, 1);
          if (vm.key_metro == delete_key) { //代表刪到選取的站,要重新更換key_metro
              var _index = index - 1;
              if (_index < 0) _index = 0;
              var new_metro_key = data.line[vm.index_line].metro[_index]._key;
              vm.key_metro = new_metro_key;
          }
          vm.action = "delete_metro";
          vm.update_blueprint(data.key, data);
          DB.ref("info/" + data.line[vm.index_line]._key + "/metro").child(delete_key).remove();
        }
      }	
    },
		swap_metro: function (oldIndex, newIndex) {
      if (oldIndex == newIndex) return;
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      var data_metro = data.line[this.index_line].metro

      function get_key(key) {
        for (var i = 0; i < data_metro.length; i++) {
          if (data_metro[i]._key == key) return i;
        }
      };
      var new_metro = [];
      $("#top_tag li").each(function () {
        var index_key = get_key($(this).data("key"));
        new_metro.push(data_metro[index_key]);
      });
      data.line[this.index_line].metro = new_metro;
      vm.action = "swap_metro";
      vm.update_blueprint(data.key, data);
    },
    get_metro: function () {
      var _line = this.get_line();
      var _key_metro = vm.key_metro;
      var _m = _line.metro;
      var _index = 0
      for (var i = 0; i < _line.metro.length; i++) {
        if (_line.metro[i]._key == _key_metro) {
          _index = i;
          break;
        }
      }
      return _line.metro[_index];
    },
    paste_info: function(_data){
      _data.update_timestamp = firebase.database.ServerValue.TIMESTAMP;
      _data.timestamp = firebase.database.ServerValue.TIMESTAMP;
      delete _data[".key"];
      this.save_info(_data);
    },
    new_info: function () { //新增資訊
      var board_textarea = $.trim($("#board_textarea").val());
      if (board_textarea == "") return;
      var _data = {
        message: board_textarea,
        favorite: false,
        url_info: "",
		update_timestamp: firebase.database.ServerValue.TIMESTAMP,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        users: user_uid,
        file_id : $("#uploadFileParent").data("file_id") || "",
        file_url : $("#uploadFileParent").data("file_url") || "",
        file_name : $("#uploadFileParent").data("file_name") || ""
      }
      clear_uploadFile("send");
      if (vm.url_info) _data.url_info = vm.url_info;
      remove_start();
      if($("#top_tag").find("[data-key='"+vm.key_metro+"']").length==0){
        vm.exchange_line(0);
        vm.exchange_line(1);
        print("目前不在任何地鐵上");
        return
      }
      vm.url_info = undefined; //清掉
      $("#board_textarea").val("").keyup(); //清掉
			for(var index in _data.url_info) { 
				if (_data.url_info.hasOwnProperty(index)) {
					if(_data.url_info[index]==undefined)_data.url_info[index]="";
				}
			}
			this.save_info(_data);
    },
		save_info: function(_data){
			DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).push(_data, function (error) {
			if (error) { //修補程式(不常發生)
				if (error.toString().indexOf("Permission denied") > -1) {
					set_line_root(vm.get_line_key(), user_uid );
					DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).push(_data);
					setTimeout(function () {
						print("未發現root，重新寫入root")
						location.reload();
					}, 0)
				}
			}
			});
		},
    delete_info: function (key, event) { //刪除資訊
      var $target_parent = $(event.target).closest(".board_list");
      if ($target_parent.hasClass("edit")) return;
      var $delete_info = $target_parent.find("._modal_info");
      if(!$delete_info.length){
        $delete_info=$target_parent.append(delete_modal_html(vm.line_color));
      }
      //https://semantic-ui.com/modules/dimmer.html
      //opacity : 0.7,
      $delete_info.dimmer({
        duration: {
          show: 400,
          hide: 0
        }
      }).dimmer('show');
			//要調整
      $delete_info.find(".send").off("click").on("click", function () {
         _fn();
				//$(document).off("keydown.info_delete");
      });
      $delete_info.find(".cancel").off("click").on("click", function () {
				$delete_info.dimmer('hide');
				//$(document).off("keydown.info_delete");
      })	
      $(document).on("keydown.info_delete",function(event){
          if (event.which == 13 ) { //enter
              _fn();
              $(document).off("keydown.info_delete");
          } else if (event.which == 27) { //esc
              $delete_info.dimmer('hide');
              $(document).off("keydown.info_delete");
          }
      })
      function _fn(){
          DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(key).remove();//delete_info_direct相同
          $delete_info.dimmer('hide');
      }	
    },
    delete_info_line: function (_line_key) { //從info最上層的line刪除
      DB.ref("info/" + _line_key + "/metro").remove();
      DB.ref("info/" + _line_key + "/root").remove();
    },
    favorite_info: function (item) {
      DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(item[".key"]).update({
        favorite: !item.favorite,
				update_timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    },
    edit_info: function (item, dbl, event) {
      var $target_parent = $(event.target).closest(".board_list");
      if ($target_parent.hasClass("edit")) return false
      vm.leave_edit_info();
      if (dbl == "dbl" && vm.mode != 1) return false
      $("html").addClass("re_name");
      var _key = item[".key"];
      $target_parent.addClass("edit");
      var $textarea = $target_parent.find("textarea");
      $textarea.val(item.message).focus();
      $textarea.on("keyup.textarea", function (event) {
        auto_height2(this);
        if (event.keyCode == 27) vm.leave_edit_info($target_parent);
      }).keyup();
      $textarea.on('paste', function () {
        if (!item.url_info) textarea_paste2($textarea[0], item);
      });
      $target_parent.find("button.send").one("click", function () {
        if (!item.url_info) item.url_info = "";
        var board_textarea = $.trim($textarea.val());
        vm.leave_edit_info($target_parent);
        setTimeout(function(){
          $target_parent.velocity("scroll",{duration: 500,offset: -500});
        },50);
        DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(_key).update({
          message: board_textarea,
          url_info: item.url_info,
          update_timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      })
      $target_parent.find("button.cancel").one("click", function () {
        vm.leave_edit_info($target_parent);
      })
    },
    leave_edit_info: function ($target) {
      $(document).one("click", function () { //解決出現Chrome英文翻譯的問題
        $("html").removeClass("re_name");
      })
      if ($target) {
        $target.removeClass("edit");
        $target.off("keyup.textarea").off("paste");
        $target.find("button").off("click");
      } else {
        $(".board_list").removeClass("edit");
        $("#board_info textarea").off("keyup.textarea").off("paste");
        $("#board_info .textarea button").off("click");
      }
      
    },
    edit_name:function(event,_level){
      $("#border_"+_level+"_name").hide();
      var $textarea=$("#board_"+_level+"_textarea");
      $textarea.show();
      $textarea.focus();
      if(_level=="line"){
        var get_level=vm.get_line();
      }else if(_level=="metro"){
        var get_level=vm.get_metro();
      }
	  var _name=get_level.name;
      $textarea.val(get_level.name);
      auto_height2($textarea[0]);
      $textarea.on("keydown",function(event){
        auto_height2($textarea[0]);
        if (event.which == 13 || (event.shiftKey && event.which == 13)) { //enter
		  		event.preventDefault();
          get_level.name=$.trim($textarea.val().replace(/  +/g, ' '));
					if(_name == get_level.name)return
					if(_level == "line") vm.set_總站(get_level.name,_name);
          vm.action = "re_name";
          vm.update_blueprint();
          edit_set();
        } else if (event.which == 27) { //esc
          edit_set();
        }
      })
      $(document).on("click."+_level+"_board", function (event) {
        if (event.target.id!="board_"+_level+"_textarea") edit_set();
      })
      function edit_set(){
        $(document).off("click."+_level+"_board");
        $textarea.off("keydown");
        $("#border_"+_level+"_name").show();
        $textarea.hide();
      }
    },
    set_總站: function(edit_name,before_name){
        var _get_metro=vm.get_line().metro;
        if(_get_metro.length==1 && (_get_metro[0].name=="總站" || _get_metro[0].name==before_name)){
            _get_metro[0].name=edit_name;
        }
    },
    re_name: function (index, _level, event) { //重新命名(共用)
      if ($(event.target).hasClass("blueprint_i")) return;
      $("html").addClass("re_name");
      var $level_list = $(event.target).closest("." + _level + "_list");
      $level_list.addClass("edit");
			var sort_level=_level;
      if (sortable[sort_level]) sortable[sort_level].option("disabled", true);
      var _name = get_level().name;
      var $level_list_input = $level_list.find("." + _level + "_input");
      $level_list_input.select().on("keyup." + _level + "_input", function (event) {
        if (event.which == 13) { //enter
          edit_set();
          if(get_level().name==""){
            get_level().name = _name;
            return
          }
					if(_name == get_level().name)return
					if(_level == "line") vm.set_總站(get_level().name,_name);
          vm.action = "re_name";
          vm.update_blueprint();
        } else if (event.which == 27) { //esc
          edit_set();
          get_level().name = _name;
        }
      })
      setTimeout(function () {
        $(document).on("click." + _level + "_input", function (event) {
          if (event.target.className.indexOf("" + _level + "_input") == -1) {
            edit_set();
            get_level().name = _name;
          };
        })
      }, 5);

      function get_level() {
        if (_level == "blueprint") {
          return vm.blueprint[index];
        } else if (_level == "line") {
          return vm.get_blueprint().line[index];
        } else if (_level == "metro") {
          return vm.get_line().metro[index];
        }
      }

      function edit_set() {
        $(document).one("click", function () { //解決出現Chrome英文翻譯的問題
          $("html").removeClass("re_name");
        })
        $level_list.removeClass("edit");
        if (sortable[_level]) sortable[_level].option("disabled", false);
        $level_list_input.off("keyup." + _level + "_input");
        $(document).off("click." + _level + "_input");
      }
    },
    get_default_color: function (k) {
      var c = ["#f2711c", "#db2828", "#fbbd08", "#b5cc18", "#21ba45", "#00b5ad", "#2185d0", "#5829bb", "#a333c8", "#e03997", "#a5673f", "#767676"][k];
      if (!c) return "#000000";
      return c;
    },
    open_color: function (index, color) { //打開色票選擇器(line)
			if(vm.mode==0){
				vm.exchange_line(index)
				return
			}
			if($("#left_color").attr("show")=="Y"){
				$(".colpick_submit").off("click.op");
				$("#left_color").attr("show","");
				return;
			}

      color = color.split("#")[1];
      var $et = $(event.target);
      var _left = $et.offset().left;
      var _top = $et.offset().top + $et.height() + 2;
      $("#left_color").css({
        "left": _left,
        "top": _top
      }).colpickSetColor(color).colpickShow();
			$("#left_color").attr("show","Y")
      $(".colpick_submit").off("click.op").on("click.op", function () {
        vm.get_blueprint().line[index].color = "#" + $("#left_color").val();
        vm.action = "edit_color";
        vm.update_blueprint();
		$("#left_color").attr("show","");
        $(this).off("click.op");
      });
    },
    swap_line: function (oldIndex, newIndex) {
      if (oldIndex == newIndex) return;
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      var new_line = [];
      var new_index = [];
      $("#line_drag li").each(function () {
        var index_key = get_key($(this).data("key"));
        new_line.push(data.line[index_key]);
        new_index.push(vm.index[vm.index_blueprint][index_key]);
      })
      data.line = new_line;
      vm.index[vm.index_blueprint] = new_index;
      vm.update_index_line(new_index);
      vm.action = "swap_line";
      vm.update_blueprint(data.key, data);

      function get_key(key) {
        for (var i = 0; i < data.line.length; i++) {
          if (data.line[i]._key == key) return i;
        }
      }
    }
  }
})