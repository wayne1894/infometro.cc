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
  sortable["blueprint"] = new Sortable(id("blueprint_drag"));
  sortable["line"] = new Sortable(id("line_drag"));
  sortable["metro"] = new Sortable(id("top_tag"),{
    setData: function (dataTransfer,dragEl) {
	  dataTransfer.setData('index',$(dragEl).data("index")); //設定要傳送的資料
	},
  });

  $(function(){
    //鍵盤按下去
    $("#board_textarea").keyup(function(e) {
      $(this).height(70);
      $(this).height(this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")));
    });
    
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