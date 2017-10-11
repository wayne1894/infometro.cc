  var resizeTime=0
  $(window).resize(function () {
     
    if(resizeTime)return
   
    resizeTime=setTimeout(function(){
        var center_width=$("#center").width();
		var window_width = $(window).width();
        if(center_width<=1165){
			$("#board_parent").addClass("adj");
		}else{
			$("#board_parent").removeClass("adj");
		}
        if(window.matchMedia('(max-width: 800px)').matches){
          $("#board_edit .border_area").attr("data-position","bottom center")
        }else{
          $("#board_edit .border_area").attr("data-position","right center")
        }
        //       if(is_mobile()){
        //         $("#board_parent").css("min-height",(getViewportSize().h)+"px");
        //       }
        clearTimeout(resizeTime);
        resizeTime=0
    },300);
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
    $.get("//calendar2017.me/infometro.asp?url=" + url, function (html) {
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
		var _height = textarea.scrollHeight + parseFloat($(textarea).css("borderTopWidth")) + parseFloat($(textarea).css("borderBottomWidth"))
    $(textarea).height(_height);
  }
	function auto_height2(textarea){
    $(textarea).height(0);
    var _height=textarea.scrollHeight + parseFloat($(textarea).css("borderTopWidth")) + parseFloat($(textarea).css("borderBottomWidth"));
    $(textarea).height(_height);
  }
  function auto_height3(textarea){
    $(textarea).height(0);
		$(textarea).css("padding-top",0).css("padding-bottom",0);
    var _height=textarea.scrollHeight + parseFloat($(textarea).css("borderTopWidth")) + parseFloat($(textarea).css("borderBottomWidth"));
    $(textarea).height(_height);
		setTimeout(function(){
			$(textarea).css("padding-top","3px").css("padding-bottom","3px");
		},5);
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

	function get_tag(text){//得到tag
		//https://stackoverflow.com/questions/21421526/javascript-jquery-parse-hashtags-in-a-string-using-regex-except-for-anchors-i
	}
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
	$(function () {
		$('#copyright .ui.dropdown').dropdown();
	})

	function export_line() {
		var export_json=[];
		var export_json_info=[]
		var export_num = 0;
		var export_num_use = 0;
		var _check
		
		var _color = vm.line_color;
		$('#export_modal').css("borderTopColor", _color);
		$('#export_modal').modal('hide');

		$("#send_modal_button").css("backgroundColor", _color);
		$("#download_modal_button").css("backgroundColor", _color);
		$("#send_modal_button").removeClass("loading");
		
		$('#export_modal').modal({
			inverted: true,
			closable: false
	  }).modal('show');

		function download(text, name, type) {
			var a = document.createElement("a");
			var file = new Blob([text], {type: type});
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
		}
		function load_info(key,index,fn) {
			DB.ref("info/" + key + "/metro").once("value", function (data) {
				export_json_info[index] = data.val();
				export_num_use = export_num_use + 1;
				if (export_num_use == export_num) { //代表載入完成
					fn();
				}
			})
		}
		function get_check(fn){
			for(var i=0;i<_check.length;i++){
				var _line=vm.blueprint[0].line[_check[i].id.split("---")[1]];
				var key = _line._key;
				export_json.push(_line);
				export_json_info.push([]);
				load_info(key,export_json.length-1,fn);
				export_num = export_num + 1
			}
		}

		$("#send_modal_button").off("click").one("click", function () {//寄送email
			var email = $.trim($("#modal_send").val());
			if (email == "") return;
			_check=$("#export_modal input.hidden:checked");
			if(_check.length==0)return
			$(this).addClass("loading");
			get_check(function(){
				$.post("https://us-central1-infometro-cc.cloudfunctions.net/mail", {
					"email": email,
					"subject": "infometro 資料匯出",
					"html": "檔案存於附件",
					"attachments": JSON.stringify(export_json) +"____//____"+JSON.stringify(export_json_info)
				}).done(function () {
					$("#send_modal_button").removeClass("loading");
					$('#export_modal').modal('hide');
					show_event_fn("寄送成功", "檔案已寄到您指定的信箱");
				})
			});
		})
		$("#download_modal_button").off("click").one("click", function () {//下載檔案
			_check=$("#export_modal input.hidden:checked");
			if(_check.length==0)return
			$(this).addClass("loading");
			get_check(function(){
				var t=new Date();
				var tt=t.getFullYear()+"_"+(t.getMonth()+1)+"_"+t.getDate()+"_";
				var attachments=JSON.stringify(export_json)+"____//____"+JSON.stringify(export_json_info);
				download(attachments, "infometro_"+tt+".txt", "text/plain");
				$("#send_modal_button").removeClass("loading");
				$('#export_modal').modal('hide');
				show_event_fn("下載成功", "檔案已下載");
			});
		})
	}

	function import_line() {
		var import_json ="";
		var _check
		var _color = vm.line_color;
		$('#import_modal').css("borderTopColor", _color);
		$("#import_modal_button").css("backgroundColor", _color);
		$('#import_modal').modal({
			inverted: true,
			closable: false,
			onHide: function(){
				vm.line_import = [];
				$("#uploadtxt").val("");
			}
		}).modal('show');

		$('#uploadtxt').off("change").on('change', function (e) {
    	  onChange(e);
		});
		function onChange(event) {
			var reader = new FileReader();
			reader.onload = onReaderLoad;
			reader.readAsText(event.target.files[0]);
		}
		function onReaderLoad(event){
            import_json = event.target.result;
			vm.line_import = JSON.parse(import_json.split("____//____")[0]);
		}
        function get_check(){
          var _line=[]
			for(var i=0;i<_check.length;i++){
			  _line.push(vm.line_import[_check[i].id.split("---")[1]]);
			}
          return _line;
		}
		$("#import_modal_button").off("click").one("click", function () {
           _check=$("#import_modal input.hidden:checked");
           if(_check.length==0)return
            var _line=get_check();
            var _info_str=import_json.split("____//____")[1];
			for (var j = 0; j < _line.length; j++) {
               var _line_key= DB.ref('blueprint/' + user_uid).push().key
               _line[j]._key=_line_key;	//要把line的key換成新的
				for (var k = 0; k < _line[j].metro.length; k++) {
                  var _metro_key=DB.ref('blueprint/' + user_uid).push().key;
                  _info_str = _info_str.replace(_line[j].metro[k]._key, _metro_key); //並且將info裡的替換掉
                  _line[j].metro[k]._key=_metro_key
				}
				set_line_root(_line_key, user_uid); //新增info的line

                var _info_arr=JSON.parse(_info_str)[j];
				DB.ref('info/' + _line_key + "/metro").set(_info_arr);
                vm.blueprint[0].line.push(_line[j]);
			}
            vm.update_blueprint();
			$('#import_modal').modal('hide');
		})
	}
	function drop_line(event, index) {
		$(event.target).closest("li").jrumble().trigger('stopRumble');
		if (vm.index_line == index) return;
		var metro_key = vm.drag_metro_key;
		if (metro_key == "") return;
		var _metro = vm.move_metro(metro_key, index);
		if (_metro == undefined) return
		_metro = _metro[0];
		var data = JSON.parse(JSON.stringify(vm.blueprint[0])); //將傳址改為傳值
		data.line[index].metro.push(_metro);
		vm.action = "drop_line";
		vm.update_blueprint(data.key, data);
	}
	$(function () {
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
			layout: 'hex',
			onHide: function () {
				vm.pick_color = undefined;
			},
			onChange: function (hsb, hex, rgb, el, bySetColor) {
				vm.pick_color = "#" + hex;
			},
			onSubmit: function (hsb, hex, rgb, el, bySetColor) {
				$(el).val(hex);
				$(el).colpickHide();
			}
		}).colpickHide();

		$("#left .left_line").on('mousedown', function (event) {
			$(document).on('selectstart', function () {
				return false;
			})
			$(document).on('dragstart', function () {
				return false;
			})
			// var max_width=$(window).width()-120;
			var gX = ($("#left").width() - event.pageX);
			var b_left = event.pageX - parseInt($("#board1").css("left"));
			$(document).on('mousemove.line', function (event) {
				var _w = (event.pageX) - gX;
				if (_w <= 120) _w = 120; //最小寬度
				//if(_w>max_width)_w=max_width;
				$("#left").css("width", _w);
				$("#line_parent").css("width", _w)
				$("#center").css("margin-left", _w);
//				$("#edit_parent a").css("width", _w)
			});
			$(document).on('mouseup.line', function (event) {
				$(document).off('mouseup.line');
				$(document).off('mousemove.line');
				$(document).off('selectstart');
				$(document).off('dragstart');
				$("#show_event").css("left", $("#left").width() + 20);
			});
		})

	})

	function allowDrop_line(event) { //拖曳的物件移到上面
		if (vm.drag_metro_key) {
			$(event.target).closest("li").jrumble().trigger('startRumble');
		}

		event.preventDefault(); //必要不能刪
	}

	function allowDropLeave_line(event) { //拖曳的物件移出
		if (vm.drag_metro_key) {
			$(event.target).closest("li").jrumble().trigger('stopRumble');
		}
		event.preventDefault(); //必要不能刪
	}
	$(function () {
		//perfectScrollbar
		$("#right .r_content").perfectScrollbar();
		$("#right .r_button").on("click", function () {
			var _index = $(this).index() - 1;
			if (_index == 0) {
				$("#right_lightning").show();
			} else {
				$("#right_lightning").hide();
			}
			$(this).addClass("active").siblings().removeClass("active");
			$("#right .r_content:eq(" + _index + ")").addClass("active").siblings().removeClass("active");
		})

		$("#right .down_img").on("click", function (event) {
				if ($(event.target).closest(".r_button").length == 0) {
					$("#right").toggleClass("down");
					$.cookie('right_tool', $("#right").attr('class'));
				}
		})
		if ($.cookie('right_tool')) {
			if ($.cookie('right_tool').indexOf("down") > -1) {
				$(".right_tool").click();
			}
		}

		//拖動拉Bar
		$("#right .right_line").on('mousedown', function (event) {
			$(document).on('selectstart', function () {
				return false;
			})
			$(document).on('dragstart', function () {
				return false;
			})
			var max_width = $(window).width() - 120;
			var gX = ($("#right").width() - ($(window).width() - event.pageX));
			$(document).on('mousemove.line', function (event) {
				var _w = ($(window).width() - event.pageX) - gX;
				//if(_w<270)_w=270;//最小寬度
				if (_w > max_width) _w = max_width;
				$("#right").css("width", _w)
			});
			$(document).on('mouseup.line', function (event) {
				$(document).off('mouseup.line');
				$(document).off('mousemove.line');
				$(document).off('selectstart');
				$(document).off('dragstart');
			});
		})

		// https://semantic-ui.com/modules/accordion.html#/definition
		$('#right .ui.accordion').accordion(); //折疊菜單
	})

	function info_search_db(line_key, _val) {
		DB.ref("info/" + line_key + "/metro/").once("value", function (data) {
			data.forEach(function (childData) {
				for (var info_key in childData.val()) {
					if (childData.val()[info_key].message.indexOf(_val) > -1) {
						vm.search_info.push({
							line_key: line_key,
							metro_key: childData.key,
							message: childData.val()[info_key].message
						})
					}
				}
			});
		})
	}

	function info_search() { //搜尋地鐵功能
		//先從藍圖資訊找到
		return false
		var _val = $.trim($("#right_search input").val());
		vm.search_metro = [];
		vm.search_info = [];
		if (_val == "") return
		var _blueprint = vm.blueprint[0];
		for (var i = 0; i < _blueprint.line.length; i++) {
			var _key = _blueprint.line[i]._key;
			var _name = _blueprint.line[i].name;
			var _m = _blueprint.line[i].metro;
			for (var j = 0; j < _m.length; j++) {
				if (_m[j].name.indexOf(_val) > -1) {
					vm.search_metro.push({
						line_name: _name,
						line_id: i,
						metro_name: _m[j].name,
						metro_id: j
					});
				}
			}
			info_search_db(_key, _val);
		}
	}

	function lighning_bind() {
		var _ref = DB.ref('users_data/' + user_uid + "/lightning/" + vm.blueprint[0].key);
		//.limitToFirst(50)
		vm.$bindAsArray('lightning', _ref);
		_ref.once("child_added", function (snapshot) { //元件載入後的動作
			setTimeout(function () {
				$("#right .r_content").perfectScrollbar('update');
			}, 5);
		})
	}

	function lightning_send() {
		var _textarea = $.trim($("#right_lightning textarea").val());
		if (_textarea == "") return
		var data = {
			message: _textarea,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		}
		DB.ref('users_data/' + user_uid + "/lightning/" + vm.blueprint[0].key).push().set(data);
		$("#right_lightning textarea").val("");
	}
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


//center_board2 檔案上傳的部份
 $(function () {
   var obj = $("#board_enter_parent,#board_send_parent");
   obj.on('dragenter', function (e) {
     e.stopPropagation();
     e.preventDefault();
   });
   obj.on('dragover', function (e) {
     var files = e.originalEvent.dataTransfer.files;
     if (vm.drag_line_key || vm.drag_metro_key) return
     $("#board_send_parent>.ui.icon").css("background-color", "#f7f7f7");
     e.stopPropagation();
     e.preventDefault();
   });

   obj.on('dragleave', function (e) {
     var files = e.originalEvent.dataTransfer.files;
     if (vm.drag_line_key || vm.drag_metro_key) return
     $("#board_send_parent>.ui.icon").css("background-color", "");
     e.stopPropagation();
     e.preventDefault();
   });
   obj.on('drop', function (e) {
     e.preventDefault();
     var files = e.originalEvent.dataTransfer.files;
     $("#board_send_parent>.ui.icon").css("background-color", "");
     if (files.length == 0) return;
     upload_file(files[0]);
   });
 })

 function clear_uploadFile(send) {
   $("#progress .bar").css("min-width", "0%");
   $("#uploadFileParent").parent().css("background-color", "");
   var file_id = $("#uploadFileParent").data("file_id");
   var file_name = $("#uploadFileParent").data("file_name");
   if(send!="send"){ //代表送出就不刪除
     if (file_id != undefined && file_id != "") { //把他刪了
       var storageRef = firebase.storage().ref();
       var desertRef = storageRef.child("file/" + vm.get_line_key() + "/" + vm.get_metro()._key + "/" + file_id + "/" + file_name);

       desertRef.delete().then(function () {
         //print("刪除原先的檔案");
       }).catch(function (error) {
         // Uh-oh, an error occurred!
       });
     }
   }

   $("#uploadFileParent").data({
     file_id: "",
     file_url: "",
     file_name: ""
   });
   $('#uploadFileInput').val("");
   $("#uploadName").html("");
   $('#uploadFileParent').attr("data-tooltip", "上傳檔案");

 }

 function upload_file(file) {
   var name = file.name;
   //var ext= name.split(".")[1];//可以在這邊檢查不合適的副檔名

   var newfile = DB.ref("file/" + vm.get_line_key() + "/" + vm.get_metro()._key).push();
   newfile.set({
     name: name,
     timestamp: firebase.database.ServerValue.TIMESTAMP
   })

   //https://firebase.google.com/docs/storage/web/upload-files
   var storageRef = firebase.storage().ref();
   var uploadTask = storageRef.child("file/" + vm.get_line_key() + "/" + vm.get_metro()._key + "/" + newfile.key + "/" + name).put(file);
   clear_uploadFile();
   uploadTask.on('state_changed', function (snapshot) {
     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     $("#progress .bar").css("min-width", progress + "%");
     //console.log('Upload is ' + progress + '% done');
   }, function (error) {
     // Handle unsuccessful uploads
   }, function () {
     $("#uploadFileParent").parent().css("background-color", "currentColor");
     $("#progress .bar").css("min-width", "0%");
     $('#uploadFileInput').val("");
     $('#uploadFileParent').attr("data-tooltip", "重新上傳");
     $("#uploadName").html("<span style='color:#ffffff;margin-left:5px;white-space: nowrap;'>" + name + "</span><i class='delete icon' style='position: relative;left:5px;cursor:pointer;color:#ffffff;display:inline' onclick='clear_uploadFile()'></i>");
     var downloadURL = uploadTask.snapshot.downloadURL;
     $('#uploadFileInput').val("");
     $("#uploadFileParent").data({
       file_id: newfile.key,
       file_url: downloadURL,
       file_name: name
     });
     var board_textarea = $.trim($("#board_textarea").val());
     if (board_textarea == "") {
       $("#board_textarea").val($("#board_textarea").val() + name);
     } else {
       $("#board_textarea").val($("#board_textarea").val() + "\n" + name);
     }
   })
 }
 $(function () {
   //https://firebase.google.com/docs/storage/web/upload-files
   $("#uploadButton").click(function () {
     $("#uploadFileInput").click();
   });
   $('#uploadFileInput').on('change', function (e) {
     if (e.target.files.length > 0) {
       var file = e.target.files[0];
       upload_file(file);
     }
   });
 })
//center_board2 檔案上傳的部份
var vm_header=new Vue({
	el: '#header_main',
	data: {
	  users: [],
      header_search : []
	},
    mounted: function () {
      $("#header_area").css("visibility", "visible");
    },
    methods: {
      header_keyup : function(){
        vm_header.header_search=[];
        var _name=$.trim($("#header_search").val()).toLowerCase();//要查詢的name
        if(_name=="")return;
        var _line=vm.blueprint[0].line;
        for(var i=0;i<_line.length;i++){
          for(var j=0;j<_line[i].metro.length;j++){
            var _name2=_line[i].metro[j].name.toLowerCase();
            if(_name2.indexOf(_name)>-1 || _name.indexOf(_name2)>-1){
              var myRegExp=new RegExp(_name,"g");
              var replaceText 	= "<b style='color:"+_line[i].color+"'>"+_name+"</b>"; //準備替換成的文字
              var new_string=_name2.replace(myRegExp, replaceText);
              this.header_search.push({
                name : new_string,
                _key : _line[i].metro[j]._key,
                color : _line[i].color,
                index: i
              })
            }
          }
        }
        
      },
      header_search_click : function(index,key){
        vm.exchange_line(index,"header_search_click");
        setTimeout(function(){
          vm.key_metro=key;
        },5)
        vm_header.header_search=[];
        $("#header_search").val("");
      }
    }
})
var vm = new Vue({
  el: '#main',
  data: {
    blueprint: [],
    index: [],
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
    copy_info : [],
		line_import :[]
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
      return this.blueprint[0].line[0].color;
    },
    line: function () { //載入line
      if (this.blueprint.length == 0) return "";
      return this.blueprint[0].line;
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
//    info_favorites: function () {
//      var _info = this.info.filter(function (info) {
//        if (info.favorite) {
//          if (info.url_info) { //有網址資訊
//            return true;
//          } else {
//            return false;
//          }
//        }
//        return false;
//      });
//      if (_info.length == 0) return false;
//      return _info;
//    },
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
    },
		get_linked:function(){
				var _line=vm.blueprint[0].line;
        for(var i=0;i<_line.length;i++){
          for(var j=0;j<_line[i].metro.length;j++){
            var _name2=_line[i].metro[j].name.toLowerCase();
            if(_name2.indexOf(_name)>-1 || _name.indexOf(_name2)>-1){
              //有筆對到
             
            }
          }
        }
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
        DB.ref('users_data/' + user_uid +"/lightning/"+vm.blueprint[0].key+"/"+key).remove();
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
              if(Math.abs(img.width / img.height -1)>0.5){//代表長寬比比較大
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
              if(Math.abs(img.width / img.height -1)>0.5){//代表長寬比比較大
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
        setTimeout(function () {
          sortable["metro"].option("disabled", true);
         // sortable["line"].option("disabled", true);
        }, 5)
        return "一般模式"
      } else if (this.mode == 1) { //編輯模式
        setTimeout(function () {
          sortable["metro"].option("disabled", false);
        //  sortable["line"].option("disabled", false);
        }, 5)
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
        data = vm.blueprint[0];
        key = data.key;
      }
      setTimeout(function () {
        DB.ref('blueprint/' + user_uid + "/" + key).set(data);
      }, 0)
    },
    get_index_blueprint: function () { //得到當前藍圖索引資料
      return vm.index[0];
    },
    get_line: function () {
      return this.blueprint[0].line[this.index_line]
    },
    get_index_line: function () { //得到當前支線索引資料
      var _index=vm.index[0][vm.index_line];
      if(typeof _index!="object"){
         print("索引變字串");
         vm.index[0][vm.index_line]={}
         vm.index[0][vm.index_line].check=false;
        return vm.index[0][vm.index_line]
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
    exchange_line: function (index,source) {
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
        if(source==undefined){
          vm.update_metro_key(vm.get_index_blueprint()[index]);
        }
        vm.action_move=1;
        setTimeout(move_center,0);
        $(document.body).scrollTop(0);
      }
    },
    replace_index: function () { //修補程式(不常發生)
      var _line = this.blueprint[0].line;
      var _index_blueprint = vm.get_index_blueprint();
      var j = _line.length - _index_blueprint.length;
      for (var i = 0; i < j; i++) _index_blueprint.push([]); //新增line的index陣列
      print("重新設定了index");
    },
    new_line: function () {
      if(vm.action=="load")return;
      var data = this.blueprint[0];
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
      var data = vm.blueprint[0];
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
      var data = vm.blueprint[0];
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
      var data = JSON.parse(JSON.stringify(this.blueprint[0])); //將傳址改為傳值
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
      var data = this.blueprint[0];
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

				DB.ref('info/' + vm.blueprint[0].line[_line_index]._key + "/metro/" + move_key).set(old_data.val());//移動

				DB.ref("info/" + data.line[vm.index_line]._key + "/metro").child(move_key).remove();//移除(可以進行備份)

				if(delete_fn)setTimeout(delete_fn,5);//刪除支線

			}) 
      return _metro
    },
    delete_metro: function (delete_key) { //與move_metro雷同
      var data = JSON.parse(JSON.stringify(this.blueprint[0])); //將傳址改為傳值
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
      var data = JSON.parse(JSON.stringify(this.blueprint[0])); //將傳址改為傳值
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
     if(_level=="metro"){
			  var get_level=vm.get_metro();
      }else{//line
        var get_level=vm.get_line();
      }
			var _name=get_level.name;
      $textarea.val(get_level.name);
			if(_level=="metro"){
				auto_height3($textarea[0]);
			}else{//line
				auto_height2($textarea[0]);
			} 
      $textarea.on("keydown",function(event){
				if(_level=="metro"){
					auto_height3($textarea[0]);
				}else{//line
					auto_height2($textarea[0]);
				}
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
        if (_level == "line") {
          return vm.blueprint[0].line[index];
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
        vm.blueprint[0].line[index].color = "#" + $("#left_color").val();
        vm.action = "edit_color";
        vm.update_blueprint();
		$("#left_color").attr("show","");
        $(this).off("click.op");
      });
    },
    swap_line: function (oldIndex, newIndex) {
      if (oldIndex == newIndex) return;
      var data = JSON.parse(JSON.stringify(this.blueprint[0])); //將傳址改為傳值
      var new_line = [];
      var new_index = [];
      $("#line_drag li").each(function () {
        var index_key = get_key($(this).data("key"));
        new_line.push(data.line[index_key]);
        new_index.push(vm.index[0][index_key]);
      })
      data.line = new_line;
      vm.index[0] = new_index;
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