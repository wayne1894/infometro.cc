  var b1_left = parseInt($("#board1").css("left"));
  var b2_left = parseInt($("#board2").css("left"));
  var b3_left = parseInt($("#board3").css("left"));
  $(window).resize(function () {
		var center_width=$("#center").width();
		var window_width = $(window).width();
		if(center_width<=1165){
			$("#board_parent").addClass("adj");
		}else{
			$("#board_parent").removeClass("adj");
		}
       if(is_mobile()){
         $("#board_parent").css("min-height",(getViewportSize().h)+"px");
       }
    
        if(window_width<700){
          $("#center").css("width","700px");
          $("#top").css("width", $("#center").width());
        }else{
          $("#center").css("width","87%");
          if(window_width<(991-30)){
              $("#top").css("width", window_width-$("#left").width());
          }else{
              $("#top").css("width", "inherit");
          }
        }
  }).resize();

	setTimeout(function(){
		if(typeof(vm)=="undefined")location.reload();
	},5000);

  var sortable = [];
	var mode_before ; //mode before 暫放
  $(function () {
    //拖亦的部份 https://github.com/RubaXa/Sortable
    sortable["line"] = new Sortable(id("line_drag"), {
      animation: 150,
      forceFallback: false,
      setData: function (dataTransfer, dragEl) {
        vm.drag_line_key=$(dragEl).data("key"); //正在脫亦的line key
        if(navigator.userAgent.match("Firefox")){
          dataTransfer.setData('line_key', $(dragEl).data("key")); //設定要傳送的資料
        }
      },
      onStart: function(evt){
				mode_before =vm.mode;
        vm.mode = 1.5;
      },
      onEnd: function (evt) {
        setTimeout(function(){
          vm.swap_line(evt.oldIndex, evt.newIndex);
		  		vm.mode = mode_before;
          vm.drag_line_key="";
        },5);
      }
    });
    sortable["metro"] = new Sortable(id("top_tag"), {
      animation: 50,
      forceFallback: false,
      filter: ".add",
      setData: function (dataTransfer, dragEl) {
        vm.drag_metro_key=$(dragEl).data("key"); //正在脫亦的metro key
        if(navigator.userAgent.match("Firefox")){
		  		dataTransfer.setData('key', $(dragEl).data("key")); 
        }
      },
      onStart: function (evt) {
        var $top_tag = $("#top_tag");
        $("#top_tag_parent").css("left",$top_tag.css("left"));
        $top_tag.addClass("left_inherit");
        $top_tag.find(".add").hide();
        if (evt.oldIndex == 0) {
          $top_tag.addClass("first_drag");
        } else if (evt.oldIndex == $("#top_tag li").length - 2) {
          $top_tag.addClass("last_drag");
        }
				mode_before =vm.mode;
        vm.mode = 1.5;
      },
      onEnd: function (evt) {
        var $top_tag = $("#top_tag");
        $top_tag.find(".add").show();
        setTimeout(function(){
          $top_tag.removeClass("left_inherit");
        },100)
        $top_tag.removeClass("first_drag").removeClass("last_drag");
        setTimeout(function(){
          vm.swap_metro(evt.oldIndex, evt.newIndex);
          vm.mode = mode_before;
          vm.drag_metro_key="";
        },5)
      }
    });
    //導覽的部份
    setTimeout(function () {
      $('.nav_i.custom')
        .popup({
          popup: $('.custom.popup'),
          on: 'click',
          onShow : function(){
            var _html="";
            var _img=$(this).data("img");
            if(_img!=""){
              _html="<img style='width: 100%;' src='"+_img+"'>";
              $(this).html(_html);
            }
            
          }
        })
    }, 5);
    setTimeout(function () {
      $(".nav_i:not(.custom)").popup({
        on: 'click'
      })
    }, 5);
  })
  
  function is_mobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    }
  }
  function getViewportSize(w) {
    //https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript

      // Use the specified window or the current window if no argument
      w = w || window;

      // This works for all browsers except IE8 and before
      if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight };

      // For IE (or any browser) in Standards mode
      var d = w.document;
      if (document.compatMode == "CSS1Compat")
          return { w: d.documentElement.clientWidth,
             h: d.documentElement.clientHeight };

      // For browsers in Quirks mode
      return { w: d.body.clientWidth, h: d.body.clientHeight };

  }

  function urlify(text) {
    //http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

  function textarea_paste() {
    if (vm.url_info) return;
    var domTextarea = this;
    var txt = domTextarea.value;
    var startPos = domTextarea.selectionStart;
    var endPos = domTextarea.selectionEnd;
    var scrollTop = domTextarea.scrollTop;
    domTextarea.value = '';

    setTimeout(function (item) {
      var pastedValue = domTextarea.value;
      domTextarea.value = txt.substring(0, startPos) + pastedValue + txt.substring(endPos, txt.length);
      domTextarea.focus();
      domTextarea.selectionStart = domTextarea.selectionEnd = startPos + pastedValue.length;
      domTextarea.scrollTop = scrollTop;
      var urlify_url = urlify(pastedValue);
      if (urlify_url.indexOf("<a href=") > -1) {
        var url = urlify_url.split("</a>")[0].split(">")[1];
        $("#board_enter .world.icon").show();
        $("#board_enter .idea.icon").hide();
        parse_url(url, function (url_info) {
          if($("#board_textarea").val()!=""){
            if(url_info)vm.url_info = url_info;
          }
          $("#board_enter .world.icon").hide();
          //$("#board_enter .idea.icon").show();
        });
      }
    }, 0);
  }

  function textarea_paste2(domTextarea, item) {
    var txt = domTextarea.value;
    var startPos = domTextarea.selectionStart;
    var endPos = domTextarea.selectionEnd;
    var scrollTop = domTextarea.scrollTop;
    domTextarea.value = '';

    setTimeout(function () {
      var pastedValue = domTextarea.value;
      domTextarea.value = txt.substring(0, startPos) + pastedValue + txt.substring(endPos, txt.length);
      domTextarea.focus();
      domTextarea.selectionStart = domTextarea.selectionEnd = startPos + pastedValue.length;
      domTextarea.scrollTop = scrollTop;
      var urlify_url = urlify(pastedValue);
      if (urlify_url.indexOf("<a href=") > -1) {
        var url = urlify_url.split("</a>")[0].split(">")[1];
        parse_url(url, function (url_info) {
          item.url_info = url_info;
        });
      }
    }, 0);
  }

	function show_event_fn(title,text){
		var _color=vm.line_color;
		if(title==undefined)title="儲存成功";
		text='<div class="description">'+text+'</div>'
		if(text==undefined)text="";
		clearTimeout(window.show_setTimeout);
		$("#show_event").html('<div style="display:none" class="ui steps"><div class="completed step"><i class="payment icon" style="color:'+_color+'"></i><div class="content"><div class="title">'+title+'</div>'+text+'</div></div></div>');

		$("#show_event .ui").transition({
			animation : 'fade up',
			duration  : 800
		});
		window.show_setTimeout=setTimeout(function(){
			$("#show_event .ui").transition({
				animation : 'fade down',
				duration  : 1200
			});
		},2000);
	}

  function parse_url(url, fn) {
    $.get("https://infometro.hopto.org/infometro.asp?url=" + url, function (html) {
      var url_info = {}
		try{
          var iframe = document.createElement("iframe");
          iframe.id = "iframe";
          iframe.style.display = "none";
          $(document.body).append(iframe);
          var ifrm = document.getElementById('iframe');
          ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
          ifrm.document.open();
          ifrm.document.write(html);
          ifrm.document.close();

          var metas = $("#iframe")[0].contentWindow.document.getElementsByTagName('meta');
          for (var i = 0; i < metas.length; i++) {
              if (metas[i].getAttribute("name") == "description") {
                  url_info.description = metas[i].getAttribute("content");
              } else if (metas[i].getAttribute("property") == "og:description") {
                  url_info.og_description = metas[i].getAttribute("content");
              } else if (metas[i].getAttribute("property") == "og:image") {
                  url_info.og_image = metas[i].getAttribute("content").split(",")[0];
              } else if (metas[i].getAttribute("property") == "og:title") {
                  url_info.og_title = metas[i].getAttribute("content");
              }
          }
          //字串手動劫取
          if (url_info.og_image == undefined){
            url_info.og_image = capture_image(html); 
          }
          if (url_info.og_description == undefined && url_info.description==undefined) {
            url_info.og_description=capture_description(html);
          }
        
          if (url_info.og_title == undefined){
            url_info.og_title=capture_title(html);
          }
          if (url_info.og_title) {
              url_info.title = url_info.og_title;
          } else {
              url_info.title = $(document.getElementById('iframe').contentWindow.document).find("title").html();
              if (url_info.title == undefined) url_info.title = "";
          }
          if (url_info.og_description) {
              url_info.description = url_info.og_description;
          }
          if (url_info.og_image) {
              url_info.image = url_info.og_image;
          }

          delete url_info.og_title
          delete url_info.og_description
          delete url_info.og_image

          url_info.url = url; //這個url代表是連結的url
          url_info.url_parent = url.split("://")[1].split("/")[0];
          //print(url_info.url_parent)
          if(url_info.image.indexOf("http://")==-1 && url_info.image.indexOf("https://")==-1){
            url_info.image = "//"+url_info.url_parent + url_info.image;
          }
          
          //判斷是不是youtube
          if (url.indexOf(".youtube.") > -1) {
              url_info.youtube = url.split("?v=")[1].split("&")[0];
          } else if (url.indexOf("youtu.be/") > -1) {
              url_info.youtube = url.split("be/")[1];
          }
          $("#iframe").remove();
        if (typeof fn === "function") fn(url_info);
          
      }catch(err) {
        url_info.image = capture_image(html); 
        url_info.description=capture_description(html)
        url_info.title=capture_title(html);
        
        url_info.url = url; //這個url代表是連結的url
        url_info.url_parent = url.split("://")[1].split("/")[0];

        if (typeof fn === "function") fn(url_info);
      }
    }).fail(function(){
      print("請求錯誤");
      if (typeof fn === "function") fn();
	})
    
    function capture_image(html){
       if (html.indexOf("og:image") > -1) {
          var og_html = html.split("og:image")[1].split(">")[0];
          if(og_html.indexOf("content=")==-1){
            var _meta = html.split("og:image")[0].split("<meta");
            og_html=_meta[_meta.length-1];
          }
         if(og_html.indexOf("content=")>-1){
            og_html = og_html.replace(/\'/gi, "\"");
            og_html = og_html.split("content=\"")[1].split('"')[0];
            return og_html;
         }
       }
      
      if(html.indexOf("<link rel=\"image_src") > -1){
         var og_html=html.split("<link rel=")[1].split(">")[0];
         og_html = og_html.replace(/\'/gi, "\"");
         og_html= og_html.split("href=\"")[1].split('"')[0];
         return og_html;
       }
    }
    
    function capture_description(html){
      try{
        if (html.indexOf("og:description") > -1) { 
          var og_html = html.split("og:description")[1].split(">")[0];
          if(og_html.indexOf("content=")==-1){
            var _meta = html.split("og:description")[0].split("<meta");
            og_html=_meta[_meta.length-1];
          }
          og_html = og_html.replace(/\'/gi, "\"");
          og_html = og_html.split("content=\"")[1].split('"')[0]
          return og_html;
        }
      }catch(err) {
        
      }
    }
    
    function capture_title(html){
      if (html.indexOf("og:title") > -1) {
        var og_html = html.split("og:title")[1].split(">")[0];
        if(og_html.indexOf("content=")==-1){
          var _meta = html.split("og:title")[0].split("<meta");
          og_html=_meta[_meta.length-1];
        }
        og_html = og_html.replace(/\'/gi, "\"");
        og_html = og_html.split("content=\"")[1].split('"')[0];
        return og_html;
       }
      if(html.indexOf("<title") > -1){
        var _title=html.split("<title")[1].split("</title>")[0].split(">")[1];
        return _title
      }
     
    }
  }
  function auto_height(textarea){
    $(textarea).height(70);
    $(textarea).height(textarea.scrollHeight + parseFloat($(textarea).css("borderTopWidth")) + parseFloat($(textarea).css("borderBottomWidth")));
  }
  function auto_height2(textarea){
    $(textarea).height(0);
    var _height=textarea.scrollHeight + parseFloat($(textarea).css("borderTopWidth")) + parseFloat($(textarea).css("borderBottomWidth"));
    $(textarea).height(_height);
  }


//剪下貼上資訊的部份
	function getselecttext(){//抓取選取文字
		var t='';
		if(window.getSelection){t=window.getSelection();}
		else if(document.getSelection){t=document.getSelection();}
		else if(window.document.selection){t=window.document.selection.createRange().text;}
		if(t!='') return t
	}
	$(function(){
	 var ctrlDown = false,
	 	ctrlKey = 17,
	 	cmdKey = 91,
	 	vKey = 86,
	 	cKey = 67,
	 	xKey = 88;
	var shiftDown = false,
		shiftKey = 16;
	
	
	
	var copy_flocus=false
	$(document).on( "focus", "input,textarea", function(){
		vm.copy_info=[];
		copy_flocus=true;
		$(this).one("blur",function(){
			copy_flocus=false;
		})
	})

 $(document).keydown(function(e) {
		if(copy_flocus) return;
	 			ctrlDown=e.metaKey || e.ctrlKey; //(跨瀏覽器的解決方案)
				if (ctrlDown && e.keyCode == cKey){ //按下ctrl+c
					if(getselecttext()!=undefined) return
					if(vm.info_active){
						if($("#"+vm.info_active).find("textarea").is(":visible")) return
						//從vm.info 複製一份資料出來
						vm.copy_info[0]=JSON.parse(JSON.stringify(copy_info(vm.info_active)));//傳址轉傳值
						vm.copy_info[1]="copy";
						show_event_fn("複製成功","你複製了一個資訊");
					}
				}else if(ctrlDown && e.keyCode == xKey){ //按下ctrl+x
					if(getselecttext()!=undefined) return
					if(vm.info_active){
						//從vm.info 複製一份資料出來, 並新增等下要刪除的資訊
						if($("#"+vm.info_active).find("textarea").is(":visible")) return
						vm.copy_info[0]=JSON.parse(JSON.stringify(copy_info(vm.info_active)));//傳址轉傳值
						vm.copy_info[1]="cut";
						var get_line_key=vm.get_line_key();
						var key_metro=vm.key_metro;
						var info_active=vm.info_active;
						vm.copy_info[2]=function(){
							DB.ref('info/' + get_line_key + "/metro/" + key_metro).child(info_active).remove().then(function(){
								vm.copy_info=[];
							});
						}
						show_event_fn("剪下成功","你剪下了一個資訊");
					}
				}else if(ctrlDown && e.keyCode == vKey){ //按下ctrl+v
					if(vm.copy_info.length==0)return
					vm.paste_info(vm.copy_info[0]);
					if(vm.copy_info[1]=="cut") {
						vm.copy_info[2]();
						show_event_fn("貼上成功","你貼上了一個資訊");
					}
				}else if(e.keyCode==46){//按下delete
					if(vm.info_active){
						if($("#"+vm.info_active).find("textarea").is(":visible")) return
						$("#"+vm.info_active).find("._info_delete").trigger("click");
					}
				}
    }).keyup(function(e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });
	function copy_info(_key){
		for(var i=0;i<vm.info.length;i++){
			if(vm.info[i][".key"]==_key){
				return vm.info[i];
			}
		}
	}
})

  //導覽區程式
  function remove_start(n){
      $.removeCookie("start");
      if(n==1){
          $("#edit_parent .navOne").remove();
      }else if(n==2){
          $("#board_send_parent .navOne").remove();
      }else if(n==3){
          $("#new_line_parent .navOne").remove();
      }else if(n==4){
          $("#top .navOne").remove();
      }else{
          $(".navOne").remove();
      }
  }
  function start_set(){
    if($.cookie("start")=="Y" || 1==2){//代表第一次進來
          $("#edit_parent").append("<div class='navOne ui left pointing basic label'>第一次進來嗎？點擊這裡開始導覽。<i class='delete icon' style='float:right'></i></div>");

//          $("#board_send_parent").append("<div class='navOne ui top pointing basic label'>這個區塊可以新增資訊<i class='delete icon' style='float:right'></i></div>");
//
//          $("#new_line_parent").append("<div class='navOne ui top pointing basic label'>這裡是支線區<i class='delete icon' style='float:right'></i></div>");
//
//          $("#top").append("<div class='navOne ui right pointing basic label'>這個區塊是地鐵站<i class='delete icon' style='float:right'></i></div>");

          $("#edit_parent .navigation").one("click",remove_start);

           $("#edit_parent .navOne i").one("click",function(){
               remove_start(1);
           });
           setTimeout(function(){
               $("#edit_parent .navOne").transition("flash");
           },600);
//
//           $("#board_send_parent .navOne i").one("click",function(){
//               remove_start(2);
//           });
//           setTimeout(function(){
//               $("#board_send_parent .navOne").transition("flash");
//           },1400);
//
//           $("#new_line_parent .navOne i").one("click",function(){
//               remove_start(3);
//           });
//           setTimeout(function(){
//               $("#new_line_parent .navOne").transition("flash");
//           },2200);
//          $("#top .navOne i").one("click",function(){
//               remove_start(4);
//           });
//           setTimeout(function(){
//               $("#top .navOne").transition("flash");
//           },3000);
      }

  }
  
  function delete_modal_html(button_color){
    if(button_color==undefined)button_color="#FF6900";
    return '<div class="_modal_info ui inverted dimmer">'+
          '<div class="content">'+
              '<div class="center">'+
									//'<div style="width:100%;height:100%;">'+
											'<i class="trash outline icon" style="font-size: 1.8em;margin-bottom: 13px;color:#000;cursor: default"></i>'+
											'<div class="_modal_but" style="margin-bottom:20px;color:#000;">確定要刪除資料？</div>'+
											'<button class="send mini ui button" style="background-color:'+button_color+'">刪除</button>'+
											'<button class="cancel mini ui button">取消</button>'+
									//'</div>'+
             '</div>'+
         '</div>'+
       '</div>'
  }
//----------------------分塊程式碼------------------

	//top
	 function move_center() {
		 $("#top_tag li.active").velocity("scroll", { 
			 axis: "x",
			 duration: 0,
			 container: $("#top_tag"),
			 complete: function(){
				 $("#top_tag").show();
			 }
		 });
		 $("#top_tag").velocity("stop").velocity("fadeIn",{ duration: 350 })
		 vm.action_move=0;
	 }
	 $(function () {
		 //http://velocityjs.org/#scroll
		 $(".triangle.left").click(function(){
            $("#top_tag").velocity("stop").velocity('scroll', {
                container: $("#top_tag"),
                offset: -200,
                duration: 250,
                axis: 'x'
            });
         });
       	 $(".triangle.right").click(function(){
            $("#top_tag").velocity("stop").velocity('scroll', {
                container: $("#top_tag"),
                offset: 70,
                duration: 250,
                axis: 'x'
            });
         });
	 })
	//top

	//bottom
	function drop_blueprint(event,key){
  	$(event.target).closest(".blueprint_list").jrumble().trigger('stopRumble');
		var line_key = vm.drag_line_key;
		if(line_key=="")return;
		if(key==vm.blueprint[vm.index_blueprint].key){
			print("相同的blueprint");
			return;
		}
		var _line=vm.move_line(line_key);
		_line=_line[0];
		setTimeout(function(){
			for(var i=0;i<vm.blueprint.length;i++){
				if(vm.blueprint[i].key==key){
					vm.blueprint[i].line.push(_line);
					vm.index[i].push([]);
					vm.index[i][vm.index[i].length - 1].check = false;
					vm.action="drop_blueprint";
					vm.更新藍圖(key,vm.blueprint[i]);
					vm.index_update();
					break;
				}
			}
		},0)
	}

	function allowDrop_blueprint(event) { //拖曳的物件移到上面
		if(vm.drag_line_key){
			$(event.target).closest(".blueprint_list").jrumble().trigger('startRumble');
		}

		event.preventDefault();//必要不能刪
}
	function allowDropLeave_blueprint(event) { //拖曳的物件移出
		if(vm.drag_line_key){
			$(event.target).closest(".blueprint_list").jrumble().trigger('stopRumble');
		}
		event.preventDefault();//必要不能刪
}
	$(function(){
		$('#copyright .ui.dropdown').dropdown();
	})
    
	var export_json={};
	var export_num =0;
	var export_num_use=0;
	
	function load_info(key){
	  DB.ref("info/"+key+"/metro").once("value",function(data){
	    export_json.info[key]=data.val();
			export_num_use=export_num_use+1;
			if(export_num_use==export_num){//代表載入完成
				var _json=JSON.stringify(export_json);
				$('#export_modal textarea').val(_json);
				$('#modal_send').val(user_email);
				$('#export_modal').modal({
            inverted: true,
            closable: false
        }).modal('show');
			}
	  })
	}
	function 匯出藍圖(key) {
	  export_num = 0;
	  export_num_use = 0;
	  var _color = vm.line_color;
	  $('#export_modal').css("borderTopColor", _color);
	  $('#export_modal').modal('hide');
	  //$("#export_modal_button").css("backgroundColor", _color);
	  $("#send_modal_button").css("backgroundColor", _color);
	  $("#send_modal_button").removeClass("loading");
	  $("#send_modal_button").off("click").one("click", function () {
	    $(this).addClass("loading");
	    var email = $.trim($("#modal_send").val());
	    if (email == "") return;
	    var subject = $("#export_modal_name").html();
	    var attachments = $("#modal_textarea").val();

	    $.post("https://us-central1-infometro-cc.cloudfunctions.net/mail", {
	      "email": email,
	      "subject": subject,
	      "html": "檔案存於附件",
	      "attachments": attachments
	    }).done(function () {
	      $("#send_modal_button").removeClass("loading");
	      $('#export_modal').modal('hide');
	      show_event_fn("寄送成功", "檔案已寄到您指定的信箱");
	    })

	  })

	  for (var i = 0; i < vm.blueprint.length; i++) {
	    if (vm.blueprint[i].key == key) {
	      export_json.name = vm.blueprint[i].name;

	      $("#export_modal_name").html("infometro 地鐵計畫：" + export_json.name);
	      $("#export_modal_name").css("color", _color);

	      export_json.line = vm.blueprint[i].line;
	      export_json.info = {};
	      for (var j = 0; j < export_json.line.length; j++) {
	        var key = export_json.line[j]._key;
	        export_json.info[key] = "";
	        load_info(key);
	        export_num = export_num + 1
	      }
	      return
	    }
	  }
	}
	function 匯入藍圖(){
		var _color = vm.line_color;
		$('#import_modal').css("borderTopColor", _color);
		$("#import_modal_button").css("backgroundColor", _color);
		$('#import_modal').modal({
			 inverted: true
		}).modal('show');
				$("#import_modal_button").one("click",function(){
						var export_json=JSON.parse($("#import_modal textarea").val());
						var json_info_str=JSON.stringify(export_json.info);
						var newRef = DB.ref('blueprint/' + user_uid).push();
						var newLine = [];
						for(var j=0;j<export_json.line.length;j++){
								//要把metro的key換成新的
								for(var k=0;k<export_json.line[j].metro.length;k++){
										var _metro_key= DB.ref('blueprint/' + user_uid).push().key;
										json_info_str=json_info_str.replace(export_json.line[j].metro[k]._key,_metro_key);//並且將info裡的替換掉
										export_json.line[j].metro[k]._key=_metro_key;
								}
								var _line_key = DB.ref('blueprint/' + user_uid).push().key;//新的line

								set_line_root(_line_key, user_uid );//新增info的line

								var json_info=JSON.parse(json_info_str);
								DB.ref('info/' + _line_key + "/metro").set(json_info[export_json.line[j]._key]);
								export_json.line[j]._key = _line_key;
						}
						newRef.set({ //將他存到藍圖
										name: export_json.name,
										line: export_json.line,
										timestamp: firebase.database.ServerValue.TIMESTAMP
						})
						$('#import_modal').modal('hide');
						$.cookie('index_blueprint',vm.blueprint.length-1);
						setTimeout(function(){
								location.reload();
						},1000)

				})
		}

	//bottom

	//left
	function drop_line(event,index){
    $(event.target).closest("li").jrumble().trigger('stopRumble');
		if(vm.index_line==index)return;
		var metro_key = vm.drag_metro_key;
		if(metro_key=="")return;
		var _metro=vm.move_metro(metro_key,index);
		if(_metro==undefined)return
		_metro=_metro[0];
		var data = JSON.parse(JSON.stringify(vm.get_blueprint())); //將傳址改為傳值
		data.line[index].metro.push(_metro);
		vm.action="drop_line";
		vm.更新藍圖(data.key,data);
	}
	$(function(){
		//晃動 https://jackrugile.com/jrumble/
		$(".logo").jrumble({
			x: 2,
			y: 2,
			opacity: true,
			opacityMin: .5
		}).hover(function () {
			$(this).trigger('startRumble');
		}, function () {
			$(this).trigger('stopRumble');
		});

		$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>");
		$('#left_color').colpick({
			layout:'hex',
			onHide:function(){
				vm.pick_color=undefined;
			},
			onChange:function(hsb,hex,rgb,el,bySetColor){
				vm.pick_color="#"+hex;
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor){
				$(el).val(hex);
				$(el).colpickHide();
			}
		}).colpickHide();
      
		 $("#left .left_line").on('mousedown',function(event){
				$(document).on('selectstart',function(){return false;})
				$(document).on('dragstart',function(){return false;})
				 // var max_width=$(window).width()-120;
					var gX=($("#left").width()-event.pageX);
					var b_left=event.pageX-parseInt($("#board1").css("left"));
					$(document).on('mousemove.line',function(event){
							var _w=(event.pageX) -gX;
							if(_w<=120)_w=120;//最小寬度
							//if(_w>max_width)_w=max_width;
							$("#left").css("width",_w);
							$("#line_parent").css("width",_w)
							$("#center").css("margin-left",_w);
							$("#edit_parent a").css("width",_w)
					});
					$(document).on('mouseup.line',function(event){
							$(document).off('mouseup.line');
							$(document).off('mousemove.line');
							$(document).off('selectstart');
							$(document).off('dragstart');
							$("#show_event").css("left",$("#left").width() + 20);
					});
			})

	})
	function allowDrop_line(event) { //拖曳的物件移到上面
		if(vm.drag_metro_key){
			$(event.target).closest("li").jrumble().trigger('startRumble');
		}

		event.preventDefault();//必要不能刪
}
	function allowDropLeave_line(event) { //拖曳的物件移出
		if(vm.drag_metro_key){
			$(event.target).closest("li").jrumble().trigger('stopRumble');
		}
		event.preventDefault();//必要不能刪
}

	//left

	//right
	$(function(){
		 //perfectScrollbar
		 $("#right .r_content").perfectScrollbar();
		 $("#right .r_button").on("click",function(){
			var _index=$(this).index()-1;
		  if(_index==0){
			  $("#right_lightning").show();
		  }else{
			  $("#right_lightning").hide();
		  }
			$(this).addClass("active").siblings().removeClass("active");
			$("#right .r_content:eq("+_index+")").addClass("active").siblings().removeClass("active");
		})

		$("#right .right_tool").on("click",function(event){
			if($("#right").height()<400){
				if($(event.target).closest(".r_button").length==0){
					$("#right").toggleClass("down");
					$.cookie('right_tool',$("#right").attr('class'));
				}
			}
		})
		if($.cookie('right_tool')){
			if($.cookie('right_tool').indexOf("down")>-1){
				$(".right_tool").click();
			}
		}

		//拖動拉Bar
	 $("#right .right_line").on('mousedown',function(event){
			$(document).on('selectstart',function(){return false;})
			$(document).on('dragstart',function(){return false;})
				var max_width=$(window).width()-120;
				var gX=($("#right").width()-($(window).width()-event.pageX));
				$(document).on('mousemove.line',function(event){
					var _w=($(window).width()-event.pageX) -gX;
					//if(_w<270)_w=270;//最小寬度
					if(_w>max_width)_w=max_width;
					$("#right").css("width",_w)
				});
				$(document).on('mouseup.line',function(event){
					$(document).off('mouseup.line');
					$(document).off('mousemove.line');
					$(document).off('selectstart');
					$(document).off('dragstart');
				});
			})

		// https://semantic-ui.com/modules/accordion.html#/definition
		$('#right .ui.accordion').accordion();//折疊菜單
	})
	function info_search_db(line_key,_val){
		DB.ref("info/"+line_key+"/metro/").once("value",function(data){
			data.forEach(function (childData) {
				for(var info_key in childData.val()) {
					if(childData.val()[info_key].message.indexOf(_val)>-1){
						 vm.search_info.push({
							 line_key : line_key ,
							 metro_key: childData.key,
							 message : childData.val()[info_key].message
						 })
					}
				}
			});
		})
	}
	function info_search(){//搜尋地鐵功能
		//先從藍圖資訊找到
		return false
		var _val=$.trim($("#right_search input").val());
		vm.search_metro=[];
		vm.search_info=[];
		if(_val=="")return

		var _blueprint=vm.get_blueprint();
		for(var i=0;i<_blueprint.line.length;i++){
			var _key=_blueprint.line[i]._key;
			var _name=_blueprint.line[i].name;
			var _m=_blueprint.line[i].metro;
			for(var j=0;j<_m.length;j++){
				if(_m[j].name.indexOf(_val)>-1){
					vm.search_metro.push({
						line_name: _name,
						line_id:i ,
						metro_name:_m[j].name ,
						metro_id : j
					});
				}
			}
			info_search_db(_key,_val);
		}
	}
	function lighning_bind(){
		var _ref=DB.ref('users_data/' + user_uid +"/lightning/"+vm.get_blueprint().key);
				//.limitToFirst(50)
				vm.$bindAsArray('lightning', _ref);
		_ref.once("child_added", function (snapshot) { //元件載入後的動作
        setTimeout(function () {
         $("#right .r_content").perfectScrollbar('update');
        }, 5);
      })
	}
	function lightning_send(){
		var _textarea=$.trim($("#right_lightning textarea").val());
		if(_textarea=="")return
		var data={
			message : _textarea,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		}
		DB.ref('users_data/' + user_uid + "/lightning/"+vm.get_blueprint().key).push().set(data);
		$("#right_lightning textarea").val("");
	}
	//right

	//center
	function drop(event){
		$("#board_edit>div>i").jrumble().trigger('stopRumble');
		var key = vm.drag_metro_key;
		if(key)vm.delete_metro(key);
		var line_key=vm.drag_line_key;
		if(line_key)vm.delete_line(line_key);
	}
	function allowDrop(event) { //拖曳的物件移到上面
		$("#board_edit>div>i").jrumble().trigger('startRumble');
		event.preventDefault();//必要不能刪
	}
	function allowDropLeave(event) { //拖曳的物件移出
		$("#board_edit>div>i").jrumble().trigger('stopRumble');
		event.preventDefault();//必要不能刪
	}

	$(function(){
		$("#board_textarea").keyup(function(e) {	
			auto_height(this)
		});
		$("#board_textarea").on('paste', textarea_paste);
	})
	//center