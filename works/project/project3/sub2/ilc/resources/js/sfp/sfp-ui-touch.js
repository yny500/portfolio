/**
 * 우선 이전에 쓰던거임 추후 새로 개발
 * by MHD
 */
$(function(){

	window.POP_TOUCH = (function(){
		var settings = {
				number : {
					keys : [[1, 2, 3], [4, 5, 6], [7, 8, 9], [{value :'Del', isDel : true}, 0, { value : 'OK', isEnter : true}]]
				},
				number_text : {
					keys : [[1, 2, 3], [4, 5, 6], [7, 8, 9], [{value :'Del', isDel : true}, 0, { value : 'OK', isEnter : true}]]
				},
				float : {
					keys : [[1, 2, 3], [4, 5, 6], [7, 8, 9], [{value :'Del', isDel : true}, 0, '.'], [{ value : 'OK', isWide : true, isEnter : true}]]
				},
				text : {
					keys :  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-'], ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '_'],
				             ['A', 'S', 'D', 'F', 'G', 'H', 'J' , 'K', 'L'],['Z', 'X', 'C', 'V', 'B', 'N', 'M',  {value :'Del', isDel : true}, { value : 'OK', isEnter : true}]]
				},
				password : {
					keys :  [['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+']
							, ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 , '_', '=']
							, ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}' ]
							, ['A', 'S', 'D', 'F', 'G', 'H', 'J' , 'K', 'L', ':', ';', '"', '\'']
							, ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>',  ',', '.','?', '/']
							, ['[', ']', {value :'Del', isDel : true, isWide : true}, { value : 'OK', isEnter : true, isWide : true}]]
				}
		}, $callBack, callbackFn, $keypad;

		var init = function(){
			if(!Dialog.isDialog()){
				_generateKeypad();
				_keyPadEvent();

			}
			_bindEvent();
		},
		_generateKeypad = function(){
			var html = ["<div class = 'keypad-wrap'>"]
			for(var id in settings){
				var keyset = settings[id];
				var key = keyset.keys;
				id == "password" ? html.push("<div class = 'keypad ", id, "'><div><input type='password' data-nokeypad='true' readonly='readonly'></div><ul>")
				 				: html.push("<div class = 'keypad ", id, "'><div><input type='text' data-nokeypad='true' readonly='readonly'></div><ul>");
				for(var i = 0, len = key.length ; i < len ; i++){
					var rowKeys = key[i];
					html.push("<div><ul>")
					for( j = 0 , jlen = rowKeys.length ; j < jlen ; j++ ){
						html.push("<li ", rowKeys[j].isDel ? "data-del='true'" : "",
								rowKeys[j].isEnter ? "data-enter='true'" : "", " class='keybtn")
						if(rowKeys[j].isWide){
							html.push(" wide");
						}
						html.push("'>", rowKeys[j].value == undefined? rowKeys[j] : rowKeys[j].value, "</li>")
					}
					html.push("</ul></div>")
				}
				html.push("</div>");

			}
			html.push("</div>");
			_appendHtml(html);
		},
		_appendHtml = function(keyHtml){
			$keypad = $(keyHtml.join(""))
			$("body").append($keypad);
		},
		_keyPadEvent = function(){
			$(".keypad .keybtn").on("click", function(e){
				var $this = $(this);
				var $keyPad = $this.closest(".keypad");
				var $val = $keyPad.find("input");
				var value = $val.val();
				if($this.data("del")){
					$val.val(value.substring(0,value.length-1));
				}else if($this.data("enter")){
					hide();
					if($.isFunction(callbackFn)){
						if($keyPad.hasClass("number")){
							value = value == "" ? 0 : parseInt(value);
						}
						callbackFn.call(this, value);
					}
				}else{
					value = value + $this.text();
					if($keyPad.hasClass("number")){
						value = value == "" ? 0 : parseInt(value);
					}else if($keyPad.hasClass("float")){
						value.slice(-1) == ".";
						value = value == "" ? 0 : ( value.indexOf(".") >= 0 ? value : parseFloat(value));
					}
					$val.val(value);
				}
			});
		},
		_bindEvent = function(){
			$(document).on("click"
					, "input[type='text']:not([data-nokeypad='true']) , input[type='number']:not([data-nokeypad='true']), input[type='password']:not([data-nokeypad='true'])", function(e){
				$callBack = $(e.target);
				show($callBack.val(), notifyChange, $callBack.data("valid") ? $callBack.data("valid") : $callBack.attr("type"));
			});
			$(document).click(function(e) {
				var $target = $(e.target);
				if(!$target.is("input") && $target.closest(".keypad-wrap").length == 0){
					 hide();
				}
			});
		},
		notifyChange = function(val){
			if($callBack.val() != val){
				$callBack.val(val).trigger("change");
			}
		},
		hide = function(){
			if(!Dialog.isDialog()){
				$keypad.removeClass("text number float password number_text")
			}else{
				top.POP_TOUCH && top.POP_TOUCH.hide();
			}
		},
		show = function(val, notifyChange, keypadType){
			if(!Dialog.isDialog()){
				$keypad.removeClass("text number float password number_text").addClass(keypadType).find("input").val(val);
				callbackFn = notifyChange;
			}else{
				top.POP_TOUCH && top.POP_TOUCH.show(val, notifyChange, keypadType);
			}
		};

		init();
		return {
			hide : hide,
			show : show
		}})();
})
