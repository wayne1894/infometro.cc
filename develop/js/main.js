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
//  sortable["blueprint"] = new Sortable(id("blueprint_drag"),{
//    animation: 150,
//    forceFallback: true,
//    onEnd: function(){
//      vm.swap_blueprint(evt.oldIndex,evt.newIndex)
//    }
//  });
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
			url_info.title=$(document.getElementById('iframe').contentWindow.document).find("title").html();
			if(url_info.title==undefined)url_info.title="";
			url_info.ico="https://www.google.com/s2/favicons?domain_url="+url;

			$("#iframe").remove();
			if(typeof fn ==="function")fn(url_info);
			console.log(url_info);
      })
  }


	function print(a){
		console.log(a)
	}
	function test(msg){//測試用
		$("#test").remove();
		$(document.body).append("<div id='test' style='width:50px;height:50px;position:fixed;top:0px;left:0px; z-index:10000;color:red;'>"+msg+"</div>");
	}
	function id(a){
		return document.getElementById(a);
	}

	//一些以前遺留的資料

		// $(document).bind('selectstart',function(){return false;})
	
    //按右鍵 //if($(event.target).hasClass("blueprint_i"))return;   -->要移掉
    //    $(".blueprint_list").off("contextmenu.custom").on("contextmenu.custom",function(event){
    //      event.preventDefault();
    //      if(event.target.nodeName=="INPUT")return;
    //      $(this).trigger("customClick");
    //    })