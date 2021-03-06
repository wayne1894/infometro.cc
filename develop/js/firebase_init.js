var DB
var user_uid;
var user_email;
var isAnonymous;

firebase.initializeApp({
	apiKey: "AIzaSyAalJEx21SpnVU5q5lW0eTSVPTz18s2Hy8",
	authDomain: "infometro-cc.firebaseapp.com",
	databaseURL: "https://infometro-cc.firebaseio.com",
	storageBucket: "infometro-cc.appspot.com",
	messagingSenderId: "358423331162"
});
firebase.auth().onAuthStateChanged(function (data) {
	DB = firebase.database();
	if (data) { //使用者已登入
		print("User is logined.");
		user_uid = data.uid;
		user_email = data.email;
		if (data.isAnonymous) isAnonymous=true;
		if(user_uid=="lVAHfyuy4gN4UmiJ7WMYtIwKDts2"){
		  $.cookie("ga","N",{ expires: 365 });
		}
		if ( get_page()== "main" || get_page()== "dashboard")_is_login();
		if ( get_page()== "index"){
			set_location_button();
			if($.cookie("login")=="Y"){
				remove_login_button();
				$.removeCookie("login");
				location_main();
			}else{
				if(!isAnonymous){
					$("#google_html").html("已登入Google 直接進入");
					$("#google_button").css("background-color","#d14836").removeClass("loading");
				}
			}
		}
	} else {
		if ( get_page()== "main") location.replace("/"); //登出
	}
});

function logout() {
  firebase.auth().signOut().then(function () {
    window.location.href = "/"
  })
}
function check_login_button(){
	if($("#fb_button").hasClass("loading") || $("#google_button").hasClass("loading") || $("#anonymous_button").hasClass("loading"))return true;
}
function remove_login_button(){
	$("#fb_button").removeClass("loading")
	$("#google_button").removeClass("loading")
	$("#anonymous_button").removeClass("loading")
}
function google_login() {
  if (user_uid != undefined)return location_main();
  if(DB==undefined) return setTimeout(google_login,200);
  if(check_login_button())return
  $("#google_button").addClass("loading");
  var provider = new firebase.auth.GoogleAuthProvider();
  //signInWithPopup signInWithRedirect
  $.cookie("login", "Y");
  firebase.auth().signInWithRedirect(provider).then(function(result){
    location_main();
  }).catch(function(error) {
    remove_login_button();
  });
}
function anonymous_login() {
	if (user_uid != undefined)return location_main();
	if(DB==undefined) return setTimeout(anonymous_login,200);
	if(check_login_button())return
	$("#anonymous_button").addClass("loading");
  firebase.auth().signInAnonymously().then(function(result){
		location_main();
	}).catch(function(error) {
		remove_login_button();
	});
}
function set_user_info(fn){ //使用者初始化資訊
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
  DB.ref('users/' + user_uid).set(data).then(load_blueprint_info(fn));
}
function load_blueprint_info(fn){ //藍圖初始化資訊
  var newRef = DB.ref('blueprint/' + user_uid).push();
  var newLine = [];
  newLine.push(line_json("橘線", "#FF6900", true)); //新增第一條線
  newLine[newLine.length - 1].metro.push(metro_json("總站")); //第一條線下面的站
  newRef.set(blueprint_json("我的地鐵計畫",newLine)).then(function(){
    if (typeof fn == "function") fn();
  })
}
function blueprint_json(name,line) {
  return {
    name: name,
    line: line,
    url_name : "",
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

function blueprint_init(load_fn) { //載入地鐵初始化
  DB.ref('blueprint/' + user_uid).on("value", function (data) {
    var _action = vm.action; //操作動作執行  
    var _init = [];
    data.forEach(function (childData) {
      _init.push(childData.val());
      _init[_init.length - 1].key = childData.key;
    });
    if(_action != "load"){
      if (_init.length == 0) return load_blueprint_info();
    }
    vm.blueprint = _init;
		var index_array = [];
		if (_init[0].line) {
			for (var j = 0; j < _init[0].line.length; j++) {
				index_array.push([]);
				index_array[index_array.length - 1].check = false; //必要，這樣至少才有一個初始資料
			}
    }
		$.extend(index_array, vm.index[0]);
    vm.index[0] = index_array; //更新索引
 
		if (vm.blueprint[0].line.length != vm.index[0].length) {//修補程式(不常發生)
			var _line = vm.blueprint[0].line;
			var _index = vm.index[0];
			var index_array = []
			for (var i = 0; i < _line.length; i++) {
				if (vm.index[0][i]!=undefined) {
					index_array.push(vm.index[0][i]);
				} else {
					index_array.push({check:false});
					index_array[index_array.length - 1].check = false;
				}
			}
			print("重新更新索引");
			vm.index[0] = index_array;//更新索引
		}

    if(_action=="swap_metro"){
      show_event_fn(undefined,"你交換了地鐵站的位置");
    } else if(_action=="delete_metro"){
      show_event_fn("刪除成功","你刪除了一個地鐵站");
    } else if(_action=="new_metro"){
      show_event_fn("新增成功","你新增了一個地鐵站");
    } else if(_action=="drop_line"){
      show_event_fn("移動成功","你將地鐵站移到其他支線裡頭");
    } else if(_action=="re_name"){
      show_event_fn("名字更改成功","");
    } else if(_action=="edit_color"){
      show_event_fn(undefined,"你更改了支線的顏色");
    } else if (_action == "new_line") {
      vm.index_update();
      show_event_fn("新增成功","你新增了一條支線");
      vm.exchange_line(vm.index[0].length - 1);
    } else if(_action=="delete_line"){
      show_event_fn("刪除成功","你刪除了一條支線");
    } else if (_action == "swap_line") {
      vm.index_update();
      show_event_fn(undefined,"你交換了支線的位置");
    } else if (_action == "load") {
      $("#top_tag").stop().fadeOut(0);
			vm.update_index_line(vm.index[0]);
			vm.update_index_line_check();
			vm.update_selection_color();
			vm.update_metro_key(vm.index[0][vm.index_line]);
      vm.action_move=1;
      setTimeout(move_center, 0);
      load_fn();
    }
    vm.action = "";
  })
}
//程式進入點
function _is_login() {
  DB.ref('users/' + user_uid).once('value', function (data) { //載入使用者基本資料
    if (data.val()) {
      vm.users = data.val();
      vm_header.users=data.val();
    } else { //沒有會員資料
	  set_user_info(_is_login);
      return false;
    }
  });
  DB.ref('users_data/' + user_uid +"/index").once('value', function (data) { //載入user_data
    if (data.val()) vm.index = data.val();
  }).then(function () {
    blueprint_init(function(){//這裡只要vm.load會執行
      start_set();
      lighning_bind();      
    });
  });
}