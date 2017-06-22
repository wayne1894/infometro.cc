function logout(){firebase.auth().signOut().then(function(){window.location.href="/"})}function get_page(){return"/"==location.pathname||"/index.html"==location.pathname?"index":"main"}function get_test(){if(location.href.indexOf("localhost:1313")>-1)return"test"}function location_fn(){"test"==get_test()?location.href="404.html":location.href="/:-D"}function google_login(){if(void 0==DB)return setTimeout(google_login,500);if(void 0!=user_uid&&!isAnonymous)return location_fn();var e=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){var n=e.user;DB.ref("users/"+n.uid).once("value",function(e){e.val()?location_fn():初始化使用者資訊(location_fn)})})}function fb_login(){if(void 0==DB)return setTimeout(fb_login,500);if(void 0!=user_uid&&!isAnonymous)return location_fn();if(!login_wait){login_wait=!0;var e=new firebase.auth.FacebookAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){var n=e.user;DB.ref("users/"+n.uid).once("value",function(e){e.val()?location_fn():初始化使用者資訊(location_fn)})}).catch(function(e){"auth/account-exists-with-different-credential"==e.code&&google_login()})}}function anonymous_login(){if(!login_wait){if(login_wait=!0,void 0==DB)return setTimeout(anonymous_login,500);void 0!=user_uid&&location_fn(),firebase.auth().signInAnonymously()}}function 初始化使用者資訊(e){var n=firebase.auth().currentUser,i={name:n.displayName,url_name:"",photo:n.photoURL};isAnonymous&&(i.photo="https://semantic-ui.com/images/avatar/large/elliot.jpg",i.name="匿名"),$.cookie("start","Y"),DB.ref("users/"+n.uid).set(i).then(初始化藍圖資料(e))}function 初始化藍圖資料(e){var n=DB.ref("blueprint/"+user_uid).push(),i=[];i.push(line_json("橘線","#FF6900",!0)),i[i.length-1].metro.push(metro_json("總站")),n.set(blueprint_json("我的地鐵計畫",i),function(n){"function"==typeof e&&e()})}function blueprint_json(e,n){return{name:e,line:n,timestamp:firebase.database.ServerValue.TIMESTAMP}}function set_line_root(e,n){DB.ref("info/"+e+"/root").set(n)}function line_json(e,n){var i=DB.ref("blueprint/"+user_uid).push().key;return set_line_root(i,user_uid),{_key:i,name:e,color:n,metro:[],timestamp:firebase.database.ServerValue.TIMESTAMP}}function metro_json(e){return{_key:DB.ref("blueprint/"+user_uid).push().key,name:e,timestamp:firebase.database.ServerValue.TIMESTAMP}}function get_other_user(e,n){DB.ref("users/"+e).once("value",function(e){e.val()&&n(e.val())})}function show_event_fn(e,n){var i=vm.line_color;void 0==e&&(e="儲存成功"),n='<div class="description">'+n+"</div>",void 0==n&&(n=""),clearTimeout(window.show_setTimeout),$("#show_event").html('<div style="display:none" class="ui steps"><div class="completed step"><i class="payment icon" style="color:'+i+'"></i><div class="content"><div class="title">'+e+"</div>"+n+"</div></div></div>"),$("#show_event .ui").transition({animation:"fade up",duration:800}),window.show_setTimeout=setTimeout(function(){$("#show_event .ui").transition({animation:"fade down",duration:1200})},2e3)}function blueprint_init(e,n){DB.ref("blueprint/"+user_uid).on("value",function(i){var t=vm.action,o=[];if(i.forEach(function(e){o.push(e.val()),o[o.length-1].key=e.key}),"load"!=t&&0==o.length)return 初始化藍圖資料();vm.blueprint=o;for(var r=[],a=0;a<o.length;a++)if(r.push([]),o[a].line)for(var u=0;u<o[a].line.length;u++)r[a].push([]),r[a][r[a].length-1].check=!1;if($.extend(r,vm.index),vm.index=r,vm.blueprint.length!=vm.index.length){for(var s=[],a=0;a<o.length;a++)if(s.push([]),o[a].line)for(var u=0;u<o[a].line.length;u++)s[a].push([]),s[a][s[a].length-1].check=!1;vm.index=s,vm.index_blueprint=0,print("重新設定index[載入-全部重設]")}if(""==vm.action)for(var l=vm.blueprint,a=0;a<l.length;a++)vm.檢查更新錯誤索引(a,l);if("new_blueprint"==t){var f=vm.index.length-1;vm.exchange_blueprint(f,!0),show_event_fn("新增成功","你新增了一個地鐵計畫"),e()}else"swap_metro"==t?show_event_fn(void 0,"你交換了地鐵站的位置"):"delete_metro"==t?show_event_fn("刪除成功","你刪除了一個地鐵站"):"new_metro"==t?show_event_fn("新增成功","你新增了一個地鐵站"):"drop_blueprint"==t?show_event_fn("移動成功","你將支線移到其他地鐵計畫裡頭"):"drop_line"==t?show_event_fn("移動成功","你將地鐵站移到其他支線裡頭"):"re_name"==t?show_event_fn("名字更改成功",""):"edit_color"==t?show_event_fn(void 0,"你更改了支線的顏色"):"new_line"==t?(vm.index_update(),show_event_fn("新增成功","你新增了一條支線"),vm.exchange_line(vm.index[vm.index_blueprint].length-1)):"delete_line"==t?show_event_fn("刪除成功","你刪除了一條支線"):"swap_line"==t?(vm.index_update(),show_event_fn(void 0,"你交換了支線的位置")):"delete_blueprint"==t?(e(),show_event_fn("刪除成功","你刪除了一個地鐵計畫"),vm.exchange_blueprint(vm.index_blueprint,!0)):"load"==t&&(vm.exchange_blueprint(vm.index_blueprint,!0),e(),n());vm.action=""})}function blueprint_set(){$(".blueprint_list").dropdown("hide").dropdown("destroy").dropdown({on:"customClick",onShow:function(){sortable.blueprint.option("disabled",!0)},onHide:function(){sortable.blueprint.option("disabled",!1)}}),sortable.blueprint||(sortable.blueprint=new Sortable(id("blueprint_drag"),{scroll:!1,animation:150,forceFallback:!1,onEnd:function(e){}}))}function _is_login(){DB.ref("users/"+user_uid).once("value",function(e){e.val()?vm.users=e.val():初始化使用者資訊()});var e=DB.ref("users_data/"+user_uid+"/lightning").limitToFirst(50);vm.$bindAsArray("lightning",e),DB.ref("users_data/"+user_uid+"/index").once("value",function(e){e.val()&&(vm.index=e.val())}).then(function(){void 0!=$.cookie("index_blueprint")&&(vm.index_blueprint=$.cookie("index_blueprint")),blueprint_init(function(){setTimeout(blueprint_set,5)},function(){start_set()})})}var DB,user_uid,user_email,isAnonymous;$(function(){var e={apiKey:"AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",authDomain:"infometro-cc.firebaseapp.com",databaseURL:"https://infometro-cc.firebaseio.com",storageBucket:"infometro-cc.appspot.com",messagingSenderId:"358423331162"};firebase.initializeApp(e),DB=firebase.database(),firebase.auth().onAuthStateChanged(function(e){var n=get_page();e?(user_uid=e.uid,"lVAHfyuy4gN4UmiJ7WMYtIwKDts2"==user_uid&&$.cookie("ga",{expires:365}),user_email=e.email,e.isAnonymous?(isAnonymous=!0,DB.ref("users/"+e.uid).once("value",function(e){if(e.val())"main"==n&&_is_login();else{var i=_is_login;"index"==n&&(i=location_fn),初始化使用者資訊(i)}})):"main"==n&&_is_login()):(print("User is not logined yet."),"main"==n&&location.replace("/"))})});