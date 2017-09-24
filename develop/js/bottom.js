	$(function () {
		$('#copyright .ui.dropdown').dropdown();
	})

	function export_line() {
		var export_json=[];
		var export_json_info=[]
		var export_num = 0;
		var export_num_use = 0;
		var _check
		
		var _color = vm.line_color;
		$('#export_modal').css("borderTopColor", _color);
		$('#export_modal').modal('hide');

		$("#send_modal_button").css("backgroundColor", _color);
		$("#download_modal_button").css("backgroundColor", _color);
		$("#send_modal_button").removeClass("loading");
		
		$('#export_modal').modal({
			inverted: true,
			closable: false
	  }).modal('show');

		function download(text, name, type) {
			var a = document.createElement("a");
			var file = new Blob([text], {type: type});
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
		}
		function load_info(key,index,fn) {
			DB.ref("info/" + key + "/metro").once("value", function (data) {
				export_json_info[index] = data.val();
				export_num_use = export_num_use + 1;
				if (export_num_use == export_num) { //代表載入完成
					fn();
				}
			})
		}
		function get_check(fn){
			for(var i=0;i<_check.length;i++){
				var _line=vm.blueprint[0].line[_check[i].id.split("---")[1]];
				var key = _line._key;
				export_json.push(_line);
				export_json_info.push([]);
				load_info(key,export_json.length-1,fn);
				export_num = export_num + 1
			}
		}

		$("#send_modal_button").off("click").one("click", function () {//寄送email
			var email = $.trim($("#modal_send").val());
			if (email == "") return;
			_check=$("#export_modal input.hidden:checked");
			if(_check.length==0)return
			$(this).addClass("loading");
			get_check(function(){
				$.post("https://us-central1-infometro-cc.cloudfunctions.net/mail", {
					"email": email,
					"subject": "infometro 資料匯出",
					"html": "檔案存於附件",
					"attachments": JSON.stringify(export_json) +"____//____"+JSON.stringify(export_json_info)
				}).done(function () {
					$("#send_modal_button").removeClass("loading");
					$('#export_modal').modal('hide');
					show_event_fn("寄送成功", "檔案已寄到您指定的信箱");
				})
			});
		})
		$("#download_modal_button").off("click").one("click", function () {//下載檔案
			_check=$("#export_modal input.hidden:checked");
			if(_check.length==0)return
			$(this).addClass("loading");
			get_check(function(){
				var t=new Date();
				var tt=t.getFullYear()+"_"+(t.getMonth()+1)+"_"+t.getDate()+"_";
				var attachments=JSON.stringify(export_json)+"____//____"+JSON.stringify(export_json_info);
				download(attachments, "infometro_"+tt+".txt", "text/plain");
				$("#send_modal_button").removeClass("loading");
				$('#export_modal').modal('hide');
				show_event_fn("下載成功", "檔案已下載");
			});
		})
	}

	function import_line() {
        var import_json ="";
        var _check
		var _color = vm.line_color;
		$('#import_modal').css("borderTopColor", _color);
		$("#import_modal_button").css("backgroundColor", _color);
		$('#import_modal').modal({
			inverted: true,
            closable: false,
            onHide: function(){
              vm.line_import = [];
              $("#uploadtxt").val("");
            }
		}).modal('show');

		$('#uploadtxt').off("change").on('change', function (e) {
    	  onChange(e);
		});
		function onChange(event) {
			var reader = new FileReader();
			reader.onload = onReaderLoad;
			reader.readAsText(event.target.files[0]);
		}
		function onReaderLoad(event){
            import_json = event.target.result;
			vm.line_import = JSON.parse(import_json.split("____//____")[0]);
		}
        function get_check(){
          var _line=[]
			for(var i=0;i<_check.length;i++){
			  _line.push(vm.line_import[_check[i].id.split("---")[1]]);
			}
          return _line;
		}
		$("#import_modal_button").off("click").one("click", function () {
           _check=$("#import_modal input.hidden:checked");
           if(_check.length==0)return
            var _line=get_check();
            var _info_str=import_json.split("____//____")[1];
			for (var j = 0; j < _line.length; j++) {
               var _line_key= DB.ref('blueprint/' + user_uid).push().key
               _line[j]._key=_line_key;	//要把line的key換成新的
				for (var k = 0; k < _line[j].metro.length; k++) {
                  var _metro_key=DB.ref('blueprint/' + user_uid).push().key;
                  _info_str = _info_str.replace(_line[j].metro[k]._key, _metro_key); //並且將info裡的替換掉
                  _line[j].metro[k]._key=_metro_key
				}
				set_line_root(_line_key, user_uid); //新增info的line

                var _info_arr=JSON.parse(_info_str)[j];
				DB.ref('info/' + _line_key + "/metro").set(_info_arr);
                vm.blueprint[0].line.push(_line[j]);
			}
            vm.update_blueprint();
			$('#import_modal').modal('hide');
		})
	}