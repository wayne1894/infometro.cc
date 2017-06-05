function urlify(t){var e=/(https?:\/\/[^\s]+)/g;return t.replace(e,function(t){return'<a href="'+t+'">'+t+"</a>"})}function textarea_paste(){if(!vm.url_info){var t=this,e=t.value,n=t.selectionStart,i=t.selectionEnd,o=t.scrollTop;t.value="",setTimeout(function(a){var r=t.value;t.value=e.substring(0,n)+r+e.substring(i,e.length),t.focus(),t.selectionStart=t.selectionEnd=n+r.length,t.scrollTop=o;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];$("#board_enter .world.icon").show(),$("#board_enter .idea.icon").hide(),parse_url(s,function(t){""!=$("#board_textarea").val()&&t&&(vm.url_info=t),$("#board_enter .world.icon").hide()})}},0)}}function textarea_paste2(t,e){var n=t.value,i=t.selectionStart,o=t.selectionEnd,a=t.scrollTop;t.value="",setTimeout(function(){var r=t.value;t.value=n.substring(0,i)+r+n.substring(o,n.length),t.focus(),t.selectionStart=t.selectionEnd=i+r.length,t.scrollTop=a;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];parse_url(s,function(t){e.url_info=t})}},0)}function parse_url(t,e){$.get("https://infometro.hopto.org/infometro.asp?url="+t,function(n){try{var i=document.createElement("iframe");i.id="iframe",i.style.display="none",$(document.body).append(i);var o=document.getElementById("iframe");o=o.contentWindow||o.contentDocument.document||o.contentDocument,o.document.open(),o.document.write(n),o.document.close();for(var a={},r=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),l=0;l<r.length;l++)"description"==r[l].getAttribute("name")?a.description=r[l].getAttribute("content"):"og:description"==r[l].getAttribute("property")?a.og_description=r[l].getAttribute("content"):"og:image"==r[l].getAttribute("property")?a.og_image=r[l].getAttribute("content").split(",")[0]:"og:title"==r[l].getAttribute("property")&&(a.og_title=r[l].getAttribute("content"));if(void 0==a.og_image&&n.indexOf("og:image")>-1){var s=n.split("og:image")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_image=s}if(void 0==a.og_description&&n.indexOf("og:description")>-1){var s=n.split("og:description")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_description=s}if(void 0==a.og_title&&n.indexOf("og:title")>-1){var s=n.split("og:title")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_title=s}a.og_title?a.title=a.og_title:(a.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==a.title&&(a.title="")),a.og_description&&(a.description=a.og_description),a.og_image&&(a.image=a.og_image),delete a.og_title,delete a.og_description,delete a.og_image,a.url=t,a.url_parent=t.split("://")[1].split("/")[0],t.indexOf(".youtube.")>-1?a.youtube=t.split("?v=")[1].split("&")[0]:t.indexOf("youtu.be/")>-1&&(a.youtube=t.split("be/")[1]),$("#iframe").remove(),"function"==typeof e&&e(a)}catch(t){print("網址解析有錯"),"function"==typeof e&&e()}}).fail(function(){"function"==typeof e&&e()})}function auto_height(t){$(t).height(70),$(t).height(t.scrollHeight+parseFloat($(t).css("borderTopWidth"))+parseFloat($(t).css("borderBottomWidth")))}function auto_height2(t){$(t).height(0);var e=t.scrollHeight+parseFloat($(t).css("borderTopWidth"))+parseFloat($(t).css("borderBottomWidth"));$(t).height(e)}function remove_start(t){$.removeCookie("start"),1==t?$("#edit_parent .navOne").remove():2==t?$("#board_send_parent .navOne").remove():3==t?$("#new_line_parent .navOne").remove():4==t?$("#top .navOne").remove():$(".navOne").remove()}function start_set(){"Y"==$.cookie("start")&&($("#edit_parent").append("<div class='navOne ui left pointing basic label'>第一次進來嗎？點擊這裡開始導覽。<i class='delete icon' style='float:right'></i></div>"),$("#board_send_parent").append("<div class='navOne ui top pointing basic label'>這個區塊可以新增資訊<i class='delete icon' style='float:right'></i></div>"),$("#new_line_parent").append("<div class='navOne ui top pointing basic label'>這裡是支線區<i class='delete icon' style='float:right'></i></div>"),$("#top").append("<div class='navOne ui right pointing basic label'>這個區塊是地鐵站<i class='delete icon' style='float:right'></i></div>"),$("#edit_parent .navigation").one("click",remove_start),$("#edit_parent .navOne i").one("click",function(){remove_start(1)}),setTimeout(function(){$("#edit_parent .navOne").transition("flash")},600),$("#board_send_parent .navOne i").one("click",function(){remove_start(2)}),setTimeout(function(){$("#board_send_parent .navOne").transition("flash")},1400),$("#new_line_parent .navOne i").one("click",function(){remove_start(3)}),setTimeout(function(){$("#new_line_parent .navOne").transition("flash")},2200),$("#top .navOne i").one("click",function(){remove_start(4)}),setTimeout(function(){$("#top .navOne").transition("flash")},3e3))}function move_center(t){var e=0,n=$("#top_tag").width();$("#top_tag li").each(function(){e+=$(this).width()}),n>e?$("#top_tag").css("left",(n-e)/2+15+"px"):$("#top_tag").css("left",0),$("#top_tag").stop().fadeIn(350)}function top_tag_scroll(){var t=0,e=$("#top_tag"),n=e.find(">li.active").length?e.find(">li.active").index():0,i=$(this).hasClass("right")?1:-1,o=n+i<0?[]:e.find(">li").eq(n+i);o.length&&(t=$("#top_tag").scrollLeft(),o.addClass("active").velocity("stop",!0).velocity("scroll",{axis:"x",duration:150,offset:-42,easing:"ease",container:e,complete:function(){i&&$("#top_tag").scrollLeft()==t&&o.removeClass("active").prev().addClass("active")}}).siblings().removeClass("active"))}function drop_blueprint(t,e){var n=vm.drag_line_key;if(""!=n){if(e==vm.blueprint[vm.index_blueprint].key)return void print("相同的blueprint");var i=vm.move_line(n);i=i[0];for(var o=0;o<vm.blueprint.length;o++)if(vm.blueprint[o].key==e){vm.blueprint[o].line.push(i),vm.index[o].push([]),vm.index[o][vm.index[o].length-1].check=!1,vm.action="drop_blueprint",vm.更新藍圖(e,vm.blueprint[o]),vm.index_update();break}}}function drop_line(t,e){if(vm.index_line!=e){var n=vm.drag_metro_key;if(""!=n){var i=vm.move_metro(n,e);if(void 0!=i){i=i[0];var o=JSON.parse(JSON.stringify(vm.get_blueprint()));o.line[e].metro.push(i),vm.action="drop_line",vm.更新藍圖(o.key,o)}}}}function info_search_db(t,e){DB.ref("info/"+t+"/metro/").once("value",function(n){n.forEach(function(n){for(var i in n.val())n.val()[i].message.indexOf(e)>-1&&vm.search_info.push({line_key:t,metro_key:n.key,message:n.val()[i].message})})})}function info_search(){return!1}function drop(t){var e=vm.drag_metro_key;e&&vm.delete_metro(e);var n=vm.drag_line_key;n&&vm.delete_line(n)}function allowDrop(t){t.preventDefault()}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){$(window).width();if($("#top").css("width",$("#center").width()),$("#main").width()<1260){$("#board3").addClass("board3_left");var t=($("#center").width()-860)/2;if(t<0)return;$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t)}else{$("#board3").removeClass("board3_left");var t=($("#center").width()-1175)/2;t<0&&(t=0),$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t),$("#board3").css("left",b3_left+t)}setTimeout(move_center,0)}).resize();var sortable=[];$(function(){sortable.line_master=new Sortable(id("line_drag_master"),{animation:150,forceFallback:!1}),sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,setData:function(t,e){vm.drag_line_key=$(e).data("key")},onStart:function(t){vm.mode=1.5},onEnd:function(t){setTimeout(function(){vm.swap_line(t.oldIndex,t.newIndex),vm.mode=1,vm.drag_line_key=""},5)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(t,e){vm.drag_metro_key=$(e).data("key")},onStart:function(t){var e=$("#top_tag");$("#top_tag_parent").css("left",e.css("left")),e.addClass("left_inherit"),e.find(".add").hide(),0==t.oldIndex?e.addClass("first_drag"):t.oldIndex==$("#top_tag li").length-2&&e.addClass("last_drag"),vm.mode=1.5},onEnd:function(t){var e=$("#top_tag");e.find(".add").show(),setTimeout(function(){e.removeClass("left_inherit")},100),e.removeClass("first_drag").removeClass("last_drag"),setTimeout(function(){vm.swap_metro(t.oldIndex,t.newIndex),vm.mode=1,vm.drag_metro_key=""},5)}}),setTimeout(function(){$(".nav_i.custom").popup({popup:$(".custom.popup"),on:"click",onShow:function(){var t="",e=$(this).data("img");""!=e&&(t="<img style='width: 100%;' src='"+e+"'>",$(this).html(t))}})},5),setTimeout(function(){$(".nav_i:not(.custom)").popup({on:"click"})},5)}),$(function(){$(".triangle").click(top_tag_scroll)}),$(function(){$("#blueprint").on("click",function(t){$(t.target).hasClass("blueprint_i")&&$(t.target).closest(".blueprint_list").trigger("customClick")})}),$(function(){$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")}),$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>"),$("#left_color").colpick({layout:"hex",onHide:function(){vm.pick_master=void 0,vm.pick_color=void 0},onChange:function(t,e,n,i,o){vm.pick_color="#"+e},onSubmit:function(t,e,n,i,o){$(i).val(e),$(i).colpickHide()}}).colpickHide(),$("#left .left_line").on("mousedown",function(t){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var e=$("#left").width()-t.pageX,n=t.pageX-parseInt($("#board1").css("left"));$(document).on("mousemove.line",function(t){var i=t.pageX-e;if(i<=120)i=120;else{var o=t.pageX-n;$("#board1").css("left",o)}$("#left").css("width",i),$("#line_parent").css("width",i),$("#center").css("margin-left",i),$("#top").css("left",i+1),$("#top").css("width",$("#center").width()),$("#edit_parent a").css("width",i)}),$(document).on("mouseup.line",function(t){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart")})})}),$(function(){$("#right .r_content").perfectScrollbar(),$("#right .r_button").on("click",function(){var t=$(this).index()-1;$(this).addClass("active").siblings().removeClass("active"),$("#right .r_content:eq("+t+")").addClass("active").siblings().removeClass("active")}),$("#right .right_tool").on("click",function(t){$("#right").height()<400&&0==$(t.target).closest(".r_button").length&&($("#right").toggleClass("down"),$.cookie("right_tool",$("#right").attr("class")))}),$.cookie("right_tool")&&$.cookie("right_tool").indexOf("down")>-1&&$(".right_tool").click(),$("#right .right_line").on("mousedown",function(t){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var e=$(window).width()-120,n=$("#right").width()-($(window).width()-t.pageX);$(document).on("mousemove.line",function(t){var i=$(window).width()-t.pageX-n;i>e&&(i=e),$("#right").css("width",i)}),$(document).on("mouseup.line",function(t){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart")})}),$("#right .ui.accordion").accordion()}),$(function(){$("#board_textarea").keyup(function(t){auto_height(this)}),$("#board_textarea").on("paste",textarea_paste)});