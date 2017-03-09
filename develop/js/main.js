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

  $(function(){
    $("#board_textarea").keyup(function(e) {
    $(this).height(70);
    $(this).height(this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")));
});	
    $("#right .right_main").perfectScrollbar();
    
    //https://jackrugile.com/jrumble/
    $("#logo img").jrumble().hover(function(){
	  $(this).trigger('startRumble');
    }, function(){
      $(this).trigger('stopRumble');
    });
    
  })