// Firebase 管理使用者資訊
//https://firebase.google.com/docs/auth/web/manage-users
//http://sj82516-blog.logdown.com/posts/1050619
//https://firebase.google.com/docs/auth/web/manage-users  管理使用者帳戶

//https://phpwolf.blogspot.tw/2017/01/firebase-facebook.html   FB	login教學

//重新驗証用戶 (參考：http://sj82516-blog.logdown.com/posts/1050619)



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

  function 註冊(email, password){
    //如果註冊新帳戶，也會自動登入
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMsg = error.message;
      print(errorMsg);
    })
  }
  function 登入(email,password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMsg = error.message;
    print(errorMsg+"___");
  	});
  }
  function 登出(){
    firebase.auth().signOut().then(function() {
      print("User sign out!");
    }, function(error) {
      print("User sign out error!");
    })
  }
  function 取得使用者資料(){//頂層
    var user = firebase.auth().currentUser;
    if (user != null) {
      print("使用者名稱: " +user.displayName);
      print("使用者email: " +user.email);
      print("使用者照片: " + user.photoURL);
      print("Email 驗證: " + user.emailVerified);
      print("uid: " + user.uid);
    }
  }
  function 取得使用者登入資料(){
    var user = firebase.auth().currentUser; //使用者登入狀態
    if (user != null) {
      user.providerData.forEach(function (profile) {
        print(" Sign-in provider: "+profile.providerId);
        print("  Provider-specific UID: "+profile.uid);
        print("  Name: "+profile.displayName);
        print("  Email: "+profile.email);
        print("  Photo URL: "+profile.photoURL);
      });
    }
  }
  function 寄認證信(){
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      print("eamil sent")
    }, function(error) {
      print("error")
    });
  }
  
  //[全域]監聽狀態改變
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userLogin = user;
      print("User is logined", user)
			$("#user").html(user.email)
    } else {
      userLogin = null;
      print("User is not logined yet.");
    }
  });


//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();

function fb_login_redirect(){
	//signInWithPopup signInWithRedirect
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
            print("成功連結");
          });
				}
			});
		}
	});
}

//更改基本資料
function update_Profile(){
	var user = firebase.auth().currentUser;
	user.updateProfile({
		displayName: "wayne",
		photoURL: "https://example.com/jane-q-user/profile.jpg"
	}).then(function() {
		print(user.displayName);
		print(user.photoURL);
	}, function(error) {
		
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


function print(a){
	console.log(a)
}