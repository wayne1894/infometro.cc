	function drop_blueprint(event, key) {
		$(event.target).closest(".blueprint_list").jrumble().trigger('stopRumble');
		var line_key = vm.drag_line_key;
		if (line_key == "") return;
		if (key == vm.blueprint[vm.index_blueprint].key) {
			print("相同的blueprint");
			return;
		}
		var _line = vm.move_line(line_key);
		_line = _line[0];
		setTimeout(function () {
			for (var i = 0; i < vm.blueprint.length; i++) {
				if (vm.blueprint[i].key == key) {
					vm.blueprint[i].line.push(_line);
					vm.index[i].push([]);
					vm.index[i][vm.index[i].length - 1].check = false;
					vm.action = "drop_blueprint";
					vm.update_blueprint(key, vm.blueprint[i]);
					vm.index_update();
					break;
				}
			}
		}, 0)
	}

	function allowDrop_blueprint(event) { //拖曳的物件移到上面
		if (vm.drag_line_key) {
			$(event.target).closest(".blueprint_list").jrumble().trigger('startRumble');
		}

		event.preventDefault(); //必要不能刪
	}

	function allowDropLeave_blueprint(event) { //拖曳的物件移出
		if (vm.drag_line_key) {
			$(event.target).closest(".blueprint_list").jrumble().trigger('stopRumble');
		}
		event.preventDefault(); //必要不能刪
	}
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

	function 匯出藍圖(key) {
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

				$("#export_modal_name").html("infometro 地鐵計畫：" + export_json.name);
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
			$.cookie('index_blueprint', vm.blueprint.length - 1);
			setTimeout(function () {
				location.reload();
			}, 1000)

		})
	}