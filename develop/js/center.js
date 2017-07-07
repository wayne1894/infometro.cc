	function drop(event){
		$("#board_edit>div>i").jrumble().trigger('stopRumble');
		var key = vm.drag_metro_key;
		if(key)vm.delete_metro(key);
		var line_key=vm.drag_line_key;
		if(line_key)vm.delete_line(line_key);
	}
	function allowDrop(event) { //拖曳的物件移到上面
		$("#board_edit>div>i").jrumble().trigger('startRumble');
		event.preventDefault();//必要不能刪
	}
	function allowDropLeave(event) { //拖曳的物件移出
		$("#board_edit>div>i").jrumble().trigger('stopRumble');
		event.preventDefault();//必要不能刪
	}

	$(function(){
		$("#board_textarea").keyup(function(e) {	
			auto_height(this)
		});
		$("#board_textarea").on('paste', textarea_paste);
	})


//center_board2 檔案上傳的部份
 $(function(){
		var obj = $("#board_enter_parent,#board_send_parent");
		obj.on('dragenter', function (e){
			e.stopPropagation();
			e.preventDefault();
		});
		obj.on('dragover', function (e){
			var files = e.originalEvent.dataTransfer.files;
			if(vm.drag_line_key || vm.drag_metro_key)return
			$("#board_send_parent>.ui.icon").css("background-color","#f7f7f7");
			e.stopPropagation();
			e.preventDefault();
		});

		obj.on('dragleave', function (e){
			var files = e.originalEvent.dataTransfer.files;
			if(vm.drag_line_key || vm.drag_metro_key)return
			$("#board_send_parent>.ui.icon").css("background-color","");
			e.stopPropagation();
			e.preventDefault();
		});
		obj.on('drop', function (e){
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;
			$("#board_send_parent>.ui.icon").css("background-color","");
			if(files.length==0)return;
			upload_file(files[0]);
		});
	})
	function clear_uploadFile(){
		$("#progress .bar").css("min-width" ,"0%");
		$("#uploadFileParent").parent().css("background-color","");

		var file_id=$("#uploadFileParent").data("file_id");
		var file_name=$("#uploadFileParent").data("file_name");
		if(file_id!=undefined){//把他刪了
			var storageRef = firebase.storage().ref();
			var desertRef = storageRef.child("file/"+vm.get_line_key()+"/"+vm.get_metro()._key+"/"+ file_id +"/"+ file_name);

			desertRef.delete().then(function() {
				//print("刪除原先的檔案");
			}).catch(function(error) {
				// Uh-oh, an error occurred!
			});

		}

		$("#uploadFileParent").data({
			file_id : "",
			file_url : "",
			file_name : ""
		});
		$('#uploadFileInput').val("");
		$("#uploadName").html("");
		$('#uploadFileParent').attr("data-tooltip","上傳檔案");

	}
	function upload_file(file){
		var name = file.name;
		//var ext= name.split(".")[1];//可以在這邊檢查不合適的副檔名

		var newfile = DB.ref("file/"+ vm.get_line_key() +"/"+ vm.get_metro()._key).push();
		newfile.set({
			name : name,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		})

		//https://firebase.google.com/docs/storage/web/upload-files
		var storageRef = firebase.storage().ref();
		var uploadTask = storageRef.child("file/"+vm.get_line_key()+"/"+vm.get_metro()._key+"/"+newfile.key+"/"+name).put(file);
		clear_uploadFile();
		uploadTask.on('state_changed', function(snapshot){
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			$("#progress .bar").css("min-width" ,progress + "%" );
			//console.log('Upload is ' + progress + '% done');
		},function(error) {
			// Handle unsuccessful uploads
		}, function() {
			$("#uploadFileParent").parent().css("background-color","currentColor");
			$("#progress .bar").css("min-width" ,"0%" );
			$('#uploadFileInput').val("");
			$('#uploadFileParent').attr("data-tooltip","重新上傳");
			$("#uploadName").html("<span style='color:#ffffff;margin-left:5px;white-space: nowrap;'>"+name+"</span><i class='delete icon' style='position: relative;left:5px;cursor:pointer;color:#ffffff;display:inline' onclick='clear_uploadFile()'></i>");
			var downloadURL = uploadTask.snapshot.downloadURL;
			$('#uploadFileInput').val("");
			$("#uploadFileParent").data({
				file_id : newfile.key,
				file_url : downloadURL,
				file_name : name
			});
			var board_textarea=$.trim($("#board_textarea").val());
			if(board_textarea==""){
				$("#board_textarea").val($("#board_textarea").val()+name);
			}else{
				$("#board_textarea").val($("#board_textarea").val()+"\n"+name);
			}
		})
	}
	$(function(){
		//https://firebase.google.com/docs/storage/web/upload-files
		$("#uploadButton").click(function() {
			$("#uploadFileInput").click();
		});
		$('#uploadFileInput').on('change', function(e) {
			if(e.target.files.length>0){
				var file = e.target.files[0];
				upload_file(file);
			}
		});
	})
//center_board2 檔案上傳的部份