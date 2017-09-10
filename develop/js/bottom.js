	$(function () {
		$('#copyright .ui.dropdown').dropdown();
	})

	var export_json = {};
	var export_num = 0;
	var export_num_use = 0;

	function load_info(key) {
		DB.ref("info/" + key + "/metro").once("value", function (data) {
			export_json.info[key] = data.val();
			export_num_use = export_num_use + 1;
			if (export_num_use == export_num) { //代表載入完成
				var _json = JSON.stringify(export_json);
				$('#export_modal textarea').val(_json);
				$('#modal_send').val(user_email);
				$('#export_modal').modal({
					inverted: true,
					closable: false
				}).modal('show');
			}
		})
	}

	function 匯出藍圖() {
      var key=vm.get_blueprint().key;
		export_num = 0;
		export_num_use = 0;
		var _color = vm.line_color;
		$('#export_modal').css("borderTopColor", _color);
		$('#export_modal').modal('hide');
		//$("#export_modal_button").css("backgroundColor", _color);
		$("#send_modal_button").css("backgroundColor", _color);
		$("#send_modal_button").removeClass("loading");
		$("#send_modal_button").off("click").one("click", function () {
			$(this).addClass("loading");
			var email = $.trim($("#modal_send").val());
			if (email == "") return;
			var subject = $("#export_modal_name").html();
			var attachments = $("#modal_textarea").val();

			$.post("https://us-central1-infometro-cc.cloudfunctions.net/mail", {
				"email": email,
				"subject": subject,
				"html": "檔案存於附件",
				"attachments": attachments
			}).done(function () {
				$("#send_modal_button").removeClass("loading");
				$('#export_modal').modal('hide');
				show_event_fn("寄送成功", "檔案已寄到您指定的信箱");
			})

		})

		for (var i = 0; i < vm.blueprint.length; i++) {
			if (vm.blueprint[i].key == key) {
				export_json.name = vm.blueprint[i].name;

				//$("#export_modal_name").html(export_json.name);
				$("#export_modal_name").css("color", _color);

				export_json.line = vm.blueprint[i].line;
				export_json.info = {};
				for (var j = 0; j < export_json.line.length; j++) {
					var key = export_json.line[j]._key;
					export_json.info[key] = "";
					load_info(key);
					export_num = export_num + 1
				}
				return
			}
		}
	}

	function 匯入藍圖() {
		var _color = vm.line_color;
		$('#import_modal').css("borderTopColor", _color);
		$("#import_modal_button").css("backgroundColor", _color);
		$('#import_modal').modal({
			inverted: true
		}).modal('show');
		$("#import_modal_button").one("click", function () {
			var export_json = JSON.parse($("#import_modal textarea").val());
			var json_info_str = JSON.stringify(export_json.info);
			var newRef = DB.ref('blueprint/' + user_uid).push();
			var newLine = [];
			for (var j = 0; j < export_json.line.length; j++) {
				//要把metro的key換成新的
				for (var k = 0; k < export_json.line[j].metro.length; k++) {
					var _metro_key = DB.ref('blueprint/' + user_uid).push().key;
					json_info_str = json_info_str.replace(export_json.line[j].metro[k]._key, _metro_key); //並且將info裡的替換掉
					export_json.line[j].metro[k]._key = _metro_key;
				}
				var _line_key = DB.ref('blueprint/' + user_uid).push().key; //新的line

				set_line_root(_line_key, user_uid); //新增info的line

				var json_info = JSON.parse(json_info_str);
				DB.ref('info/' + _line_key + "/metro").set(json_info[export_json.line[j]._key]);
				export_json.line[j]._key = _line_key;
			}
			newRef.set({ //將他存到藍圖
				name: export_json.name,
				line: export_json.line,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			})
			$('#import_modal').modal('hide');
			$.cookie('location_main', vm.blueprint.length - 1);
			setTimeout(function () {
				location.reload();
			}, 1000)

		})
	}