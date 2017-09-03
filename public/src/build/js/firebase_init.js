function logout(){firebase.auth().signOut().then(function(){window.location.href="/"})}function get_page(){return"/"==location.pathname||"/index.html"==location.pathname?"index":"main"}function get_test(){if(location.href.indexOf("localhost:1313")>-1)return"test"}function location_fn(){"test"==get_test()?location.href="404.html":location.href="/:-D"}function check_login_button(){if($("#fb_button").hasClass("loading")||$("#google_button").hasClass("loading")||$("#anonymous_button").hasClass("loading"))return!0}function remove_login_button(){$("#fb_button").removeClass("loading"),$("#google_button").removeClass("loading"),$("#anonymous_button").removeClass("loading")}function google_login(e){if(void 0!=user_uid)return location_fn();if(void 0==DB)return setTimeout(google_login,200);if("fb_login_before"==e);else{if(check_login_button())return;$("#google_button").addClass("loading")}var n=new firebase.auth.GoogleAuthProvider;$.cookie("login","Y"),firebase.auth().signInWithRedirect(n).then(function(e){location_fn()}).catch(function(e){remove_login_button()})}function fb_login(){if(void 0!=user_uid)return location_fn();if(void 0==DB)return setTimeout(fb_login,200);if(!check_login_button()){if($("#fb_button").addClass("loading"),void 0!=user_uid&&!isAnonymous)return location_fn();var e=new firebase.auth.FacebookAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){location_fn()}).catch(function(e){"auth/account-exists-with-different-credential"==e.code?setTimeout(function(){google_login("fb_login_before")},0):remove_login_button()})}}function anonymous_login(){return void 0!=user_uid?location_fn():void 0==DB?setTimeout(anonymous_login,200):void(check_login_button()||($("#anonymous_button").addClass("loading"),firebase.auth().signInAnonymously().then(function(e){location_fn()}).catch(function(e){remove_login_button()})))}function set_user_info(e){var n=firebase.auth().currentUser,o={name:n.displayName,url_name:"",photo:n.photoURL};isAnonymous&&(o.photo="https://semantic-ui.com/images/avatar/large/elliot.jpg",o.name="匿名"),$.cookie("start","Y"),DB.ref("users/"+user_uid).set(o).then(load_blueprint_info(e))}function load_blueprint_info(e){var n=DB.ref("blueprint/"+user_uid).push(),o=[];o.push(line_json("橘線","#FF6900",!0)),o[o.length-1].metro.push(metro_json("總站")),n.set(blueprint_json("我的地鐵計畫",o),function(n){"function"==typeof e&&e()})}function blueprint_json(e,n){return{name:e,line:n,timestamp:firebase.database.ServerValue.TIMESTAMP}}function set_line_root(e,n){DB.ref("info/"+e+"/root").set(n)}function line_json(e,n){var o=DB.ref("blueprint/"+user_uid).push().key;return set_line_root(o,user_uid),{_key:o,name:e,color:n,metro:[],timestamp:firebase.database.ServerValue.TIMESTAMP}}function metro_json(e){return{_key:DB.ref("blueprint/"+user_uid).push().key,name:e,timestamp:firebase.database.ServerValue.TIMESTAMP}}function get_other_user(e,n){DB.ref("users/"+e).once("value",function(e){e.val()&&n(e.val())})}function blueprint_init(e,n){DB.ref("blueprint/"+user_uid).on("value",function(o){var t=vm.action,i=[];if(o.forEach(function(e){i.push(e.val()),i[i.length-1].key=e.key}),"load"!=t&&0==i.length)return load_blueprint_info();vm.blueprint=i;for(var r=[],u=0;u<i.length;u++)if(r.push([]),i[u].line)for(var a=0;a<i[u].line.length;a++)r[u].push([]),r[u][r[u].length-1].check=!1;if($.extend(r,vm.index),vm.index=r,vm.blueprint.length!=vm.index.length){for(var l=[],u=0;u<i.length;u++)if(l.push([]),i[u].line)for(var a=0;a<i[u].line.length;a++)l[u].push([]),l[u][l[u].length-1].check=!1;vm.index=l,vm.index_blueprint=0,print("重新設定index[載入-全部重設]")}if(""==vm.action)for(var s=vm.blueprint,u=0;u<s.length;u++)vm.check_error_index(u,s);if("new_blueprint"==t){var _=vm.index.length-1;vm.exchange_blueprint(_,!0),show_event_fn("新增成功","你新增了一個地鐵計畫"),e()}else"swap_metro"==t?show_event_fn(void 0,"你交換了地鐵站的位置"):"delete_metro"==t?show_event_fn("刪除成功","你刪除了一個地鐵站"):"new_metro"==t?show_event_fn("新增成功","你新增了一個地鐵站"):"drop_blueprint"==t?show_event_fn("移動成功","你將支線移到其他地鐵計畫裡頭"):"drop_line"==t?show_event_fn("移動成功","你將地鐵站移到其他支線裡頭"):"re_name"==t?show_event_fn("名字更改成功",""):"edit_color"==t?show_event_fn(void 0,"你更改了支線的顏色"):"new_line"==t?(vm.index_update(),show_event_fn("新增成功","你新增了一條支線"),vm.exchange_line(vm.index[vm.index_blueprint].length-1)):"delete_line"==t?show_event_fn("刪除成功","你刪除了一條支線"):"swap_line"==t?(vm.index_update(),show_event_fn(void 0,"你交換了支線的位置")):"delete_blueprint"==t?(e(),show_event_fn("刪除成功","你刪除了一個地鐵計畫"),vm.exchange_blueprint(vm.index_blueprint,!0)):"load"==t&&(vm.exchange_blueprint(vm.index_blueprint,!0),e(),n());vm.action=""})}function blueprint_set(){$(".blueprint_list").dropdown("hide").dropdown("destroy").dropdown({on:"customClick",onShow:function(){sortable.blueprint.option("disabled",!0)},onHide:function(){sortable.blueprint.option("disabled",!1)}}),sortable.blueprint||(sortable.blueprint=new Sortable(id("blueprint_drag"),{scroll:!1,animation:150,forceFallback:!1,onEnd:function(e){}}))}function _is_login(){DB.ref("users/"+user_uid).once("value",function(e){if(!e.val())return set_user_info(_is_login),!1;vm.users=e.val()}),DB.ref("users_data/"+user_uid+"/index").once("value",function(e){e.val()&&(vm.index=e.val())}).then(function(){blueprint_init(function(){},function(){start_set()})})}var DB,user_uid,user_email,isAnonymous;firebase.initializeApp({apiKey:"AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",authDomain:"infometro-cc.firebaseapp.com",databaseURL:"https://infometro-cc.firebaseio.com",storageBucket:"infometro-cc.appspot.com",messagingSenderId:"358423331162"}),firebase.auth().onAuthStateChanged(function(e){DB=firebase.database(),e?(print("User is logined."),user_uid=e.uid,user_email=e.email,e.isAnonymous&&(isAnonymous=!0),"lVAHfyuy4gN4UmiJ7WMYtIwKDts2"==user_uid?$.cookie("ga","N",{expires:365}):DB.ref("log/").push({users:user_uid,page:get_page(),timestamp:firebase.database.ServerValue.TIMESTAMP}),"main"==get_page()&&_is_login(),"index"==get_page()&&(set_location_button(),"Y"==$.cookie("login")?(remove_login_button(),$.removeCookie("login"),location_fn()):isAnonymous||($("#google_html").html("已登入Google 直接進入"),$("#google_button").css("background-color","#d14836").removeClass("loading")))):"main"==get_page()&&location.replace("/")});