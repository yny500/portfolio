$(function(){
	window.MessageBox = (function($){
		// show 할때 options 에 isTop 을 true 로 넘기면 다이어로그가 있어도 위에 뜸. 아닌 경우는 안뜸
		var $messageBoxList, $messageBox, $header, $body, $footer, _blinkClass = "blink", _clickClass = "clickable", exc = ["alarm", "error", "confirm"]
		, type = {
				message : {
					title : sfp.lang.getInterpreter("메세지")
					, delay : 2000
					, isBlink : true
					, isAutoHide : true
					, isClickHide : false
				}
				, info : {
					title : sfp.lang.getInterpreter("정보")
					, delay : 4000
					, isBlink : true
					, isAutoHide : true
					, isClickHide : false
				}
				, alarm : {
					title : sfp.lang.getInterpreter("경고")
					, delay : 3000
					, isBlink : true
					, isAutoHide : true
					, isClickHide : false
				}
				, error : {
					title : sfp.lang.getInterpreter("에러")
					, delay : 4000
					, isBlink : true
					, isAutoHide : true
					, isClickHide : false
				}
				, confirm : {
					title : sfp.lang.getInterpreter("확인")
					, isBlink : false
					, isAutoHide : false
					, isFooterBtn : true
					, isClickHide : false
					, cbFn : null
				}
		};
		var _init = function(){
			$messageBoxList = $("<div>", {'class' : 'sfp-message-box-list'});
			$messageBoxList.hide();
			$("body").append($messageBoxList);
			$messageBoxList.on( "click", ".btn-message-confirm, .btn-message-cancel, .clickable", function() {
				$(this).closest(".sfp-message-box").slideUp( "slow", function(){
					$(this).remove();
					if($(".sfp-message-box-list").find(".sfp-message-box").length == 0){
						$(".sfp-message-box-list").hide();
					}
				});
			});

			setInterval(blink, 1000);
		}
		, blink = function(){
			$('.sfp-message-box.blink .sfp-message-box-body').fadeOut(500).fadeIn(500);
		}
		, setType = function(options){
			type[key] = $.extend(type[key], options);
		}
		, show = function( key, msg, options ){
			if((!$.isPlainObject(options) && Dialog.hasDialog())
					|| ($.isPlainObject(options) && (options.isTop != true && Dialog.hasDialog()))){
				return;
			}

			if(Dialog.isDialog()){
				top.MessageBox.show(key, msg,  $.extend({}, options, {isTop:true}));
			} else {
				if(!window["POPHeader"] || (window["POPHeader"] && (POPHeader.isAlarmMessage() || exc.indexOf(key) >= 0))){
					if(_containMessage(msg)) return;
					var boxType = $.extend({}, type[key], options);
					var box = _getBox(key, boxType);

					box.body.html(msg);
					box.header.html(boxType.title);

					$messageBoxList.append(box.main);
					$messageBoxList.show();

					boxType.isAutoHide && setTimeout(function(){
						box.remove();
					}, boxType.delay);
				}
			}
		}
		, _containMessage = function(msg){
			var result = false;
			$messageBoxList.find(".sfp-message-box-body").each(function(){
				if(msg == $(this).text()){
					result = true;
					return;
				}
			});
			return result;
		}
		, hide = function(){
			$messageBoxList.find(".sfp-message-box").hide();
		}
		, _getBox = function(mainclass, boxType){
			var result = {
				main : $("<div>", {'class' : 'sfp-message-box ' + mainclass + ( boxType.isBlink ? " " + _blinkClass : "")
					+ ( boxType.isClickHide ? " " + _clickClass : "") })
				, header : $("<div>", {'class' : 'sfp-message-box-header'})
				, body : $("<div>", {'class' : 'sfp-message-box-body'})
				, footer : $("<div>", {'class' : 'sfp-message-box-footer'})
				, remove : function(){
					this.main.slideUp( "slow", function(){
						$(this).remove();
						if($(".sfp-message-box-list").find(".sfp-message-box").length == 0){
							$(".sfp-message-box-list").hide();
						}
					});
				}
			};
			if(boxType.isFooterBtn){
				var $btnConfirm = $('<button class="btn-out-of-stock-ok skyblue btn-message-confirm">'+sfp.lang.getInterpreter("확인")+'</button>');
				$btnConfirm.click(function(){
					if($.isFunction(boxType.cbFn)){
						boxType.cbFn.call(this);
					}
				});
				result.footer.append($btnConfirm);
				result.footer.append('<button class="btn-out-of-stock-cancel gray btn-message-cancel" style="margin-left: 20px">'+sfp.lang.getInterpreter("취소")+'</button>');
			}
			result.main.append(result.header).append(result.body).append(result.footer);
			return result;
		}
		, message = function(msg, options){
			show("message", msg, options);
		}
		, info = function(msg, options){
			show("info", msg, options);
		}
		, alarm = function(msg, options){
			show("alarm", msg, options);
		}
		, error = function(msg, options){
			show("error", msg, options);
		}
		, confirm = function(msg, options){
			if($messageBoxList.find(".confirm").length == 0){
				show("confirm", msg, options);
			}
		}
		, hasAlarmClickMessageBox = function(){
			if(Dialog.isDialog()){
				return top.MessageBox.hasAlarmClickMessageBox();
			}
			return $(".sfp-message-box-list .sfp-message-box.alarm."+_clickClass).length > 0;
		}
		_init();

		return {
			message : message
			, alarm : alarm
			, error : error
			, info : info
			, hide : hide
			, show : show
			, confirm : confirm
			, hasAlarmClickMessageBox : hasAlarmClickMessageBox
		}
	})(jQuery);

	window.BallonBox =(function($){
		var intervalId = 0, $ballon, exc = ["alarm","error"]
			options = {
				timeout : 0
				, direction : "up"		// up , down , left , right
				, proportion : "normal"	// big, small
			};

		var directionPosition = {
				common : function($selector){
					return {
						/*width : $selector.width()*/
						magnification : 1.5
					};
				}
				, getHeight : function($selector){
					return ($selector.height() - $ballon.height())/2;
				}
				, left : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + this.getHeight($selector);
					result["left"] = position.left - $ballon.width() - 20;
					return result;
				}
				, right : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + this.getHeight($selector)
					result["left"] = position.left + $selector.width() + 30;
					return result;
				}
				, up : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top - $ballon.height() - 20;
					result["left"] = position.left + $selector.width()/2 - $ballon.width()/2;
					return result;
				}
				, down : function($selector, position){
					var result = this.common($selector);
					result["top"] = position.top + $ballon.height();
					result["left"] = position.left + $selector.width()/2 - $ballon.width()/2;
					return result;
				}
		}
		var _init = function(){
			$ballon = $("<div>", {'class' : 'sfp-message-balloon small'});
			$ballon.hide();
			$("body").append($ballon.append("<span/>"));
		}
		, _show = function(main, selector, msg){
			if(!window["POPHeader"] || (window["POPHeader"] && POPHeader.isWorkGuideBalloon() && exc.indexOf(main) < 0)){
				$ballon.removeClass("message alarm error info big small normal").addClass(main).addClass(options.proportion);
				clearInterval(intervalId);
				var $selector = $(selector);
				$ballon.removeClass("up down left right").addClass(options.direction).show();
				$ballon.find("span").text(msg);
				$ballon.css(directionPosition[options.direction]($selector, $selector.offset()));
				if(options.timeout !== undefined && options.timeout > 0){
					intervalId = setTimeout(function(){
						$ballon.hide();
					}, options.timeout);
				}
			}
		}
		, message = function(selector, msg){
			_show("message", selector, msg);
		}
		, alarm = function(selector, msg){
			_show("alarm", selector, msg);
		}
		, error = function(selector, msg){
			_show("error", selector, msg);
		}
		, info = function(selector, msg){
			_show("info", selector, msg);
		}
		, setOption = function(key, val){
			options[key] = val;
		}
		, setOptions = function(opts){
			$.extend(options, opts);
		}
		, clear = function(){
			$ballon.hide();
		};
		_init();
		return {
			message : message
			, alarm : alarm
			, error : error
			, info : info
			, clear : clear
			, setOption : setOption
			, setOptions : setOptions
		};
	})(jQuery);
});