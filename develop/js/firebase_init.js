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

//https://firebase.google.com/docs/database/web/offline-capabilities#server-timestamps  firebase 離線功能

//https://firebase.google.com/docs/reference/security/database/    rules進階

// Initialize Firebase 初始化
  var config = {
    apiKey: "AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",
    authDomain: "infometro-cc.firebaseapp.com",
    databaseURL: "https://infometro-cc.firebaseio.com",
    storageBucket: "infometro-cc.appspot.com",
    messagingSenderId: "358423331162"
  };
  firebase.initializeApp(config);
  var DB = firebase.database();
  var user_uid

  //[全域]監聽狀態改變
  firebase.auth().onAuthStateChanged(function(data) {
    if (data) {
      print("User is logined");
      //print(data)
      user_uid=data.uid;
      if(typeof _is_login==="function")_is_login();
    } else {
      print("User is not logined yet.");
    }
    user_uid=data.uid;
  });

  function email_註冊(email, password,fn){
    //如果註冊新帳戶，也會自動登入
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
    //寄認證信
    初始化使用者資訊(fn)
  }).catch(function(error) {
      var errorCode = error.code;
      var errorMsg = error.message;
      print(errorMsg);
    })
  }
  function email_登入(email,password,fn){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
      fn();
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

//更改基本資料
//function update_Profile(){
//	var user = firebase.auth().currentUser;
//	user.updateProfile({
//		displayName: "wayne",
//		photoURL: "https://example.com/jane-q-user/profile.jpg"
//	}).then(function() {
//		print(user.displayName);
//		print(user.photoURL);
//	}, function(error) {
//		
//	});
//}

//  function 寄認證信(){
//    var user = firebase.auth().currentUser;
//    user.sendEmailVerification().then(function() {
//      print("eamil sent")
//    }, function(error) {
//      print("error")
//    });
//  }

//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();
function fb_登入(fn){
	//signInWithPopup signInWithRedirect
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  //var token = result.credential.accessToken;
	  var user = result.user;
       DB.ref('users/' + user.uid).once('value',function(data) {
         if(!data.val()){
           初始化使用者資訊(fn)
         }else{
           fn();
         }
       })

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
            user.link(credential);//與FB連結
          }).then(function() {
            print("成功連結");
          });
				}
			});
		}
	});
}
function 初始化使用者資訊(fn){
  var user = firebase.auth().currentUser;
  DB.ref('users/' + user.uid).set({
    name : user.displayName,
    email : user.email,
    url_name: "",
    photo : user.photoURL
  }).then(fn);
}
function blueprint_json(name){
  return {
    name : name,
    line : []
  }
}
function set_line_info(_line_key){
  DB.ref('info/' + _line_key +"/root").set(user_uid);
}
function line_json(name,color){
  var _line_key=DB.ref('blueprint/' + user_uid).push().key;
  set_line_info(_line_key);
  return {
    _key : _line_key,
    name: name,
    color : color ,
    metro : []
  }
}
function metro_json(name){
  return {
    _key : DB.ref('blueprint/' + user_uid).push().key,
    name : name ,
		create: firebase.database.ServerValue.TIMESTAMP
  }
}
function blueprint_init(fn){
  DB.ref('blueprint/' + user_uid).on("value",function(data){
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
					index_array[i][index_array[i].length-1].check=true;
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
    vm.blueprint=_init;
		if(typeof fn=="function"){
			setTimeout(fn,5);
		}
  })

}
function load_users(){//載入位置資訊
	DB.ref('users/' + user_uid).once('value',function(data) {
		 if(data.val()){
			 if(data.val().index){//初始化index
				 vm.index=data.val().index
			 }

		 }else{
			//沒有會員資料 
		 }
	 })
}

