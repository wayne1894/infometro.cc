function 註冊(e,n,i){firebase.auth().createUserWithEmailAndPassword(e,n).then(function(){"function"==typeof i&&i()}).catch(function(e){var n=(e.code,e.message);print(n)})}function email_登入(e,n,i){firebase.auth().signInWithEmailAndPassword(e,n).then(function(){"function"==typeof i&&i()}).catch(function(e){var n=(e.code,e.message);print(n+"___")})}function 登出(){firebase.auth().signOut().then(function(){print("User sign out!")},function(e){print("User sign out error!")})}function 取得使用者資料(){var e=firebase.auth().currentUser;return null!=e&&(print("使用者名稱: "+e.displayName),print("使用者email: "+e.email),print("使用者照片: "+e.photoURL),print("Email 驗證: "+e.emailVerified),print("uid: "+e.uid)),e}function 取得使用者登入資料(){var e=firebase.auth().currentUser;null!=e&&e.providerData.forEach(function(e){print(" Sign-in provider: "+e.providerId),print("  Provider-specific UID: "+e.uid),print("  Name: "+e.displayName),print("  Email: "+e.email),print("  Photo URL: "+e.photoURL)})}function 寄認證信(){var e=firebase.auth().currentUser;e.sendEmailVerification().then(function(){print("eamil sent")},function(e){print("error")})}function fb_登入(e){firebase.auth().signInWithPopup(provider).then(function(n){n.credential.accessToken,n.user;"function"==typeof e&&e()}).catch(function(e){var n=(e.code,e.message,e.email),i=e.credential;"auth/account-exists-with-different-credential"===e.code&&firebase.auth().fetchProvidersForEmail(n).then(function(e){if("password"===e[0]){var t=prompt("請輸入email密碼與facebook帳戶綁定");firebase.auth().signInWithEmailAndPassword(n,t).then(function(e){e.link(i)}).then(function(){print("成功連結")})}})})}function update_Profile(){var e=firebase.auth().currentUser;e.updateProfile({displayName:"wayne",photoURL:"https://example.com/jane-q-user/profile.jpg"}).then(function(){print(e.displayName),print(e.photoURL)},function(e){})}function 新增藍圖(e){var n=D.ref("users/"+user.uid).push();n.set({name:e,line:line_template()}).then(function(e){setTimeout(function(){vm.index_blueprint=vm.blueprint.length-1},5)})}function updateData(){var e={};e.name="v",D.ref("users/"+user.uid).child(0).update(e)}function line_template(){return[{name:"淡水線a1",color:"#ff6900",metro:[{_key:D.ref("users/"+user.uid).push().key,name:"台北車站"},{_key:D.ref("users/"+user.uid).push().key,name:"關渡站"}]},{name:"板南線a2",color:"#ff6900",metro:[{_key:D.ref("users/"+user.uid).push().key,name:"府中站"},{_key:D.ref("users/"+user.uid).push().key,name:"亞東醫院站"}]},{name:"其他線a3",color:"#ff6900",metro:[{_key:D.ref("users/"+user.uid).push().key,name:"府中站"},{_key:D.ref("users/"+user.uid).push().key,name:"亞東醫院站"}]}]}function blueprint_json(e){return{name:e,line:[]}}function line_json(e,n){return{name:e,color:n,metro:[]}}function metro_json(e){return{_key:D.ref("users/"+user.uid).push().key,name:e}}function blueprint_init(){D.ref("users/"+user.uid).on("value",function(e){var n=[];e.forEach(function(e){n.push(e.val()),n[n.length-1].key=e.key}),vm.index_blueprint>n.length-1&&(vm.index_blueprint=n.length-1),vm.blueprint=n})}function insert_info(e){D.ref("info/"+user.uid+"/"+e).push({msg:"44看見我的靈魂裡那洗拭不去的黑色污點",img:"test",lick:!0})}function get_info_list(e){D.ref("info/"+user.uid+"/"+e).once("value")}var config={apiKey:"AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",authDomain:"infometro-cc.firebaseapp.com",databaseURL:"https://infometro-cc.firebaseio.com",storageBucket:"infometro-cc.appspot.com",messagingSenderId:"358423331162"};firebase.initializeApp(config);var D=firebase.database(),user;firebase.auth().onAuthStateChanged(function(e){e?(print("User is logined"),user=e,"function"==typeof _is_login&&_is_login(e)):print("User is not logined yet."),user=e});var provider=new firebase.auth.FacebookAuthProvider;