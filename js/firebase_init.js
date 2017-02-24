// Firebase 管理使用者資訊
//https://firebase.google.com/docs/auth/web/manage-users
//http://sj82516-blog.logdown.com/posts/1050619
//https://firebase.google.com/docs/auth/web/manage-users  管理使用者帳戶

//https://phpwolf.blogspot.tw/2017/01/firebase-facebook.html   FB	login教學
//使用Popup註冊FB方式//FB網址請用英文http://localhost/　


//更新照片
//設定email
//重新驗証用戶 (參考：http://sj82516-blog.logdown.com/posts/1050619)
//...更多請參考網址



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
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
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
  
  //[全域]監聽狀態改變
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userLogin = user;
      console.log("User is logined", user)
			$("#user").html(user.email)
    } else {
      userLogin = null;
      console.log("User is not logined yet.");
    }
  });


//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();

function fb_login_redirect(){
	//signInWithPopup
	//signInWithRedirect
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
		if (error.code === 'auth/account-exists-with-different-credential') {
			firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
				if(providers[0] === "password"){
					
					var password = prompt("請輸入email密碼與facebook帳戶綁定");
				
					firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            user.link(credential);
          }).then(function() {
            log("成功連結");
          });
					
				}
			});
		}
	});
}

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


function log(a){
	console.log(a)
}