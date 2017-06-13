var vm=new Vue({el:"#main",data:{blueprint:[],index:[],index_blueprint:0,index_line:0,info_active:"",key_metro:"",action:"load",action_move:0,info:[],users:[],mode:1,pick_master:void 0,pick_color:void 0,url_info:void 0,filter_search:"",is_nav:!1,search_info:[],search_metro:[],drag_line_key:"",drag_metro_key:""},mounted:function(){$("#main").css("visibility","visible")},updated:function(){setTimeout(function(){$(window).resize()},0),$("#board_info .ui.active").show(),1==vm.action_move&&setTimeout(move_center,0)},firebase:{},computed:{master_line_color:function(){return 0==this.blueprint.length?"":this.pick_color&&this.pick_master?this.pick_color:this.get_blueprint().line[0].color},line:function(){return 0==this.blueprint.length?"":this.get_blueprint().line},line_color:function(e){return 0==this.blueprint.length?"":this.pick_color&&!this.pick_master?this.pick_color:this.get_line().color},metro:function(){if(0==this.blueprint.length)return"";var e=this.get_line();return void 0==e&&vm.exchange_line(0),e.metro},line_name:function(){return 0==this.blueprint.length?"":this.get_line().name},metro_name:function(){return 0==this.blueprint.length?"":this.get_metro().name},metro_create:function(){if(0==this.blueprint.length)return"";var e=this.get_metro().timestamp;return void 0==e?"":moment(e).format("lll")},info_count:function(){return 0==this.blueprint.length?"":this.info.length},info_favorites:function(){var e=this.info.filter(function(e){return!!e.favorite&&!!e.url_info});return 0!=e.length&&e},info_sort_filter:function(){if(0==this.blueprint.length)return"";var e=this.info;vm.filter_search&&(e=e.filter(function(e){return e.message.indexOf(vm.filter_search)>-1}));for(var t=[],i=[],n=0;n<e.length;n++)e[n].favorite?t.push(e[n]):i.push(e[n]);return[].concat(i,t)}},filters:{message_filter:function(e){return e=e.replace(/\</g,"&lt;"),e=e.replace(/\>/g,"&gt;"),e=urlify(e),e=e.replace(/(?:\r\n|\r|\n)/g,"<br/>"),e=e.replace(/ /g,"&nbsp;"),e=e.replace(/\<a&nbsp;href=/g,"<a href="),setTimeout(function(){$("#board_info .info_message").find("a").css("color",vm.line_color).attr("target","_blank")},5),e}},watch:{info_active:function(){var e=this.get_index_line();e.info_active||(e.info_active=[]),e.info_active[vm.key_metro]=this.info_active||"",vm.index_update()},key_metro:function(){var e=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByChild("update_timestamp");vm.$bindAsArray("info",e);var t=this.get_index_line();if(t.key_metro=this.key_metro,t.info_active){var i=t.info_active[this.key_metro];this.info_active=i}else vm.index_update();vm.leave_edit_info(),e.on("child_added",function(e){setTimeout(function(){$("#board_info .dropdown").dropdown("destroy").dropdown()},5)})}},methods:{get_youtube_embed:function(e){return e.url_info&&e.url_info.youtube?(setTimeout(function(){$("#"+e[".key"]).find(".ui.embed:not(.active)").embed()},5),"flex_youtube"):""},get_favorite_style:function(e,t){return e?{color:t}:{}},is_master:function(){return 0==this.blueprint.length?"":0==vm.index_line},color_gradient:function(e){return"linear-gradient(to right, #000 50%, "+e+" 0%)"},mode_txt:function(){if(!sortable.blueprint){if(0==this.mode)return"一般模式";if(1==this.mode)return"編輯模式"}return 0==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!0),sortable.line.option("disabled",!0)},5),"一般模式"):1==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!1),sortable.line.option("disabled",!1)},5),"編輯模式"):1.5==this.mode?"編輯模式":void 0},mode_click:function(){var e=this.mode;e=Math.floor(e+1),e>1&&(e=0),this.mode=e},mode_class:function(){return 0==this.mode?"male":1==this.mode?"configure":1.5==this.mode?"trash":void 0},index_update:function(){var e=JSON.parse(JSON.stringify(vm.index));setTimeout(function(){DB.ref("users_data/"+user_uid+"/index").set(e)},0)},"更新藍圖":function(e,t){void 0!=e&&void 0!=t||(t=vm.get_blueprint(),e=t.key),setTimeout(function(){DB.ref("blueprint/"+user_uid+"/"+e).set(t)},0)},get_blueprint:function(e){return void 0!=e?this.blueprint[e]:this.blueprint[this.index_blueprint]},get_index_blueprint:function(){return vm.index[vm.index_blueprint]},get_line:function(){return this.get_blueprint().line[this.index_line]},get_index_line:function(){return vm.index[vm.index_blueprint][vm.index_line]},update_index_line:function(e){for(var t=0,i=0;i<e.length;i++)if(e[i]||(e[i]=[],e[i].check=!1),e[i].check){t=i;break}vm.index_line=t},update_index_line_check:function(){for(var e=vm.get_index_blueprint(),t=0;t<e.length;t++)e[t]||(e[t]=[]),e[t].check=!1;e[vm.index_line].check=!0},update_selection_color:function(){var e=vm.line_color;if(!document.getElementById("selection")){var t=document.createElement("style");t.id="selection",t.type="text/css",document.getElementsByTagName("head")[0].appendChild(t)}document.getElementById("selection").innerHTML="::selection {background: "+e+";color: #fff;}::-moz-selection {background: "+e+";color: #fff;}img::selection {background: "+e+";color: #fff;}img::-moz-selection {background: "+e+";color: #fff;}"},update_metro_key:function(e){var t=this.get_line().metro,i=!1;if(e.key_metro){for(var n=0;n<t.length;n++)if(t[n]._key==e.key_metro){vm.key_metro=t[n]._key,i=!0;break}i||(vm.key_metro=t[0]._key)}else vm.key_metro=t[0]._key},new_blueprint:function(){if("load"!=vm.action){vm.action="new_blueprint";var e=DB.ref("blueprint/"+user_uid).push(),t=[];t.push(line_json("橘線","#FF6900",!0)),t[t.length-1].metro.push(metro_json("總站")),e.set({name:"我的地鐵計畫",line:t,timestamp:firebase.database.ServerValue.TIMESTAMP})}},delete_blueprint:function(e){$(".ui.modal").modal("refresh"),setTimeout(function(){$("#blueprint_delete_modal").modal({inverted:!0,closable:!1}).modal("show")}),$("#blueprint_delete_name").html(vm.get_blueprint().name),$("#blueprint_delete_button").off("dblclick").on("dblclick",function(){for(var t,i=0;i<vm.blueprint.length;i++)if(vm.blueprint[i].key==e){t=i;break}vm.action="delete_blueprint";for(var n=vm.blueprint[t].line,i=0;i<n.length;i++)vm.delete_info_line(n[i]._key);vm.blueprint.length>1?(vm.index.splice(t,1),vm.index_update(),vm.index_line=0,vm.index_blueprint=0,vm.update_index_line(vm.index[vm.index_blueprint]),vm.update_index_line_check(),vm.update_selection_color(),setTimeout(function(){vm.update_metro_key(vm.index[vm.index_blueprint][vm.index_line])},0),DB.ref("blueprint/"+user_uid+"/"+e).remove()):DB.ref("blueprint/"+user_uid+"/"+e).remove().then(function(){vm.index.splice(t,1),vm.index_update(),location.reload()}),$("#blueprint_delete_button").off("click"),$("#blueprint_delete_modal").modal("hide")})},"檢查更新錯誤索引":function(e,t){if(t[e]&&t[e].line.length!=vm.index[e].length){for(var i=t[e].line,n=(vm.index[e],[]),o=0;o<i.length;o++)void 0!=vm.index[e][o]?n.push(vm.index[e][o]):(n.push({check:!1}),n[n.length-1].check=!1);print("重新更新索引"),vm.index[e]=n}},exchange_blueprint:function(e,t,i){if("load"!=vm.action&&vm.index_blueprint==e)return void(i&&$(i.target).hasClass("blueprint_i")&&$(i.target).trigger("customClick"));vm.檢查更新錯誤索引(e,vm.blueprint),e>=vm.blueprint.length&&(e=0),$("#top_tag").stop().fadeOut(0),$.cookie("index_blueprint",e),i&&i.target&&void 0!=i.target.className&&(i.target.className.indexOf("blueprint_a")>-1||i.target.className.indexOf("blueprint_i")>-1)&&(t=!0),t&&(vm.index_blueprint=e,vm.update_index_line(vm.index[e]),vm.update_index_line_check(),vm.update_selection_color(),vm.update_metro_key(vm.index[e][vm.index_line])),vm.action_move=1,setTimeout(move_center,0)},exchange_line:function(e){function t(){vm.index_line=e,vm.get_index_blueprint()[e]||vm.replace_index(),vm.update_index_line_check(),vm.update_selection_color(),vm.update_metro_key(vm.get_index_blueprint()[e]),vm.action_move=1,setTimeout(move_center,0)}if(vm.index_line!=e){if($("#top_tag").stop().fadeOut(0),$("html").hasClass("re_name"))return setTimeout(function(){t()},0);t()}},replace_index:function(){for(var e=vm.get_blueprint().line,t=vm.get_index_blueprint(),i=e.length-t.length,n=0;n<i;n++)t.push([]);print("重新設定了index")},new_line:function(){if("load"!=vm.action){var e=this.get_blueprint(),t=vm.get_index_blueprint();remove_start(),e.line||(e.line=[]);var i=vm.get_default_color(e.line.length),n=line_json("未命名",i);n.metro.push(metro_json("總站")),e.line.push(n),t.push({check:!1}),vm.action="new_line",vm.更新藍圖(e.key,e)}},find_line_index:function(e,t){for(var i=0;i<t.line.length;i++)if(t.line[i]._key==e)return i},move_line:function(e){var t=vm.get_blueprint(),i=vm.find_line_index(e,t);if(void 0!=i){var n=t.line.splice(i,1);if(vm.get_index_blueprint().splice(i,1),vm.index_line>=i){var o=vm.index_line-1;o<0&&(o=0),vm.index_line=o}return vm.update_metro_key(vm.get_index_line()),vm.更新藍圖(t.key,t),n}},delete_line:function(e){function t(){if(i.line.splice(n,1),vm.get_index_blueprint().splice(n,1),vm.index_line>=n){var t=vm.index_line-1;t<0&&(t=0),vm.index_line=t}vm.update_metro_key(vm.get_index_line()),vm.action="delete_line",vm.更新藍圖(i.key,i),vm.delete_info_line(e),$("#line_delete_button").off("click"),$("#line_delete_modal").modal("hide"),$(document).off("keydown.line_delete")}var i=vm.get_blueprint(),n=vm.find_line_index(e,i);if(void 0!=n){$(".ui.modal").modal("refresh"),setTimeout(function(){$("#line_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var o=i.line[n].color;$("#line_delete_modal").css("borderTopColor",o),$("#line_delete_button").css("backgroundColor",o),$(document).on("keydown.line_delete",function(e){13==e.which?t():27==e.which&&($("#line_delete_modal").modal("hide"),$("#line_delete_button").off("click"),$(document).off("keydown.line_delete"))}),$("#line_delete_button").off("click").on("click",t)}},get_line_key:function(){return vm.get_line()._key},new_metro:function(e){var t=metro_json("未命名"),i=JSON.parse(JSON.stringify(this.get_blueprint()));i.line[vm.index_line].metro.splice(e,0,t),vm.action="new_metro",remove_start(),this.更新藍圖(i.key,i)},check_metro:function(e){if(vm.key_metro==e)return"active"},exchange_metro:function(e){this.key_metro=e},find_metro_index:function(e,t){for(var i=t.line[this.index_line].metro,n=0;n<i.length;n++)if(i[n]._key==e)return n},move_metro:function(e,t){var i=this.get_blueprint();if(!(i.line[this.index_line].metro.length<=1)){var n=vm.find_metro_index(e,i);if(void 0!=n){var o=i.line[this.index_line].metro.splice(n,1);if(this.key_metro==e){var r=n-1;r<0&&(r=0);var l=i.line[this.index_line].metro[r]._key;this.key_metro=l}return DB.ref("info/"+i.line[this.index_line]._key+"/metro").child(e).once("value",function(n){DB.ref("info/"+vm.get_blueprint().line[t]._key+"/metro/"+e).set(n.val()),DB.ref("info/"+i.line[vm.index_line]._key+"/metro").child(e).remove()}),o}}},delete_metro:function(e){function t(){if(i.line[vm.index_line].metro.splice(n,1),vm.key_metro==e){var t=n-1;t<0&&(t=0);var o=i.line[vm.index_line].metro[t]._key;vm.key_metro=o}vm.action="delete_metro",vm.更新藍圖(i.key,i),DB.ref("info/"+i.line[vm.index_line]._key+"/metro").child(e).remove()}var i=JSON.parse(JSON.stringify(this.get_blueprint()));if(!(i.line[this.index_line].metro.length<=1)){var n=vm.find_metro_index(e,i);if(void 0!=n){$(".ui.modal").modal("refresh"),setTimeout(function(){$("#metro_delete_modal").modal({inverted:!0,closable:!1}).modal("show")},0);var o=vm.line_color;$("#metro_delete_modal").css("borderTopColor",o),$("#metro_delete_button").css("backgroundColor",o),$("#metro_delete_button").off("click").on("click",function(){t(),$("#metro_delete_button").off("click"),$("#metro_delete_modal").modal("hide")})}}},swap_metro:function(e,t){function i(e){for(var t=0;t<o.length;t++)if(o[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=n.line[this.index_line].metro,r=[];$("#top_tag li").each(function(){var e=i($(this).data("key"));r.push(o[e])}),n.line[this.index_line].metro=r,vm.action="swap_metro",vm.更新藍圖(n.key,n)}},get_metro:function(){for(var e=this.get_line(),t=vm.key_metro,i=(e.metro,0),n=0;n<e.metro.length;n++)if(e.metro[n]._key==t){i=n;break}return e.metro[i]},new_info:function(){var e=$.trim($("#board_textarea").val());if(""!=e){var t={message:e,favorite:!1,url_info:"",update_timestamp:firebase.database.ServerValue.TIMESTAMP,timestamp:firebase.database.ServerValue.TIMESTAMP,users:user_uid,file_id:$("#uploadFileParent").data("file_id")||"",file_url:$("#uploadFileParent").data("file_url")||"",file_name:$("#uploadFileParent").data("file_name")||""};if(clear_uploadFile(),vm.url_info&&(t.url_info=vm.url_info),remove_start(),0==$("#top_tag").find("[data-key='"+vm.key_metro+"']").length)return vm.exchange_line(0),vm.exchange_line(1),void print("目前不在任何地鐵上");vm.url_info=void 0,$("#board_textarea").val("").keyup(),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(t,function(e){e&&e.toString().indexOf("Permission denied")>-1&&(set_line_root(vm.get_line_key(),user_uid),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(t),setTimeout(function(){print("未發現root，重新寫入root"),location.reload()},0))})}},delete_info:function(e,t){var i=$(t.target).closest(".board_list");i.hasClass("edit")||($delete_info=i.find("._delete_info"),$delete_info.dimmer({duration:{show:400,hide:0}}).dimmer("show"),$delete_info.find(".send").off("click").on("click",function(){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove(),$delete_info.dimmer("hide")}),$delete_info.find(".cancel").off("click").on("click",function(){$delete_info.dimmer("hide")}))},delete_info_line:function(e){DB.ref("info/"+e+"/metro").remove(),DB.ref("info/"+e+"/root").remove()},favorite_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e[".key"]).update({favorite:!e.favorite,update_timestamp:firebase.database.ServerValue.TIMESTAMP})},edit_info:function(e,t,i){var n=$(i.target).closest(".board_list");if(n.hasClass("edit"))return!1;if(vm.leave_edit_info(),"dbl"==t&&1!=vm.mode)return!1;$("html").addClass("re_name");var o=e[".key"];n.addClass("edit");var r=n.find("textarea");r.val(e.message).focus(),r.on("keyup.textarea",function(e){auto_height2(this),27==e.keyCode&&vm.leave_edit_info(n)}).keyup(),r.on("paste",function(){e.url_info||textarea_paste2(r[0],e)}),n.find("button.send").one("click",function(){e.url_info||(e.url_info="");var t=$.trim(r.val());vm.leave_edit_info(n),setTimeout(function(){n.velocity("scroll",{duration:500,offset:-250})},50),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(o).update({message:t,url_info:e.url_info,update_timestamp:firebase.database.ServerValue.TIMESTAMP})}),n.find("button.cancel").one("click",function(){vm.leave_edit_info(n)})},leave_edit_info:function(e){$(document).one("click",function(){$("html").removeClass("re_name")}),e?(e.removeClass("edit"),e.off("keyup.textarea").off("paste"),e.find("button").off("click")):($(".board_list").removeClass("edit"),$("#board_info textarea").off("keyup.textarea").off("paste"),$("#board_info .textarea button").off("click"))},edit_name:function(e,t){function i(){$(document).off("click."+t+"_board"),n.off("keydown"),$("#border_"+t+"_name").show(),n.hide()}$("#border_"+t+"_name").hide();var n=$("#board_"+t+"_textarea");if(n.show(),n.focus(),"line"==t)var o=vm.get_line();else if("metro"==t)var o=vm.get_metro();n.val(o.name),auto_height2(n[0]),n.on("keydown",function(e){auto_height2(n[0]),13==e.which||e.shiftKey&&13==e.which?(e.preventDefault(),o.name=$.trim(n.val().replace(/  +/g," ")),vm.action="re_name",vm.更新藍圖(),i()):27==e.which&&i()}),$(document).on("click."+t+"_board",function(e){e.target.id!="board_"+t+"_textarea"&&i()})},re_name:function(e,t,i,n){function o(){return"blueprint"==t?vm.blueprint[e]:"line"==t?vm.get_blueprint().line[e]:"metro"==t?vm.get_line().metro[e]:void 0}function r(){$(document).one("click",function(){$("html").removeClass("re_name")}),l.removeClass("edit"),sortable[t]&&sortable[t].option("disabled",!1),m.off("keyup."+t+"_input"),$(document).off("click."+t+"_input")}if(!$(i.target).hasClass("blueprint_i")){$("html").addClass("re_name");var l=$(i.target).closest("."+t+"_list");l.addClass("edit");var a=t;"master"==n&&(a="line_master"),sortable[a]&&sortable[a].option("disabled",!0);var _=o().name,m=l.find("."+t+"_input");m.select().on("keyup."+t+"_input",function(e){if(13==e.which){if(r(),""==o().name)return void(o().name=_);vm.action="re_name",vm.更新藍圖()}else 27==e.which&&(r(),o().name=_)}),setTimeout(function(){$(document).on("click."+t+"_input",function(e){-1==e.target.className.indexOf(t+"_input")&&(r(),o().name=_)})},5)}},get_default_color:function(e){var t=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][e];return t||"#000000"},open_color:function(e,t,i){t=t.split("#")[1];var n=$(event.target),o=n.offset().left,r=n.offset().top+n.height()+2;vm.pick_master=i,$("#left_color").css({left:o,top:r}).colpickSetColor(t).colpickShow(),$(".colpick_submit").off("click.op").on("click.op",function(){vm.get_blueprint().line[e].color="#"+$("#left_color").val(),vm.action="edit_color",vm.更新藍圖(),$(this).off("click.op")})},swap_blueprint:function(e,t){},swap_line:function(e,t){function i(e){for(var t=0;t<n.line.length;t++)if(n.line[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=[],r=[];$("#line_drag li").each(function(){var e=i($(this).data("key"));o.push(n.line[e]),r.push(vm.index[vm.index_blueprint][e])}),n.line=o,vm.index[vm.index_blueprint]=r,vm.update_index_line(r),vm.action="swap_line",vm.更新藍圖(n.key,n)}}}});