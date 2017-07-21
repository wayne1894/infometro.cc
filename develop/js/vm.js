var vm = new Vue({
  el: '#main',
  data: {
    blueprint: [],
    index: [],
    index_blueprint: 0,
    index_line: 0,
    info_active: "",
    key_metro: "",
    action: "load",
    action_move: 0,
    info: [],
    users: [],
    mode: 1,
    pick_master: undefined,
    pick_color: undefined,
    url_info: undefined,
    filter_search: "",
    is_nav: false ,
    search_info : [],
    search_metro : [],
    drag_line_key : "",
    drag_metro_key : ""
  },
  mounted: function () {
    $("#main").css("visibility", "visible");
  },
  updated: function () {
    setTimeout(function () {
      $(window).resize();
    }, 0);
    $("#board_info .ui.active").show();
    if(vm.action_move==1)setTimeout(move_center, 0);
  },
  firebase: {
    //watch:key_metro
  },
  computed: {
    master_line_color: function () { //主線目前一律是line 0
      if (this.blueprint.length == 0) return "";
      if (this.pick_color && this.pick_master) return this.pick_color;
      return this.get_blueprint().line[0].color;
    },
    line: function () { //載入line
      if (this.blueprint.length == 0) return "";
      return this.get_blueprint().line;
    },
    line_color: function (index) {
      if (this.blueprint.length == 0) return "";
      if (this.pick_color && !this.pick_master) return this.pick_color
      return this.get_line().color;
    },
    metro: function () { //載入metro
      if (this.blueprint.length == 0) return "";
      var _line=this.get_line();
      if(_line==undefined)vm.exchange_line(0);   
      return _line.metro;
    },
    line_name: function(){
      if (this.blueprint.length == 0) return "";
      return this.get_line().name;
    },
    metro_name: function () {
      if (this.blueprint.length == 0) return "";
      return this.get_metro().name;
    },
    metro_create: function () {
      if (this.blueprint.length == 0) return "";
      var timestamp = this.get_metro().timestamp;
      if (timestamp == undefined) return "";
      //http://momentjs.com/
      return moment(timestamp).format("lll");
    },
    info_count: function () {
      if (this.blueprint.length == 0) return "";
      return this.info.length;
    },
    info_favorites: function () {
      var _info = this.info.filter(function (info) {
        if (info.favorite) {
          if (info.url_info) { //有網址資訊
            return true
          } else {
            return false;
          }
        }
        return false;
      });
      if (_info.length == 0) return false
      return _info
    },
    info_sort_filter: function () { //資訊的排序與過濾
		if (this.blueprint.length == 0) return "";
	  	var _sort=this.info;
			if(vm.filter_search){
				_sort=_sort.filter(function (info) { //先從濾鏡開始
					return info.message.indexOf(vm.filter_search) > -1
				})
			}
			var favorites_sort=[];
			var new_sort=[];
			for(var i=0;i<_sort.length;i++){
				if(_sort[i].favorite){
					favorites_sort.push(_sort[i]);
				}else{
					new_sort.push(_sort[i]);
				}
			}
//      new_sort = new_sort.sort(function (a, b) {
//        if (a.update_timestamp > b.update_timestamp) return -1; //照timestamp
//        return 1;
//      });
			return [].concat(new_sort,favorites_sort);

    }
  },
  filters: {
    message_filter: function (message) {
      message = message.replace(/\</g, "&lt;");
      message = message.replace(/\>/g, "&gt;");
      message = urlify(message); //轉成超連結
      message = message.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      message = message.replace(/ /g, "&nbsp;");
      message = message.replace(/\<a&nbsp;href=/g, "<a href=");
      setTimeout(function () {
        $("#board_info .info_message").find("a").css("color", vm.line_color).attr("target", "_blank");
      }, 5)
      return message;
    }
  },
  watch: {
    info_active: function () {
      var _index = this.get_index_line();
      if (!_index.info_active) _index.info_active = [];
      _index.info_active[vm.key_metro] = this.info_active || "";
      vm.index_update();
    },
    key_metro: function () {
      //https://github.com/vuejs/vuefire
      var _ref = DB.ref("info/" + vm.get_line_key() + "/metro/" + vm.key_metro).orderByChild("update_timestamp");
      vm.$bindAsArray('info', _ref);
      var _index = this.get_index_line();
      _index.key_metro = this.key_metro;
      if (_index.info_active) { //等下會更新到，這邊就不用更新了
        var _active = _index.info_active[this.key_metro];
        this.info_active = _active;
        //        setTimeout(function(){
        //          $("#"+_active).velocity("scroll",{duration: 0,offset: -250});
        //        },50);

      } else {
        vm.index_update();
      }
      vm.leave_edit_info();
      _ref.on("child_added", function (snapshot) { //元件載入後的動作
        setTimeout(function () {
          $("#board_info .dropdown").dropdown("destroy").dropdown();
        }, 5)
      })
    }
  },
  methods: {
    get_youtube_embed: function (item) {
      if (item.url_info && item.url_info.youtube) {
        setTimeout(function () {
          //https://semantic-ui.com/modules/embed.html#/definition
          //autoplay: true
          $("#" + item['.key']).find(".ui.embed:not(.active)").embed();
        }, 5);
        return "flex_youtube"; //順便傳回class
      }
      return "";
    },
    get_favorite_style: function (favorite, color) {
      if (favorite) {
        return {
          color: color
        }
      }
      return {}
    },
    is_master: function () {
      if (this.blueprint.length == 0) return "";
      if (vm.index_line == 0) return true;
      return false
    },
    color_gradient: function (color) {
      return "linear-gradient(to right, #000 50%, " + color + " 0%)";
    },
    mode_txt: function () {
      if (!sortable['blueprint']){
        if(this.mode==0)return "一般模式";
        if(this.mode==1)return "編輯模式";
      } 
      if (this.mode == 0) { //一般模式
        setTimeout(function () {
          sortable["metro"].option("disabled", true);
          sortable["line"].option("disabled", true);
        }, 5)
        return "一般模式"
      } else if (this.mode == 1) { //編輯模式
        setTimeout(function () {
          sortable["metro"].option("disabled", false);
          sortable["line"].option("disabled", false);
        }, 5)
        return "編輯模式"
      } else if (this.mode == 1.5) {
        return "編輯模式"
      }
    },
    mode_click: function () {
      var mode_num = this.mode;
      mode_num = Math.floor(mode_num + 1);
      if (mode_num > 1) mode_num = 0;
      this.mode = mode_num;
    },
    mode_class: function () {
      if (this.mode == 0) { //一般模式
        //male,mouse pointer
        return "male"
      } else if (this.mode == 1) { //編輯模式
        //wizard
        return "configure"
      } else if (this.mode == 1.5) {
        return "trash"
      }
    },
    index_update: function () {
      var data = JSON.parse(JSON.stringify(vm.index)); //將傳址改為傳值
      setTimeout(function(){
        DB.ref('users_data/' + user_uid + "/index").set(data);
      },0)
    },
    更新藍圖: function (key, data) {
      if (key == undefined || data == undefined) {
        data = vm.get_blueprint();
        key = data.key;
      }
      setTimeout(function () {
        DB.ref('blueprint/' + user_uid + "/" + key).set(data);
      }, 0)

    },
    get_blueprint: function (index) { //得到藍圖(傳入index為其他藍圖)
      if (index != undefined) return this.blueprint[index];
      return this.blueprint[this.index_blueprint];
    },
    get_index_blueprint: function () { //得到當前藍圖索引資料
      return vm.index[vm.index_blueprint];
    },
    get_line: function () {
      return this.get_blueprint().line[this.index_line]
    },
    get_index_line: function () { //得到當前支線索引資料
      return vm.index[vm.index_blueprint][vm.index_line];
    },
    update_index_line: function (index_array) {
      var _index = 0;
      for (var i = 0; i < index_array.length; i++) {
        if (!index_array[i]) {
          index_array[i] = [];
          index_array[i].check = false;
        }
        if (index_array[i].check) {
          _index = i;
          break;
        }
      }
      vm.index_line = _index;
    },
    update_index_line_check: function () {
      var index_array = vm.get_index_blueprint();
      for (var i = 0; i < index_array.length; i++) {
        if (!index_array[i]) index_array[i] = [];
        index_array[i].check = false;
      }
      index_array[vm.index_line].check = true;
    },
    update_selection_color: function () { //更換selection的顏色
      var _color = vm.line_color;
      if (!document.getElementById("selection")) {
        var style = document.createElement('style');
        style.id = 'selection';
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
      }
      document.getElementById("selection").innerHTML = "::selection {background: " + _color + ";color: #fff;}::-moz-selection {background: " + _color + ";color: #fff;}img::selection {background: " + _color + ";color: #fff;}img::-moz-selection {background: " + _color + ";color: #fff;}";
    },
    update_metro_key: function (index_array) {
      var _metro = this.get_line().metro;
      var is_check = false;
      if (index_array.key_metro) { //代表有選到的結點
        for (var i = 0; i < _metro.length; i++) {
          if (_metro[i]._key == index_array.key_metro) {
            vm.key_metro = _metro[i]._key;
            is_check = true;
            break;
          }
        }
        if (!is_check) vm.key_metro = _metro[0]._key; //如果都沒有把第一個給他(或選中間)
      } else { //使用預設		
        vm.key_metro = _metro[0]._key; //如果都沒有把第一個給他(或選中間)
      }

    },
    new_blueprint: function () { //新增藍圖
      if(vm.action=="load")return;
      vm.action = "new_blueprint";
      var newRef = DB.ref('blueprint/' + user_uid).push();
      var newLine = [];
      newLine.push(line_json("橘線", "#FF6900", true)); //新增第一條線
      newLine[newLine.length - 1].metro.push(metro_json("總站")); //第一條線下面的站
      newRef.set({ //將他存到藍圖
        name: "我的地鐵計畫",
        line: newLine,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
    },
    delete_blueprint: function (key) { //刪除藍圖
      $('.ui.modal').modal("refresh");
      setTimeout(function () {
        $("#blueprint_delete_modal").modal({
          inverted: true,
          closable: false
        }).modal('show');
      })
      $("#blueprint_delete_name").html(vm.get_blueprint().name);
      $("#blueprint_delete_button").off("dblclick").on("dblclick", function () {
        var index; //從刪除KEY找到他排在陣列的第幾個
        for (var i = 0; i < vm.blueprint.length; i++) { //找到刪除的index
          if (vm.blueprint[i].key == key) {
            index = i;
            break;
          }
        }
        vm.action = "delete_blueprint";
        var _line = vm.blueprint[index].line;
        for (var i = 0; i < _line.length; i++) vm.delete_info_line(_line[i]._key); //刪除info
        if (vm.blueprint.length > 1) {
          vm.index.splice(index, 1); //刪除索引
          vm.index_update(); //更新index
          vm.index_line = 0;
          vm.index_blueprint = 0;
          vm.update_index_line(vm.index[vm.index_blueprint]);
          vm.update_index_line_check();
          vm.update_selection_color();
          setTimeout(function () {
            vm.update_metro_key(vm.index[vm.index_blueprint][vm.index_line]);
          }, 0)

          DB.ref('blueprint/' + user_uid + "/" + key).remove();
        } else {
          DB.ref('blueprint/' + user_uid + "/" + key).remove().then(function () {
            vm.index.splice(index, 1); //刪除索引
            vm.index_update(); //更新index
            location.reload();
          })
        }
        $("#blueprint_delete_button").off("click");
        $("#blueprint_delete_modal").modal("hide");
      })
    },
    檢查更新錯誤索引: function (index,_vm_blueprint) { //修補程式(不常發生)
      if (!_vm_blueprint[index]) return ;
      if (_vm_blueprint[index].line.length != vm.index[index].length) {
        var _line = _vm_blueprint[index].line;
        var _index = vm.index[index];
        var index_array = []
        for (var i = 0; i < _line.length; i++) {
          if (vm.index[index][i]!=undefined) {
            index_array.push(vm.index[index][i]);
          } else {
            index_array.push({check:false});
            index_array[index_array.length - 1].check = false;
          }
        }
        print("重新更新索引");
        vm.index[index] = index_array;
      }
    },
    exchange_blueprint: function (index, target, event) { //切換藍圖
      if (vm.action != "load" && vm.index_blueprint == index) {
        if (event && $(event.target).hasClass("blueprint_i")) {
          $(event.target).trigger("customClick");
        };
        return; //重覆就離開
      }    
      vm.檢查更新錯誤索引(index,vm.blueprint);
      if (index >= vm.blueprint.length) index = 0;
      $("#top_tag").stop().fadeOut(0);
      $.cookie("index_blueprint", index);
      if (event && event.target) {
        if (event.target.className != undefined) {
          if (event.target.className.indexOf("blueprint_a") > -1 || event.target.className.indexOf("blueprint_i") > -1) {
            target = true;
          }
        }
      }
      if (target) {
        vm.index_blueprint = index; //重新安排
        vm.update_index_line(vm.index[index]);
        vm.update_index_line_check();
        vm.update_selection_color();
        vm.update_metro_key(vm.index[index][vm.index_line]);
      }
      vm.action_move=1;
      setTimeout(move_center, 0);
      
    },
    exchange_line: function (index) {
      if (vm.index_line == index) return; //重覆就離開
      $("#top_tag").stop().fadeOut(0);
      if ($("html").hasClass("re_name")) { //解決編輯按兩下的BUG
        return setTimeout(function () {
          _el();
        }, 0)
      }
      _el();

      function _el() {
        vm.index_line = index;
        if (!vm.get_index_blueprint()[index]) vm.replace_index(); //重新設定index
        vm.update_index_line_check();
        vm.update_selection_color();
        vm.update_metro_key(vm.get_index_blueprint()[index]);
        vm.action_move=1;
        setTimeout(move_center,0);
      }
    },
    replace_index: function () { //修補程式(不常發生)
      var _line = vm.get_blueprint().line;
      var _index_blueprint = vm.get_index_blueprint();
      var j = _line.length - _index_blueprint.length;
      for (var i = 0; i < j; i++) _index_blueprint.push([]); //新增line的index陣列
      print("重新設定了index");
    },
    new_line: function () {
      if(vm.action=="load")return;
      var data = this.get_blueprint();
      var get_index = vm.get_index_blueprint();
			remove_start();
      if (!data.line) data.line = []; //如果沒有line就新增一個空陣列
      var get_color = vm.get_default_color(data.line.length);
      var _j = line_json("未命名", get_color);
      _j.metro.push(metro_json("總站"));
      data.line.push(_j);
      get_index.push({check:false}); //新增line的index陣列
      vm.action = "new_line";
      vm.更新藍圖(data.key, data);
    },
		find_line_index: function(key, data){
			for (var i = 0; i < data.line.length; i++) {
					if (data.line[i]._key == key) {
						return i;
					}
				}
		},
    move_line: function (key) {
      var data = vm.get_blueprint();
      var index= vm.find_line_index(key,data);
      if (index == undefined) return
      var _line = data.line.splice(index, 1);
      vm.get_index_blueprint().splice(index, 1); //移除line的index索引陣列
      if (vm.index_line >= index) { //刪除到小於自已-就往前倒退索引(同刪除藍圖)
        var new_index = vm.index_line - 1;
        if (new_index < 0) new_index = 0;
        vm.index_line = new_index; //重新安排
      }
      vm.update_metro_key(vm.get_index_line());
      vm.更新藍圖(data.key, data);
      return _line
    },
    delete_line: function (key) {
      var data = vm.get_blueprint();
      var index= vm.find_line_index(key,data);
      if (index == undefined) return
      $('.ui.modal').modal("refresh");
      setTimeout(function () {
        $('#line_delete_modal').modal({
          inverted: true,
          closable: false
        }).modal('show');
      }, 0)
      var _color = data.line[index].color;
      $('#line_delete_modal').css("borderTopColor", _color);
      $("#line_delete_button").css("backgroundColor", _color);
			$(document).on("keydown.line_delete",function(event){
        if (event.which == 13 ) { //enter
					_fn();
        } else if (event.which == 27) { //esc
          $('#line_delete_modal').modal("hide");
					$("#line_delete_button").off("click");
					$(document).off("keydown.line_delete");
        }
      })
      $("#line_delete_button").off("click").on("click",_fn);
			function _fn(){
				data.line.splice(index, 1); //移除line
        vm.get_index_blueprint().splice(index, 1); //移除line的index索引陣列
        if (vm.index_line >= index) { //刪除到自已或小於自已-就往前倒退索引(同刪除藍圖)
          var new_index = vm.index_line - 1;
          if (new_index < 0) new_index = 0;
          vm.index_line = new_index; //重新安排
        }
        vm.update_metro_key(vm.get_index_line());
        vm.action = "delete_line";
        vm.更新藍圖(data.key, data);
        vm.delete_info_line(key);
        $("#line_delete_button").off("click");
        $("#line_delete_modal").modal("hide");
				$(document).off("keydown.line_delete");
			}
    },
    get_line_key: function () {
      return vm.get_line()._key;
    },
    new_metro: function (order) {
      var _metro = metro_json("未命名");
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      data.line[vm.index_line].metro.splice(order, 0, _metro);
      vm.action = "new_metro";
      remove_start();
      this.更新藍圖(data.key, data);
    },
    check_metro: function (key) {
      if (vm.key_metro == key) return "active"
    },
    exchange_metro: function (key) {
      this.key_metro = key;
    },
    find_metro_index: function (key, data) {
      var _metro = data.line[this.index_line].metro;
      for (var i = 0; i < _metro.length; i++) {
        if (_metro[i]._key == key) {
          return i
        }
      }
    },
    move_metro: function (move_key, _line_index) {
      var data = this.get_blueprint();
      if (data.line[this.index_line].metro.length <= 1) return
      var index = vm.find_metro_index(move_key, data);
      if (index == undefined) return;
      var _metro = data.line[this.index_line].metro.splice(index, 1);
      if (this.key_metro == move_key) { //代表刪到選取的站,要重新更換key_metro
        var _index = index - 1;
        if (_index < 0) _index = 0;
        var new_metro_key = data.line[this.index_line].metro[_index]._key;
        this.key_metro = new_metro_key;
      }
      DB.ref("info/" + data.line[this.index_line]._key + "/metro").child(move_key).once("value", function (old_data) {
        DB.ref('info/' + vm.get_blueprint().line[_line_index]._key + "/metro/" + move_key).set(old_data.val());
        DB.ref("info/" + data.line[vm.index_line]._key + "/metro").child(move_key).remove();
      })
      return _metro
    },
    delete_metro: function (delete_key) { //與move_metro雷同
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      if (data.line[this.index_line].metro.length <= 1) {
        //在這裡要把line也刪除
        return;
      }
      var index = vm.find_metro_index(delete_key, data);
      if (index == undefined) return;
      $('.ui.modal').modal("refresh");
      setTimeout(function () {
        $('#metro_delete_modal').modal({
            inverted: true,
            closable: false
        }).modal('show');
      }, 0);
      var _color = vm.line_color;
      $('#metro_delete_modal').css("borderTopColor", _color);
      $("#metro_delete_button").css("backgroundColor", _color);
      $("#metro_delete_button").off("click").on("click", function () {
          _del_metro();
          $("#metro_delete_button").off("click");
          $("#metro_delete_modal").modal("hide");
      })
      function _del_metro(){
          data.line[vm.index_line].metro.splice(index, 1);
          if (vm.key_metro == delete_key) { //代表刪到選取的站,要重新更換key_metro
              var _index = index - 1;
              if (_index < 0) _index = 0;
              var new_metro_key = data.line[vm.index_line].metro[_index]._key;
              vm.key_metro = new_metro_key;
          }
          vm.action = "delete_metro";
          vm.更新藍圖(data.key, data);
          DB.ref("info/" + data.line[vm.index_line]._key + "/metro").child(delete_key).remove();
      }	
    },
		swap_metro: function (oldIndex, newIndex) {
      if (oldIndex == newIndex) return;
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      var data_metro = data.line[this.index_line].metro

      function get_key(key) {
        for (var i = 0; i < data_metro.length; i++) {
          if (data_metro[i]._key == key) return i;
        }
      };
      var new_metro = [];
      $("#top_tag li").each(function () {
        var index_key = get_key($(this).data("key"));
        new_metro.push(data_metro[index_key]);
      });
      data.line[this.index_line].metro = new_metro;
      vm.action = "swap_metro";
      vm.更新藍圖(data.key, data);
    },
    get_metro: function () {
      var _line = this.get_line();
      var _key_metro = vm.key_metro;
      var _m = _line.metro;
      var _index = 0
      for (var i = 0; i < _line.metro.length; i++) {
        if (_line.metro[i]._key == _key_metro) {
          _index = i;
          break;
        }
      }
      return _line.metro[_index];
    },
    new_info: function () { //新增資訊
      var board_textarea = $.trim($("#board_textarea").val());
      if (board_textarea == "") return;
      var _data = {
        message: board_textarea,
        favorite: false,
        url_info: "",
		update_timestamp: firebase.database.ServerValue.TIMESTAMP,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        users: user_uid,
        file_id : $("#uploadFileParent").data("file_id") || "",
        file_url : $("#uploadFileParent").data("file_url") || "",
        file_name : $("#uploadFileParent").data("file_name") || ""
      }
      clear_uploadFile();
      if (vm.url_info) _data.url_info = vm.url_info;
      remove_start();
      if($("#top_tag").find("[data-key='"+vm.key_metro+"']").length==0){
        vm.exchange_line(0);
        vm.exchange_line(1);
        print("目前不在任何地鐵上");
        return
      }
      
      vm.url_info = undefined; //清掉
      $("#board_textarea").val("").keyup(); //清掉
        DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).push(_data, function (error) {
        if (error) { //修補程式(不常發生)
          if (error.toString().indexOf("Permission denied") > -1) {
            set_line_root(vm.get_line_key(), user_uid );
            DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).push(_data)
            setTimeout(function () {
              print("未發現root，重新寫入root")
              location.reload();
            }, 0)

          }
        }
        });
    },
    delete_info: function (key, event) { //刪除資訊
      var $target_parent = $(event.target).closest(".board_list");
      if ($target_parent.hasClass("edit")) return;
      $delete_info = $target_parent.find("._delete_info");
      //https://semantic-ui.com/modules/dimmer.html
      //opacity : 0.7,
      $delete_info.dimmer({
        duration: {
          show: 400,
          hide: 0
        }
      }).dimmer('show');
      $delete_info.find(".send").off("click").on("click", function () {
        DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(key).remove();
        $delete_info.dimmer('hide');
      });
      $delete_info.find(".cancel").off("click").on("click", function () {
        $delete_info.dimmer('hide');
      })
    },
    delete_info_line: function (_line_key) { //從info最上層的line刪除
      DB.ref("info/" + _line_key + "/metro").remove();
      DB.ref("info/" + _line_key + "/root").remove();
    },
    favorite_info: function (item) {
      DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(item[".key"]).update({
        favorite: !item.favorite,
		update_timestamp: firebase.database.ServerValue.TIMESTAMP
      });
    },
    edit_info: function (item, dbl, event) {
      var $target_parent = $(event.target).closest(".board_list");
      if ($target_parent.hasClass("edit")) return false
      vm.leave_edit_info();
      if (dbl == "dbl" && vm.mode != 1) return false
      $("html").addClass("re_name");
      var _key = item[".key"];
      $target_parent.addClass("edit");
      var $textarea = $target_parent.find("textarea");
      $textarea.val(item.message).focus();
      $textarea.on("keyup.textarea", function (event) {
        auto_height2(this);
        if (event.keyCode == 27) vm.leave_edit_info($target_parent);
      }).keyup();
      $textarea.on('paste', function () {
        if (!item.url_info) textarea_paste2($textarea[0], item);
      });
      $target_parent.find("button.send").one("click", function () {
        if (!item.url_info) item.url_info = "";
        var board_textarea = $.trim($textarea.val());
        vm.leave_edit_info($target_parent);
        setTimeout(function(){
          $target_parent.velocity("scroll",{duration: 500,offset: -250});
        },50);
        DB.ref('info/' + vm.get_line_key() + "/metro/" + vm.key_metro).child(_key).update({
          message: board_textarea,
          url_info: item.url_info,
          update_timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      })
      $target_parent.find("button.cancel").one("click", function () {
        vm.leave_edit_info($target_parent);
      })
    },
    leave_edit_info: function ($target) {
      $(document).one("click", function () { //解決出現Chrome英文翻譯的問題
        $("html").removeClass("re_name");
      })
      if ($target) {
        $target.removeClass("edit");
        $target.off("keyup.textarea").off("paste");
        $target.find("button").off("click");
      } else {
        $(".board_list").removeClass("edit");
        $("#board_info textarea").off("keyup.textarea").off("paste");
        $("#board_info .textarea button").off("click");
      }
      
    },
    edit_name:function(event,_level){
      $("#border_"+_level+"_name").hide();
      var $textarea=$("#board_"+_level+"_textarea");
      $textarea.show();
      $textarea.focus();
      if(_level=="line"){
        var get_level=vm.get_line();
      }else if(_level=="metro"){
        var get_level=vm.get_metro();
      }
      $textarea.val(get_level.name);
      auto_height2($textarea[0]);
      $textarea.on("keydown",function(event){
        auto_height2($textarea[0]);
        if (event.which == 13 || (event.shiftKey && event.which == 13)) { //enter
		  event.preventDefault();
          get_level.name=$.trim($textarea.val().replace(/  +/g, ' ')); 
          vm.action = "re_name";
          vm.更新藍圖();
          edit_set();
        } else if (event.which == 27) { //esc
          edit_set();
        }
      })
      $(document).on("click."+_level+"_board", function (event) {
        if (event.target.id!="board_"+_level+"_textarea") edit_set();
      })
      function edit_set(){
        $(document).off("click."+_level+"_board");
        $textarea.off("keydown");
        $("#border_"+_level+"_name").show();
        $textarea.hide();
      }
    },
    re_name: function (index, _level, event ,other) { //重新命名(共用)
      if ($(event.target).hasClass("blueprint_i")) return;
      $("html").addClass("re_name");
      var $level_list = $(event.target).closest("." + _level + "_list");
      $level_list.addClass("edit");
			var sort_level=_level;
			if(other=="master")sort_level="line_master";
      if (sortable[sort_level]) sortable[sort_level].option("disabled", true);
      var _name = get_level().name;
      var $level_list_input = $level_list.find("." + _level + "_input");
      $level_list_input.select().on("keyup." + _level + "_input", function (event) {
        if (event.which == 13) { //enter
          edit_set();
          if(get_level().name==""){
            get_level().name = _name;
            return
          }
          vm.action = "re_name"
          vm.更新藍圖();
        } else if (event.which == 27) { //esc
          edit_set();
          get_level().name = _name;
        }
      })
      setTimeout(function () {
        $(document).on("click." + _level + "_input", function (event) {
          if (event.target.className.indexOf("" + _level + "_input") == -1) {
            edit_set();
            get_level().name = _name;
          };
        })
      }, 5);

      function get_level() {
        if (_level == "blueprint") {
          return vm.blueprint[index];
        } else if (_level == "line") {
          return vm.get_blueprint().line[index];
        } else if (_level == "metro") {
          return vm.get_line().metro[index];
        }
      }

      function edit_set() {
        $(document).one("click", function () { //解決出現Chrome英文翻譯的問題
          $("html").removeClass("re_name");
        })
        $level_list.removeClass("edit");
        if (sortable[_level]) sortable[_level].option("disabled", false);
        $level_list_input.off("keyup." + _level + "_input");
        $(document).off("click." + _level + "_input");
      }
    },
    get_default_color: function (k) {
      var c = ["#f2711c", "#db2828", "#fbbd08", "#b5cc18", "#21ba45", "#00b5ad", "#2185d0", "#5829bb", "#a333c8", "#e03997", "#a5673f", "#767676"][k];
      if (!c) return "#000000";
      return c;
    },
    open_color: function (index, color, master) { //打開色票選擇器(line)
      color = color.split("#")[1];
      var $et = $(event.target);
      var _left = $et.offset().left;
      var _top = $et.offset().top + $et.height() + 2;
      vm.pick_master = master;
      $("#left_color").css({
        "left": _left,
        "top": _top
      }).colpickSetColor(color).colpickShow();
      $(".colpick_submit").off("click.op").on("click.op", function () {
        vm.get_blueprint().line[index].color = "#" + $("#left_color").val();
        vm.action = "edit_color";
        vm.更新藍圖();
        $(this).off("click.op");
      });
    },
    swap_blueprint: function (oldIndex, newIndex) {

    },
    swap_line: function (oldIndex, newIndex) {
      if (oldIndex == newIndex) return;
      var data = JSON.parse(JSON.stringify(this.get_blueprint())); //將傳址改為傳值
      var new_line = [];
      var new_index = [];
      $("#line_drag li").each(function () {
        var index_key = get_key($(this).data("key"));
        new_line.push(data.line[index_key]);
        new_index.push(vm.index[vm.index_blueprint][index_key]);
      })
      data.line = new_line;
      vm.index[vm.index_blueprint] = new_index;
      vm.update_index_line(new_index);
      vm.action = "swap_line";
      vm.更新藍圖(data.key, data);

      function get_key(key) {
        for (var i = 0; i < data.line.length; i++) {
          if (data.line[i]._key == key) return i;
        }
      }
    }
  }
})
