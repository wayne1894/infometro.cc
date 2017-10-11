 function move_center() {
   $("#top_tag li.active").velocity("scroll", { 
       axis: "x",
       duration: 0,
       container: $("#top_tag"),
       complete: function(){
           $("#top_tag").show();
       }
   });
   $("#top_tag").velocity("stop").velocity("fadeIn",{ duration: 350 })
   vm.action_move=0;
 }
 $(function () {
   //http://velocityjs.org/#scroll
   $(".triangle.left").click(function(){
      $("#top_tag").velocity("stop").velocity('scroll', {
          container: $("#top_tag"),
          offset: -200,
          duration: 250,
          axis: 'x'
      });
   });
   $(".triangle.right").click(function(){
      $("#top_tag").velocity("stop").velocity('scroll', {
          container: $("#top_tag"),
          offset: 70,
          duration: 250,
          axis: 'x'
      });
   });
     
     
     
   var hammertime = new Hammer(document.getElementById("top_tag_parent"))
   hammertime.on('panleft panright', function(ev) {
       print(ev.type)
     if(ev.type=="panleft"){
         $(".triangle.right").click()
     }else{
         $(".triangle.left").click()
     }
   });
 })