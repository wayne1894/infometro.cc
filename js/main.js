var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){$(window).width();if($("#top").css("width",$("#center").width()),$("#main").width()<1260){$("#board3").addClass("board3_left");var t=($("#center").width()-860)/2;$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t)}else{$("#board3").removeClass("board3_left");var t=($("#center").width()-1175)/2;t<0&&(t=0),$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t),$("#board3").css("left",b3_left+t)}}).resize(),$("#main").css("visibility","visible").css("left",0),$(function(){$("#board_textarea").keyup(function(t){$(this).height(70),$(this).height(this.scrollHeight+parseFloat($(this).css("borderTopWidth"))+parseFloat($(this).css("borderBottomWidth")))}),$("#right .right_main").perfectScrollbar(),$("#logo img").jrumble().hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")})});