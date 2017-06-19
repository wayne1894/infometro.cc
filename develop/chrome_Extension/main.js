

function print(a){
    console.log(a)
}
function id(a){
    return document.getElementById(a);
}
var DB
var user_uid;
var user_email
var provider;
var isAnonymous;

$(function(){
  $("#main button").click(function(){
    	provider = new firebase.auth.FacebookAuthProvider()

        //signInWithPopup signInWithRedirect
        firebase.auth().signInWithRedirect(provider).then(function (result) {
          var user = result.user;
           print(user.uid)
    
        })
  })
})

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
		if (data) { //使用者已登入
			user_uid = data.uid;
			user_email = data.email
          print(data)
		} else {
			print("User is not logined yet.");
			
		}
	});
})