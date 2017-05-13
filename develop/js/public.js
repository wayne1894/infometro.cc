	function print(a){
		console.log(a)
	}
	function test(msg){//測試用
		$("#test").remove();
		$(document.body).append("<div id='test' style='width:50px;height:50px;position:fixed;top:0px;left:0px; z-index:10000;color:red;'>"+msg+"</div>");
	}
	function id(a){
		return document.getElementById(a);
	}

	if (location.protocol != 'https:'){
		if(window.location.hostname!="localhost" && window.location.hostname!="127.0.0.1" ){
				location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
		}
	}  