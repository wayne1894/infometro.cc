function email_註冊(e,n,i){firebase.auth().createUserWithEmailAndPassword(e,n).then(function(e){初始化使用者資訊(i)}).catch(function(e){var n=(e.code,e.message);print(n)})}function email_登入(e,n,i){firebase.auth().signInWithEmailAndPassword(e,n).then(function(e){i()}).catch(function(e){var n=(e.code,e.message);print(n+"___")})}function 登出(){firebase.auth().signOut().then(function(){print("User sign out!"),window.location.href="/"},function(e){print("User sign out error!")})}function fb_登入(e){firebase.auth().signInWithPopup(provider).then(function(n){var i=n.user;DB.ref("users/"+i.uid).once("value",function(n){n.val()?e():初始化使用者資訊(e)})}).catch(function(e){var n=(e.code,e.message,e.email),i=e.credential;"auth/account-exists-with-different-credential"===e.code&&firebase.auth().fetchProvidersForEmail(n).then(function(e){if("password"===e[0]){var t=prompt("請輸入email密碼與facebook帳戶綁定");firebase.auth().signInWithEmailAndPassword(n,t).then(function(e){e.link(i)}).then(function(){print("成功連結")})}})})}function anonymous_login(e){firebase.auth().signInAnonymously().catch(function(e){e.code,e.message})}function 初始化使用者資訊(e){var n=firebase.auth().currentUser;DB.ref("users/"+n.uid).set({name:n.displayName,email:n.email,url_name:"",photo:n.photoURL}).then(e)}function blueprint_json(e){return{name:e,line:[]}}function set_line_info(e){DB.ref("info/"+e+"/root").set(user_uid)}function line_json(e,n,i){var t=DB.ref("blueprint/"+user_uid).push().key;return set_line_info(t),i||(i=!1),{_key:t,name:e,master:i,color:n,metro:[]}}function metro_json(e){return{_key:DB.ref("blueprint/"+user_uid).push().key,name:e,create:firebase.database.ServerValue.TIMESTAMP}}function blueprint_init(e){DB.ref("blueprint/"+user_uid).on("value",function(n){var i=[];if(n.forEach(function(e){i.push(e.val()),i[i.length-1].key=e.key}),0==i.length)return void vm.new_blueprint();vm.blueprint=i;for(var t=[],r=0;r<i.length;r++)if(t.push([]),i[r].line)for(var o=0;o<i[r].line.length;o++)t[r].push([]),t[r][t[r].length-1].check=!1;$.extend(t,vm.index),vm.index=t;var a=vm.index_blueprint,u=vm.action;"new_blueprint"==u?(a=vm.index.length-1,vm.exchange_blueprint(a,!0)):"new_line"==u?(vm.index_update(),vm.exchange_line(vm.index[a].length-1)):"swap_list"==u?vm.index_update():"delete_blueprint"==u?(vm.index_update(),vm.exchange_blueprint(a,!0)):"load"==u&&vm.exchange_blueprint(a,!0),"function"==typeof e&&setTimeout(e,5),vm.action="",vm.blueprint=i})}function _is_login(){DB.ref("users/"+user_uid).once("value",function(e){e.val()?vm.users=e.val():location.href="/"}),DB.ref("users_data/"+user_uid).once("value",function(e){e.val()&&e.val().index&&(vm.index=e.val().index,delete e.val().index)}).then(function(){blueprint_init(function(){$(".blueprint_list").dropdown("destroy").dropdown({on:"customClick"}),$(".blueprint_list .blueprint_i").off("click.custom").on("click.custom",function(e){$(this).trigger("customClick")})})})}var config={apiKey:"AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",authDomain:"infometro-cc.firebaseapp.com",databaseURL:"https://infometro-cc.firebaseio.com",storageBucket:"infometro-cc.appspot.com",messagingSenderId:"358423331162"};firebase.initializeApp(config);var DB=firebase.database(),user_uid;firebase.auth().onAuthStateChanged(function(e){if(e){print("User is logined");var n=e.isAnonymous;print(n),n&&DB.ref("users/"+e.uid).once("value",function(e){e.val()||(初始化使用者資訊(),location_fn())}),user_uid=e.uid,"function"==typeof _is_login&&_is_login()}else print("User is not logined yet.");user_uid=e.uid});var provider=new firebase.auth.FacebookAuthProvider;