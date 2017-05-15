var vm=new Vue({el:"#main",data:{blueprint:[],index:[],index_blueprint:0,index_line:-1,key_metro:"",action:"load",info:[],users:[],mode:1,pick_master:void 0,pick_color:void 0,url_info:void 0,filter_search:""},mounted:function(){$("#main").css("visibility","visible")},updated:function(){setTimeout(function(){$(window).resize()},0),$("#board_info .ui.active").show()},firebase:{},computed:{master_line_color:function(){return 0!=this.blueprint.length&&(this.pick_color&&this.pick_master?this.pick_color:this.get_blueprint().line[0].color)},line:function(){return 0!=this.blueprint.length&&this.get_blueprint().line},line_name:function(){return 0==this.blueprint.length?"":this.get_line().name},line_color:function(){return 0==this.blueprint.length?"":this.pick_color&&!this.pick_master?this.pick_color:this.get_line().color},metro:function(){return 0!=this.blueprint.length&&this.get_line().metro},metro_name:function(){return 0==this.blueprint.length?"":this.get_metro().name},metro_create:function(){if(0==this.blueprint.length)return"";var e=this.get_metro().timestamp;return void 0==e?"":moment(e).format("lll")},info_count:function(){return 0==this.blueprint.length?"":this.info.length},info_favorites:function(){var e=this.info.filter(function(e){return!!e.favorite&&!!e.url_info});return 0!=e.length&&e},info_sort_filter:function(){var e=this.info.sort(function(e,t){return e.timestamp>t.timestamp?1:-1});return e=e.sort(function(e,t){return e.favorite?-1:1}),e.filter(function(e){return e.message.indexOf(vm.filter_search)>-1})}},filters:{message_filter:function(e){return e=e.replace(/\</g,"&lt;"),e=e.replace(/\>/g,"&gt;"),e=urlify(e),e=e.replace(/(?:\r\n|\r|\n)/g,"<br/>"),e=e.replace(/ /g,"&nbsp;"),e=e.replace(/\<a&nbsp;href=/g,"<a href="),setTimeout(function(){$("#board_info .info_message").find("a").css("color",vm.line_color).attr("target","_blank")},5),e}},watch:{key_metro:function(){var e=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByKey();vm.$bindAsArray("info",e);var t=this.index[this.index_blueprint][this.index_line];t.key_metro=this.key_metro,vm.index_update(),vm.leave_edit_info()}},methods:{get_favorite_style:function(e,t){return e?{color:t}:{}},is_master:function(){return 0==this.blueprint.length?"":0==vm.index_line},color_gradient:function(e){return"linear-gradient(to right, #000 50%, "+e+" 0%)"},mode_txt:function(){if(sortable.blueprint)return 0==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!0)},5),"一般模式"):1==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!1)},5),"編輯模式"):1.5==this.mode?"編輯模式":2==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!0)},5),"導覽模式"):void 0},mode_click:function(){var e=this.mode;e=Math.floor(e+1),e>1&&(e=0),this.mode=e},mode_class:function(){return 0==this.mode?"male":1==this.mode?"configure":1.5==this.mode?"trash":2==this.mode?"help circle outline":void 0},index_update:function(){DB.ref("users_data/"+user_uid+"/index").set(vm.index)},"更新藍圖":function(e,t,i){void 0!=e&&void 0!=t||(t=vm.get_blueprint(),e=t.key),DB.ref("blueprint/"+user_uid+"/"+e).update(t).then(i)},get_blueprint:function(e){return void 0!=e?this.blueprint[e]:this.blueprint[this.index_blueprint]},get_index_blueprint:function(){return vm.index[vm.index_blueprint]},get_line:function(){var e=this.get_blueprint();return e.line[this.index_line]},get_index_line:function(){return vm.index[vm.index_blueprint][vm.index_line]},update_index_line:function(e){for(var t=0,i=0;i<e.length;i++)if(e[i].check){t=i;break}vm.index_line=t},update_index_blueprint_line_check:function(){for(var e=vm.get_index_blueprint(),t=0;t<e.length;t++)e[t].check=!1;e[vm.index_line].check=!0;var i=vm.line_color;if(!document.getElementById("selection")){var n=document.createElement("style");n.id="selection",n.type="text/css",document.getElementsByTagName("head")[0].appendChild(n)}document.getElementById("selection").innerHTML="::selection {background: "+i+";color: #fff;}::-moz-selection {background: "+i+";color: #fff;}img::selection {background: "+i+";color: #fff;}img::-moz-selection {background: "+i+";color: #fff;}"},update_metro_key:function(e){var t=this.get_line().metro;if(e.key_metro){for(var i=0;i<t.length;i++)if(t[i]._key==e.key_metro){vm.key_metro=t[i]._key;break}}else vm.key_metro=t[0]._key},new_blueprint:function(){vm.action="new_blueprint";var e=DB.ref("blueprint/"+user_uid).push(),t=[];t.push(line_json("橘線","#FF6900",!0)),t[t.length-1].metro.push(metro_json("總站")),e.set({name:"我的地鐵計畫",line:t})},delete_blueprint:function(e,t){$("#blueprint_delete_modal").modal({inverted:!0,closable:!1}).modal("show"),$("#blueprint_delete_button").off("click").on("click",function(){vm.action="delete_blueprint";for(var i=vm.blueprint[t].line,n=0;n<i.length;n++)vm.delete_info_line(i[n]._key);if(vm.index.splice(t,1),vm.index_blueprint>=t){var o=t-1;o<0&&(o=0),vm.index_blueprint=o}DB.ref("blueprint/"+user_uid+"/"+e).remove(),$(this).off("click"),$("#blueprint_delete_modal").modal("hide")})},exchange_blueprint:function(e,t){function i(){n&&n.target&&void 0!=n.target.className&&(n.target.className.indexOf("blueprint_a")>-1||n.target.className.indexOf("blueprint_i")>-1)&&(t=!0),t&&(vm.index_blueprint=e,vm.update_index_line(vm.index[e]),vm.update_index_blueprint_line_check(),vm.update_metro_key(vm.index[e][vm.index_line])),setTimeout(move_center,0)}if(void 0!=event&&!$(event.target).hasClass("blueprint_i")){$("#top_tag").stop().fadeOut(0),$.cookie("index_blueprint",e);var n=event;return $("html").hasClass("re_name")?setTimeout(function(){i()},0):void i()}},check_blueprint:function(e){if(this.index_blueprint==e)return"check"},exchange_line:function(e){function t(){vm.index_line=e,vm.get_index_blueprint()[e]||vm.replace_index(),vm.update_index_blueprint_line_check(),vm.update_metro_key(vm.get_index_blueprint()[e]),setTimeout(move_center,0)}if(vm.index_line!=e)return $("#top_tag").stop().fadeOut(0),$("html").hasClass("re_name")?setTimeout(function(){t()},0):void t()},replace_index:function(){var e=vm.get_blueprint().line,t=vm.get_index_blueprint(),i=e.length-t.length;print("重新設定index");for(var n=0;n<i;n++)t.push([])},check_line:function(e){if(this.index_line==e)return"check"},new_line:function(){vm.action="new_line";var e=this.get_blueprint();e.line||(e.line=[]);var t=vm.get_default_color(e.line.length),i=line_json("未命名",t);i.metro.push(metro_json("總站")),e.line.push(i),vm.get_index_blueprint().push([]),this.更新藍圖(e.key,e)},delete_line:function(e){$("#line_delete_modal").modal({inverted:!0,closable:!1}).modal("show"),$("#line_delete_button").off("click").on("click",function(){var t=vm.get_blueprint(),i=t.line[e]._key;if(t.line.splice(e,1),vm.index_line>=e){var n=e-1;n<0&&(n=0),vm.index_line=n}vm.get_index_blueprint().splice(e,1),vm.update_metro_key(vm.get_index_line()),vm.更新藍圖(t.key,t),vm.delete_info_line(i),$(this).off("click"),$("#line_delete_modal").modal("hide")})},get_line_key:function(){return vm.get_line()._key},new_metro:function(e){var t=metro_json("未命名"),i=JSON.parse(JSON.stringify(this.get_blueprint()));i.line[vm.index_line].metro.splice(e,0,t),this.更新藍圖(i.key,i),setTimeout(move_center,0)},check_metro:function(e){if(vm.key_metro==e){var t=this.get_line().color;return"background-color: "+t}},exchange_metro:function(e){this.key_metro=e},move_metro:function(e){var t=this.get_blueprint(),i=t.line[this.index_line].metro[e]._key;if(!(t.line[this.index_line].metro.length<=1)){var n=t.line[this.index_line].metro.splice(e,1);if(this.key_metro==i){var o=e-1;o<0&&(o=0);var r=t.line[this.index_line].metro[o]._key;this.key_metro=r}return n}},delete_metro:function(e){var t=JSON.parse(JSON.stringify(this.get_blueprint())),i=t.line[this.index_line].metro[e]._key;if(!(t.line[this.index_line].metro.length<=1)){if(t.line[this.index_line].metro.splice(e,1),this.key_metro==i){var n=e-1;n<0&&(n=0);var o=t.line[this.index_line].metro[n]._key;this.key_metro=o}this.更新藍圖(t.key,t),DB.ref("info/"+t.line[this.index_line]._key+"/metro").child(i).remove()}},get_metro:function(){for(var e=this.get_line(),t=vm.key_metro,i=(e.metro,0),n=0;n<e.metro.length;n++)if(e.metro[n]._key==t){i=n;break}return e.metro[i]},new_info:function(){var e=$.trim($("#board_textarea").val());if(""!=e){var t={message:e,favorite:!1,url_info:"",timestamp:firebase.database.ServerValue.TIMESTAMP,users:user_uid};vm.url_info&&(t.url_info=vm.url_info),vm.url_info=void 0,$("#board_textarea").val(""),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(t)}},delete_info:function(e){var t=$(event.target).closest(".board_list");t.hasClass("edit")||($delete_info=t.find("._delete_info"),$delete_info.dimmer({duration:{show:400,hide:0}}).dimmer("show"),$delete_info.find(".send").off("click").on("click",function(){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove(),$delete_info.dimmer("hide")}),$delete_info.find(".cancel").off("click").on("click",function(){$delete_info.dimmer("hide")}))},delete_info_line:function(e){DB.ref("info/"+e+"/metro").remove(),DB.ref("info/"+e+"/root").remove()},favorite_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e[".key"]).update({favorite:!e.favorite})},edit_info:function(e){$("html").addClass("re_name");var t=e[".key"],i=$(event.target).closest(".board_list");i.addClass("edit");var n=i.find("textarea");n.val(e.message).focus(),$(document.body).on("keyup.textarea",function(e){27==e.keyCode&&vm.leave_edit_info(i)}),n.off("paste").on("paste",function(){e.url_info||textarea_paste2(n[0],e)}),i.find("button.send").one("click",function(){e.url_info||(e.url_info="");var o=$.trim(n.val());vm.leave_edit_info(i),n.off("paste"),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(t).update({message:o,url_info:e.url_info,update_timestamp:firebase.database.ServerValue.TIMESTAMP})}),i.find("button.cancel").one("click",function(){vm.leave_edit_info(i),n.off("paste")})},leave_edit_info:function(e){$(".board_list").hasClass("edit")&&($(document).one("click",function(){$("html").removeClass("re_name")}),e?e.removeClass("edit"):$(".board_list").removeClass("edit"),$(document.body).off("keyup.textarea"))},re_name:function(e,t){function i(){return"blueprint"==t?vm.blueprint[e]:"line"==t?vm.get_blueprint().line[e]:"metro"==t?vm.get_line().metro[e]:void 0}function n(){$(document).one("click",function(){$("html").removeClass("re_name")}),o.removeClass("edit"),sortable[t]&&sortable[t].option("disabled",!1),l.off("keyup."+t+"_input"),$(document).off("click."+t+"_input")}if(!$(event.target).hasClass("blueprint_i")){$("html").addClass("re_name");var o=$(event.target).closest("."+t+"_list");o.addClass("edit"),sortable[t]&&sortable[t].option("disabled",!0);var r=i().name,l=o.find("."+t+"_input");l.select().on("keyup."+t+"_input",function(e){13==e.which?(n(),vm.更新藍圖()):27==e.which&&(n(),i().name=r)}),setTimeout(function(){$(document).on("click."+t+"_input",function(e){e.target.className.indexOf(""+t+"_input")==-1&&(n(),i().name=r)})},5)}},get_default_color:function(e){var t=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][e];return t?t:"#000000"},open_color:function(e,t,i){t=t.split("#")[1];var n=$(event.target),o=n.offset().left,r=n.offset().top+n.height()+2;vm.pick_master=i,$("#left_color").css({left:o,top:r}).colpickSetColor(t).colpickShow(),$(".colpick_submit").off("click.op").on("click.op",function(){vm.get_blueprint().line[e].color="#"+$("#left_color").val(),vm.更新藍圖(),$(this).off("click.op")})},swap_list:function(e,t){function i(e){for(var t=0;t<n.line.length;t++)if(n.line[t]._key==e)return t}if(e!=t){vm.action="swap_list";var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=[],r=[];$("#line_drag li").each(function(){var e=i($(this).data("key"));o.push(n.line[e]),r.push(vm.index[vm.index_blueprint][e])}),n.line=o,vm.index[vm.index_blueprint]=r,vm.update_index_line(r),vm.更新藍圖(n.key,n)}},swap_metro:function(e,t){function i(e){for(var t=0;t<o.length;t++)if(o[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.get_blueprint())),o=n.line[this.index_line].metro,r=[];$("#top_tag li").each(function(){var e=i($(this).data("key"));r.push(o[e])}),n.line[this.index_line].metro=r,vm.更新藍圖(n.key,n)}}}});