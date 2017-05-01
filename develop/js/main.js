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
    setData: function (dataTransfer,dragEl) {
     dataTransfer.setData('index',$(dragEl).data("index")); //設定要傳送的資料
	},onStart: function (evt) {
	  //print(evt.oldIndex);
	},onEnd: function(evt){
      vm.swap_metro(evt.oldIndex,evt.newIndex)
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

  function parse_url(url,fn){
 
    $.get("http://54.250.245.226/infometro.asp?url="+url,function(html){
          var iframe = document.createElement("iframe");
          iframe.id="iframe";
          iframe.style.display="none";
          $(document.body).append(iframe);
      var ifrm = document.getElementById('iframe');
          ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
          ifrm.document.open();
          ifrm.document.write(html);
          ifrm.document.close();
           var url_info={}
           var metas = $("#iframe")[0].contentWindow.document.getElementsByTagName('meta');
           for (var i=0; i<metas.length; i++) { 
               //console.log(metas[i])
               if(metas[i].getAttribute("name")=="description"){
                   url_info.description=metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:description"){
                   url_info.fb_description=metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:image"){
                   url_info.fb_image=url_info.fb_image +","+ metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:title"){
                   url_info.fb_title=metas[i].getAttribute("content");
               }else if(metas[i].getAttribute("property")=="og:url"){
                   url_info.fb_url=metas[i].getAttribute("content");
               }
           }
          //var $iframe_body=$(document.getElementById('iframe').contentWindow.document.body);
          url_info.title=$(document.getElementById('iframe').contentWindow.document).find("title").html();
          url_info.ico="https://www.google.com/s2/favicons?domain_url="+url;
          $("#iframe").remove();
          if(typeof fn ==="function")fn(url_info);
          //console.log(url_info.fb_url);
      })
  }