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
  var user_uid;

  //[全域]監聽狀態改變
  firebase.auth().onAuthStateChanged(function(data) {
    if (data) {
      print("User is logined");

			var isAnonymous = data.isAnonymous;
			print(isAnonymous)
			if(isAnonymous){

				 DB.ref('users/' + data.uid).once('value',function(data) {
					 if(!data.val()){
						 初始化使用者資訊();
						 location_fn();
					 }
				 })
			}

			
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
      window.location.href="/"
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
           初始化使用者資訊(fn);
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

function anonymous_login(fn){
	firebase.auth().signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});
}


function 初始化使用者資訊(fn){
  var user = firebase.auth().currentUser;
  DB.ref('users/' + user.uid).set({
    name : user.displayName,
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
function set_line_root(_line_key,user_uid){//設定支線擁有者
	DB.ref('info/' + _line_key +"/root").set(user_uid);
}
function push_line_public(_line_key,_line,_metro){//推送分支到遠端
	DB.ref('info/' + _line_key +"/public").set(true);//設為公開
	DB.ref('info/' + _line_key +"/w_metro").set(true);//擁有metro編寫權限
	DB.ref('info/' + _line_key +"/w_info").set(true);//擁有info編寫權限
  
	DB.ref('info/' + _line_key +"/line_data").set(_line);//遠端支線相關
	DB.ref('info/' + _line_key +"/metro_data/").set(_metro);//遠端metro資訊
}
function push_now_line(){//傳送現在位置的支線到遠端(更新)
  var data=vm.get_blueprint();
  var _line=vm.get_line()
  _line.public=true;//要同步將本地端支線變成public
  vm.更新藍圖(data.key,data);
  var _metro=_line.metro;
  var __line=JSON.parse(JSON.stringify(_line));//將傳址改為傳值
  delete __line.metro;
  push_line_public(__line._key,__line,_metro);
}
function copy_public_line(_line_key){//複製某個遠端支線到自己的位置
  var _data=vm.get_blueprint();
  for(var i=0;i<_data.line.length;i++){
    if(_data.line[i]._key==_line_key)return "repeat"
  }
  DB.ref('info/' + _line_key + "/line_data").once("value",function(data){
    _data.line.push(data.val());
    DB.ref('info/' + _line_key + "/metro_data").once("value",function(data){
      _data.line[_data.line.length-1].metro=data.val();
      _data.line.public=true;
      vm.更新藍圖(_data.key,_data);
    })
  })
}
function update_public_line(_line_key){//更新某個遠端支線到自己的位置
  var _data=vm.get_blueprint();
  var update_index
  for(var i=0;i<_data.line.length;i++){
    if(_data.line[i]._key==_line_key)update_index=i
  }
  if(update_index==undefined)return false
  DB.ref('info/' + _line_key + "/line_data").once("value",function(data){
    _data.line[update_index]=data.val();
    DB.ref('info/' + _line_key + "/metro_data").once("value",function(data){
      _data.line[update_index].metro=data.val();
      vm.更新藍圖(_data.key,_data);
    })
  })
}


function line_json(name,color,master){
  var _line_key=DB.ref('blueprint/' + user_uid).push().key;
  set_line_root(_line_key,user_uid+"(build)");
  if(!master)master=false
  return {
    _key : _line_key,
    name: name,
    master: master,
    color : color ,
    metro : []
  }
}
function metro_json(name){
  return {
    _key : DB.ref('blueprint/' + user_uid).push().key,
    name : name ,
		timestamp: firebase.database.ServerValue.TIMESTAMP
  }
}
function get_other_user(other_user_uid,fn){
		DB.ref('users/' + other_user_uid).once('value',function(data) { //載入user
		if(data.val()){
		  fn(data.val())
		}
	});
}
function blueprint_init(fn){
  DB.ref('blueprint/' + user_uid).on("value",function(data){
    var _init=[];
    data.forEach(function(childData) {
      _init.push(childData.val());
      _init[_init.length-1].key=childData.key;
    });
    if(_init.length==0){//第一次進來
			vm.new_blueprint();
			return ;
		}
    vm.blueprint=_init ;
    var index_array=[];
    for(var i=0;i<_init.length;i++){
      index_array.push([]);
      if(_init[i].line){
        for(var j=0;j<_init[i].line.length;j++){
          index_array[i].push([]);
          index_array[i][index_array[i].length-1].check=false;
        }
      }
    }
    $.extend(index_array,vm.index);
    vm.index=index_array;
   
		var _index = vm.index_blueprint; //預載入的藍圖

		var _action = vm.action; //操作動作執行
		if (_action == "new_blueprint") { //判斷動作
		  _index = vm.index.length - 1; //移到最後一個
		  vm.exchange_blueprint(_index, true); //切換藍圖
		} else if (_action == "new_line") {
		  vm.index_update();
		  vm.exchange_line(vm.index[_index].length - 1);
		} else if (_action == "swap_list") {
		  vm.index_update();
		} else if (_action == "delete_blueprint") {
		  vm.index_update();
		  vm.exchange_blueprint(_index, true); //切換藍圖
		} else if (_action == "load") {
		  vm.exchange_blueprint(_index, true); //切換藍圖
		}
		
    if(typeof fn=="function"){
      setTimeout(fn,5);
    }
    vm.action="";
    vm.blueprint=_init;//載入資料
  })

}

function _is_login(){//程式進入點
	 DB.ref('users/' + user_uid).once('value',function(data) {//載入使用者基本資料
		 if(data.val()){
			 vm.users=data.val();
		 }else{
			 location.href = "/";
			//沒有會員資料 
		 }
	 });
	DB.ref('users_data/' + user_uid).once('value',function(data) { //載入user_data
		if(data.val()){
		  if(data.val().index){//初始化index
				 vm.index=data.val().index;
				 delete data.val().index;
		  }
		}
	}).then(function(){

      if($.cookie('index_blueprint')!=undefined){ //預設要載入的藍圖索引
        vm.index_blueprint=$.cookie('index_blueprint');
      }
      
      blueprint_init(function(){
            //一定要等vue資料載完才能載入選單物件
        $(".blueprint_list").dropdown("destroy").dropdown({
          on : 'customClick'
        });
        $(".blueprint_list .blueprint_i").off("click.custom").on("click.custom",function(event){
          $(this).trigger("customClick");
        })
      });
    });
}