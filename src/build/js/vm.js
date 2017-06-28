var vm=new Vue({el:"#main",data:{blueprint:[],index:[],index_blueprint:0,index_line:0,info_active:"",key_metro:"",action:"load",action_move:0,info:[],users:[],mode:0,pick_color:void 0,url_info:void 0,filter_search:"",is_nav:!1,search_info:[],search_metro:[],drag_line_key:"",drag_metro_key:"",lightning:[],copy_info:[]},mounted:function(){$("#main").css("visibility","visible")},updated:function(){setTimeout(function(){$(window).resize()},0),$("#board_info .ui.active").show(),1==vm.action_move&&setTimeout(move_center,0)},firebase:{},computed:{loading_blueprint:function(){if(this.blueprint.length>0)return!0},line_color:function(){return 0==this.blueprint.length?"":this.pick_color?this.pick_color:this.get_blueprint().line[0].color},line:function(){return 0==this.blueprint.length?"":this.get_blueprint().line},line_color:function(e){return 0==this.blueprint.length?"":this.pick_color?this.pick_color:this.get_line().color},metro:function(){if(0==this.blueprint.length)return"";var e=this.get_line();return void 0==e&&vm.exchange_line(0),e.metro},line_name:function(){return 0==this.blueprint.length?"":this.get_line().name},metro_name:function(){return this.get_metro().name},metro_create:function(){if(0==this.blueprint.length)return"";var e=this.get_metro().timestamp;return void 0==e?"":moment(e).format("lll")},info_count:function(){return 0==this.blueprint.length?"":this.info.length},info_favorites:function(){var e=this.info.filter(function(e){return!!e.favorite&&!!e.url_info});return 0!=e.length&&e},info_sort_filter:function(){if(0==this.blueprint.length)return"";var e=this.info;vm.filter_search&&(e=e.filter(function(e){return e.message.indexOf(vm.filter_search)>-1}));for(var i=[],t=[],n=0;n<e.length;n++)e[n].favorite?i.push(e[n]):t.push(e[n]);return[].concat(t,i)},lightning_sort:function(){var e=this.lightning;return e=e.sort(function(e,i){return e.timestamp>i.timestamp?-1:1})}},filters:{message_filter:function(e){return e=e.replace(/\</g,"&lt;"),e=e.replace(/\>/g,"&gt;"),e=urlify(e),e=e.replace(/(?:\r\n|\r|\n)/g,"<br/>"),e=e.replace(/ /g,"&nbsp;"),e=e.replace(/\<a&nbsp;href=/g,"<a href="),setTimeout(function(){$("#board_info .info_message").find("a").css("color",vm.line_color).attr("target","_blank")},5),e}},watch:{info_active:function(){var e=this.get_index_line();e.info_active||(e.info_active=[]),e.info_active[vm.key_metro]=this.info_active||"",vm.index_update()},key_metro:function(){var e=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByChild("update_timestamp");vm.$bindAsArray("info",e);var i=this.get_index_line();if(i.key_metro=this.key_metro,i.info_active){var t=i.info_active[this.key_metro];this.info_active=t}else vm.index_update();vm.leave_edit_info(),e.on("child_added",function(e){setTimeout(function(){$("#board_info .dropdown").dropdown("destroy").dropdown()},5)})}},methods:{lightning_create:function(e){return moment(e).endOf("hour").fromNow()},delete_lightning:function(e,i){var t=$(i.target).closest(".lightning_item"),n=t.find("._modal_info");n.length||(n=t.append(delete_modal_html())),t.find("._modal_but").css("margin-bottom","10px"),n.dimmer({duration:{show:400,hide:0}}).dimmer("show"),n.find(".send").off("click").on("click",function(){DB.ref("users_data/"+user_uid+"/lightning/"+e).remove(),n.dimmer("hide")}),n.find(".cancel").off("click").on("click",function(){n.dimmer("hide")})},lightning_click:function(e){var i=$(e.target).closest(".lightning_item");i.addClass("active").siblings().removeClass("active")},img_file:function(e){if(""!=e&&void 0!=e)return e=e.toLowerCase(),e.indexOf("png")>-1||e.indexOf("gif")>-1||e.indexOf("jpg")>-1||e.indexOf("jpeg")>-1||void 0},get_youtube_embed:function(e){return e.url_info&&e.url_info.youtube?(setTimeout(function(){$("#"+e[".key"]).find(".ui.embed:not(.active)").embed()},5),"flex_youtube"):""},get_favorite_style:function(e,i){return e?{color:i}:{}},color_gradient:function(e){return"linear-gradient(to right, #000 50%, "+e+" 0%)"},mode_txt:function(){return 0==this.blueprint.length?"":0==this.mode?"一般模式":1==this.mode?"編輯模式":1.5==this.mode?"編輯模式":void 0},mode_click:function(){var e=this.mode;e=Math.floor(e+1),e>1&&(e=0),this.mode=e},mode_class:function(){return 0==this.mode?"male":1==this.mode?"configure":1.5==this.mode?"trash":void 0},index_update:function(){DB.ref("users_data/"+user_uid+"/index").set(vm.index)},"更新藍圖":function(e,i){void 0!=e&&void 0!=i||(i=vm.get_blueprint(),e=i.key),setTimeout(function(){DB.ref("blueprint/"+user_uid+"/"+e).set(i)},0)},get_blueprint:function(e){return void 0!=e?this.blueprint[e]:this.blueprint[this.index_blueprint]},get_index_blueprint:function(){return vm.index[vm.index_blueprint]},get_line:function(){return this.get_blueprint().line[this.index_line]},get_index_line:function(){var e=vm.index[vm.index_blueprint][vm.index_line];return"object"!=typeof e?(print("索引變字串"),vm.index[vm.index_blueprint][vm.index_line]={},vm.index[vm.index_blueprint][vm.index_line].check=!1,vm.index[vm.index_blueprint][vm.index_line]):e},update_index_line:function(e){for(var i=0,t=0;t<e.length;t++)if(e[t]||(e[t]=[],e[t].check=!1),e[t].check){i=t;break}vm.index_line=i},update_index_line_check:function(){for(var e=vm.get_index_blueprint(),i=0;i<e.length;i++)e[i]||(e[i]=[]),e[i].check=!1;e[vm.index_line].check=!0},update_selection_color:function(){var e=vm.line_color;if(!document.getElementById("selection")){var i=document.createElement("style");i.id="selection",i.type="text/css",document.getElementsByTagName("head")[0].appendChild(i)}document.getElementById("selection").innerHTML="::selection {background: "+e+";color: #fff;}::-moz-selection {background: "+e+";color: #fff;}img::selection {background: "+e+";color: #fff;}img::-moz-selection {background: "+e+";color: #fff;}"},update_metro_key:function(e){var i=this.get_line().metro,t=!1;if(e.key_metro){for(var n=0;n<i.length;n++)if(i[n]._key==e.key_metro){vm.key_metro=i[n]._key,t=!0;break}t||(vm.key_metro=i[0]._key)}else vm.key_metro=i[0]._key},new_blueprint:function(){if("load"!=vm.action){vm.action="new_blueprint";var e=DB.ref("blueprint/"+user_uid).push(),i=[];i.push(line_json("橘線","#FF6900",!0)),i[i.length-1].metro.push(metro_json("總站")),e.set(blueprint_json("我的地鐵計畫",i))}},delete_blueprint:function(e,i){function t(){for(var t,n=0;n<vm.blueprint.length;n++)if(vm.blueprint[n].key==e){t=n;break}if(vm.action="delete_blueprint","move_delete"==i);else for(var o=vm.blueprint[t].line,n=0;n<o.length;n++)vm.delete_info_line(o[n]._key);vm.blueprint.length>1?(vm.index.splice(t,1),vm.index_update(),vm.index_line=0,vm.index_blueprint=0,vm.update_index_line(vm.index[vm.index_blueprint]),vm.update_index_line_check(),vm.update_selection_color(),setTimeout(function(){vm.update_metro_key(vm.index[vm.index_blueprint][vm.index_line])},0),DB.ref("blueprint/"+user_uid+"/"+e).remove()):DB.ref("blueprint/"+user_uid+"/"+e).remove().then(function(){vm.index.splice(t,1),vm.index_update(),location.reload()}),$("#blueprint_delete_button").off("click"),$("#blueprint_delete_modal").modal("hide")}"move_delete"==i||"line_one_delete"==i?t():($(".ui.modal").modal("refresh"),setTimeout(function(){$("#blueprint_delete_modal").modal({inverted:!0,closable:!1}).modal("show")}),$("#blueprint_delete_name").html(vm.get_blueprint().name),$("#blueprint_delete_button").off("dblclick").on("dblclick",t))},"檢查更新錯誤索引":function(e,i){if(i[e]&&i[e].line.length!=vm.index[e].length){for(var t=i[e].line,n=(vm.index[e],[]),o=0;o<t.length;o++)void 0!=vm.index[e][o]?n.push(vm.index[e][o]):(n.push({check:!1}),n[n.length-1].check=!1);print("重新更新索引"),vm.index[e]=n}},exchange_blueprint:function(e,i,t){return"load"!=vm.action&&vm.index_blueprint==e?void(t&&$(t.target).hasClass("blueprint_i")&&$(t.target).trigger("customClick")):(vm.檢查更新錯誤索引(e,vm.blueprint),e>=vm.blueprint.length&&(e=0),$("#top_tag").stop().fadeOut(0),$.cookie("index_blueprint",e),t&&t.target&&void 0!=t.target.className&&(t.target.className.indexOf("blueprint_a")>-1||t.target.className.indexOf("blueprint_i")>-1)&&(i=!0),i&&(vm.index_blueprint=e,vm.update_index_line(vm.index[e]),vm.update_index_line_check(),vm.update_selection_color(),vm.update_metro_key(vm.index[e][vm.index_line])),vm.action_move=1,void setTimeout(move_center,0))},exchange_line:function(e){function i(){vm.index_line=e,vm.get_index_blueprint()[e]||vm.replace_index(),vm.update_index_line_check(),vm.update_selection_color(),vm.update_metro_key(vm.get_index_blueprint()[e]),vm.action_move=1,setTimeout(move_center,0)}if(vm.index_line!=e)return $("#top_tag").stop().fadeOut(0),$("html").hasClass("re_name")?setTimeout(function(){i()},0):void i()},replace_index:function(){for(var e=vm.get_blueprint().line,i=vm.get_index_blueprint(),t=e.length-i.length,n=0;n<t;n++)i.push([]);print("重新設定了index")},new_line:function(){if("load"!=vm.action){var e=this.get_blueprint(),i=vm.get_index_blueprint();remove_start(),e.line||(e.line=[]);var t=vm.get_default_color(e.line.length),n=line_json("未命名",t);n.metro.push(metro_json("總站")),e.line.push(n),i.push({check:!1}),vm.action="new_line",vm.更新藍圖(e.key,e)}},find_line_index:function(e,i){for(var t=0;t<i.line.length;t++)if(i.line[t]._key==e)return t},move_line:function(e){var i=vm.get_blueprint(),t=vm.find_line_index(e,i);if(void 0!=t){if(0==t){var n=i.line;vm.delete_blueprint(i.key,"move_delete")}else{var n=i.line.splice(t,1);if(vm.get_index_blueprint().splice(t,1),vm.index_line>=t){var o=vm.index_line-1;o<0&&(o=0),vm.index_line=o}vm.update_metro_key(vm.get_index_line()),vm.更新藍圖(i.key,i)}return n}},delete_line:function(e,i){function t(){if(1==n.line.length)vm.delete_blueprint(n.key,"line_one_delete");else{if(n.line.splice(o,1),vm.get_index_blueprint().splice(o,1),vm.index_line>=o){var t=vm.index_line-1;t<0&&(t=0),vm.index_line=t}vm.update_metro_key(vm.get_index_line()),vm.action="delete_line",vm.更新藍圖(n.key,n),"move_delete"==i||vm.delete_info_line(e)}$("#line_delete_button").off("click"),$("#line_delete_modal").modal("hide"),$(document).off("keydown.line_delete")}var n=vm.get_blueprint(),o=vm.find_line_index(e,n);if(void 0!=o)if("move_delete"==i||"metro_one_delete"==i)t();else{$(".ui.modal").modal("refresh"),setTimeout(function(){$("#line_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var r=n.line[o].color;$("#line_delete_modal").css("borderTopColor",r),$("#line_delete_button").css("backgroundColor",r),$("#line_delete_button").off("click").on("click",t)}},get_line_key:function(){return vm.get_line()._key},new_metro:function(e){var i=metro_json("未命名"),t=JSON.parse(JSON.stringify(this.get_blueprint()));t.line[vm.index_line].metro.splice(e,0,i),vm.action="new_metro",remove_start(),this.更新藍圖(t.key,t)},check_metro:function(e){if(vm.key_metro==e)return"active"},exchange_metro:function(e){this.key_metro=e},find_metro_index:function(e,i){for(var t=i.line[this.index_line].metro,n=0;n<t.length;n++)if(t[n]._key==e)return n},move_metro:function(e,i){var t,n=this.get_blueprint(),o=n.line[this.index_line].metro;if(o.length<=1)t=function(){vm.delete_line(n.line[vm.index_line]._key,"move_delete")};else{var r=vm.find_metro_index(e,n);if(void 0==r)return;var o=o.splice(r,1);if(this.key_metro==e){var l=r-1;l<0&&(l=0);var _=n.line[this.index_line].metro[l]._key;this.key_metro=_}}return DB.ref("info/"+n.line[this.index_line]._key+"/metro").child(e).once("value",function(o){DB.ref("info/"+vm.get_blueprint().line[i]._key+"/metro/"+e).set(o.val()),DB.ref("info/"+n.line[vm.index_line]._key+"/metro").child(e).remove(),t&&setTimeout(t,5)}),o},delete_metro:function(e){function i(){if(t.line[vm.index_line].metro.length<=1)vm.delete_line(t.line[vm.index_line]._key,"metro_one_delete");else{if(t.line[vm.index_line].metro.splice(n,1),vm.key_metro==e){var i=n-1;i<0&&(i=0);var o=t.line[vm.index_line].metro[i]._key;vm.key_metro=o}vm.action="delete_metro",vm.更新藍圖(t.key,t),DB.ref("info/"+t.line[vm.index_line]._key+"/metro").child(e).remove()}}var t=JSON.parse(JSON.stringify(this.get_blueprint())),n=vm.find_metro_index(e,t);if(void 0!=n){$(".ui.modal").modal("refresh"),setTimeout(function(){$("#metro_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var o=vm.line_color;$("#metro_delete_modal").css("borderTopColor",o),$("#metro_delete_button").css("backgroundColor",o),$("#metro_delete_button").off("click").on("click",function(){i(),$("#metro_delete_button").off("click"),$("#metro_delete_modal").modal("hide")})}},swap_metro:function(e,i){function t(e){for(var i=0;i<o.length;i++)if(o[i]._key==e)return i}if(e!=i){var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=n.line[this.index_line].metro,r=[];$("#top_tag li").each(function(){var e=t($(this).data("key"));r.push(o[e])}),n.line[this.index_line].metro=r,vm.action="swap_metro",vm.更新藍圖(n.key,n)}},get_metro:function(){for(var e=this.get_line(),i=vm.key_metro,t=(e.metro,0),n=0;n<e.metro.length;n++)if(e.metro[n]._key==i){t=n;break}return e.metro[t]},paste_info:function(e){e.update_timestamp=firebase.database.ServerValue.TIMESTAMP,e.timestamp=firebase.database.ServerValue.TIMESTAMP,delete e[".key"],this.save_info(e)},new_info:function(){var e=$.trim($("#board_textarea").val());if(""!=e){var i={message:e,favorite:!1,url_info:"",update_timestamp:firebase.database.ServerValue.TIMESTAMP,timestamp:firebase.database.ServerValue.TIMESTAMP,users:user_uid,file_id:$("#uploadFileParent").data("file_id")||"",file_url:$("#uploadFileParent").data("file_url")||"",file_name:$("#uploadFileParent").data("file_name")||""};if(clear_uploadFile(),vm.url_info&&(i.url_info=vm.url_info),remove_start(),0==$("#top_tag").find("[data-key='"+vm.key_metro+"']").length)return vm.exchange_line(0),vm.exchange_line(1),void print("目前不在任何地鐵上");vm.url_info=void 0,$("#board_textarea").val("").keyup();for(var t in i.url_info)i.url_info.hasOwnProperty(t)&&void 0==i.url_info[t]&&(i.url_info[t]="");this.save_info(i)}},save_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(e,function(i){i&&i.toString().indexOf("Permission denied")>-1&&(set_line_root(vm.get_line_key(),user_uid),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(e),setTimeout(function(){print("未發現root，重新寫入root"),location.reload()},0))})},delete_info_direct:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove()},delete_info:function(e,i){var t=$(i.target).closest(".board_list");if(!t.hasClass("edit")){var n=t.find("._modal_info");n.length||(n=t.append(delete_modal_html(vm.line_color))),n.dimmer({duration:{show:400,hide:0}}).dimmer("show"),n.find(".send").off("click").on("click",function(){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove(),n.dimmer("hide")}),n.find(".cancel").off("click").on("click",function(){n.dimmer("hide")})}},delete_info_line:function(e){DB.ref("info/"+e+"/metro").remove(),DB.ref("info/"+e+"/root").remove()},favorite_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e[".key"]).update({favorite:!e.favorite,update_timestamp:firebase.database.ServerValue.TIMESTAMP})},edit_info:function(e,i,t){var n=$(t.target).closest(".board_list");if(n.hasClass("edit"))return!1;if(vm.leave_edit_info(),"dbl"==i&&1!=vm.mode)return!1;$("html").addClass("re_name");var o=e[".key"];n.addClass("edit");var r=n.find("textarea");r.val(e.message).focus(),r.on("keyup.textarea",function(e){auto_height2(this),27==e.keyCode&&vm.leave_edit_info(n)}).keyup(),r.on("paste",function(){e.url_info||textarea_paste2(r[0],e)}),n.find("button.send").one("click",function(){e.url_info||(e.url_info="");var i=$.trim(r.val());vm.leave_edit_info(n),setTimeout(function(){n.velocity("scroll",{duration:500,offset:-250})},50),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(o).update({message:i,url_info:e.url_info,update_timestamp:firebase.database.ServerValue.TIMESTAMP})}),n.find("button.cancel").one("click",function(){vm.leave_edit_info(n)})},leave_edit_info:function(e){$(document).one("click",function(){$("html").removeClass("re_name")}),e?(e.removeClass("edit"),e.off("keyup.textarea").off("paste"),e.find("button").off("click")):($(".board_list").removeClass("edit"),$("#board_info textarea").off("keyup.textarea").off("paste"),$("#board_info .textarea button").off("click"))},edit_name:function(e,i){function t(){$(document).off("click."+i+"_board"),n.off("keydown"),$("#border_"+i+"_name").show(),n.hide()}$("#border_"+i+"_name").hide();var n=$("#board_"+i+"_textarea");if(n.show(),n.focus(),"line"==i)var o=vm.get_line();else if("metro"==i)var o=vm.get_metro();var r=o.name;n.val(o.name),auto_height2(n[0]),n.on("keydown",function(e){if(auto_height2(n[0]),13==e.which||e.shiftKey&&13==e.which){if(e.preventDefault(),o.name=$.trim(n.val().replace(/  +/g," ")),r==o.name)return;"line"==i&&vm.set_總站(o.name,r),vm.action="re_name",vm.更新藍圖(),t()}else 27==e.which&&t()}),$(document).on("click."+i+"_board",function(e){e.target.id!="board_"+i+"_textarea"&&t()})},"set_總站":function(e,i){var t=vm.get_line().metro;1!=t.length||"總站"!=t[0].name&&t[0].name!=i||(t[0].name=e)},re_name:function(e,i,t){function n(){return"blueprint"==i?vm.blueprint[e]:"line"==i?vm.get_blueprint().line[e]:"metro"==i?vm.get_line().metro[e]:void 0}function o(){$(document).one("click",function(){$("html").removeClass("re_name")}),r.removeClass("edit"),sortable[i]&&sortable[i].option("disabled",!1),m.off("keyup."+i+"_input"),$(document).off("click."+i+"_input")}if(!$(t.target).hasClass("blueprint_i")){$("html").addClass("re_name");var r=$(t.target).closest("."+i+"_list");r.addClass("edit");var l=i;sortable[l]&&sortable[l].option("disabled",!0);var _=n().name,m=r.find("."+i+"_input");m.select().on("keyup."+i+"_input",function(e){if(13==e.which){if(o(),""==n().name)return void(n().name=_);if(_==n().name)return;"line"==i&&vm.set_總站(n().name,_),vm.action="re_name",vm.更新藍圖()}else 27==e.which&&(o(),n().name=_)}),setTimeout(function(){$(document).on("click."+i+"_input",function(e){e.target.className.indexOf(""+i+"_input")==-1&&(o(),n().name=_)})},5)}},get_default_color:function(e){var i=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][e];return i?i:"#000000"},open_color:function(e,i){if(0==vm.mode)return void vm.exchange_line(e);if("Y"==$("#left_color").attr("show"))return $(".colpick_submit").off("click.op"),void $("#left_color").attr("show","");i=i.split("#")[1];var t=$(event.target),n=t.offset().left,o=t.offset().top+t.height()+2;$("#left_color").css({left:n,top:o}).colpickSetColor(i).colpickShow(),$("#left_color").attr("show","Y"),$(".colpick_submit").off("click.op").on("click.op",function(){vm.get_blueprint().line[e].color="#"+$("#left_color").val(),vm.action="edit_color",vm.更新藍圖(),$("#left_color").attr("show",""),$(this).off("click.op")})},swap_blueprint:function(e,i){},swap_line:function(e,i){function t(e){for(var i=0;i<n.line.length;i++)if(n.line[i]._key==e)return i}if(e!=i){var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=[],r=[];$("#line_drag li").each(function(){var e=t($(this).data("key"));o.push(n.line[e]),r.push(vm.index[vm.index_blueprint][e])}),n.line=o,vm.index[vm.index_blueprint]=r,vm.update_index_line(r),vm.action="swap_line",vm.更新藍圖(n.key,n)}}}});