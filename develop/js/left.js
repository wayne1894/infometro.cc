	function drop_line(event, index) {
		$(event.target).closest("li").jrumble().trigger('stopRumble');
		if (vm.index_line == index) return;
		var metro_key = vm.drag_metro_key;
		if (metro_key == "") return;
		var _metro = vm.move_metro(metro_key, index);
		if (_metro == undefined) return
		_metro = _metro[0];
		var data = JSON.parse(JSON.stringify(vm.get_blueprint())); //將傳址改為傳值
		data.line[index].metro.push(_metro);
		vm.action = "drop_line";
		vm.update_blueprint(data.key, data);
	}
	$(function () {
		//晃動 https://jackrugile.com/jrumble/
		$(".logo").jrumble({
			x: 2,
			y: 2,
			opacity: true,
			opacityMin: .5
		}).hover(function () {
			$(this).trigger('startRumble');
		}, function () {
			$(this).trigger('stopRumble');
		});

		$(document.body).append("<div id='left_color' style='position: absolute;left:0;top:0'></div>");
		$('#left_color').colpick({
			layout: 'hex',
			onHide: function () {
				vm.pick_color = undefined;
			},
			onChange: function (hsb, hex, rgb, el, bySetColor) {
				vm.pick_color = "#" + hex;
			},
			onSubmit: function (hsb, hex, rgb, el, bySetColor) {
				$(el).val(hex);
				$(el).colpickHide();
			}
		}).colpickHide();

		$("#left .left_line").on('mousedown', function (event) {
			$(document).on('selectstart', function () {
				return false;
			})
			$(document).on('dragstart', function () {
				return false;
			})
			// var max_width=$(window).width()-120;
			var gX = ($("#left").width() - event.pageX);
			var b_left = event.pageX - parseInt($("#board1").css("left"));
			$(document).on('mousemove.line', function (event) {
				var _w = (event.pageX) - gX;
				if (_w <= 120) _w = 120; //最小寬度
				//if(_w>max_width)_w=max_width;
				$("#left").css("width", _w);
				$("#line_parent").css("width", _w)
				$("#center").css("margin-left", _w);
				$("#edit_parent a").css("width", _w)
			});
			$(document).on('mouseup.line', function (event) {
				$(document).off('mouseup.line');
				$(document).off('mousemove.line');
				$(document).off('selectstart');
				$(document).off('dragstart');
				$("#show_event").css("left", $("#left").width() + 20);
			});
		})

	})

	function allowDrop_line(event) { //拖曳的物件移到上面
		if (vm.drag_metro_key) {
			$(event.target).closest("li").jrumble().trigger('startRumble');
		}

		event.preventDefault(); //必要不能刪
	}

	function allowDropLeave_line(event) { //拖曳的物件移出
		if (vm.drag_metro_key) {
			$(event.target).closest("li").jrumble().trigger('stopRumble');
		}
		event.preventDefault(); //必要不能刪
	}