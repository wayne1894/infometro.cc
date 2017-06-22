var DB
var user_uid;
var user_email
var isAnonymous;

$(function(){
	// Initialize Firebase 初始化
	var config = {
		apiKey: "AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",
		authDomain: "infometro-cc.firebaseapp.com",
		databaseURL: "https://infometro-cc.firebaseio.com",
		storageBucket: "infometro-cc.appspot.com",
		messagingSenderId: "358423331162"
	};
	firebase.initializeApp(config);
	DB = firebase.database();
	//[全域]監聽狀態改變
	firebase.auth().onAuthStateChanged(function (data) {
		var page=get_page();
		
		if (data) { //使用者已登入
			user_uid = data.uid;
			user_email = data.email
			if (data.isAnonymous) { //匿名使用者
				isAnonymous=true;
				DB.ref('users/' + data.uid).once('value', function (data) {
					if (!data.val()) {
						var fn = _is_login;
						if (page == "index") fn = location_fn;
						初始化使用者資訊(fn);
					} else {
						if ( page == "main") _is_login();
					}
				})
			} else {
				if ( page== "main") _is_login();
			}
		} else {
			print("User is not logined yet.");
			if ( page == "main") location.replace("/"); //登出
		}
	});
})

function logout() {
  firebase.auth().signOut().then(function () {
    window.location.href = "/"
  })
}
function get_page() {
  if(location.pathname=="/" || location.pathname=="/index.html"){  //代表首頁
    return "index";
  } else {
    return "main";
  }
}
function get_test(){
	if(location.href.indexOf("localhost:1313")>-1){//代表測試環境
		return "test"
	}
}
function location_fn(){
	if(get_test()=="test"){//代表測試環境
		location.href = "404.html";
	}else{
		location.href = "/:-D";
	}
}
function google_login() {
  if(DB==undefined) return setTimeout(google_login,500);
  if (user_uid != undefined && !isAnonymous) return location_fn();
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
     var user = result.user;
     DB.ref('users/' + user.uid).once('value', function (data) {
        if (!data.val()) {
          初始化使用者資訊(location_fn);
        } else {
          location_fn();
        }
      })
  })
}

function fb_login() {
  if(DB==undefined) return setTimeout(fb_login,500);
  if (user_uid != undefined && !isAnonymous) return location_fn();
	if(login_wait)return;
	login_wait=true
	//firebase to fb login
	var provider = new firebase.auth.FacebookAuthProvider();

  //signInWithPopup signInWithRedirect
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var user = result.user;
    DB.ref('users/' + user.uid).once('value', function (data) {
      if (!data.val()) {
        初始化使用者資訊(location_fn);
      } else {
        location_fn();
      }
    })
  }).catch(function(error) {
    // Handle Errors here.
    if(error.code=="auth/account-exists-with-different-credential"){
      google_login();
    }
  });
}
function anonymous_login() {
	if(login_wait)return;
	login_wait=true;
  if(DB==undefined) return setTimeout(anonymous_login,500);
  if (user_uid != undefined) location_fn();
  firebase.auth().signInAnonymously();
}

function 初始化使用者資訊(fn) {
  var user = firebase.auth().currentUser;
  var data = {
    name: user.displayName,
    url_name: "",
    photo: user.photoURL
  }
  //https://semantic-ui.com/views/card.html
  if (isAnonymous) {
    data.photo = "https://semantic-ui.com/images/avatar/large/elliot.jpg";
    data.name = "匿名";
  }
  $.cookie("start","Y");
  DB.ref('users/' + user.uid).set(data).then(初始化藍圖資料(fn));
}

function 初始化藍圖資料(fn) {
  var newRef = DB.ref('blueprint/' + user_uid).push();
  var newLine = [];
  newLine.push(line_json("橘線", "#FF6900", true)); //新增第一條線
  newLine[newLine.length - 1].metro.push(metro_json("總站")); //第一條線下面的站
  newRef.set(blueprint_json("我的地鐵計畫",newLine),function(error){
	if (typeof fn == "function") fn()
  })
}

function blueprint_json(name,line) {
  return {
    name: name,
    line: line,
		timestamp: firebase.database.ServerValue.TIMESTAMP
  }
}

function set_line_root(_line_key, user_uid) { //設定支線擁有者
  DB.ref('info/' + _line_key + "/root").set(user_uid);
}

function line_json(name, color) {
  var _line_key = DB.ref('blueprint/' + user_uid).push().key;
  set_line_root(_line_key, user_uid );
  return {
    _key: _line_key,
    name: name,
    color: color,
    metro: [],
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }
}

function metro_json(name) {
  return {
    _key: DB.ref('blueprint/' + user_uid).push().key,
    name: name,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }
}

function get_other_user(other_user_uid, fn) {
  DB.ref('users/' + other_user_uid).once('value', function (data) { //載入user
    if (data.val()) {
      fn(data.val())
    }
  });
}
function show_event_fn(title,text){
  var _color=vm.line_color;
  if(title==undefined)title="儲存成功";
  text='<div class="description">'+text+'</div>'
  if(text==undefined)text="";
  clearTimeout(window.show_setTimeout);
  $("#show_event").html('<div style="display:none" class="ui steps"><div class="completed step"><i class="payment icon" style="color:'+_color+'"></i><div class="content"><div class="title">'+title+'</div>'+text+'</div></div></div>');

  $("#show_event .ui").transition({
    animation : 'fade up',
    duration  : 800
  });
  window.show_setTimeout=setTimeout(function(){
    $("#show_event .ui").transition({
      animation : 'fade down',
      duration  : 1200
    });
  },2000);
}

function blueprint_init(blueprint_fn,load_fn) {
  DB.ref('blueprint/' + user_uid).on("value", function (data) {
    var _action = vm.action; //操作動作執行  
    var _init = [];
    
    data.forEach(function (childData) {
      _init.push(childData.val());
      _init[_init.length - 1].key = childData.key;
    });
    if(_action != "load"){
      if (_init.length == 0) return 初始化藍圖資料();
    }
    vm.blueprint = _init;
    var index_array = [];
    for (var i = 0; i < _init.length; i++) {
      index_array.push([]);
      if (_init[i].line) {
        for (var j = 0; j < _init[i].line.length; j++) {
          index_array[i].push([]);
          index_array[i][index_array[i].length - 1].check = false;//必要，這樣至少才有一個初始資料
        }
      }
    }

    $.extend(index_array, vm.index);
    vm.index = index_array;

    if (vm.blueprint.length != vm.index.length) { //修補程式(不常發生)
      var _array = [];
      for (var i = 0; i < _init.length; i++) {
        _array.push([]);
        if (_init[i].line) {
          for (var j = 0; j < _init[i].line.length; j++) {
            _array[i].push([]);
            _array[i][_array[i].length - 1].check = false;
          }
        }
      }
      vm.index = _array;
      vm.index_blueprint = 0;
      print("重新設定index[載入-全部重設]");
    }
    if(vm.action==""){
      var _vm_blueprint=vm.blueprint
      for(var i=0;i<_vm_blueprint.length;i++){
        vm.檢查更新錯誤索引(i,_vm_blueprint);
      }
    }
    if (_action == "new_blueprint") { //判斷動作
      var _index = vm.index.length - 1; //移到最後一個
      vm.exchange_blueprint(_index, true); //切換藍圖
      show_event_fn("新增成功","你新增了一個地鐵計畫");
      blueprint_fn();
    } else if(_action=="swap_metro"){
      show_event_fn(undefined,"你交換了地鐵站的位置");
    } else if(_action=="delete_metro"){
      show_event_fn("刪除成功","你刪除了一個地鐵站");
    } else if(_action=="new_metro"){
      show_event_fn("新增成功","你新增了一個地鐵站");
    } else if(_action=="drop_blueprint"){
      show_event_fn("移動成功","你將支線移到其他地鐵計畫裡頭");
    } else if(_action=="drop_line"){
      show_event_fn("移動成功","你將地鐵站移到其他支線裡頭");
    } else if(_action=="re_name"){
      show_event_fn("名字更改成功","");
    } else if(_action=="edit_color"){
      show_event_fn(undefined,"你更改了支線的顏色");
    } else if (_action == "new_line") {
      vm.index_update();
      show_event_fn("新增成功","你新增了一條支線");
     vm.exchange_line(vm.index[vm.index_blueprint].length - 1);
    } else if(_action=="delete_line"){
      show_event_fn("刪除成功","你刪除了一條支線");
    } else if (_action == "swap_line") {
      vm.index_update();
      show_event_fn(undefined,"你交換了支線的位置");
    } else if (_action == "delete_blueprint") {
      blueprint_fn();
      show_event_fn("刪除成功","你刪除了一個地鐵計畫");
      vm.exchange_blueprint(vm.index_blueprint, true); //切換藍圖
    } else if (_action == "load") {
      vm.exchange_blueprint(vm.index_blueprint, true); //切換藍圖
      blueprint_fn();
      load_fn();
    }
    vm.action = "";
  })
}
function blueprint_set(){
  //https://semantic-ui.com/modules/dropdown.html#/settings 
  $(".blueprint_list").dropdown("hide").dropdown("destroy").dropdown({
        on: 'customClick',
        onShow: function () {
          sortable["blueprint"].option("disabled", true);
        },
        onHide: function () {
          sortable["blueprint"].option("disabled", false);
        }
      });

      if (!sortable["blueprint"]) {
        sortable["blueprint"] = new Sortable(id("blueprint_drag"), {
          scroll: false,
          animation: 150,
          forceFallback: false,
					onEnd: function (evt) {

//						var _init=vm.blueprint;
//						var blueprint_list=$("#blueprint_drag>.blueprint_list");
//						for(var i=0;i<blueprint_list.length;i++){
//							var _key=blueprint_list.eq(i).data("key");
//							for(var j=0;j<_init.length;j++){
//								if(_key==_init[j].key){
//									vm.blueprint[j].sort=i;
//									//DB.ref('blueprint/' + user_uid)
//									break;
//								}
//							}
//						}

					}
        });

      }

}

function _is_login() { //程式進入點
  DB.ref('users/' + user_uid).once('value', function (data) { //載入使用者基本資料
    if (data.val()) {
      vm.users = data.val();
    } else {//沒有會員資料 
      初始化使用者資訊();
    }
  });
  var _ref=DB.ref('users_data/' + user_uid +"/lightning").limitToFirst(50);
  vm.$bindAsArray('lightning', _ref);
  
  DB.ref('users_data/' + user_uid +"/index" ).once('value', function (data) { //載入user_data
    if (data.val()) vm.index = data.val();
  }).then(function () {
    if ($.cookie('index_blueprint') != undefined) { //預設要載入的藍圖索引
      vm.index_blueprint = $.cookie('index_blueprint');
    }
    blueprint_init(function () {//這裡是變動藍圖資訊都會執行 
      setTimeout(blueprint_set, 5);
    },function(){//這裡只要vm.load會執行
      start_set();
    });
    
  });
}