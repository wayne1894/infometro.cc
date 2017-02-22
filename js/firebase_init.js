  // Initialize Firebase 初始化
  var config = {
    apiKey: "AIzaSyBipX4R5DxXqF3QaJHu6FjBGuqoAlohsXw",
    authDomain: "infometro-97014.firebaseapp.com",
    databaseURL: "https://infometro-97014.firebaseio.com",
    storageBucket: "infometro-97014.appspot.com",
    messagingSenderId: "37652553574"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // Firebase 註冊登入
  
  function 註冊(email, password){
    //如果註冊新帳戶，也會自動登入
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMsg = error.message;
      console.log(errorMsg);
    })
  }
  function 登入(email,password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMsg = error.message;
    console.log(errorMsg+"___");
  	});
  }
  function 登出(){
    firebase.auth().signOut().then(function() {
      console.log("User sign out!");
    }, function(error) {
      console.log("User sign out error!");
    })
  }
  
  // Firebase 管理使用者資訊
  //https://firebase.google.com/docs/auth/web/manage-users
  //http://sj82516-blog.logdown.com/posts/1050619
  
  function 取得使用者登入狀態(){
    log(firebase.auth().currentUser);
  }
  
  function 取得使用者登入資料(){
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                       // this value to authenticate with your backend server, if
                       // you have one. Use User.getToken() instead.
    }
    
    log(uid)
    //log(emailVerified)
  }
  
  function get_provider_specific(){
    var user = firebase.auth().currentUser;
    if (user != null) {
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
      });
    }
  }
  
  function send_verification_email(){
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      // Email sent.
      log("eamil sent")
    }, function(error) {
      // An error happened.
      log("error")
    });
  }
  
  //更新照片
  //設定email
  //重新驗証用戶 (參考：http://sj82516-blog.logdown.com/posts/1050619)
  //...更多請參考網址
  
  
  // Firebase Realtime Databe
  // 7IJBbfGenZOdVlZjq3nnk1El04T2  我的uid
  
  
  
  
  //監聽狀態改變
//  var userLogin;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userLogin = user;
      console.log("User is logined", user)
    } else {
      userLogin = null;
      console.log("User is not logined yet.");
    }
  });

//firebase CRUD 操作  
  function createData(uid, name, email, imageUrl) {
    firebase.database().ref('users/' + uid).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
  
  function removeData(uid, name, email, imageUrl) {
    firebase.database().ref('users/' + uid).remove();
  }
  var uid="7IJBbfGenZOdVlZjq3nnk1El04T2"
  function postSmtBtn(){
    var postRef = firebase.database().ref('/posts/' + uid);
   postRef.push().set({
      uid: uid,
      title: "g1",
      content: "g2",
      age: "g3"
    })
  }





//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();

provider.setCustomParameters({
  'display': 'popup'
});

//使用Popup註冊FB方式
var fbLoginBtn = document.getElementById("fbLoginBtn");
fbLoginBtn.addEventListener("click",function(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // 取得FB Token，可以使用於FB API中
    var token = result.credential.accessToken;
    // 使用者資料
    var FBUser = result.user;
    console.log(FBUser);
  }).catch(function(error) {
    //處理 帳號已經存在於其他登入方式時
    if (error.code === 'auth/account-exists-with-different-credential') {
      //取得credential
      var pendingCred = error.credential;
      // The provider account's email address.
      var email = error.email;
      console.log("FB登入錯誤-使用者信箱：",email);
      // 取得當初此Email的登入方式
      firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
        // 如果使用者有多個登入方式的話
        console.log("FB登入錯誤-其他登入方式：",providers);
        if (providers[0] === 'password') {
          // 如果使用者用密碼登入，要求使用者輸入密碼
          var password = promptUserForPassword(); // TODO: 實作 promptUserForPassword.
          firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            // Step 4a.
            return user.link(pendingCred);
          }).then(function() {
            // 成功連結
            goToApp();
          });
          return;
        }
        // 如果是其他登入方式，必須取得該登入方式,同時提供相對應的Provider
        // TODO: implement getProviderForProviderId.
        var provider = getProviderForProviderId(providers[0]);
        // 此時你必須讓使用者了解到 他曾經用其他方式登入過
        // Note: 瀏覽器通常會擋住跳出頁面，所以在現實狀況下，最好有個"請繼續"按鈕觸發新的註冊頁面
        // 可以參考 https://fir-ui-demo-84a6c.firebaseapp.com/
        auth.signInWithPopup(provider).then(function(result) {
          // 如果使用者用不同Email登入同一個帳號，這樣Firebase是無法擋住的
          // Step 4b.
          // 連結回原本的credential
          result.user.link(pendingCred).then(function() {
            // 成功連結
            goToApp();
          });
        });
      });
    }
  });
},false);

function promptUserForPassword(){
	var pwd = prompt("Please enter your password");
    if (pwd != null) {
    	return pwd;
    }
}

function goToApp(){
  alert("d")
}