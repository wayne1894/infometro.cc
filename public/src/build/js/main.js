function is_mobile(){if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))return!0}function getViewportSize(e){if(e=e||window,null!=e.innerWidth)return{w:e.innerWidth,h:e.innerHeight};var t=e.document;return"CSS1Compat"==document.compatMode?{w:t.documentElement.clientWidth,h:t.documentElement.clientHeight}:{w:t.body.clientWidth,h:t.body.clientHeight}}function urlify(e){var t=/(https?:\/\/[^\s]+)/g;return e.replace(t,function(e){return'<a href="'+e+'">'+e+"</a>"})}function textarea_paste(){if(!vm.url_info){var e=this,t=e.value,i=e.selectionStart,n=e.selectionEnd,o=e.scrollTop;e.value="",setTimeout(function(r){var a=e.value;e.value=t.substring(0,i)+a+t.substring(n,t.length),e.focus(),e.selectionStart=e.selectionEnd=i+a.length,e.scrollTop=o;var l=urlify(a);if(l.indexOf("<a href=")>-1){var d=l.split("</a>")[0].split(">")[1];$("#board_enter .world.icon").show(),$("#board_enter .idea.icon").hide(),parse_url(d,function(e){""!=$("#board_textarea").val()&&e&&(vm.url_info=e),$("#board_enter .world.icon").hide()})}},0)}}function textarea_paste2(e,t){var i=e.value,n=e.selectionStart,o=e.selectionEnd,r=e.scrollTop;e.value="",setTimeout(function(){var a=e.value;e.value=i.substring(0,n)+a+i.substring(o,i.length),e.focus(),e.selectionStart=e.selectionEnd=n+a.length,e.scrollTop=r;var l=urlify(a);if(l.indexOf("<a href=")>-1){parse_url(l.split("</a>")[0].split(">")[1],function(e){t.url_info=e})}},0)}function show_event_fn(e,t){var i=vm.line_color;void 0==e&&(e="儲存成功"),t='<div class="description">'+t+"</div>",void 0==t&&(t=""),clearTimeout(window.show_setTimeout),$("#show_event").html('<div style="display:none" class="ui steps"><div class="completed step"><i class="payment icon" style="color:'+i+'"></i><div class="content"><div class="title">'+e+"</div>"+t+"</div></div></div>"),$("#show_event .ui").transition({animation:"fade up",duration:800}),window.show_setTimeout=setTimeout(function(){$("#show_event .ui").transition({animation:"fade down",duration:1200})},2e3)}function parse_url(e,t){function i(e){if(e.indexOf("og:image")>-1){var t=e.split("og:image")[1].split(">")[0];if(-1==t.indexOf("content=")){var i=e.split("og:image")[0].split("<meta");t=i[i.length-1]}if(t.indexOf("content=")>-1)return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}if(e.indexOf('<link rel="image_src')>-1){var t=e.split("<link rel=")[1].split(">")[0];return t=t.replace(/\'/gi,'"'),t=t.split('href="')[1].split('"')[0]}}function n(e){try{if(e.indexOf("og:description")>-1){var t=e.split("og:description")[1].split(">")[0];if(-1==t.indexOf("content=")){var i=e.split("og:description")[0].split("<meta");t=i[i.length-1]}return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}}catch(e){}}function o(e){if(e.indexOf("og:title")>-1){var t=e.split("og:title")[1].split(">")[0];if(-1==t.indexOf("content=")){var i=e.split("og:title")[0].split("<meta");t=i[i.length-1]}return t=t.replace(/\'/gi,'"'),t=t.split('content="')[1].split('"')[0]}if(e.indexOf("<title")>-1){return e.split("<title")[1].split("</title>")[0].split(">")[1]}}$.get("//calendar2017.me/infometro.asp?url="+e,function(r){var a={};try{var l=document.createElement("iframe");l.id="iframe",l.style.display="none",$(document.body).append(l);var d=document.getElementById("iframe");d=d.contentWindow||d.contentDocument.document||d.contentDocument,d.document.open(),d.document.write(r),d.document.close();for(var c=$("#iframe")[0].contentWindow.document.getElementsByTagName("meta"),s=0;s<c.length;s++)"description"==c[s].getAttribute("name")?a.description=c[s].getAttribute("content"):"og:description"==c[s].getAttribute("property")?a.og_description=c[s].getAttribute("content"):"og:image"==c[s].getAttribute("property")?a.og_image=c[s].getAttribute("content").split(",")[0]:"og:title"==c[s].getAttribute("property")&&(a.og_title=c[s].getAttribute("content"));void 0==a.og_image&&(a.og_image=i(r)),void 0==a.og_description&&void 0==a.description&&(a.og_description=n(r)),void 0==a.og_title&&(a.og_title=o(r)),a.og_title?a.title=a.og_title:(a.title=$(document.getElementById("iframe").contentWindow.document).find("title").html(),void 0==a.title&&(a.title="")),a.og_description&&(a.description=a.og_description),a.og_image&&(a.image=a.og_image),delete a.og_title,delete a.og_description,delete a.og_image,a.url=e,a.url_parent=e.split("://")[1].split("/")[0],-1==a.image.indexOf("http://")&&-1==a.image.indexOf("https://")&&(a.image="//"+a.url_parent+a.image),e.indexOf(".youtube.")>-1?a.youtube=e.split("?v=")[1].split("&")[0]:e.indexOf("youtu.be/")>-1&&(a.youtube=e.split("be/")[1]),$("#iframe").remove(),"function"==typeof t&&t(a)}catch(l){a.image=i(r),a.description=n(r),a.title=o(r),a.url=e,a.url_parent=e.split("://")[1].split("/")[0],"function"==typeof t&&t(a)}}).fail(function(){print("請求錯誤"),"function"==typeof t&&t()})}function auto_height(e){$(e).height(70),$(e).height(e.scrollHeight+parseFloat($(e).css("borderTopWidth"))+parseFloat($(e).css("borderBottomWidth")))}function auto_height2(e){$(e).height(0);var t=e.scrollHeight+parseFloat($(e).css("borderTopWidth"))+parseFloat($(e).css("borderBottomWidth"));$(e).height(t)}function getselecttext(){var e="";if(window.getSelection?e=window.getSelection():document.getSelection?e=document.getSelection():window.document.selection&&(e=window.document.selection.createRange().text),""!=e)return e}function remove_start(e){$.removeCookie("start"),1==e?$("#edit_parent .navOne").remove():2==e?$("#board_send_parent .navOne").remove():3==e?$("#new_line_parent .navOne").remove():4==e?$("#top .navOne").remove():$(".navOne").remove()}function start_set(){"Y"==$.cookie("start")&&($("#edit_parent").append("<div class='navOne ui left pointing basic label'>第一次進來嗎？點擊這裡開始導覽。<i class='delete icon' style='float:right'></i></div>"),$("#edit_parent .navigation").one("click",remove_start),$("#edit_parent .navOne i").one("click",function(){remove_start(1)}),setTimeout(function(){$("#edit_parent .navOne").transition("flash")},600))}function delete_modal_html(e){return void 0==e&&(e="#FF6900"),'<div class="_modal_info ui inverted dimmer"><div class="content"><div class="center"><i class="trash outline icon" style="font-size: 1.8em;margin-bottom: 13px;color:#000;cursor: default"></i><div class="_modal_but" style="margin-bottom:20px;color:#000;">確定要刪除資料？</div><button class="send mini ui button" style="background-color:'+e+'">刪除</button><button class="cancel mini ui button">取消</button></div></div></div>'}function move_center(){$("#top_tag li.active").velocity("scroll",{axis:"x",duration:0,container:$("#top_tag"),complete:function(){$("#top_tag").show()}}),$("#top_tag").velocity("stop").velocity("fadeIn",{duration:350}),vm.action_move=0}function export_line(){function e(e,t,i){var n=document.createElement("a"),o=new Blob([e],{type:i});n.href=URL.createObjectURL(o),n.download=t,n.click()}function t(e,t,i){DB.ref("info/"+e+"/metro").once("value",function(e){r[t]=e.val(),(l+=1)==a&&i()})}function i(e){for(var i=0;i<n.length;i++){var l=vm.blueprint[0].line[n[i].id.split("---")[1]],d=l._key;o.push(l),r.push([]),t(d,o.length-1,e),a+=1}}var n,o=[],r=[],a=0,l=0,d=vm.line_color;$("#export_modal").css("borderTopColor",d),$("#export_modal").modal("hide"),$("#send_modal_button").css("backgroundColor",d),$("#download_modal_button").css("backgroundColor",d),$("#send_modal_button").removeClass("loading"),$("#export_modal").modal({inverted:!0,closable:!1}).modal("show"),$("#send_modal_button").off("click").one("click",function(){var e=$.trim($("#modal_send").val());""!=e&&(n=$("#export_modal input.hidden:checked"),0!=n.length&&($(this).addClass("loading"),i(function(){$.post("https://us-central1-infometro-cc.cloudfunctions.net/mail",{email:e,subject:"infometro 資料匯出",html:"檔案存於附件",attachments:JSON.stringify(o)+"____//____"+JSON.stringify(r)}).done(function(){$("#send_modal_button").removeClass("loading"),$("#export_modal").modal("hide"),show_event_fn("寄送成功","檔案已寄到您指定的信箱")})})))}),$("#download_modal_button").off("click").one("click",function(){n=$("#export_modal input.hidden:checked"),0!=n.length&&($(this).addClass("loading"),i(function(){var t=new Date,i=t.getFullYear()+"_"+(t.getMonth()+1)+"_"+t.getDate()+"_";e(JSON.stringify(o)+"____//____"+JSON.stringify(r),"infometro_"+i+".txt","text/plain"),$("#send_modal_button").removeClass("loading"),$("#export_modal").modal("hide"),show_event_fn("下載成功","檔案已下載")}))})}function import_line(){function e(e){var i=new FileReader;i.onload=t,i.readAsText(e.target.files[0])}function t(e){o=e.target.result,vm.line_import=JSON.parse(o.split("____//____")[0])}function i(){for(var e=[],t=0;t<n.length;t++)e.push(vm.line_import[n[t].id.split("---")[1]]);return e}var n,o="",r=vm.line_color;$("#import_modal").css("borderTopColor",r),$("#import_modal_button").css("backgroundColor",r),$("#import_modal").modal({inverted:!0,closable:!1,onHide:function(){vm.line_import=[],$("#uploadtxt").val("")}}).modal("show"),$("#uploadtxt").off("change").on("change",function(t){e(t)}),$("#import_modal_button").off("click").one("click",function(){if(n=$("#import_modal input.hidden:checked"),0!=n.length){for(var e=i(),t=o.split("____//____")[1],r=0;r<e.length;r++){var a=DB.ref("blueprint/"+user_uid).push().key;e[r]._key=a;for(var l=0;l<e[r].metro.length;l++){var d=DB.ref("blueprint/"+user_uid).push().key;t=t.replace(e[r].metro[l]._key,d),e[r].metro[l]._key=d}set_line_root(a,user_uid);var c=JSON.parse(t)[r];DB.ref("info/"+a+"/metro").set(c),vm.blueprint[0].line.push(e[r])}vm.update_blueprint(),$("#import_modal").modal("hide")}})}function drop_line(e,t){if($(e.target).closest("li").jrumble().trigger("stopRumble"),vm.index_line!=t){var i=vm.drag_metro_key;if(""!=i){var n=vm.move_metro(i,t);if(void 0!=n){n=n[0];var o=JSON.parse(JSON.stringify(vm.blueprint[0]));o.line[t].metro.push(n),vm.action="drop_line",vm.update_blueprint(o.key,o)}}}}function allowDrop_line(e){vm.drag_metro_key&&$(e.target).closest("li").jrumble().trigger("startRumble"),e.preventDefault()}function allowDropLeave_line(e){vm.drag_metro_key&&$(e.target).closest("li").jrumble().trigger("stopRumble"),e.preventDefault()}function info_search_db(e,t){DB.ref("info/"+e+"/metro/").once("value",function(i){i.forEach(function(i){for(var n in i.val())i.val()[n].message.indexOf(t)>-1&&vm.search_info.push({line_key:e,metro_key:i.key,message:i.val()[n].message})})})}function info_search(){return!1}function lighning_bind(){var e=DB.ref("users_data/"+user_uid+"/lightning/"+vm.blueprint[0].key);vm.$bindAsArray("lightning",e),e.once("child_added",function(e){setTimeout(function(){$("#right .r_content").perfectScrollbar("update")},5)})}function lightning_send(){var e=$.trim($("#right_lightning textarea").val());if(""!=e){var t={message:e,timestamp:firebase.database.ServerValue.TIMESTAMP};DB.ref("users_data/"+user_uid+"/lightning/"+vm.blueprint[0].key).push().set(t),$("#right_lightning textarea").val("")}}function drop(e){$("#board_edit>div>i").jrumble().trigger("stopRumble");var t=vm.drag_metro_key;t&&vm.delete_metro(t);var i=vm.drag_line_key;i&&vm.delete_line(i)}function allowDrop(e){$("#board_edit>div>i").jrumble().trigger("startRumble"),e.preventDefault()}function allowDropLeave(e){$("#board_edit>div>i").jrumble().trigger("stopRumble"),e.preventDefault()}function clear_uploadFile(e){$("#progress .bar").css("min-width","0%"),$("#uploadFileParent").parent().css("background-color","");var t=$("#uploadFileParent").data("file_id"),i=$("#uploadFileParent").data("file_name");if("send"!=e&&void 0!=t&&""!=t){firebase.storage().ref().child("file/"+vm.get_line_key()+"/"+vm.get_metro()._key+"/"+t+"/"+i).delete().then(function(){}).catch(function(e){})}$("#uploadFileParent").data({file_id:"",file_url:"",file_name:""}),$("#uploadFileInput").val(""),$("#uploadName").html(""),$("#uploadFileParent").attr("data-tooltip","上傳檔案")}function upload_file(e){var t=e.name,i=DB.ref("file/"+vm.get_line_key()+"/"+vm.get_metro()._key).push();i.set({name:t,timestamp:firebase.database.ServerValue.TIMESTAMP});var n=firebase.storage().ref(),o=n.child("file/"+vm.get_line_key()+"/"+vm.get_metro()._key+"/"+i.key+"/"+t).put(e);clear_uploadFile(),o.on("state_changed",function(e){var t=e.bytesTransferred/e.totalBytes*100;$("#progress .bar").css("min-width",t+"%")},function(e){},function(){$("#uploadFileParent").parent().css("background-color","currentColor"),$("#progress .bar").css("min-width","0%"),$("#uploadFileInput").val(""),$("#uploadFileParent").attr("data-tooltip","重新上傳"),$("#uploadName").html("<span style='color:#ffffff;margin-left:5px;white-space: nowrap;'>"+t+"</span><i class='delete icon' style='position: relative;left:5px;cursor:pointer;color:#ffffff;display:inline' onclick='clear_uploadFile()'></i>");var e=o.snapshot.downloadURL;$("#uploadFileInput").val(""),$("#uploadFileParent").data({file_id:i.key,file_url:e,file_name:t}),""==$.trim($("#board_textarea").val())?$("#board_textarea").val($("#board_textarea").val()+t):$("#board_textarea").val($("#board_textarea").val()+"\n"+t)})}var b1_left=parseInt($("#board1").css("left")),b2_left=parseInt($("#board2").css("left")),b3_left=parseInt($("#board3").css("left"));$(window).resize(function(){var e=$("#center").width();$(window).width();e<=1165?$("#board_parent").addClass("adj"):$("#board_parent").removeClass("adj"),is_mobile()&&$("#board_parent").css("min-height",getViewportSize().h+"px")}).resize(),setTimeout(function(){void 0===vm&&location.reload()},5e3);var sortable=[],mode_before;$(function(){sortable.line=new Sortable(id("line_drag"),{animation:150,forceFallback:!1,setData:function(e,t){vm.drag_line_key=$(t).data("key"),navigator.userAgent.match("Firefox")&&e.setData("line_key",$(t).data("key"))},onStart:function(e){mode_before=vm.mode,vm.mode=1.5},onEnd:function(e){setTimeout(function(){vm.swap_line(e.oldIndex,e.newIndex),vm.mode=mode_before,vm.drag_line_key=""},5)}}),sortable.metro=new Sortable(id("top_tag"),{animation:50,forceFallback:!1,filter:".add",setData:function(e,t){vm.drag_metro_key=$(t).data("key"),navigator.userAgent.match("Firefox")&&e.setData("key",$(t).data("key"))},onStart:function(e){var t=$("#top_tag");$("#top_tag_parent").css("left",t.css("left")),t.addClass("left_inherit"),t.find(".add").hide(),0==e.oldIndex?t.addClass("first_drag"):e.oldIndex==$("#top_tag li").length-2&&t.addClass("last_drag"),mode_before=vm.mode,vm.mode=1.5},onEnd:function(e){var t=$("#top_tag");t.find(".add").show(),setTimeout(function(){t.removeClass("left_inherit")},100),t.removeClass("first_drag").removeClass("last_drag"),setTimeout(function(){vm.swap_metro(e.oldIndex,e.newIndex),vm.mode=mode_before,vm.drag_metro_key=""},5)}}),setTimeout(function(){$(".nav_i.custom").popup({popup:$(".custom.popup"),on:"click",onShow:function(){var e="",t=$(this).data("img");""!=t&&(e="<img style='width: 100%;' src='"+t+"'>",$(this).html(e))}})},5),setTimeout(function(){$(".nav_i:not(.custom)").popup({on:"click"})},5)}),$(function(){function e(e){for(var t=0;t<vm.info.length;t++)if(vm.info[t][".key"]==e)return vm.info[t]}var t=!1,i=!1;$(document).on("focus","input,textarea",function(){vm.copy_info=[],i=!0,$(this).one("blur",function(){i=!1})}),$(document).keydown(function(n){if(!i)if((t=n.metaKey||n.ctrlKey)&&67==n.keyCode){if(void 0!=getselecttext())return;if(vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;vm.copy_info[0]=JSON.parse(JSON.stringify(e(vm.info_active))),vm.copy_info[1]="copy",show_event_fn("複製成功","你複製了一個資訊")}}else if(t&&88==n.keyCode){if(void 0!=getselecttext())return;if(vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;vm.copy_info[0]=JSON.parse(JSON.stringify(e(vm.info_active))),vm.copy_info[1]="cut";var o=vm.get_line_key(),r=vm.key_metro,a=vm.info_active;vm.copy_info[2]=function(){DB.ref("info/"+o+"/metro/"+r).child(a).remove().then(function(){vm.copy_info=[]})},show_event_fn("剪下成功","你剪下了一個資訊")}}else if(t&&86==n.keyCode){if(0==vm.copy_info.length)return;vm.paste_info(vm.copy_info[0]),"cut"==vm.copy_info[1]&&(vm.copy_info[2](),show_event_fn("貼上成功","你貼上了一個資訊"))}else if(46==n.keyCode&&vm.info_active){if($("#"+vm.info_active).find("textarea").is(":visible"))return;$("#"+vm.info_active).find("._info_delete").trigger("click")}}).keyup(function(e){17!=e.keyCode&&91!=e.keyCode||(t=!1)})}),$(function(){$(".triangle.left").click(function(){$("#top_tag").velocity("stop").velocity("scroll",{container:$("#top_tag"),offset:-200,duration:250,axis:"x"})}),$(".triangle.right").click(function(){$("#top_tag").velocity("stop").velocity("scroll",{container:$("#top_tag"),offset:70,duration:250,axis:"x"})})}),$(function(){$("#copyright .ui.dropdown").dropdown()}),$(function(){$(".logo").jrumble({x:2,y:2,opacity:!0,opacityMin:.5}).hover(function(){$(this).trigger("startRumble")},function(){$(this).trigger("stopRumble")}),$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>"),$("#left_color").colpick({layout:"hex",onHide:function(){vm.pick_color=void 0},onChange:function(e,t,i,n,o){vm.pick_color="#"+t},onSubmit:function(e,t,i,n,o){$(n).val(t),$(n).colpickHide()}}).colpickHide(),$("#left .left_line").on("mousedown",function(e){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var t=$("#left").width()-e.pageX;e.pageX,parseInt($("#board1").css("left"));$(document).on("mousemove.line",function(e){var i=e.pageX-t;i<=120&&(i=120),$("#left").css("width",i),$("#line_parent").css("width",i),$("#center").css("margin-left",i)}),$(document).on("mouseup.line",function(e){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart"),$("#show_event").css("left",$("#left").width()+20)})})}),$(function(){$("#right .r_content").perfectScrollbar(),$("#right .r_button").on("click",function(){var e=$(this).index()-1;0==e?$("#right_lightning").show():$("#right_lightning").hide(),$(this).addClass("active").siblings().removeClass("active"),$("#right .r_content:eq("+e+")").addClass("active").siblings().removeClass("active")}),$("#right .right_tool").on("click",function(e){$("#right").height()<400&&0==$(e.target).closest(".r_button").length&&($("#right").toggleClass("down"),$.cookie("right_tool",$("#right").attr("class")))}),$.cookie("right_tool")&&$.cookie("right_tool").indexOf("down")>-1&&$(".right_tool").click(),$("#right .right_line").on("mousedown",function(e){$(document).on("selectstart",function(){return!1}),$(document).on("dragstart",function(){return!1});var t=$(window).width()-120,i=$("#right").width()-($(window).width()-e.pageX);$(document).on("mousemove.line",function(e){var n=$(window).width()-e.pageX-i;n>t&&(n=t),$("#right").css("width",n)}),$(document).on("mouseup.line",function(e){$(document).off("mouseup.line"),$(document).off("mousemove.line"),$(document).off("selectstart"),$(document).off("dragstart")})}),$("#right .ui.accordion").accordion()}),$(function(){$("#board_textarea").keyup(function(e){auto_height(this)}),$("#board_textarea").on("paste",textarea_paste)}),$(function(){var e=$("#board_enter_parent,#board_send_parent");e.on("dragenter",function(e){e.stopPropagation(),e.preventDefault()}),e.on("dragover",function(e){e.originalEvent.dataTransfer.files;vm.drag_line_key||vm.drag_metro_key||($("#board_send_parent>.ui.icon").css("background-color","#f7f7f7"),e.stopPropagation(),e.preventDefault())}),e.on("dragleave",function(e){e.originalEvent.dataTransfer.files;vm.drag_line_key||vm.drag_metro_key||($("#board_send_parent>.ui.icon").css("background-color",""),e.stopPropagation(),e.preventDefault())}),e.on("drop",function(e){e.preventDefault();var t=e.originalEvent.dataTransfer.files;$("#board_send_parent>.ui.icon").css("background-color",""),0!=t.length&&upload_file(t[0])})}),$(function(){$("#uploadButton").click(function(){$("#uploadFileInput").click()}),$("#uploadFileInput").on("change",function(e){if(e.target.files.length>0){upload_file(e.target.files[0])}})});var vm_header=new Vue({el:"#header_main",data:{users:[],header_search:[]},mounted:function(){$("#header_area").css("visibility","visible")},methods:{header_keyup:function(){vm_header.header_search=[];var e=$.trim($("#header_search").val()).toLowerCase();if(""!=e)for(var t=vm.blueprint[0].line,i=0;i<t.length;i++)for(var n=0;n<t[i].metro.length;n++){var o=t[i].metro[n].name.toLowerCase();if(o.indexOf(e)>-1||e.indexOf(o)>-1){var r=new RegExp(e,"g"),a="<b style='color:"+t[i].color+"'>"+e+"</b>",l=o.replace(r,a);this.header_search.push({name:l,_key:t[i].metro[n]._key,color:t[i].color,index:i})}}},header_search_click:function(e,t){vm.exchange_line(e,"header_search_click"),setTimeout(function(){vm.key_metro=t},5),vm_header.header_search=[],$("#header_search").val("")}}}),vm=new Vue({el:"#main",data:{blueprint:[],index:[],index_line:0,info_active:"",key_metro:"",action:"load",action_move:0,info:[],users:[],mode:0,pick_color:void 0,url_info:void 0,filter_search:"",is_nav:!1,search_info:[],search_metro:[],drag_line_key:"",drag_metro_key:"",lightning:[],copy_info:[],line_import:[]},mounted:function(){$("#main").css("visibility","visible")},updated:function(){setTimeout(function(){$(window).resize()},0),$("#board_info .ui.active").show(),1==vm.action_move&&setTimeout(move_center,0)},firebase:{},computed:{loading_blueprint:function(){if(this.blueprint.length>0)return!0},line_color:function(){return 0==this.blueprint.length?"":this.pick_color?this.pick_color:this.blueprint[0].line[0].color},line:function(){return 0==this.blueprint.length?"":this.blueprint[0].line},line_color:function(e){return 0==this.blueprint.length?"":this.pick_color?this.pick_color:this.get_line().color},metro:function(){if(0==this.blueprint.length)return"";var e=this.get_line();return void 0==e&&vm.exchange_line(0),e.metro},line_name:function(){return 0==this.blueprint.length?"":this.get_line().name},metro_name:function(){return this.get_metro().name},metro_create:function(){if(0==this.blueprint.length)return"";var e=this.get_metro().timestamp;return void 0==e?"":moment(e).format("lll")},info_count:function(){return 0==this.blueprint.length?"":this.info.length},info_favorites:function(){var e=this.info.filter(function(e){return!!e.favorite&&!!e.url_info});return 0!=e.length&&e},info_sort_filter:function(){if(0==this.blueprint.length)return"";var e=this.info;vm.filter_search&&(e=e.filter(function(e){return e.message.indexOf(vm.filter_search)>-1}));for(var t=[],i=[],n=0;n<e.length;n++)e[n].favorite?t.push(e[n]):i.push(e[n]);return[].concat(i,t)},lightning_sort:function(){var e=this.lightning;return e=e.sort(function(e,t){return e.timestamp>t.timestamp?-1:1})}},filters:{message_filter:function(e,t){if(void 0!=e)return e=e.replace(/\</g,"&lt;"),e=e.replace(/\>/g,"&gt;"),e=urlify(e),e=e.replace(/(?:\r\n|\r|\n)/g,"<br/>"),e=e.replace(/ /g,"&nbsp;"),e=e.replace(/\<a&nbsp;href=/g,"<a href="),setTimeout(function(){"right"==t?$("#right .right_main").find("a").attr("target","_blank"):$("#board_info .info_message").find("a").css("color",vm.line_color).attr("target","_blank")},5),e}},watch:{info_active:function(){var e=this.get_index_line();e.info_active||(e.info_active=[]),e.info_active[vm.key_metro]=this.info_active||"",vm.index_update()},key_metro:function(){var e=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByChild("update_timestamp");vm.$bindAsArray("info",e);var t=this.get_index_line();if(t.key_metro=this.key_metro,t.info_active){var i=t.info_active[this.key_metro];this.info_active=i}else vm.index_update();vm.leave_edit_info(),e.on("child_added",function(e){setTimeout(function(){$("#board_info .dropdown").dropdown("destroy").dropdown()},5)})}},methods:{lightning_create:function(e){return moment(e).endOf("hour").fromNow()},delete_lightning:function(e,t){var i=$(t.target).closest(".lightning_item"),n=i.find("._modal_info");n.length||(n=i.append(delete_modal_html())),i.find("._modal_but").css("margin-bottom","10px"),n.dimmer({duration:{show:400,hide:0}}).dimmer("show"),n.find(".send").off("click").on("click",function(){DB.ref("users_data/"+user_uid+"/lightning/"+vm.blueprint[0].key+"/"+e).remove(),n.dimmer("hide")}),n.find(".cancel").off("click").on("click",function(){n.dimmer("hide")})},lightning_click:function(e){$(e.target).closest(".lightning_item").addClass("active").siblings().removeClass("active")},img_file:function(e){if(""!=e&&void 0!=e)return e=e.toLowerCase(),e.indexOf("png")>-1||e.indexOf("gif")>-1||e.indexOf("jpg")>-1||e.indexOf("jpeg")>-1||void 0},get_img_embed_url:function(){if(vm.url_info.image){var e=new Image;e.src=vm.url_info.image,e.onload=function(){$("#url_info_board").find(".url_img").attr("src",e.src),Math.abs(e.width/e.height-1)>.5?$("#url_info_board").addClass("flex_item"):$("#url_info_board").addClass("flex_item_row")}}},get_img_embed:function(e){if(e.url_info){if(e.url_info.youtube)return setTimeout(function(){$("#"+e[".key"]).find(".ui.embed:not(.active)").embed()},5),"flex_item youtube";if(e.url_info.image){var t=new Image;t.src=e.url_info.image,t.onload=function(){var i=$("#"+e[".key"]);i.find(".url_img").attr("src",t.src),Math.abs(t.width/t.height-1)>.5?i.find(".item_url_info").addClass("flex_item"):i.find(".item_url_info").addClass("flex_item_row")}}}},get_favorite_style:function(e,t){return e?{color:t}:{}},color_gradient:function(e){return"linear-gradient(to right, #000 50%, "+e+" 0%)"},mode_txt:function(){return 0==this.blueprint.length?"":0==this.mode?"一般模式":1==this.mode?"編輯模式":1.5==this.mode?"編輯模式":void 0},mode_click:function(){var e=this.mode;e=Math.floor(e+1),e>1&&(e=0),this.mode=e},mode_class:function(){return 0==this.mode?"male":1==this.mode?"configure":1.5==this.mode?"trash":void 0},index_update:function(){DB.ref("users_data/"+user_uid+"/index").set(vm.index)},update_blueprint:function(e,t){void 0!=e&&void 0!=t||(t=vm.blueprint[0],e=t.key),setTimeout(function(){DB.ref("blueprint/"+user_uid+"/"+e).set(t)},0)},get_index_blueprint:function(){return vm.index[0]},get_line:function(){return this.blueprint[0].line[this.index_line]},get_index_line:function(){var e=vm.index[0][vm.index_line];return"object"!=typeof e?(print("索引變字串"),vm.index[0][vm.index_line]={},vm.index[0][vm.index_line].check=!1,vm.index[0][vm.index_line]):e},update_index_line:function(e){for(var t=0,i=0;i<e.length;i++)if(e[i]||(e[i]=[],e[i].check=!1),e[i].check){t=i;break}vm.index_line=t},update_index_line_check:function(){for(var e=vm.get_index_blueprint(),t=0;t<e.length;t++)e[t]||(e[t]=[]),e[t].check=!1;e[vm.index_line].check=!0},update_selection_color:function(){var e=vm.line_color;if(!document.getElementById("selection")){var t=document.createElement("style");t.id="selection",t.type="text/css",document.getElementsByTagName("head")[0].appendChild(t)}document.getElementById("selection").innerHTML="::selection {background: "+e+";color: #fff;}::-moz-selection {background: "+e+";color: #fff;}img::selection {background: "+e+";color: #fff;}img::-moz-selection {background: "+e+";color: #fff;}"},update_metro_key:function(e){var t=this.get_line().metro,i=!1;if(e.key_metro){for(var n=0;n<t.length;n++)if(t[n]._key==e.key_metro){vm.key_metro=t[n]._key,i=!0;break}i||(vm.key_metro=t[0]._key)}else vm.key_metro=t[0]._key},exchange_line:function(e,t){function i(){vm.index_line=e,vm.get_index_blueprint()[e]||vm.replace_index(),vm.update_index_line_check(),vm.update_selection_color(),void 0==t&&vm.update_metro_key(vm.get_index_blueprint()[e]),vm.action_move=1,setTimeout(move_center,0),$(document.body).scrollTop(0)}if(vm.index_line!=e){if($("#top_tag").stop().fadeOut(0),$("html").hasClass("re_name"))return setTimeout(function(){i()},0);i()}},replace_index:function(){for(var e=this.blueprint[0].line,t=vm.get_index_blueprint(),i=e.length-t.length,n=0;n<i;n++)t.push([]);print("重新設定了index")},new_line:function(){if("load"!=vm.action){var e=this.blueprint[0],t=vm.get_index_blueprint();remove_start(),e.line||(e.line=[]);var i=vm.get_default_color(e.line.length),n=line_json("未命名",i);n.metro.push(metro_json("總站")),e.line.push(n),t.push({check:!1}),vm.action="new_line",vm.update_blueprint(e.key,e)}},find_line_index:function(e,t){for(var i=0;i<t.line.length;i++)if(t.line[i]._key==e)return i},move_line:function(e){var t=vm.blueprint[0],i=vm.find_line_index(e,t);if(void 0!=i){if(0==i){var n=t.line;vm.delete_blueprint(t.key,"move_delete")}else{var n=t.line.splice(i,1);if(vm.get_index_blueprint().splice(i,1),vm.index_line>=i){var o=vm.index_line-1;o<0&&(o=0),vm.index_line=o}vm.update_metro_key(vm.get_index_line()),vm.update_blueprint(t.key,t)}return n}},delete_line:function(e,t){function i(){if(1==n.line.length)vm.delete_blueprint(n.key,"line_one_delete");else{if(n.line.splice(o,1),vm.get_index_blueprint().splice(o,1),vm.index_line>=o){var i=vm.index_line-1;i<0&&(i=0),vm.index_line=i}vm.update_metro_key(vm.get_index_line()),vm.action="delete_line",vm.update_blueprint(n.key,n),"move_delete"==t||vm.delete_info_line(e)}$("#line_delete_button").off("click"),$("#line_delete_modal").modal("hide"),$(document).off("keydown.line_delete")}var n=vm.blueprint[0],o=vm.find_line_index(e,n);if(void 0!=o)if("move_delete"==t||"metro_one_delete"==t)i();else{$(".ui.modal").modal("refresh"),setTimeout(function(){$("#line_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var r=n.line[o].color;$("#line_delete_modal").css("borderTopColor",r),$("#line_delete_button").css("backgroundColor",r),$("#line_delete_button").off("click").on("click",i)}},get_line_key:function(){return vm.get_line()._key},new_metro:function(e){var t=metro_json("未命名"),i=JSON.parse(JSON.stringify(this.blueprint[0]));i.line[vm.index_line].metro.splice(e,0,t),vm.action="new_metro",remove_start(),this.update_blueprint(i.key,i)},check_metro:function(e){if(vm.key_metro==e)return"active"},exchange_metro:function(e){this.key_metro=e},find_metro_index:function(e,t){for(var i=t.line[this.index_line].metro,n=0;n<i.length;n++)if(i[n]._key==e)return n},move_metro:function(e,t){var i,n=this.blueprint[0],o=n.line[this.index_line].metro;if(o.length<=1)i=function(){vm.delete_line(n.line[vm.index_line]._key,"move_delete")};else{var r=vm.find_metro_index(e,n);if(void 0==r)return;var o=o.splice(r,1);if(this.key_metro==e){var a=r-1;a<0&&(a=0);var l=n.line[this.index_line].metro[a]._key;this.key_metro=l}}return DB.ref("info/"+n.line[this.index_line]._key+"/metro").child(e).once("value",function(o){DB.ref("info/"+vm.blueprint[0].line[t]._key+"/metro/"+e).set(o.val()),DB.ref("info/"+n.line[vm.index_line]._key+"/metro").child(e).remove(),i&&setTimeout(i,5)}),o},delete_metro:function(e){function t(){if(i.line[vm.index_line].metro.length<=1)vm.delete_line(i.line[vm.index_line]._key,"metro_one_delete");else{if(i.line[vm.index_line].metro.splice(n,1),vm.key_metro==e){var t=n-1;t<0&&(t=0);var o=i.line[vm.index_line].metro[t]._key;vm.key_metro=o}vm.action="delete_metro",vm.update_blueprint(i.key,i),DB.ref("info/"+i.line[vm.index_line]._key+"/metro").child(e).remove()}}var i=JSON.parse(JSON.stringify(this.blueprint[0])),n=vm.find_metro_index(e,i);if(void 0!=n){$(".ui.modal").modal("refresh"),setTimeout(function(){$("#metro_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var o=vm.line_color;$("#metro_delete_modal").css("borderTopColor",o),$("#metro_delete_button").css("backgroundColor",o),$("#metro_delete_button").off("click").on("click",function(){t(),$("#metro_delete_button").off("click"),$("#metro_delete_modal").modal("hide")})}},swap_metro:function(e,t){function i(e){for(var t=0;t<o.length;t++)if(o[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.blueprint[0])),o=n.line[this.index_line].metro,r=[];$("#top_tag li").each(function(){var e=i($(this).data("key"));r.push(o[e])}),n.line[this.index_line].metro=r,vm.action="swap_metro",vm.update_blueprint(n.key,n)}},get_metro:function(){for(var e=this.get_line(),t=vm.key_metro,i=(e.metro,0),n=0;n<e.metro.length;n++)if(e.metro[n]._key==t){i=n;break}return e.metro[i]},paste_info:function(e){e.update_timestamp=firebase.database.ServerValue.TIMESTAMP,
e.timestamp=firebase.database.ServerValue.TIMESTAMP,delete e[".key"],this.save_info(e)},new_info:function(){var e=$.trim($("#board_textarea").val());if(""!=e){var t={message:e,favorite:!1,url_info:"",update_timestamp:firebase.database.ServerValue.TIMESTAMP,timestamp:firebase.database.ServerValue.TIMESTAMP,users:user_uid,file_id:$("#uploadFileParent").data("file_id")||"",file_url:$("#uploadFileParent").data("file_url")||"",file_name:$("#uploadFileParent").data("file_name")||""};if(clear_uploadFile("send"),vm.url_info&&(t.url_info=vm.url_info),remove_start(),0==$("#top_tag").find("[data-key='"+vm.key_metro+"']").length)return vm.exchange_line(0),vm.exchange_line(1),void print("目前不在任何地鐵上");vm.url_info=void 0,$("#board_textarea").val("").keyup();for(var i in t.url_info)t.url_info.hasOwnProperty(i)&&void 0==t.url_info[i]&&(t.url_info[i]="");this.save_info(t)}},save_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(e,function(t){t&&t.toString().indexOf("Permission denied")>-1&&(set_line_root(vm.get_line_key(),user_uid),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(e),setTimeout(function(){print("未發現root，重新寫入root"),location.reload()},0))})},delete_info:function(e,t){function i(){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove(),o.dimmer("hide")}var n=$(t.target).closest(".board_list");if(!n.hasClass("edit")){var o=n.find("._modal_info");o.length||(o=n.append(delete_modal_html(vm.line_color))),o.dimmer({duration:{show:400,hide:0}}).dimmer("show"),o.find(".send").off("click").on("click",function(){i()}),o.find(".cancel").off("click").on("click",function(){o.dimmer("hide")}),$(document).on("keydown.info_delete",function(e){13==e.which?(i(),$(document).off("keydown.info_delete")):27==e.which&&(o.dimmer("hide"),$(document).off("keydown.info_delete"))})}},delete_info_line:function(e){DB.ref("info/"+e+"/metro").remove(),DB.ref("info/"+e+"/root").remove()},favorite_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e[".key"]).update({favorite:!e.favorite,update_timestamp:firebase.database.ServerValue.TIMESTAMP})},edit_info:function(e,t,i){var n=$(i.target).closest(".board_list");if(n.hasClass("edit"))return!1;if(vm.leave_edit_info(),"dbl"==t&&1!=vm.mode)return!1;$("html").addClass("re_name");var o=e[".key"];n.addClass("edit");var r=n.find("textarea");r.val(e.message).focus(),r.on("keyup.textarea",function(e){auto_height2(this),27==e.keyCode&&vm.leave_edit_info(n)}).keyup(),r.on("paste",function(){e.url_info||textarea_paste2(r[0],e)}),n.find("button.send").one("click",function(){e.url_info||(e.url_info="");var t=$.trim(r.val());vm.leave_edit_info(n),setTimeout(function(){n.velocity("scroll",{duration:500,offset:-500})},50),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(o).update({message:t,url_info:e.url_info,update_timestamp:firebase.database.ServerValue.TIMESTAMP})}),n.find("button.cancel").one("click",function(){vm.leave_edit_info(n)})},leave_edit_info:function(e){$(document).one("click",function(){$("html").removeClass("re_name")}),e?(e.removeClass("edit"),e.off("keyup.textarea").off("paste"),e.find("button").off("click")):($(".board_list").removeClass("edit"),$("#board_info textarea").off("keyup.textarea").off("paste"),$("#board_info .textarea button").off("click"))},edit_name:function(e,t){function i(){$(document).off("click."+t+"_board"),n.off("keydown"),$("#border_"+t+"_name").show(),n.hide()}$("#border_"+t+"_name").hide();var n=$("#board_"+t+"_textarea");if(n.show(),n.focus(),"line"==t)var o=vm.get_line();else if("metro"==t)var o=vm.get_metro();var r=o.name;n.val(o.name),auto_height2(n[0]),n.on("keydown",function(e){if(auto_height2(n[0]),13==e.which||e.shiftKey&&13==e.which){if(e.preventDefault(),o.name=$.trim(n.val().replace(/  +/g," ")),r==o.name)return;"line"==t&&vm.set_總站(o.name,r),vm.action="re_name",vm.update_blueprint(),i()}else 27==e.which&&i()}),$(document).on("click."+t+"_board",function(e){e.target.id!="board_"+t+"_textarea"&&i()})},"set_總站":function(e,t){var i=vm.get_line().metro;1!=i.length||"總站"!=i[0].name&&i[0].name!=t||(i[0].name=e)},re_name:function(e,t,i){function n(){return"line"==t?vm.blueprint[0].line[e]:"metro"==t?vm.get_line().metro[e]:void 0}function o(){$(document).one("click",function(){$("html").removeClass("re_name")}),r.removeClass("edit"),sortable[t]&&sortable[t].option("disabled",!1),d.off("keyup."+t+"_input"),$(document).off("click."+t+"_input")}if(!$(i.target).hasClass("blueprint_i")){$("html").addClass("re_name");var r=$(i.target).closest("."+t+"_list");r.addClass("edit");var a=t;sortable[a]&&sortable[a].option("disabled",!0);var l=n().name,d=r.find("."+t+"_input");d.select().on("keyup."+t+"_input",function(e){if(13==e.which){if(o(),""==n().name)return void(n().name=l);if(l==n().name)return;"line"==t&&vm.set_總站(n().name,l),vm.action="re_name",vm.update_blueprint()}else 27==e.which&&(o(),n().name=l)}),setTimeout(function(){$(document).on("click."+t+"_input",function(e){-1==e.target.className.indexOf(t+"_input")&&(o(),n().name=l)})},5)}},get_default_color:function(e){var t=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][e];return t||"#000000"},open_color:function(e,t){if(0==vm.mode)return void vm.exchange_line(e);if("Y"==$("#left_color").attr("show"))return $(".colpick_submit").off("click.op"),void $("#left_color").attr("show","");t=t.split("#")[1];var i=$(event.target),n=i.offset().left,o=i.offset().top+i.height()+2;$("#left_color").css({left:n,top:o}).colpickSetColor(t).colpickShow(),$("#left_color").attr("show","Y"),$(".colpick_submit").off("click.op").on("click.op",function(){vm.blueprint[0].line[e].color="#"+$("#left_color").val(),vm.action="edit_color",vm.update_blueprint(),$("#left_color").attr("show",""),$(this).off("click.op")})},swap_line:function(e,t){function i(e){for(var t=0;t<n.line.length;t++)if(n.line[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.blueprint[0])),o=[],r=[];$("#line_drag li").each(function(){var e=i($(this).data("key"));o.push(n.line[e]),r.push(vm.index[0][e])}),n.line=o,vm.index[0]=r,vm.update_index_line(r),vm.action="swap_line",vm.update_blueprint(n.key,n)}}}});