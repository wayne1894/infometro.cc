var DB
var user_uid;
var user_email
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
		//user_uid="";
		if ( get_page()== "main")_is_login();
		if ( get_page()== "index"){
			set_location_button();
			if($.cookie("login")=="Y"){
					remove_login_button();
					$.removeCookie("login");
					location_fn();
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
function check_login_button(){
	if($("#fb_button").hasClass("loading") || $("#google_button").hasClass("loading") || $("#anonymous_button").hasClass("loading"))return true;
}
function remove_login_button(){
	$("#fb_button").removeClass("loading")
	$("#google_button").removeClass("loading")
	$("#anonymous_button").removeClass("loading")
}

function google_login(fb_login_before) {
	if (user_uid != undefined)return location_fn();
	if(DB==undefined) return setTimeout(google_login,200);
	if(fb_login_before=="fb_login_before"){
		
	}else{
		if(check_login_button())return
		$("#google_button").addClass("loading");
	}
  var provider = new firebase.auth.GoogleAuthProvider();
//signInWithPopup signInWithRedirect
  $.cookie("login", "Y");
  firebase.auth().signInWithRedirect(provider).then(function(result){
		location_fn();
	}).catch(function(error) {
		remove_login_button();
	});
}
function fb_login() {//已棄用
	if (user_uid != undefined)return location_fn();
	if(DB==undefined) return setTimeout(fb_login,200);
	if(check_login_button())return 
	$("#fb_button").addClass("loading");
  if (user_uid != undefined && !isAnonymous) return location_fn();
	//firebase to fb login
	var provider = new firebase.auth.FacebookAuthProvider();
  //signInWithPopup signInWithRedirect
  firebase.auth().signInWithPopup(provider).then(function(result){
		location_fn();
	}).catch(function(error) {
    // Handle Errors here.
    if(error.code=="auth/account-exists-with-different-credential"){
			setTimeout(function(){
				google_login("fb_login_before");
			},0)
    }else{
			remove_login_button();
		}
  });
}
function anonymous_login() {
	if (user_uid != undefined)return  location_fn();
	if(DB==undefined) return setTimeout(anonymous_login,200);
	if(check_login_button())return
	$("#anonymous_button").addClass("loading");
  firebase.auth().signInAnonymously().then(function(result){
		location_fn();
	}).catch(function(error) {
		remove_login_button();
	});
}

function load_user_info(fn) {
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
  DB.ref('users/' + user.uid).set(data).then(load_blueprint_info(fn));
}

function load_blueprint_info(fn) {
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

function blueprint_init(blueprint_fn,load_fn) {
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
        vm.check_error_index(i,_vm_blueprint);
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

//程式進入點
function _is_login() {
  DB.ref('users/' + user_uid).once('value', function (data) { //載入使用者基本資料
    if (data.val()) {
      vm.users = data.val();
    } else {//沒有會員資料
			load_user_info(_is_login);
      return false;
    }
  });
  
  DB.ref('users_data/' + user_uid +"/index").once('value', function (data) { //載入user_data
    if (data.val()) vm.index = data.val();
  }).then(function () {
    if ($.cookie('index_blueprint') != undefined) { //預設要載入的藍圖索引
      vm.index_blueprint = $.cookie('index_blueprint');
    }
    blueprint_init(function () {//這裡是變動藍圖資訊都會常態執行的fn
      setTimeout(blueprint_set, 5);
    },function(){//這裡只要vm.load會執行
      start_set();
      lighning_bind();
    });
    
  });
}