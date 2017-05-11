var vm=new Vue({el:"#main",data:{blueprint:[],index:[],index_blueprint:0,index_line:-1,key_metro:"",action:"load",info:[],users:[],mode:1,pick_master:void 0,pick_color:void 0,url_info:void 0},updated:function(){setTimeout(function(){$(window).resize()},0),$("#board_info .ui.active").show()},firebase:{},computed:{master_line_color:function(){return 0!=this.blueprint.length&&(this.pick_color&&this.pick_master?this.pick_color:this.get_blueprint().line[0].color)},line:function(){return 0!=this.blueprint.length&&this.get_blueprint().line},line_name:function(){return 0==this.blueprint.length?"":this.get_line().name},line_color:function(){return 0==this.blueprint.length?"":this.pick_color&&!this.pick_master?this.pick_color:this.get_line().color},metro:function(){return 0!=this.blueprint.length&&this.get_line().metro},metro_name:function(){return 0==this.blueprint.length?"":this.get_metro().name},metro_create:function(){if(0==this.blueprint.length)return"";var e=this.get_metro().timestamp;return void 0==e?"":moment(e).format("lll")},info_count:function(){return 0==this.blueprint.length?"":this.info.length},info_favorites:function(){var e=this.info.filter(function(e){return e.favorite});return 0!=e.length&&e},info_sort:function(){var e=this.info.sort(function(e,t){return e.timestamp>t.timestamp?1:-1});return e=e.sort(function(e,t){return e.favorite?-1:1})},user_photo:function(){var e=this.users.photo;return e?e:"https://semantic-ui.com/images/avatar/large/daniel.jpg"}},watch:{index_line:function(){for(var e=vm.get_index_blueprint(),t=0;t<e.length;t++)e[t].check=!1;e[this.index_line].check=!0;var i=vm.line_color;if(!document.getElementById("selection")){var n=document.createElement("style");n.id="selection",n.type="text/css",document.getElementsByTagName("head")[0].appendChild(n)}document.getElementById("selection").innerHTML="::selection {background: "+i+";color: #fff;}::-moz-selection {background: "+i+";color: #fff;}img::selection {background: "+i+";color: #fff;}img::-moz-selection {background: "+i+";color: #fff;}"},key_metro:function(){var e=DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).orderByKey();vm.$bindAsArray("info",e);var t=this.index[this.index_blueprint][this.index_line];t.key_metro=this.key_metro,vm.index_update()}},methods:{get_favorite_style:function(e,t){return e?{color:t}:{}},is_master:function(){return 0==this.blueprint.length?"":0==vm.index_line},color_gradient:function(e){return"linear-gradient(to right, #000 50%, "+e+" 0%)"},mode_txt:function(){return 0==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!0)},5),"一般模式"):1==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!1)},5),"編輯模式"):1.5==this.mode?"編輯模式":2==this.mode?(setTimeout(function(){sortable.metro.option("disabled",!0)},5),"導覽模式"):void 0},mode_click:function(){var e=this.mode;e=Math.floor(e+1),e>1&&(e=0),this.mode=e},mode_class:function(){return 0==this.mode?"male":1==this.mode?"configure":1.5==this.mode?"trash":2==this.mode?"help circle outline":void 0},index_update:function(){DB.ref("users_data/"+user_uid+"/index").set(vm.index)},message_filter:function(e,t){return e=e.replace(/\</g,"&lt;"),e=e.replace(/\>/g,"&gt;"),e=e.replace(/(?:\r\n|\r|\n)/g,"<br />"),e=urlify(e),e=e.replace(/ /g,"&nbsp;"),e=e.replace(/\<a&nbsp;href=/g,"<a href="),setTimeout(function(){$("#board_info").find("a").css("color",vm.line_color).attr("target","_blank")},5),e},"更新藍圖":function(e,t,i){void 0!=e&&void 0!=t||(t=vm.get_blueprint(),e=t.key),DB.ref("blueprint/"+user_uid+"/"+e).update(t).then(i)},get_blueprint:function(e){return void 0!=e?this.blueprint[e]:this.blueprint[this.index_blueprint]},get_index_blueprint:function(){return vm.index[vm.index_blueprint]},get_line:function(){var e=this.get_blueprint();return e.line[this.index_line]},get_index_line:function(){return vm.index[vm.index_blueprint][vm.index_line]},update_line_index:function(e){for(var t=0,i=0;i<e.length;i++)if(e[i].check){t=i;break}this.index_line=t},update_metro_key:function(e){var t=this.get_line().metro;if(e.key_metro){for(var i=0;i<t.length;i++)if(t[i]._key==e.key_metro){vm.key_metro=t[i]._key;break}}else vm.key_metro=t[0]._key},new_blueprint:function(){vm.action="new_blueprint";var e=DB.ref("blueprint/"+user_uid).push(),t=[];t.push(line_json("橘線","#FF6900",!0)),t[t.length-1].metro.push(metro_json("總站")),e.set({name:"我的地鐵計畫",line:t})},delete_blueprint:function(e,t){vm.action="delete_blueprint";for(var i=vm.blueprint[t].line,n=0;n<i.length;n++)DB.ref("info/"+i[n]._key+"/metro").remove(),DB.ref("info/"+i[n]._key+"/root").remove();if(vm.index.splice(t,1),vm.index_blueprint>=t){var r=t-1;r<0&&(r=0),vm.index_blueprint=r}DB.ref("blueprint/"+user_uid+"/"+e).remove()},exchange_blueprint:function(e,t){function i(){n&&n.target&&void 0!=n.target.className&&(n.target.className.indexOf("blueprint_a")>-1||n.target.className.indexOf("blueprint_i")>-1)&&(t=!0),t&&(vm.index_blueprint=e,vm.update_line_index(vm.index[e]),vm.update_metro_key(vm.index[e][vm.index_line])),setTimeout(move_center,0)}if(void 0!=event&&!$(event.target).hasClass("blueprint_i")){$("#top_tag").stop().fadeOut(0);var n=event;return $("html").hasClass("re_name")?setTimeout(function(){i()},0):void i()}},check_blueprint:function(e){if(this.index_blueprint==e)return"check"},exchange_line:function(e){function t(){vm.index_line=e,vm.get_index_blueprint()[e]||vm.replace_index(),vm.update_metro_key(vm.get_index_blueprint()[e]),setTimeout(move_center,0)}if(vm.index_line!=e)return $("#top_tag").stop().fadeOut(0),$("html").hasClass("re_name")?setTimeout(function(){t()},0):void t()},replace_index:function(){var e=vm.get_blueprint().line,t=vm.get_index_blueprint(),i=e.length-t.length;print("重新設定index");for(var n=0;n<i;n++)t.push([])},check_line:function(e){if(this.index_line==e)return"check"},new_line:function(){vm.action="new_line";var e=this.get_blueprint();e.line||(e.line=[]);var t=vm.get_default_color(e.line.length),i=line_json("未命名",t);i.metro.push(metro_json("總站")),e.line.push(i),vm.get_index_blueprint().push([]),this.更新藍圖(e.key,e)},delete_line:function(e){var t=this.get_blueprint(),i=t.line[e]._key;if(t.line.splice(e,1),vm.index_line>=e){var n=e-1;n<0&&(n=0),vm.index_line=n}vm.get_index_blueprint().splice(e,1),vm.update_metro_key(vm.get_index_line()),this.更新藍圖(t.key,t),DB.ref("info/"+i+"/metro").remove(),DB.ref("info/"+i+"/root").remove()},get_line_key:function(){return vm.get_line()._key},new_metro:function(e){var t=metro_json("未命名"),i=JSON.parse(JSON.stringify(this.get_blueprint()));i.line[vm.index_line].metro.splice(e,0,t),this.更新藍圖(i.key,i),setTimeout(move_center,0)},check_metro:function(e){if(vm.key_metro==e){var t=this.get_line().color;return"background-color: "+t}},exchange_metro:function(e){this.key_metro=e},move_metro:function(e){var t=this.get_blueprint(),i=t.line[this.index_line].metro[e]._key;if(!(t.line[this.index_line].metro.length<=1)){var n=t.line[this.index_line].metro.splice(e,1);if(this.key_metro==i){var r=e-1;r<0&&(r=0);var o=t.line[this.index_line].metro[r]._key;this.key_metro=o}return n}},delete_metro:function(e){var t=JSON.parse(JSON.stringify(this.get_blueprint())),i=t.line[this.index_line].metro[e]._key;if(!(t.line[this.index_line].metro.length<=1)){if(t.line[this.index_line].metro.splice(e,1),this.key_metro==i){var n=e-1;n<0&&(n=0);var r=t.line[this.index_line].metro[n]._key;this.key_metro=r}this.更新藍圖(t.key,t),DB.ref("info/"+t.line[this.index_line]._key+"/metro").child(i).remove()}},get_metro:function(){for(var e=this.get_line(),t=vm.key_metro,i=(e.metro,0),n=0;n<e.metro.length;n++)if(e.metro[n]._key==t){i=n;break}return e.metro[i]},new_info:function(){var e=$.trim($("#board_textarea").val());if(""!=e){var t={message:e,favorite:!1,timestamp:firebase.database.ServerValue.TIMESTAMP,users:user_uid};vm.url_info&&(t.url_info=vm.url_info),vm.url_info=void 0,$("#board_textarea").val(""),DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).push(t)}},delete_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e).remove()},favorite_info:function(e){DB.ref("info/"+vm.get_line_key()+"/metro/"+vm.key_metro).child(e[".key"]).update({favorite:!e.favorite})},re_name:function(e,t){function i(){return"blueprint"==t?vm.blueprint[e]:"line"==t?vm.get_blueprint().line[e]:"metro"==t?vm.get_line().metro[e]:void 0}function n(){$(document).one("click",function(){$("html").removeClass("re_name")}),r.removeClass("edit"),sortable[t]&&sortable[t].option("disabled",!1),l.off("keyup."+t+"_input"),$(document).off("click."+t+"_input")}if(!$(event.target).hasClass("blueprint_i")){$("html").addClass("re_name");var r=$(event.target).closest("."+t+"_list");r.addClass("edit"),sortable[t]&&sortable[t].option("disabled",!0);var o=i().name,l=r.find("."+t+"_input");l.select().on("keyup."+t+"_input",function(e){13==e.which?(n(),vm.更新藍圖()):27==e.which&&(n(),i().name=o)}),setTimeout(function(){$(document).on("click."+t+"_input",function(e){e.target.className.indexOf(""+t+"_input")==-1&&(n(),i().name=o)})},5)}},get_default_color:function(e){var t=["#f2711c","#db2828","#fbbd08","#b5cc18","#21ba45","#00b5ad","#2185d0","#5829bb","#a333c8","#e03997","#a5673f","#767676"][e];return t?t:"#000000"},open_color:function(e,t,i){t=t.split("#")[1];var n=$(event.target),r=n.offset().left,o=n.offset().top+n.height()+2;vm.pick_master=i,$("#left_color").css({left:r,top:o}).colpickSetColor(t).colpickShow(),$(".colpick_submit").off("click.op").on("click.op",function(){vm.get_blueprint().line[e].color="#"+$("#left_color").val(),vm.更新藍圖(),$(this).off("click.op")})},swap_list:function(e,t){function i(e){for(var t=0;t<n.line.length;t++)if(n.line[t]._key==e)return t}if(e!=t){vm.action="swap_list";var n=JSON.parse(JSON.stringify(this.get_blueprint())),r=[],o=[];$("#line_drag li").each(function(){var e=i($(this).data("key"));r.push(n.line[e]),o.push(vm.index[vm.index_blueprint][e])}),n.line=r,vm.index[vm.index_blueprint]=o,vm.update_line_index(o),vm.更新藍圖(n.key,n)}},swap_metro:function(e,t){function i(e){for(var t=0;t<r.length;t++)if(r[t]._key==e)return t}if(e!=t){var n=JSON.parse(JSON.stringify(this.get_blueprint())),r=n.line[this.index_line].metro,o=[];$("#top_tag li").each(function(){var e=i($(this).data("key"));o.push(r[e])}),n.line[this.index_line].metro=o,vm.更新藍圖(n.key,n)}}}});