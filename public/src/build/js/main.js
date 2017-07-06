function is_mobile(){if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))return!0}function getViewportSize(e){if(e=e||window,null!=e.innerWidth)return{w:e.innerWidth,h:e.innerHeight};var t=e.document;return"CSS1Compat"==document.compatMode?{w:t.documentElement.clientWidth,h:t.documentElement.clientHeight}:{w:t.body.clientWidth,h:t.body.clientHeight}}function urlify(e){var t=/(https?:\/\/[^\s]+)/g;return e.replace(t,function(e){return'<a href="'+e+'">'+e+"</a>"})}function textarea_paste(){if(!vm.url_info){var e=this,t=e.value,i=e.selectionStart,o=e.selectionEnd,n=e.scrollTop;e.value="",setTimeout(function(r){var a=e.value;e.value=t.substring(0,i)+a+t.substring(o,t.length),e.focus(),e.selectionStart=e.selectionEnd=i+a.length,e.scrollTop=n;var l=urlify(a);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];$("#board_enter .world.icon").show(),$("#board_enter .idea.icon").hide(),parse_url(s,function(e){""!=$("#board_textarea").val()&&e&&(vm.url_info=e),$("#board_enter .world.icon").hide()})}},0)}}function textarea_paste2(e,t){var i=e.value,o=e.selectionStart,n=e.selectionEnd,r=e.scrollTop;e.value="",setTimeout(function(){var a=e.value;e.value=i.substring(0,o)+a+i.substring(n,i.length),e.focus(),e.selectionStart=e.selectionEnd=o+a.length,e.scrollTop=r;var l=urlify(a);if(l.indexOf("<a href=")>-1){var s=l.split("</a>")[0].split(">")[1];parse_url(s,function(e){t.url_info=e})}},0)}function show_event_fn(e,t){var i=vm.line_color;void 0==e&&(e="儲存成功"),t='<div class="description">'+t+"</div>",void 0==t&&(t=""),clearTimeout(window.show_setTimeout),$("#show_event").html('<div style="display:none" class="ui steps"><div class="completed step"><i class="payment icon" style="color:'+i+'"></i><div class="content"><div class="title">'+e+"</div>"+t+"</div></div></div>"),$("#show_event .ui").transition({animation:"fade up",duration:800}),window.show_setTimeout=setTimeout(function(){$("#show_event .ui").transition({animation:"fade down",duration:1200})},2e3)}function parse_url(e,t){function i(e){if(e.indexOf("og:image")>-1){var t=e.split("og:image")[1].split(">")[0];if(t.indexOf("content=")==-1){var i=e.split("og:image")[0].split("<meta");t=i[i.length-1]}if(t.indexOf("content=")>-1)return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}if(e.indexOf('<link rel="image_src')>-1){var t=e.split("<link rel=")[1].split(">")[0];return t=t.replace(/\'/gi,'"'),t=t.split('href="')[1].split('"')[0]}}function o(e){try{if(e.indexOf("og:description")>-1){var t=e.split("og:description")[1].split(">")[0];if(t.indexOf("content=")==-1){var i=e.split("og:description")[0].split("<meta");t=i[i.length-1]}return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}}catch(e){}}function n(e){if(e.indexOf("og:title")>-1){var t=e.split("og:title")[1].split(">")[0];if(t.indexOf("content=")==-1){var i=e.split("og:title")[0].split("<meta");t=i[i.length-1]}return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}if(e.indexOf("<title")>-1){var o=e.split("<title")[1].split("</title>")[0].split(">")[1];return o}}$.get("https://infometro.hopto.org/infometro.asp?url="+e,function(r){var a={};try{var l=document.createElement("iframe");l.id="iframe",l.style.display="none",$(document.body).append(l);var s=document.getElementById("iframe");s=s.contentWindow||s.contentDocument.document||s.contentDocument,s.document.open(),s.document.write(r),s.document.close();for(var c=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),d=0;d<c.length;d++)"description"==c[d].getAttribute("name")?a.description=c[d].getAttribute("content"):"og:description"==c[d].getAttribute("property")?a.og_description=c[d].getAttribute("content"):"og:image"==c[d].getAttribute("property")?a.og_image=c[d].getAttribute("content").split(",")[0]:"og:title"==c[d].getAttribute("property")&&(a.og_title=c[d].getAttribute("content"));void 0==a.og_image&&(a.og_image=i(r)),void 0==a.og_description&&void 0==a.description&&(a.og_description=o(r)),void 0==a.og_title&&(a.og_title=n(r)),a.og_title?a.title=a.og_title:(a.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==a.title&&(a.title="")),a.og_description&&(a.description=a.og_description),a.og_image&&(a.image=a.og_image),delete a.og_title,delete a.og_description,delete a.og_image,a.url=e,a.url_parent=e.split("://")[1].split("/")[0],a.image.indexOf("http://")==-1&&a.image.indexOf("https://")==-1&&(a.image="//"+a.url_parent+a.image),e.indexOf(".youtube.")>-1?a.youtube=e.split("?v=")[1].split("&")[0]:e.indexOf("youtu.be/")>-1&&(a.youtube=e.split("be/")[1]),$("#iframe").remove(),"function"==typeof t&&t(a)}catch(l){a.image=i(r),a.description=o(r),a.title=n(r),a.url=e,a.url_parent=e.split("://")[1].split("/")[0],"function"==typeof t&&t(a)}}).fail(function(){print("請求錯誤"),"function"==typeof t&&t()})}function auto_height(e){$(e).height(70),$(e).height(e.scrollHeight+parseFloat($(e).css("borderTopWidth"))+parseFloat($(e).css("borderBottomWidth")))}function auto_height2(e){$(e).height(0);var t=e.scrollHeight+parseFloat($(e).css("borderTopWidth"))+parseFloat($(e).css("borderBottomWidth"));$(e).height(t)}function getselecttext(){var e="";if(window.getSelection?e=window.getSelection():document.getSelection?e=document.getSelection():window.document.selection&&(e=window.document.selection.createRange().text),""!=e)return e}function remove_start(e){$.removeCookie("start"),1==e?$("#edit_parent .navOne").remove():2==e?$("#board_send_parent .navOne").remove():3==e?$("#new_line_parent .navOne").remove():4==e?$("#top .navOne").remove():$(".navOne").remove()}function start_set(){"Y"==$.cookie("start")&&($("#edit_parent").append("<div class='navOne ui left pointing basic label'>第一次進來嗎？點擊這裡開始導覽。<i class='delete icon' style='float:right'></i></div>"),$("#edit_parent .navigation").one("click",remove_start),$("#edit_parent .navOne i").one("click",function(){remove_start(1)}),setTimeout(function(){$("#edit_parent .navOne").transition("flash")},600))}function delete_modal_html(e){return void 0==e&&(e="#FF6900"),'<div class="_modal_info ui inverted dimmer"><div class="content"><div class="center"><i class="trash outline icon" style="font-size: 1.8em;margin-bottom: 13px;color:#000;cursor: default"></i><div class="_modal_but" style="margin-bottom:20px;color:#000;">確定要刪除資料？</div><button class="send mini ui button" style="background-color:'+e+'">刪除</button><button class="cancel mini ui button">取消</button></div></div></div>'}function move_center(){$("#top_tag li.active").velocity("scroll",{axis:"x",duration:0,container:$("#top_tag"),complete:function(){$("#top_tag").show()}}),$("#top_tag").velocity("stop").velocity("fadeIn",{duration:350}),vm.action_move=0}function drop_blueprint(e,t){$(e.target).closest(".blueprint_list").jrumble().trigger("stopRumble");var i=vm.drag_line_key;if(""!=i){if(t==vm.blueprint[vm.index_blueprint].key)return void print("相同的blueprint");var o=vm.move_line(i);o=o[0],setTimeout(function(){for(var e=0;e<vm.blueprint.length;e++)if(vm.blueprint[e].key==t){vm.blueprint[e].line.push(o),vm.index[e].push([]),vm.index[e][vm.index[e].length-1].check=!1,vm.action="drop_blueprint",vm.更新藍圖(t,vm.blueprint[e]),vm.index_update();break}},0)}}function allowDrop_blueprint(e){vm.drag_line_key&&$(e.target).closest(".blueprint_list").jrumble().trigger("startRumble"),e.preventDefault()}function allowDropLeave_blueprint(e){vm.drag_line_key&&$(e.target).closest(".blueprint_list").jrumble().trigger("stopRumble"),e.preventDefault()}function load_info(e){DB.ref("info/"+e+"/metro").once("value",function(t){if(export_json.info[e]=t.val(),export_num_use+=1,export_num_use==export_num){var i=JSON.stringify(export_json);$("#export_modal textarea").val(i),$("#modal_send").val(user_email),$("#export_modal").modal({inverted:!0,closable:!1}).modal("show")}})}function 匯出藍圖(e){export_num=0,export_num_use=0;var t=vm.line_color;$("#export_modal").css("borderTopColor",t),$("#export_modal").modal("hide"),$("#send_modal_button").css("backgroundColor",t),$("#send_modal_button").removeClass("loading"),$("#send_modal_button").off("click").one("click",function(){$(this).addClass("loading");var e=$.trim($("#modal_send").val());if(""!=e){var t=$("#export_modal_name").html(),i=$("#modal_textarea").val();$.post("https://us-central1-infometro-cc.cloudfunctions.net/mail",{email:e,subject:t,html:"檔案存於附件",attachments:i}).done(function(){$("#send_modal_button").removeClass("loading"),$("#export_modal").modal("hide"),show_event_fn("寄送成功","檔案已寄到您指定的信箱")})}});for(var i=0;i<vm.blueprint.length;i++)if(vm.blueprint[i].key==e){export_json.name=vm.blueprint[i].name,$("#export_modal_name").html("infometro 地鐵計畫："+export_json.name),$("#export_modal_name").css("color",t),export_json.line=vm.blueprint[i].line,export_json.info={};for(var o=0;o<export_json.line.length;o++){var e=export_json.line[o]._key;export_json.info[e]="",load_info(e),export_num+=1}return}}function 匯入藍圖(){var e=vm.line_color;$("#import_modal").css("borderTopColor",e),$("#import_modal_button").css("backgroundColor",e),$("#import_modal").modal({inverted:!0}).modal("show"),$("#import_modal_button").one("click",function(){for(var e=JSON.parse($("#import_modal textarea").val()),t=JSON.stringify(e.info),i=DB.ref("blueprint/"+user_uid).push(),o=0;o<e.line.length;o++){for(var n=0;n<e.line[o].metro.length;n++){var r=DB.ref("blueprint/"+user_uid).push().key;t=t.replace(e.line[o].metro[n]._key,r),e.line[o].metro[n]._key=r}var a=DB.ref("blueprint/"+user_uid).push().key;set_line_root(a,user_uid);var l=JSON.parse(t);DB.ref("info/"+a+"/metro").set(l[e.line[o]._key]),e.line[o]._key=a}i.set({name:e.name,line:e.line,timestamp:firebase.database.ServerValue.TIMESTAMP}),$("#import_modal").modal("hide"),$.cookie("index_blueprint",vm.blueprint.length-1),setTimeout(function(){location.reload()},1e3)})}function drop_line(e,t){if($(e.target).closest("li").jrumble().trigger("stopRumble"),vm.index_line!=t){var i=vm.drag_metro_key;if(""!=i){var o=vm.move_metro(i,t);if(void 0!=o){o=o[0];var n=JSON.parse(JSON.stringify(vm.get_blueprint()));n.line[t].metro.push(o),vm.action="drop_line",vm.更新藍圖(n.key,n)}}}}function allowDrop_line(e){vm.drag_metro_key&&$(e.target).closest("li").jrumble().trigger("startRumble"),e.preventDefault()}function allowDropLeave_line(e){vm.drag_metro_key&&$(e.target).closest("li").jrumble().trigger("stopRumble"),e.preventDefault()}function info_search_db(e,t){DB.ref("info/"+e+"/metro/").once("value",function(i){i.forEach(function(i){for(var o in i.val())i.val()[o].message.indexOf(t)>-1&&vm.search_info.push({line_key:e,metro_key:i.key,message:i.val()[o].message})})})}function info_search(){return!1}function lighning_bind(){var e=DB.ref("users_data/"+user_uid+"/lightning/"+vm.get_blueprint().key);vm.$bindAsArray("lightning",e),e.once("child_added",function(e){setTimeout(function(){$("#right .r_content").perfectScrollbar("update")},5)})}function lightning_send(){var e=$.trim($("#right_lightning textarea").val());if(""!=e){var t={message:e,timestamp:firebase.database.ServerValue.TIMESTAMP};DB.ref("users_data/"+user_uid+"/lightning/"+vm.get_blueprint().key).push().set(t),$("#right_lightning textarea").val("")}}function drop(e){$("#board_edit>div>i").jrumble().trigger("stopRumble");var t=vm.drag_metro_key;t&&vm.delete_metro(t);var i=vm.drag_line_key;i&&vm.delete_line(i)}function allowDrop(e){$("#board_edit>div>i").jrumble().trigger("startRumble"),e.preventDefault()}function allowDropLeave(e){$("#board_edit>div>i").jrumble().trigger("stopRumble"),e.preventDefault()}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){var e=$("#center").width(),t=$(window).width();e<=1165?$("#board_parent").addClass("adj"):$("#board_parent").removeClass("adj"),is_mobile()&&$("#board_parent").css("min-height",getViewportSize().h+"px"),t<700?($("#center").css("width","700px"),$("#top").css("width",$("#center").width())):($("#center").css("width","87%"),t<961?$("#top").css("width",t-$("#left").width()):$("#top").css("width","inherit"))}).resize(),setTimeout(function(){"undefined"==typeof vm&&location.reload()},5e3);var sortable=[],mode_before;$(function(){sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,setData:function(e,t){vm.drag_line_key=$(t).data("key"),navigator.userAgent.match("Firefox")&&e.setData("line_key",$(t).data("key"))},onStart:function(e){mode_before=vm.mode,vm.mode=1.5},onEnd:function(e){setTimeout(function(){vm.swap_line(e.oldIndex,e.newIndex),vm.mode=mode_before,vm.drag_line_key=""},5)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(e,t){vm.drag_metro_key=$(t).data("key"),navigator.userAgent.match("Firefox")&&e.setData("key",$(t).data("key"))},onStart:function(e){var t=$("#top_tag");$("#top_tag_parent").css("left",t.css("left")),t.addClass("left_inherit"),t.find(".add").hide(),0==e.oldIndex?t.addClass("first_drag"):e.oldIndex==$("#top_tag li").length-2&&t.addClass("last_drag"),mode_before=vm.mode,vm.mode=1.5},onEnd:function(e){var t=$("#top_tag");t.find(".add").show(),setTimeout(function(){t.removeClass("left_inherit")},100),t.removeClass("first_drag").removeClass("last_drag"),setTimeout(function(){vm.swap_metro(e.oldIndex,e.newIndex),vm.mode=mode_before,vm.drag_metro_key=""},5)}}),setTimeout(function(){$(".nav_i.custom").popup({popup:$(".custom.popup"),on:"click",onShow:function(){var e="",t=$(this).data("img");""!=t&&(e="<img style='width: 100%;' src='"+t+"'>",$(this).html(e))}})},5),setTimeout(function(){$(".nav_i:not(.custom)").popup({on:"click"})},5)}),$(function(){function e(e){for(var t=0;t<vm.info.length;t++)if(vm.info[t][".key"]==e)return vm.info[t]}var t=!1,i=17,o=91,n=86,r=67,a=88,l=!1;$(document).on("focus","input,textarea",function(){vm.copy_info=[],l=!0,$(this).one("blur",function(){l=!1})}),$(document).keydown(function(i){if(!l)if(t=i.metaKey||i.ctrlKey,t&&i.keyCode==r){if(void 0!=getselecttext())return;if(vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;vm.copy_info[0]=JSON.parse(JSON.stringify(e(vm.info_active))),vm.copy_info[1]="copy",show_event_fn("複製成功","你複製了一個資訊")}}else if(t&&i.keyCode==a){if(void 0!=getselecttext())return;if(vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;vm.copy_info[0]=JSON.parse(JSON.stringify(e(vm.info_active))),vm.copy_info[1]="cut";var o=vm.get_line_key(),s=vm.key_metro,c=vm.info_active;vm.copy_info[2]=function(){DB.ref("info/"+o+"/metro/"+s).child(c).remove().then(function(){vm.copy_info=[]})},show_event_fn("剪下成功","你剪下了一個資訊")}}else if(t&&i.keyCode==n){if(0==vm.copy_info.length)return;vm.paste_info(vm.copy_info[0]),"cut"==vm.copy_info[1]&&(vm.copy_info[2](),show_event_fn("貼上成功","你貼上了一個資訊"))}else if(46==i.keyCode&&vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;$("#"+vm.info_active).find("._info_delete").trigger("click")}}).keyup(function(e){e.keyCode!=i&&e.keyCode!=o||(t=!1)})}),$(function(){$(".triangle.left").click(function(){$("#top_tag").velocity("stop").velocity("scroll",{container:$("#top_tag"),offset:-200,duration:250,axis:"x"})}),$(".triangle.right").click(function(){$("#top_tag").velocity("stop").velocity("scroll",{container:$("#top_tag"),offset:70,duration:250,axis:"x"})})}),$(function(){$("#copyright .ui.dropdown").dropdown()});var export_json={},export_num=0,export_num_use=0;$(function(){$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")}),$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>"),$("#left_color").colpick({layout:"hex",onHide:function(){vm.pick_color=void 0},onChange:function(e,t,i,o,n){vm.pick_color="#"+t},onSubmit:function(e,t,i,o,n){$(o).val(t),$(o).colpickHide()}}).colpickHide(),$("#left .left_line").on("mousedown",function(e){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var t=$("#left").width()-e.pageX;e.pageX-parseInt($("#board1").css("left"));$(document).on("mousemove.line",function(e){var i=e.pageX-t;i<=120&&(i=120),$("#left").css("width",i),$("#line_parent").css("width",i),$("#center").css("margin-left",i),$("#edit_parent a").css("width",i)}),$(document).on("mouseup.line",function(e){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart"),$("#show_event").css("left",$("#left").width()+20)})})}),$(function(){$("#right .r_content").perfectScrollbar(),$("#right .r_button").on("click",function(){var e=$(this).index()-1;0==e?$("#right_lightning").show():$("#right_lightning").hide(),$(this).addClass("active").siblings().removeClass("active"),$("#right .r_content:eq("+e+")").addClass("active").siblings().removeClass("active")}),$("#right .right_tool").on("click",function(e){$("#right").height()<400&&0==$(e.target).closest(".r_button").length&&($("#right").toggleClass("down"),$.cookie("right_tool",$("#right").attr("class")))}),$.cookie("right_tool")&&$.cookie("right_tool").indexOf("down")>-1&&$(".right_tool").click(),$("#right .right_line").on("mousedown",function(e){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var t=$(window).width()-120,i=$("#right").width()-($(window).width()-e.pageX);$(document).on("mousemove.line",function(e){var o=$(window).width()-e.pageX-i;o>t&&(o=t),$("#right").css("width",o)}),$(document).on("mouseup.line",function(e){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart")})}),$("#right .ui.accordion").accordion()}),$(function(){$("#board_textarea").keyup(function(e){auto_height(this)}),$("#board_textarea").on("paste",textarea_paste)});