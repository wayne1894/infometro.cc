function print(a){
	console.log(a)
}
function test(msg){//測試用
	$("#test").remove();
	$(document.body).append("<div id='test' style='width:50px;height:50px;position:fixed;top:0px;left:0px; z-index:10000;color:red;'>"+msg+"</div>");
}