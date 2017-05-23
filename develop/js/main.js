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
    //拖亦程式 https://github.com/RubaXa/Sortable
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
  })
  $(function () {
    //perfectScrollbar
    $("#right .right_main").perfectScrollbar();

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
    setTimeout(function(){
      $(".nav_i:not(.custom)").popup({
        on: 'click'
      })
    },5);
    
    setTimeout(function(){
     $('.nav_i.custom')
      .popup({
        popup : $('.custom.popup'),
        on : 'click'
      })
     },5);
    
 
  })
  //parse_url("https://www.youtube.com/watch?v=6nhLWBf6lS0")

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
          if(url_info)vm.url_info = url_info;
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
    $.get("https://54.250.245.226/infometro.asp?url=" + url, function (html) {
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
      url_info.ico = "https://www.google.com/s2/favicons?domain_url=" + url;
      $("#iframe").remove();
      if (typeof fn === "function") fn(url_info);

      //console.log(url_info);
    }).fail(function(){
			 if (typeof fn === "function") fn();
		})
  }
