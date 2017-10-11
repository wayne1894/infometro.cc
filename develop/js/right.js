	$(function () {
		//perfectScrollbar
		$("#right .r_content").perfectScrollbar();
		$("#right .r_button").on("click", function () {
			var _index = $(this).index() - 2;
			if (_index == 0) {
				$("#right_lightning").show();
			} else {
				$("#right_lightning").hide();
			}
			$(this).addClass("active").siblings().removeClass("active");
			$("#right .r_content:eq(" + _index + ")").addClass("active").siblings().removeClass("active");
		})

		$("#right .down_img ,#bottom_expand").on("click", function (event) {
            $("#right").toggleClass("down");
            var _val="";
            if($("#right").hasClass("down")==false) _val="up";
            $.cookie('right_tool', _val);
		})
        if ($.cookie('right_tool')== "up") {
            $("#right .down_img").click();
        }
		//拖動拉Bar
		$("#right .right_line").on('mousedown', function (event) {
			$(document).on('selectstart', function () {
				return false;
			})
			$(document).on('dragstart', function () {
				return false;
			})
			var max_width = $(window).width() - 120;
			var gX = ($("#right").width() - ($(window).width() - event.pageX));
			$(document).on('mousemove.line', function (event) {
				var _w = ($(window).width() - event.pageX) - gX;
				//if(_w<270)_w=270;//最小寬度
				if (_w > max_width) _w = max_width;
				$("#right").css("width", _w)
			});
			$(document).on('mouseup.line', function (event) {
				$(document).off('mouseup.line');
				$(document).off('mousemove.line');
				$(document).off('selectstart');
				$(document).off('dragstart');
			});
		})

		// https://semantic-ui.com/modules/accordion.html#/definition
		$('#right .ui.accordion').accordion(); //折疊菜單
	})

	function info_search_db(line_key, _val) {
		DB.ref("info/" + line_key + "/metro/").once("value", function (data) {
			data.forEach(function (childData) {
				for (var info_key in childData.val()) {
					if (childData.val()[info_key].message.indexOf(_val) > -1) {
						vm.search_info.push({
							line_key: line_key,
							metro_key: childData.key,
							message: childData.val()[info_key].message
						})
					}
				}
			});
		})
	}

	function info_search() { //搜尋地鐵功能
		//先從藍圖資訊找到
		return false
		var _val = $.trim($("#right_search input").val());
		vm.search_metro = [];
		vm.search_info = [];
		if (_val == "") return
		var _blueprint = vm.blueprint[0];
		for (var i = 0; i < _blueprint.line.length; i++) {
			var _key = _blueprint.line[i]._key;
			var _name = _blueprint.line[i].name;
			var _m = _blueprint.line[i].metro;
			for (var j = 0; j < _m.length; j++) {
				if (_m[j].name.indexOf(_val) > -1) {
					vm.search_metro.push({
						line_name: _name,
						line_id: i,
						metro_name: _m[j].name,
						metro_id: j
					});
				}
			}
			info_search_db(_key, _val);
		}
	}

	function lighning_bind() {
		var _ref = DB.ref('users_data/' + user_uid + "/lightning/" + vm.blueprint[0].key);
		//.limitToFirst(50)
		vm.$bindAsArray('lightning', _ref);
		_ref.once("child_added", function (snapshot) { //元件載入後的動作
			setTimeout(function () {
				$("#right .r_content").perfectScrollbar('update');
			}, 5);
		})
	}

	function lightning_send() {
		var _textarea = $.trim($("#right_lightning textarea").val());
		if (_textarea == "") return
		var data = {
			message: _textarea,
			timestamp: firebase.database.ServerValue.TIMESTAMP
		}
		DB.ref('users_data/' + user_uid + "/lightning/" + vm.blueprint[0].key).push().set(data);
		$("#right_lightning textarea").val("");
	}