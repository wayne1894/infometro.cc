function 註冊(e,n,i){firebase.auth().createUserWithEmailAndPassword(e,n).then(function(){"function"==typeof i&&i()}).catch(function(e){var n=(e.code,e.message);print(n)})}function email_登入(e,n,i){firebase.auth().signInWithEmailAndPassword(e,n).then(function(){"function"==typeof i&&i()}).catch(function(e){var n=(e.code,e.message);print(n+"___")})}function 登出(){firebase.auth().signOut().then(function(){print("User sign out!")},function(e){print("User sign out error!")})}function 寄認證信(){firebase.auth().currentUser.sendEmailVerification().then(function(){print("eamil sent")},function(e){print("error")})}function fb_登入(e){firebase.auth().signInWithPopup(provider).then(function(n){var i=(n.credential.accessToken,n.user);初始化使用者資訊({name:i.displayName,email:i.email,url_name:"",photo:i.photoURL}),"function"==typeof e&&e()}).catch(function(e){var n=(e.code,e.message,e.email),i=e.credential;"auth/account-exists-with-different-credential"===e.code&&firebase.auth().fetchProvidersForEmail(n).then(function(e){if("password"===e[0]){var t=prompt("請輸入email密碼與facebook帳戶綁定");firebase.auth().signInWithEmailAndPassword(n,t).then(function(e){e.link(i)}).then(function(){print("成功連結")})}})})}function 初始化使用者資訊(e){DB.ref("users/"+user.uid).set(e)}function blueprint_json(e){return{name:e,line:[]}}function set_line_info(e){DB.ref("info/"+e+"/root").set(user.uid)}function line_json(e,n){var i=DB.ref("blueprint/"+user.uid).push().key;return set_line_info(i),{_key:i,name:e,color:n,metro:[]}}function metro_json(e){return{_key:DB.ref("blueprint/"+user.uid).push().key,name:e,create:firebase.database.ServerValue.TIMESTAMP}}function blueprint_init(e){DB.ref("blueprint/"+user.uid).on("value",function(n){var i=[];n.forEach(function(e){i.push(e.val()),i[i.length-1].key=e.key}),vm.blueprint=i;for(var t=[],r=0;r<i.length;r++)if(t.push([]),i[r].line)for(var o=0;o<i[r].line.length;o++)t[r].push([]);$.extend(t,vm.index),vm.index=t;var a=0;if("new_blueprint"==vm.action)a=vm.index.length-1;else for(var r=0;r<vm.index.length;r++)vm.index[r].check&&(a=r);vm.exchange_blueprint(a,!0),"new_line"==vm.action&&vm.exchange_line(vm.index[a].length-1),vm.action="","function"==typeof e&&setTimeout(e,5)})}var config={apiKey:"AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",authDomain:"infometro-cc.firebaseapp.com",databaseURL:"https://infometro-cc.firebaseio.com",storageBucket:"infometro-cc.appspot.com",messagingSenderId:"358423331162"};firebase.initializeApp(config);var DB=firebase.database(),user;firebase.auth().onAuthStateChanged(function(e){e?(print("User is logined"),user=e,"function"==typeof _is_login&&_is_login(e)):print("User is not logined yet."),user=e});var provider=new firebase.auth.FacebookAuthProvider;