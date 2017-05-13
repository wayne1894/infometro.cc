  var b1_left=parseInt($("#board1").css("left"));
  var b2_left=parseInt($("#board2").css("left"));
  var b3_left=parseInt($("#board3").css("left"));
  $(window).resize(function(){
    var window_width=$(window).width();
    $("#top").css("width",$("#center").width());
    if($("#main").width()<1260){
      $("#board3").addClass("board3_left");
      var _move=($("#center").width()-860)/2;
      $("#board1").css("left",b1_left+_move);
      $("#board2").css("left",b2_left+_move);
    }else{
      $("#board3").removeClass("board3_left");
      var _move=($("#center").width()-1175)/2;
      if(_move<0)_move=0;
      $("#board1").css("left",b1_left+_move);
      $("#board2").css("left",b2_left+_move);
      $("#board3").css("left",b3_left+_move);
    }
    move_center();
  }).resize();

  $("#main").css("visibility","visible").css("left",0);
  //拖亦程式https://github.com/RubaXa/Sortable
  var sortable =[];
  sortable["blueprint"] = new Sortable(id("blueprint_drag"),{
    animation: 150,
    forceFallback: true,
    onEnd: function(){
      //vm.swap_blueprint(evt.oldIndex,evt.newIndex)
    }
  });
  sortable["line"] = new Sortable(id("line_drag"),{
    animation: 150,
    forceFallback: false,
		onEnd: function (evt) {
			vm.swap_list(evt.oldIndex,evt.newIndex)
		}
  });
  sortable["metro"] = new Sortable(id("top_tag"),{
    animation: 50,
    forceFallback: false,
		filter: ".add",
    setData: function (dataTransfer,dragEl) {
     
			dataTransfer.setData('index',$(dragEl).data("index")); //設定要傳送的資料
	},onStart: function (evt) {
		var $top_tag=$("#top_tag");
		$top_tag.find(".add").hide();
		if(evt.oldIndex==0){
			$top_tag.addClass("first_drag");
		}else if(evt.oldIndex==$("#top_tag li").length-2){
			$top_tag.addClass("last_drag");
		}
		vm.mode=1.5;
	},onEnd: function(evt){
    $("#top_tag").find(".add").show();
		$("#top_tag").removeClass("first_drag").removeClass("last_drag");
		vm.swap_metro(evt.oldIndex,evt.newIndex);
		vm.mode=1;
  }
  });
  $(function(){
    //perfectScrollbar
    $("#right .right_main").perfectScrollbar();
    
    //晃動 https://jackrugile.com/jrumble/
    $("#logo img").jrumble({
      x: 2,
      y: 2,
      opacity: true,
	  opacityMin: .5
    }).hover(function(){
	  $(this).trigger('startRumble');
    }, function(){
      $(this).trigger('stopRumble');
    });
    
  })
 //parse_url("https://www.youtube.com/watch?v=6nhLWBf6lS0")
  function parse_url(url,fn){
 
    $.get("http://54.250.245.226/infometro.asp?url="+url,function(html){
          var iframe = document.createElement("iframe");
          iframe.id="iframe";
          iframe.style.display="none";
					if(html.indexOf("<body")>-1){//可在伺服器先把body截掉
						html=html.split("<body")[0]+"<body></body>";
					}
			//console.log(html)
          $(document.body).append(iframe);
      var ifrm = document.getElementById('iframe');
          ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
          ifrm.document.open();
          ifrm.document.write(html);
          ifrm.document.close();
           var url_info={}
           var metas = $("#iframe")[0].contentWindow.document.getElementsByTagName('meta');
           for (var i=0; i<metas.length; i++) { 
               if(metas[i].getAttribute("name")=="description"){
                   url_info.description=metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:description"){
                   url_info.og_description=metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:image"){
                   url_info.og_image=metas[i].getAttribute("content").split(",")[0];
               }else if(metas[i].getAttribute("property")=="og:title"){
                   url_info.og_title=metas[i].getAttribute("content");
               }
           }

			//字串手動劫取
			if(url_info.fb_image==undefined){//取fb images
				if(html.indexOf("og:image")>-1){
					var og_html=html.split("og:image")[1].split(">")[0];
					og_html=og_html.replace(/\'/gi,"\"");
					og_html=og_html.split("content=\"")[1].split('"')[0]
					url_info.fb_image=og_html;
				}
			}
			if(url_info.og_description==undefined ){
				if(html.indexOf("og:description")>-1){
					var og_html=html.split("og:description")[1].split(">")[0];
					og_html=og_html.replace(/\'/gi,"\"");
					og_html=og_html.split("content=\"")[1].split('"')[0]
					url_info.og_description=og_html;
				}
			}
			if(url_info.og_title==undefined ){
				if(html.indexOf("og:title")>-1){
					var og_html=html.split("og:title")[1].split(">")[0];
					og_html=og_html.replace(/\'/gi,"\"");
					og_html=og_html.split("content=\"")[1].split('"')[0]
					url_info.og_title=og_html;
				}
			}

			
			//var $iframe_body=$(document.getElementById('iframe').contentWindow.document.body);
			
      if(url_info.og_title){
        url_info.title=url_info.og_title
      }else{ 
        url_info.title=$(document.getElementById('iframe').contentWindow.document).find("title").html();
        if(url_info.title==undefined)url_info.title="";
      }
			url_info.ico="https://www.google.com/s2/favicons?domain_url="+url;

			$("#iframe").remove();
			if(typeof fn ==="function")fn(url_info);
			console.log(url_info);
      })
  }



//一些以前遺留的資料

// $(document).bind('selectstart',function(){return false;})

//按右鍵 //if($(event.target).hasClass("blueprint_i"))return;   -->要移掉
//    $(".blueprint_list").off("contextmenu.custom").on("contextmenu.custom",function(event){
//      event.preventDefault();
//      if(event.target.nodeName=="INPUT")return;
//      $(this).trigger("customClick");
//    })


//社交支線
//      #board_txt{
//        border-bottom: 1px solid #CDCDCD;
//        padding-left: 22px;
//        padding-top: 10px;
//        padding-bottom: 10px;
//      }
//  <div id="board_txt">
//    <span v-if="is_public">社交支線 </span>
//    <a href="#" onclick="push_now_line()">推送支線</a>
//  </div>

//   computed:
//   is_public:function(){
//     if(this.blueprint.length==0)return "";
//     return vm.get_line().public;
//   },
//不穩定，尚在開發
//function push_line_public(_line_key,_line,_metro){//推送分支到遠端
//	DB.ref('info/' + _line_key +"/public").set(true);//設為公開
//	DB.ref('info/' + _line_key +"/w_metro").set(true);//擁有metro編寫權限
//	DB.ref('info/' + _line_key +"/w_info").set(true);//擁有info編寫權限
//  
//	DB.ref('info/' + _line_key +"/line_data").set(_line);//遠端支線相關
//	DB.ref('info/' + _line_key +"/metro_data/").set(_metro);//遠端metro資訊
//}
//function push_now_line(){//傳送現在位置的支線到遠端(更新)
//  var data=vm.get_blueprint();
//  var _line=vm.get_line()
//  _line.public=true;//要同步將本地端支線變成public
//  vm.更新藍圖(data.key,data);
//  var _metro=_line.metro;
//  var __line=JSON.parse(JSON.stringify(_line));//將傳址改為傳值
//  delete __line.metro;
//  push_line_public(__line._key,__line,_metro);
//}
//function copy_public_line(_line_key){//複製某個遠端支線到自己的位置
//  var _data=vm.get_blueprint();
//  for(var i=0;i<_data.line.length;i++){
//    if(_data.line[i]._key==_line_key)return "repeat"
//  }
//  DB.ref('info/' + _line_key + "/line_data").once("value",function(data){
//    _data.line.push(data.val());
//    DB.ref('info/' + _line_key + "/metro_data").once("value",function(data){
//      _data.line[_data.line.length-1].metro=data.val();
//      _data.line.public=true;
//      vm.更新藍圖(_data.key,_data);
//    })
//  })
//}
//function update_public_line(_line_key){//更新某個遠端支線到自己的位置
//  var _data=vm.get_blueprint();
//  var update_index
//  for(var i=0;i<_data.line.length;i++){
//    if(_data.line[i]._key==_line_key)update_index=i
//  }
//  if(update_index==undefined)return false
//  DB.ref('info/' + _line_key + "/line_data").once("value",function(data){
//    _data.line[update_index]=data.val();
//    DB.ref('info/' + _line_key + "/metro_data").once("value",function(data){
//      _data.line[update_index].metro=data.val();
//      vm.更新藍圖(_data.key,_data);
//    })
//  })
//}







//index.html的資料

//<h2>email註冊</h2>
//<input id="registered1" type="text">
//<input id="registered2" type="password">
//<button id="emailadd">Email 註冊</button>
//
//
//<h2>email登入</h2>
//<input id="login1" type="text">
//<input id="login2" type="password">
//<button id="emailLogin">Email Login</button>


//  $(function(){
//      $("#emailadd").on("click",function(){
//          email_註冊($("#registered1").val(),$("#registered2").val(),location_fn)
//      })
//      $("#emailLogin").on("click",function(){
//          email_登入($("#login1").val(),$("#login2").val(),location_fn)
//      })
//
//  })