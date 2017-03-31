// Firebase 管理使用者資訊
//https://firebase.google.com/docs/auth/web/manage-users
//http://sj82516-blog.logdown.com/posts/1050619
//https://firebase.google.com/docs/auth/web/manage-users  管理使用者帳戶

//https://phpwolf.blogspot.tw/2017/01/firebase-facebook.html   FB	login教學

//重新驗証用戶 (參考：http://sj82516-blog.logdown.com/posts/1050619)

//firebase CRUD 操作 
//http://sj82516-blog.logdown.com/posts/1061094
//https://howtofirebase.com/firebase-data-structures-pagination-96c16ffdb5ca#.2aiv4i4pd   分頁

//http://sj82516-blog.logdown.com/posts/1064788/teaching-firebase-page-four-rest-and-storage  firebase 檔案

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
function blueprint_json(name){
  return {
    name : name,
    line : []
  }
}
function line_json(name,color){
  return {
    name: name,
    color : color ,
    metro : []
  }
}
function metro_json(name){
  return {
    _key : D.ref('users/' + user.uid).push().key,
    name : name
  }
}
function blueprint_init(fn){
  D.ref('users/' + user.uid).on("value",function(data){
    var _init=[];
    data.forEach(function(childData) {
      _init.push(childData.val());
      _init[_init.length-1].key=childData.key;
    });
    vm.blueprint=_init ;

    var index_array=[];
    for(var i=0;i<_init.length;i++){
      index_array.push([]);
      if(_init[i].line){
        for(var j=0;j<_init[i].line.length;j++){
          index_array[i].push([]);
        }
      }
    }

    $.extend(index_array,vm.index);
    vm.index=index_array;

    var _index=0;//預設0
    if(vm.action=="new_blueprint"){//判斷動作
      _index=vm.index.length-1;
    }else{//檢查check
      for(var i=0;i<vm.index.length;i++){
        if(vm.index[i].check)_index=i;
      }
    }
    vm.exchange_blueprint(_index,true);
    if(vm.action=="new_line"){
      vm.exchange_line(vm.index[_index].length-1);
    }
    vm.action="";
    if(typeof fn=="function"){
      setTimeout(fn,5);
    }
  })
}


