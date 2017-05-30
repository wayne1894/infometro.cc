  var b1_left = parseInt($("#board1").css("left"));
  var b2_left = parseInt($("#board2").css("left"));
  var b3_left = parseInt($("#board3").css("left"));
  $(window).resize(function () {
    var window_width = $(window).width();
    $("#top").css("width", $("#center").width());
    if ($("#main").width() < 1260) {
      $("#board3").addClass("board3_left");
      var _move = ($("#center").width() - 860) / 2;
      $("#board1").css("left", b1_left + _move);
      $("#board2").css("left", b2_left + _move);
    } else {
      $("#board3").removeClass("board3_left");
      var _move = ($("#center").width() - 1175) / 2;
      if (_move < 0) _move = 0;
      $("#board1").css("left", b1_left + _move);
      $("#board2").css("left", b2_left + _move);
      $("#board3").css("left", b3_left + _move);
    }
    setTimeout(move_center, 0);
  }).resize();


  var sortable = [];
  $(function () {
    //拖亦的部份 https://github.com/RubaXa/Sortable
    sortable["line_master"] = new Sortable(id("line_drag_master"), {
      animation: 150,
      forceFallback: false
    });
    sortable["line"] = new Sortable(id("line_drag"), {
      animation: 150,
      forceFallback: false,
      setData: function (dataTransfer, dragEl) {
		dataTransfer.setData('line_key', $(dragEl).data("key")); //設定要傳送的資料
        dataTransfer.setData('line_key', $(dragEl).data("key")); //設定要傳送的資料
      },
      onStart: function(){
        vm.mode = 1.5;
      },
      onEnd: function (evt) {
        setTimeout(function(){
          vm.swap_list(evt.oldIndex, evt.newIndex);
		  vm.mode = 1;
        },5)
      }
    });
    sortable["metro"] = new Sortable(id("top_tag"), {
      animation: 50,
      forceFallback: false,
      filter: ".add",
      setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('key', $(dragEl).data("key")); 
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
        },5)
      }
    });
    
    //導覽的部份
    setTimeout(function () {
      $('.nav_i.custom')
        .popup({
          popup: $('.custom.popup'),
          on: 'click'
        })
    }, 5);
    setTimeout(function () {
      $(".nav_i:not(.custom)").popup({
        on: 'click'
      })
    }, 5);
  })

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


//----------------------分塊程式碼------------------

//top
 function move_center(is_move) {
   var total_width = 0;
   var tog_width = $("#top_tag").width();
   $("#top_tag li").each(function () {
     total_width = total_width + $(this).width();
   })
   if (tog_width > total_width) {
     $("#top_tag").css("left", (((tog_width - total_width) / 2) + 15) + "px");
   } else {
     $("#top_tag").css("left", 0);
   }
   $("#top_tag").stop().fadeIn(350);
 }
 function top_tag_scroll() {
   var scroll_val = 0;
   var container = $("#top_tag"),
     slide = !container.find(">li.active").length ? 0 : container.find(">li.active").index(),
     direct = $(this).hasClass("right") ? 1 : -1,
     target = slide + direct < 0 ? [] : container.find(">li").eq(slide + direct);
   if (target.length) {
     scroll_val = $("#top_tag").scrollLeft();
     target.addClass("active").velocity("stop", true).velocity("scroll", {
       axis: "x",
       duration: 150,
       offset: -42,
       easing: "ease",
       container: container,
       complete: function () {
         if (direct) {
           if ($("#top_tag").scrollLeft() == scroll_val) {
             target.removeClass("active").prev().addClass("active");
           }
         }
       }
     }).siblings().removeClass("active");
   }
 }

 $(function () {
   //http://velocityjs.org/#scroll
   $(".triangle").click(top_tag_scroll);
 })
//top

//bottom
function drop_blueprint(event,key){
  var line_key = event.dataTransfer.getData("line_key");
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
  $("#blueprint").on("click",function(event){	
    if($(event.target).hasClass("blueprint_i")){
        $(event.target).closest(".blueprint_list").trigger("customClick");
    }
  })
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

  var metro_key = event.dataTransfer.getData("key");
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
function send_feedback(){
  var a=$.trim($("#feedback1").val());
  var b="///"+user_uid;
  var c="";
  if($("#feedback2").is( ":checked" ))c="////請回信"
  if(a!=""){
    a=a+b+c;
    var newRef=DB.ref("feedback/").push()
    newRef.set(a);
  }
  $("#feedback_modal").modal("hide")
}

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
  var key = event.dataTransfer.getData("key");
  if(key)vm.delete_metro(key);
  var line_key=event.dataTransfer.getData("line_key");
  if(line_key)vm.delete_line(line_key);
}
function allowDrop(event) { //拖曳的物件移到上面
  //print("拖曳的物件移到上面")
  event.preventDefault();
}
$(function(){
    $("#board_textarea").keyup(function(e) {	
      auto_height(this)
    });
    $("#board_textarea").on('paste', textarea_paste);
})
//center