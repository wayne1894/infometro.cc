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
    if (data) {//使用者已登入
			user_uid=data.uid;
      if(data.isAnonymous){//匿名使用者
         DB.ref('users/' + data.uid).once('value',function(data) {
					 if(!data.val()){
						 var fn=_is_login;
						 if(typeof anonymous_fn=="function")fn=anonymous_fn;
						 初始化使用者資訊(fn,"isAnonymous");
					 }else{
						 if(get_page()=="main")_is_login();
					 }
         })
      }else{
				if(get_page()=="main")_is_login();
			}
    } else {
      print("User is not logined yet.");
      if(get_page()=="main")location.replace("/");//登出
    }
  });


function 登出(){
    firebase.auth().signOut().then(function() {
      print("User sign out!");
      window.location.href="/"
    }, function(error) {
      print("User sign out error!");
    })
  }
function get_page(){
	if(location.href.split("://")[1].split("/")[1]==""){//代表首頁
		return "";
	}else{
		return "main";
	}
}

//firebase to fb login
var provider = new firebase.auth.FacebookAuthProvider();
function fb_login(fn){
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
var anonymous_fn
function anonymous_login(fn){
	if(user_uid!=undefined)fn();
	anonymous_fn=fn;
	firebase.auth().signInAnonymously();
}
function 初始化使用者資訊(fn,isAnonymous){
  var user = firebase.auth().currentUser;
	var data={
    name : user.displayName,
    url_name: "",
    photo : user.photoURL,
		
  }
	//https://semantic-ui.com/views/card.html
	if(isAnonymous=="isAnonymous"){
		data.photo="https://semantic-ui.com/images/avatar/large/elliot.jpg";
		data.name="匿名";
	}
	
  DB.ref('users/' + user.uid).set(data).then(初始化藍圖資料(fn));
}
function 初始化藍圖資料(fn){
	var newRef=DB.ref('blueprint/' + user_uid).push();
	var newLine=[];
	newLine.push(line_json("橘線","#FF6900",true));//新增第一條線
	newLine[newLine.length-1].metro.push(metro_json("總站"));//第一條線下面的站
	newRef.set({//將他存到藍圖
		name: "我的地鐵計畫",
		line : newLine
	})
	if(typeof fn=="function")fn()
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
			return 初始化藍圖資料();
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
  alert(0)
	 DB.ref('users/' + user_uid).once('value',function(data) {//載入使用者基本資料
		 if(data.val()){
			 vm.users=data.val();
		 }else{
			 初始化使用者資訊();
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
				//https://semantic-ui.com/modules/dropdown.html#/settings
       $(".blueprint_list").dropdown("destroy").dropdown({
          on : 'customClick',
					onShow: function(){
						sortable["blueprint"].option("disabled", true);
					},
					onHide:function(){
						sortable["blueprint"].option("disabled", false);
					}
        });
				
				if(!sortable["blueprint"]){
					sortable["blueprint"] = new Sortable(id("blueprint_drag"),{
						animation: 150,
						forceFallback: false
					});
					
				}

				
      });
    });
}