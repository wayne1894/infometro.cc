function urlify(t){var e=/(https?:\/\/[^\s]+)/g;return t.replace(e,function(t){return'<a href="'+t+'">'+t+"</a>"})}function textarea_paste(){if(!vm.url_info){var t=this,e=t.value,i=t.selectionStart,o=t.selectionEnd,n=t.scrollTop;t.value="",setTimeout(function(a){var r=t.value;t.value=e.substring(0,i)+r+e.substring(o,e.length),t.focus(),t.selectionStart=t.selectionEnd=i+r.length,t.scrollTop=n;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];$("#board_enter .world.icon").show(),$("#board_enter .idea.icon").hide(),parse_url(s,function(t){""!=$("#board_textarea").val()&&t&&(vm.url_info=t),$("#board_enter .world.icon").hide()})}},0)}}function textarea_paste2(t,e){var i=t.value,o=t.selectionStart,n=t.selectionEnd,a=t.scrollTop;t.value="",setTimeout(function(){var r=t.value;t.value=i.substring(0,o)+r+i.substring(n,i.length),t.focus(),t.selectionStart=t.selectionEnd=o+r.length,t.scrollTop=a;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];parse_url(s,function(t){e.url_info=t})}},0)}function parse_url(t,e){$.get("https://infometro.hopto.org/infometro.asp?url="+t,function(i){var o=document.createElement("iframe");o.id="iframe",o.style.display="none",$(document.body).append(o);var n=document.getElementById("iframe");n=n.contentWindow||n.contentDocument.document||n.contentDocument,n.document.open(),n.document.write(i),n.document.close();for(var a={},r=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),l=0;l<r.length;l++)"description"==r[l].getAttribute("name")?a.description=r[l].getAttribute("content"):"og:description"==r[l].getAttribute("property")?a.og_description=r[l].getAttribute("content"):"og:image"==r[l].getAttribute("property")?a.og_image=r[l].getAttribute("content").split(",")[0]:"og:title"==r[l].getAttribute("property")&&(a.og_title=r[l].getAttribute("content"));if(void 0==a.og_image&&i.indexOf("og:image")>-1){var s=i.split("og:image")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_image=s}if(void 0==a.og_description&&i.indexOf("og:description")>-1){var s=i.split("og:description")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_description=s}if(void 0==a.og_title&&i.indexOf("og:title")>-1){var s=i.split("og:title")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_title=s}a.og_title?a.title=a.og_title:(a.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==a.title&&(a.title="")),a.og_description&&(a.description=a.og_description),a.og_image&&(a.image=a.og_image),delete a.og_title,delete a.og_description,delete a.og_image,a.url=t,a.url_parent=t.split("://")[1].split("/")[0],t.indexOf(".youtube.")>-1?a.youtube=t.split("?v=")[1].split("&")[0]:t.indexOf("youtu.be/")>-1&&(a.youtube=t.split("be/")[1]),$("#iframe").remove(),"function"==typeof e&&e(a)}).fail(function(){"function"==typeof e&&e()})}function auto_height(t){$(t).height(70),$(t).height(t.scrollHeight+parseFloat($(t).css("borderTopWidth"))+parseFloat($(t).css("borderBottomWidth")))}function auto_height2(t){$(t).height(0);var e=t.scrollHeight+parseFloat($(t).css("borderTopWidth"))+parseFloat($(t).css("borderBottomWidth"));$(t).height(e)}function move_center(t){var e=0,i=$("#top_tag").width();$("#top_tag li").each(function(){e+=$(this).width()}),i>e?$("#top_tag").css("left",(i-e)/2+15+"px"):$("#top_tag").css("left",0),$("#top_tag").stop().fadeIn(350)}function top_tag_scroll(){var t=0,e=$("#top_tag"),i=e.find(">li.active").length?e.find(">li.active").index():0,o=$(this).hasClass("right")?1:-1,n=i+o<0?[]:e.find(">li").eq(i+o);n.length&&(t=$("#top_tag").scrollLeft(),n.addClass("active").velocity("stop",!0).velocity("scroll",{axis:"x",duration:150,offset:-42,easing:"ease",container:e,complete:function(){o&&$("#top_tag").scrollLeft()==t&&n.removeClass("active").prev().addClass("active")}}).siblings().removeClass("active"))}function drop_blueprint(t,e){var i=t.dataTransfer.getData("line_key");if(""!=i){if(e==vm.blueprint[vm.index_blueprint].key)return void print("相同的blueprint");var o=vm.move_line(i);o=o[0];for(var n=0;n<vm.blueprint.length;n++)if(vm.blueprint[n].key==e){vm.blueprint[n].line.push(o),vm.index[n].push([]),vm.index[n][vm.index[n].length-1].check=!1,vm.action="drop_blueprint",vm.更新藍圖(e,vm.blueprint[n]),vm.index_update();break}}}function drop_line(t,e){if(vm.index_line!=e){var i=t.dataTransfer.getData("key");if(""!=i){var o=vm.move_metro(i,e);if(void 0!=o){o=o[0];var n=JSON.parse(JSON.stringify(vm.get_blueprint()));n.line[e].metro.push(o),vm.action="drop_line",vm.更新藍圖(n.key,n)}}}}function send_feedback(){var t=$.trim($("#feedback1").val()),e="///"+user_uid,i="";if($("#feedback2").is(":checked")&&(i="////請回信"),""!=t){t=t+e+i;var o=DB.ref("feedback/").push();o.set(t)}$("#feedback_modal").modal("hide")}function info_search_db(t,e){DB.ref("info/"+t+"/metro/").once("value",function(i){i.forEach(function(i){for(var o in i.val())i.val()[o].message.indexOf(e)>-1&&vm.search_info.push({line_key:t,metro_key:i.key,message:i.val()[o].message})})})}function info_search(){return!1}function drop(t){var e=t.dataTransfer.getData("key");e&&vm.delete_metro(e);var i=t.dataTransfer.getData("line_key");i&&vm.delete_line(i)}function allowDrop(t){t.preventDefault()}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){$(window).width();if($("#top").css("width",$("#center").width()),$("#main").width()<1260){$("#board3").addClass("board3_left");var t=($("#center").width()-860)/2;$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t)}else{$("#board3").removeClass("board3_left");var t=($("#center").width()-1175)/2;t<0&&(t=0),$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t),$("#board3").css("left",b3_left+t)}setTimeout(move_center,0)}).resize();var sortable=[];$(function(){sortable.line_master=new Sortable(id("line_drag_master"),{animation:150,forceFallback:!1}),sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,setData:function(t,e){t.setData("line_key",$(e).data("key")),t.setData("line_key",$(e).data("key"))},onStart:function(){vm.mode=1.5},onEnd:function(t){setTimeout(function(){vm.swap_list(t.oldIndex,t.newIndex),vm.mode=1},5)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(t,e){t.setData("key",$(e).data("key"))},onStart:function(t){var e=$("#top_tag");$("#top_tag_parent").css("left",e.css("left")),e.addClass("left_inherit"),e.find(".add").hide(),0==t.oldIndex?e.addClass("first_drag"):t.oldIndex==$("#top_tag li").length-2&&e.addClass("last_drag"),vm.mode=1.5},onEnd:function(t){var e=$("#top_tag");e.find(".add").show(),setTimeout(function(){e.removeClass("left_inherit")},100),e.removeClass("first_drag").removeClass("last_drag"),setTimeout(function(){vm.swap_metro(t.oldIndex,t.newIndex),vm.mode=1},5)}}),setTimeout(function(){$(".nav_i.custom").popup({popup:$(".custom.popup"),on:"click"})},5),setTimeout(function(){$(".nav_i:not(.custom)").popup({on:"click"})},5)}),$(function(){$(".triangle").click(top_tag_scroll)}),$(function(){$("#blueprint").on("click",function(t){$(t.target).hasClass("blueprint_i")&&$(t.target).closest(".blueprint_list").trigger("customClick")})}),$(function(){$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")}),$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>"),$("#left_color").colpick({layout:"hex",onHide:function(){vm.pick_master=void 0,vm.pick_color=void 0},onChange:function(t,e,i,o,n){vm.pick_color="#"+e},onSubmit:function(t,e,i,o,n){$(o).val(e),$(o).colpickHide()}}).colpickHide()}),$(function(){$("#right .r_content").perfectScrollbar(),$("#right .r_button").on("click",function(){var t=$(this).index()-1;$(this).addClass("active").siblings().removeClass("active"),$("#right .r_content:eq("+t+")").addClass("active").siblings().removeClass("active")}),$("#right .right_tool").on("click",function(t){$("#right").height()<400&&0==$(t.target).closest(".r_button").length&&($("#right").toggleClass("down"),$.cookie("right_tool",$("#right").attr("class")))}),$.cookie("right_tool")&&$.cookie("right_tool").indexOf("down")>-1&&$(".right_tool").click(),$("#right .right_line").on("mousedown",function(t){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var e=$(window).width()-120,i=$("#right").width()-($(window).width()-t.pageX);$(document).on("mousemove.line",function(t){var o=$(window).width()-t.pageX-i;o>e&&(o=e),$("#right").css("width",o)}),$(document).on("mouseup.line",function(t){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart")})}),$("#right .ui.accordion").accordion()}),$(function(){$("#board_textarea").keyup(function(t){auto_height(this)}),$("#board_textarea").on("paste",textarea_paste)});