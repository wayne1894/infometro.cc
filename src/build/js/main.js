function urlify(t){var e=/(https?:\/\/[^\s]+)/g;return t.replace(e,function(t){return'<a href="'+t+'">'+t+"</a>"})}function textarea_paste(){if(!vm.url_info){var t=this,e=t.value,i=t.selectionStart,o=t.selectionEnd,n=t.scrollTop;t.value="",setTimeout(function(a){var r=t.value;t.value=e.substring(0,i)+r+e.substring(o,e.length),t.focus(),t.selectionStart=t.selectionEnd=i+r.length,t.scrollTop=n;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];$("#board_enter .world.icon").show(),$("#board_enter .idea.icon").hide(),parse_url(s,function(t){vm.url_info=t,$("#board_enter .world.icon").hide(),$("#board_enter .idea.icon").show()})}},0)}}function textarea_paste2(t,e){var i=t.value,o=t.selectionStart,n=t.selectionEnd,a=t.scrollTop;t.value="",setTimeout(function(){var r=t.value;t.value=i.substring(0,o)+r+i.substring(n,i.length),t.focus(),t.selectionStart=t.selectionEnd=o+r.length,t.scrollTop=a;var l=urlify(r);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];parse_url(s,function(t){e.url_info=t})}},0)}function parse_url(t,e){$.get("https://54.250.245.226/infometro.asp?url="+t,function(i){var o=document.createElement("iframe");o.id="iframe",o.style.display="none",$(document.body).append(o);var n=document.getElementById("iframe");n=n.contentWindow||n.contentDocument.document||n.contentDocument,n.document.open(),n.document.write(i),n.document.close();for(var a={},r=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),l=0;l<r.length;l++)"description"==r[l].getAttribute("name")?a.description=r[l].getAttribute("content"):"og:description"==r[l].getAttribute("property")?a.og_description=r[l].getAttribute("content"):"og:image"==r[l].getAttribute("property")?a.og_image=r[l].getAttribute("content").split(",")[0]:"og:title"==r[l].getAttribute("property")&&(a.og_title=r[l].getAttribute("content"));if(void 0==a.og_image&&i.indexOf("og:image")>-1){var s=i.split("og:image")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_image=s}if(void 0==a.og_description&&i.indexOf("og:description")>-1){var s=i.split("og:description")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_description=s}if(void 0==a.og_title&&i.indexOf("og:title")>-1){var s=i.split("og:title")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],a.og_title=s}a.og_title?a.title=a.og_title:(a.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==a.title&&(a.title="")),a.og_description&&(a.description=a.og_description),a.og_image&&(a.image=a.og_image),delete a.og_title,delete a.og_description,delete a.og_image,a.url=t,a.url_parent=t.split("://")[1].split("/")[0],t.indexOf(".youtube.")>-1?a.youtube=t.split("?v=")[1].split("&")[0]:t.indexOf("youtu.be/")>-1&&(a.youtube=t.split("be/")[1]),a.ico="https://www.google.com/s2/favicons?domain_url="+t,$("#iframe").remove(),"function"==typeof e&&e(a)})}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){$(window).width();if($("#top").css("width",$("#center").width()),$("#main").width()<1260){$("#board3").addClass("board3_left");var t=($("#center").width()-860)/2;$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t)}else{$("#board3").removeClass("board3_left");var t=($("#center").width()-1175)/2;t<0&&(t=0),$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t),$("#board3").css("left",b3_left+t)}setTimeout(move_center,0)}).resize();var sortable=[];$(function(){sortable.line_master=new Sortable(id("line_drag_master"),{animation:150,forceFallback:!1}),sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,setData:function(t,e){t.setData("line_key",$(e).data("key")),t.setData("line_index",$(e).data("line_index"))},onEnd:function(t){setTimeout(function(){vm.swap_list(t.oldIndex,t.newIndex)},5)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(t,e){t.setData("key",$(e).data("key"))},onStart:function(t){var e=$("#top_tag");$("#top_tag_parent").css("left",e.css("left")),e.addClass("left_inherit"),e.find(".add").hide(),0==t.oldIndex?e.addClass("first_drag"):t.oldIndex==$("#top_tag li").length-2&&e.addClass("last_drag"),vm.mode=1.5},onEnd:function(t){var e=$("#top_tag");e.find(".add").show(),setTimeout(function(){e.removeClass("left_inherit")},100),e.removeClass("first_drag").removeClass("last_drag"),setTimeout(function(){vm.swap_metro(t.oldIndex,t.newIndex),vm.mode=1},5)}})}),$(function(){$("#right .right_main").perfectScrollbar(),$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")}),setTimeout(function(){$(".nav_i:not(.custom)").popup({on:"click"})},5),setTimeout(function(){$(".nav_i.custom").popup({popup:$(".custom.popup"),on:"click"})},5)});