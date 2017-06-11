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
        if(window_width<650){
          $("#center").css("width","650px");
          $("#top").css("width", $("#center").width());
        }else{
          $("#center").css("width","87%");
          if(window_width<(961-30)){
              $("#top").css("width", window_width-$("#left").width());
          }else{
              $("#top").css("width", $("#center").width());
          }
        }
  }).resize();

 var sortable = [];
  $(function () {
    //拖亦的部份 https://github.com/RubaXa/Sortable
    sortable["line_master"] = new Sortable(id("line_drag_master"), {
      animation: 0
    });
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
        vm.mode = 1.5;
      },
      onEnd: function (evt) {
        setTimeout(function(){
          vm.swap_line(evt.oldIndex, evt.newIndex);
		  		vm.mode = 1;
          vm.drag_line_key="";
        },5)
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
          vm.mode = 1;
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

  function parse_url(url, fn) {
    $.get("https://infometro.hopto.org/infometro.asp?url=" + url, function (html) {
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
				var url_info = {}
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
				if (url_info.og_image == undefined) { //取fb images
					if (html.indexOf("og:image") > -1) {
						var og_html = html.split("og:image")[1].split(">")[0];
						og_html = og_html.replace(/\'/gi, "\"");
						og_html = og_html.split("content=\"")[1].split('"')[0]
						url_info.og_image = og_html;
					}
				}
				if (url_info.og_description == undefined) {
					if (html.indexOf("og:description") > -1) {
						var og_html = html.split("og:description")[1].split(">")[0];
						og_html = og_html.replace(/\'/gi, "\"");
						og_html = og_html.split("content=\"")[1].split('"')[0]
						url_info.og_description = og_html;
					}
				}
				if (url_info.og_title == undefined) {
					if (html.indexOf("og:title") > -1) {
						var og_html = html.split("og:title")[1].split(">")[0];
						og_html = og_html.replace(/\'/gi, "\"");
						og_html = og_html.split("content=\"")[1].split('"')[0]
						url_info.og_title = og_html;
					}
				}


				//var $iframe_body=$(document.getElementById('iframe').contentWindow.document.body);

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

				//判斷是不是youtube
				if (url.indexOf(".youtube.") > -1) {
					url_info.youtube = url.split("?v=")[1].split("&")[0];
				} else if (url.indexOf("youtu.be/") > -1) {
					url_info.youtube = url.split("be/")[1];
				}
	//      url_info.ico = "https://www.google.com/s2/favicons?domain_url=" + url; 減少流量這個不存了


				$("#iframe").remove();
			  if (typeof fn === "function") fn(url_info);
			}catch(err) {
				print("網址解析有錯")
				if (typeof fn === "function") fn();
			}

      //console.log(url_info);
    }).fail(function(){
      if (typeof fn === "function") fn();
		})
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

          $("#board_send_parent").append("<div class='navOne ui top pointing basic label'>這個區塊可以新增資訊<i class='delete icon' style='float:right'></i></div>");

          $("#new_line_parent").append("<div class='navOne ui top pointing basic label'>這裡是支線區<i class='delete icon' style='float:right'></i></div>");

          $("#top").append("<div class='navOne ui right pointing basic label'>這個區塊是地鐵站<i class='delete icon' style='float:right'></i></div>");

          $("#edit_parent .navigation").one("click",remove_start);

           $("#edit_parent .navOne i").one("click",function(){
               remove_start(1);
           });
           setTimeout(function(){
               $("#edit_parent .navOne").transition("flash");
           },600);

           $("#board_send_parent .navOne i").one("click",function(){
               remove_start(2);
           });
           setTimeout(function(){
               $("#board_send_parent .navOne").transition("flash");
           },1400);

           $("#new_line_parent .navOne i").one("click",function(){
               remove_start(3);
           });
           setTimeout(function(){
               $("#new_line_parent .navOne").transition("flash");
           },2200);

          $("#top .navOne i").one("click",function(){
               remove_start(4);
           });
           setTimeout(function(){
               $("#top .navOne").transition("flash");
           },3000);
      }

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
		var line_key = vm.drag_line_key;
		if(line_key=="")return;
		if(key==vm.blueprint[vm.index_blueprint].key){
			print("相同的blueprint");
			return;
		}
		var _line=vm.move_line(line_key);
		_line=_line[0];
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

	}
	$(function(){
      if(is_mobile()){
		$("#blueprint").on("click",function(event){	
			if($(event.target).hasClass("blueprint_i")){
					$(event.target).closest(".blueprint_list").trigger("customClick");
			}
		})
      }
	})

	//var export_json={};
	//function load_info(key){
	//  DB.ref("info/"+key+"/metro").once("value",function(data){
	//    export_json.info[key]=data.val();
	//  })
	//}
	//function 匯出藍圖(key){
	//  for(var i=0;i<vm.blueprint.length;i++){
	//    if(vm.blueprint[i].key==key){
	//      export_json.name=vm.blueprint[i].name;
	//      export_json.line=vm.blueprint[i].line;
	//      export_json.info={};
	//      for(var j=0;j<export_json.line.length;j++){
	//         var key=export_json.line[j]._key;
	//         export_json.info[key]="";
	//         load_info(key);
	//      }
	//      return
	//    }
	//  }
	//}

	//bottom

	//left
	 function drop_line(event,index){
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
				vm.pick_master=undefined;
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
                  $("#top").css("width", $("#center").width());
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
	//left

	//right
	$(function(){
		 //perfectScrollbar
		 $("#right .r_content").perfectScrollbar();
		 $("#right .r_button").on("click",function(){
			var _index=$(this).index()-1;
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
	//right

	//center
	function drop(event){
      var key = vm.drag_metro_key;
      if(key)vm.delete_metro(key);
      var line_key=vm.drag_line_key;
      if(line_key)vm.delete_line(line_key);
	}
	function allowDrop(event) { //拖曳的物件移到上面
      //print("拖曳的物件移到上面")
      event.preventDefault();//必要不能刪
	}

	$(function(){
      $("#board_textarea").keyup(function(e) {	
          auto_height(this)
      });
      $("#board_textarea").on('paste', textarea_paste);
	})
	//center