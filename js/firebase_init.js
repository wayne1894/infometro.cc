// Firebase 管理使用者資訊
//https://firebase.google.com/docs/auth/web/manage-users
//http://sj82516-blog.logdown.com/posts/1050619
//https://firebase.google.com/docs/auth/web/manage-users  管理使用者帳戶

//https://phpwolf.blogspot.tw/2017/01/firebase-facebook.html   FB	login教學

//重新驗証用戶 (參考：http://sj82516-blog.logdown.com/posts/1050619)

//firebase CRUD 操作 
//http://sj82516-blog.logdown.com/posts/1061094
//https://howtofirebase.com/firebase-data-structures-pagination-96c16ffdb5ca#.2aiv4i4pd   分頁

// Initialize Firebase 初始化
  var config = {
    apiKey: "AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",
    authDomain: "infometro-cc.firebaseapp.com",
    databaseURL: "https://infometro-cc.firebaseio.com",
    storageBucket: "infometro-cc.appspot.com",
    messagingSenderId: "358423331162"
  };
  firebase.initializeApp(config);
  var D = firebase.database();
  var user

  //[全域]監聽狀態改變
  firebase.auth().onAuthStateChanged(function(data) {
    if (data) {
      print("User is logined")
      user=data;
      if(typeof _is_login==="function")_is_login(data);
    } else {
      print("User is not logined yet.");
    }
    user=data;
  });

  function 註冊(email, password,fn){
    //如果註冊新帳戶，也會自動登入
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    if(typeof fn ==="function")fn();
  }).catch(function(error) {
      var errorCode = error.code;
      var errorMsg = error.message;
      print(errorMsg);
    })
  }
  function email_登入(email,password,fn){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
      if(typeof fn ==="function")fn();
    }).catch(function(error) {
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
    return user
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

//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();

function fb_登入(fn){
	//signInWithPopup signInWithRedirect
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
      if(typeof fn ==="function")fn();
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

function writeUserData() {//寫入預設資料
  D.ref('users/' + user.uid).push({
      name : "我的第鐵1",
      sort : 1,
      checked : true,
      line : data_template()
    });
}

function updateData(){
  var updates = {};
  updates["name"] = "v";
  D.ref('users/' + user.uid).child(0).update(updates);
}

function data_template(){
 return [
   {
     name: "淡水線",
     sort: 2,
     metro: [
        {
         _key : D.ref('users/' + user.uid).push().key ,
         name: "台北車站"
        }, {
         _key : D.ref('users/' + user.uid).push().key ,
         name: "關渡站"
        }
      ]
    }, {
     name: "板南線",
     sort: 5,
     metro: [
       {
         _key : D.ref('users/' + user.uid).push().key ,
         name: "府中站"
        }, {
         _key : D.ref('users/' + user.uid).push().key ,
         name: "亞東醫院站"
        }
      ]
   }]
}
  
function removeData(uid, name, email, imageUrl) {
  //D.ref('users/' + uid +"/blueprint").child().remove();
}

  var blueprint_data ={};
  var line_data ={};
  var metro_data = {};
function 初始化資料(vm,vm_data){

  D.ref('users/' + user.uid).once('value').then(function(data) {
    print(data.length)
    data.forEach(function(childData) {
      var Key = childData.key; //取得他的KEY
      
      if(childData.val().checked){//新增line
        line_data=childData.val().line
      }
      blueprint_data[Key]= childData.val();
    });

  });
}
function insert_info(metro_key){
  D.ref('info/' + user.uid + "/"+ metro_key).push(
    {
      msg : "看見我的靈魂裡那洗拭不去的黑色污點",
      img : "test",
      lick : true
    }
  )
}
function get_info_list(metro_key){
  D.ref('info/' + user.uid + "/"+ metro_key).once('value')
}
