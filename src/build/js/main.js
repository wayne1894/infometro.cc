function urlify(t){return t.replace(/(https?:\/\/[^\s]+)/g,function(t){return'<a href="'+t+'">'+t+"</a>"})}function textarea_paste(){if(!vm.url_info){var t=this,e=t.value,i=t.selectionStart,o=t.selectionEnd,n=t.scrollTop;t.value="",setTimeout(function(r){var a=t.value;t.value=e.substring(0,i)+a+e.substring(o,e.length),t.focus(),t.selectionStart=t.selectionEnd=i+a.length,t.scrollTop=n;var l=urlify(a);if(l.indexOf("<a href=")>-1){parse_url(l.split("</a>")[0].split(">")[1],function(t){vm.url_info=t})}},0)}}function textarea_paste2(t,e){var i=t.value,o=t.selectionStart,n=t.selectionEnd,r=t.scrollTop;t.value="",setTimeout(function(){var a=t.value;t.value=i.substring(0,o)+a+i.substring(n,i.length),t.focus(),t.selectionStart=t.selectionEnd=o+a.length,t.scrollTop=r;var l=urlify(a);if(l.indexOf("<a href=")>-1){parse_url(l.split("</a>")[0].split(">")[1],function(t){e.url_info=t})}},0)}function parse_url(t,e){$.get("https://54.250.245.226/infometro.asp?url="+t,function(i){var o=document.createElement("iframe");o.id="iframe",o.style.display="none",$(document.body).append(o);var n=document.getElementById("iframe");n=n.contentWindow||n.contentDocument.document||n.contentDocument,n.document.open(),n.document.write(i),n.document.close();for(var r={},a=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),l=0;l<a.length;l++)"description"==a[l].getAttribute("name")?r.description=a[l].getAttribute("content"):"og:description"==a[l].getAttribute("property")?r.og_description=a[l].getAttribute("content"):"og:image"==a[l].getAttribute("property")?r.og_image=a[l].getAttribute("content").split(",")[0]:"og:title"==a[l].getAttribute("property")&&(r.og_title=a[l].getAttribute("content"));if(void 0==r.og_image&&i.indexOf("og:image")>-1){var s=i.split("og:image")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],r.og_image=s}if(void 0==r.og_description&&i.indexOf("og:description")>-1){var s=i.split("og:description")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],r.og_description=s}if(void 0==r.og_title&&i.indexOf("og:title")>-1){var s=i.split("og:title")[1].split(">")[0];s=s.replace(/\'/gi,'"'),s=s.split('content="')[1].split('"')[0],r.og_title=s}r.og_title?r.title=r.og_title:(r.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==r.title&&(r.title="")),r.og_description&&(r.description=r.og_description),r.og_image&&(r.image=r.og_image),delete r.og_title,delete r.og_description,delete r.og_image,r.url=t,r.url_parent=t.split("://")[1].split("/")[0],t.indexOf(".youtube.")>-1?r.youtube=t.split("?v=")[1].split("&")[0]:t.indexOf("youtu.be/")>-1&&(r.youtube=t.split("be/")[1]),r.ico="https://www.google.com/s2/favicons?domain_url="+t,$("#iframe").remove(),"function"==typeof e&&e(r)})}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){$(window).width();if($("#top").css("width",$("#center").width()),$("#main").width()<1260){$("#board3").addClass("board3_left");var t=($("#center").width()-860)/2;$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t)}else{$("#board3").removeClass("board3_left");var t=($("#center").width()-1175)/2;t<0&&(t=0),$("#board1").css("left",b1_left+t),$("#board2").css("left",b2_left+t),$("#board3").css("left",b3_left+t)}move_center()}).resize();var sortable=[];$(function(){sortable.blueprint=new Sortable(id("blueprint_drag"),{animation:150,forceFallback:!1}),sortable.line_master=new Sortable(id("line_drag_master"),{animation:150,forceFallback:!1}),sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,onEnd:function(t){vm.swap_list(t.oldIndex,t.newIndex)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(t,e){t.setData("index",$(e).data("index"))},onStart:function(t){var e=$("#top_tag");e.find(".add").hide(),0==t.oldIndex?e.addClass("first_drag"):t.oldIndex==$("#top_tag li").length-2&&e.addClass("last_drag"),vm.mode=1.5},onEnd:function(t){$("#top_tag").find(".add").show(),$("#top_tag").removeClass("first_drag").removeClass("last_drag"),vm.swap_metro(t.oldIndex,t.newIndex),vm.mode=1}})}),$(function(){$("#right .right_main").perfectScrollbar(),$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")})});