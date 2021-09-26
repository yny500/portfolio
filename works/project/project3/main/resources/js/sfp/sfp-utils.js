(function( $ ) {
	/**
	 * 현재 해당 요소의 도시여부(세로만 체크:현 프로젝트상 가로체크 불필요)를 체크하는 function
	 * @param parent
	 */
	$.fn.visible = function(parent) {
		var $parent = $(parent);
		var bHeight = $parent.height();
		var bTop = $parent.offset().top;
		var top = $(this).offset().top;
		if(top >= bTop && top < (bTop + bHeight)){
			return true;
		}
		return false;
	};

	$.fn.decideClass=function(a,d){return this[d?"addClass":"removeClass"](a)}

	$.fn.setData = function(data){
		if(data !== null && $.isPlainObject(data)){
			//data-set-exclude='true'
			this.find("input, select, textarea, td, span, strong").not("[data-set-exclude='true']").each(function(idx, elem){
				var $this = $(this);
				var key = $this.attr("name") || $this.attr("id");
				if(key !== undefined){
					if($this.is("[type=radio], [type=checkbox]")){
						var $p = $this.parent().closest("[name], [id]");
						key = $p.attr("name") || $p.attr("id");
						if($this.is("[type=checkbox]")){
							if(data[key] !== undefined && data[key].indexOf($this.val()) >= 0){
								$this.prop("checked", true);
							}
						}else if(data[key] == $this.val()){
							$this.prop("checked", true);
						}
					}else{
						$this.is("input, select") ? $this.val(data[key]) : $this.text(data[key]);
					}
				}
			});
		}
	}

	$.fn.clearData = function(){
		this.find("input, select, textarea, td, span, strong").not("[data-set-exclude='true']").each(function(idx, elem){
			var $this = $(this);
			var key = $this.attr("name") || $this.attr("id");
			if(key !== undefined){
				if($this.is("[type=radio], [type=checkbox]")){
					$this.prop("checked", false);
				}else{
					$this.is("input, select") ? $this.val("") : $this.text("");
				}
			}
		});
	}

	$.fn.serializeObject = function() {
		var o = {};
		this.each(function() {
			var $this = $(this);
			if($this.is("[type=radio], [type=checkbox]")){
				var $p = $this.parent().closest("[name], [id]");
				var targetName = $p.attr("name") || $p.attr("id");
				if($this.is("[type=checkbox]")){
					if(!o[targetName]){
						o[targetName] = [];
					}
					if(this.checked){
						o[targetName].push(this.value);
					}
				}else if(this.checked){
					o[targetName] = this.value;
				}
			}else{
//				o[this.name] = $this.val();
				o[this.name] = $this.hasClass("multi-input-select") == true ? $this.data("val") : $this.val();// TODO KEVIN
			}
		});
		return o;
	};

	$.fn.validate = function() {
		var result = true;
		$(this).find("[name]").each(function() {
			result = formValidator(this);
			return result;
		});
		return result;
	};
}(jQuery));

var isPassProperty = function(key, value){
	try {
		if(!propertyPatterns){
			return true;
		}
		if(propertyPatterns[key] == undefined){
			return true;
		}
		if(propertyPatterns[key].test(value)){
			return true;
		}
		return false;
	} catch (e) {
		return true;
	}
}

// ns 패턴형 util 패키지 정리후 모듈패턴형태로 재작업 예정
//'use strict';
var formValidator = function(obj){
	// TODO jjo length 관련 추가해. validate 시 최소길이보다 크게 required <- 상태인 경우만
	obj = $(obj);

	var tagName = obj.get(0).tagName;
	var required = obj.data("required");

	var key = obj.get(0).name;
	var value = $.trim( obj.val() );

	var who = obj.data("required-title") || obj.attr("placeholder");
	if(required !== undefined && required === true && value.length <= 0) {
		alert(who +" "+ sfp.lang.getPhrase("required-val", "은(는) 필수값입니다."));
		obj.focus();
		return false;
	}

	if(obj.data("valid") == 'number'){
		var min = obj.data("valid-min");
		if(min !== undefined && min !== '' && $.isNumeric(min) && (parseFloat(value) < parseFloat(min))){
			alert(who +" "+ sfp.lang.getPhrase("min-val", "은(는) 최소값보다 작습니다."));
			obj.focus();
			return false;
		}

		var max = obj.data("valid-max");
		if(max !== undefined && max !== '' && $.isNumeric(max) && (parseFloat(value) > parseFloat(max))){
			alert(who +" "+ sfp.lang.getPhrase("max-val", "은(는) 최대값보다 큽니다."));
			obj.focus();
			return false;
		}
	}

		// 패턴 체크
	if(isPassProperty(key, value) == false){
		alert(who +"은(는) 형식이 다릅니다.");
		obj.focus();
		return false;
	}


	return true;

}

var validator = (function($){
	var validateNumber = function(event) {

		this.value = this.value.replace(/[^0-9\.]/g,'');

		var $this = $(this);
		if($this.data("valid") == 'number'){
			var min = $this.data("valid-min");
			if(min !== undefined && min !== '' && $.isNumeric(min) && (parseFloat(this.value) < parseFloat(min))){
				this.value = min;
				return false;
			}

			var max = $this.data("valid-max");
			if(max !== undefined && max !== '' && $.isNumeric(max) && (parseFloat(this.value) > parseFloat(max))){
				this.value = max;
				return false;
			}
		}

//		var key = window.event ? event.keyCode : event.which;
//		if (event.keyCode == 8 || event.keyCode == 46
//				|| event.keyCode == 37 || event.keyCode == 39) {
//			return true;
//		}
//		else if ( key < 48 || key > 57 ) {
//			return false;
//		}
//		else return true;

	},

	validateString = function(event) {

	},

	validateDate = function(event) {

	},

	validateMaxSize = function(event) {
		var $this = $(this);

		var maxSize = $this.data("valid-max-size");
		var v = $this.val();

		if(getByteLength(v) > maxSize){
			$this.val(v.substr(0, maxSize));
//			this.value = this.value.substr(0, maxSize)
		}
	},

	getByteLength = function(s) {
		var totalByte = 0;
		for(var i =0; i < s.length; i++) {
			var currentByte = s.charCodeAt(i);
			if(currentByte > 128) totalByte += 2;
			else totalByte++;
		}
		return totalByte;
	};

	$(document).on("keyup.s3s focusout.s3s", "input[data-valid='number']", validateNumber);
	$(document).on("keypress.s3s focusout.s3s", "input[data-valid='string']", validateString);
	$(document).on("keypress.s3s focusout.s3s", "input[data-valid='date']", validateDate);
	$(document).on("keyup.s3s paste.s3s focusout.s3s", "input[data-valid-max-size]", validateMaxSize);

})(jQuery);

var TimerManager = (function(){
	var timerList = [];
	var put = function(timer){
		timerList[timerList.length] = timer;
	},
	clear = function(){
		for(var i = 0, len = timerList.length; i < len ; i++){
			clearInterval(timerList[i]);
		}
		timerList = [];
	}
	return {
		put :put,
		clear : clear
	}
})();

var PageManager = (function(){
	var animateSpeed = 300;
	var nextPage = function(target, arriveLastFn){
		var $target = $(target);
		$target = $target.has(".sfp-grid-body-panel").length > 0 ? $target.find(".sfp-grid-body-panel") : $target;
		$target.animate({scrollTop:$target.scrollTop() + $target.height() + "px"}, animateSpeed, function(){
			if( ($target[0].scrollHeight <= $target.scrollTop() + $target.outerHeight()) && $.isFunction(arriveLastFn)){
				arriveLastFn.call(this);
			}

		});
	}
	, prevPage = function(target, arriveTopFn){
		var $target = $(target);
		$target = $target.has(".sfp-grid-body-panel").length > 0 ? $target.find(".sfp-grid-body-panel") : $target;
		$target.animate({scrollTop:$target.scrollTop() - $target.height() + "px"}, animateSpeed, function(){
			if( $target.scrollTop() == 0 && $.isFunction(arriveTopFn)){
				arriveTopFn.call(this);
			}
		});
	}
	, reset = function(target){
		var $target = $(target);
		$target.scrollTop(0);
	}
	, isEnd = function(target){
		var $target = $(target);
		if($target[0].scrollHeight <= $target.scrollTop() + $target.outerHeight()){
			return true;
		}
		return false;
	}
	, isFirst = function(target){
		return $target.scrollTop() == 0;
	};

	return {
		nextPage : nextPage, // 다음페이지
		prevPage : prevPage, // 이전페이지
		reset : reset,  // 최초
		isEnd : isEnd,  // 끝이니
		isFirst : isFirst // 처음이니
	}
})();

Object.equals = function(x, y) {
	if (x === y) return true;
	if (!(x instanceof Object) || !(y instanceof Object)) return false;
	if (x.constructor !== y.constructor) return false;
	if(Array.isArray(x)){
		if(x.length !== y.length) return false;
		for(var i = 0 , len = x.length ; i < len ; i++){
			if(y.indexOf(x[i]) < 0) return false
		}
		return true;
	}
	for (var p in x) {
		if (!x.hasOwnProperty(p)) continue;
		if (!y.hasOwnProperty(p)) return false;
		if (x[p] === y[p]) continue;
		if (typeof(x[p]) !== "object") return false;
		if (!Object.equals(x[p], y[p])) return false;
	}
	for (p in y) {
		if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
	}
	return true;
}

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
window.isChrome = /chrome/i.test(navigator.userAgent);

var SfpUtils = (function(){
	var pad = function(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	, numberCount = function( start, end, duration, target, toFixed, etc){
		$({ data : start }).animate({ data : end }, { duration : duration, complete : function(){
		}, step: function(now) {
			$(target).html(now.toFixed(toFixed) + "" + etc);
		}});
	}
	, getRGBColorByRate = function(oeeRateGrade){
		if(oeeRateGrade == 'good') {
			return "#65B8E2";
		}
		if(oeeRateGrade == 'normal') {
			return "#FFBD20";
		}
		if(oeeRateGrade == 'bad') {
			return "#F45152";
		}
		if(oeeRateGrade == 'off') {
			return "#E3E1E0";
		}
	}
	/* numerator에서 denominator를 나눈 퍼센트를 구한다 100이 넘으면 100 */
	, getPercent = function(numerator, denominator){
//		alert(numerator + " | " + denominator);
		var result = 0.0;
		if(isNaN(numerator) || numerator == null) numerator = 0.0;
		if(isNaN(denominator) || denominator == null) denominator = 0.0;
		if(numerator == 0) return 0.0;
		if(denominator == 0) return 0.0;
		result = ((numerator/denominator)*100);
		if(result >= 100) result = 100.0;
		if(result < 0) result = 0.0;
		return result;
	}
	/* numerator에서 denominator를 나눈 퍼센트를 구한다 */
	, getPercentNoLimit = function(numerator, denominator){
		var result = 0.0;
		if(isNaN(numerator) || numerator == null) numerator = 0.0;
		if(isNaN(denominator) || denominator == null) denominator = 0.0;
		if(numerator == 0) return 0.0;
		if(denominator == 0) return 0.0;
		result = ((numerator/denominator)*100);
		if(result < 0) result = 0.0;
		return result;
	}
	, progressbar = function() {
		var $bar, gauge, animate = 'Y';
			value = parseInt(this.getAttribute('data-value'));
		if (isNaN(value)) {
			return;
		}
		if(this.getAttribute('data-animate') !== null){
			animate = this.getAttribute('data-animate');
		}
		$bar = $(this);
		$('<span>').appendTo($bar)[0]
		gauge = $(this).children("span");
		if(animate == "Y"){
			gauge.animate({width: value + "%"},1000)
		}else{
			gauge.width(value + "%");
		}
	}
	, numberWithCommas = function(val){
		if( val == undefined || val == null || val == "" ) {
			val = 0;
		}
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	, isEmailCheck = function(e){
		var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		return regEmail.test(e);
	}
	, generateUID = function (){
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}
	, getBrowser = function(){
		const agt = navigator.userAgent.toLowerCase();
		if (agt.indexOf("chrome") != -1) return 'Chrome';
		if (agt.indexOf("opera") != -1) return 'Opera';
		if (agt.indexOf("staroffice") != -1) return 'Star Office';
		if (agt.indexOf("webtv") != -1) return 'WebTV';
		if (agt.indexOf("beonex") != -1) return 'Beonex';
		if (agt.indexOf("chimera") != -1) return 'Chimera';
		if (agt.indexOf("netpositive") != -1) return 'NetPositive';
		if (agt.indexOf("phoenix") != -1) return 'Phoenix';
		if (agt.indexOf("firefox") != -1) return 'Firefox';
		if (agt.indexOf("safari") != -1) return 'Safari';
		if (agt.indexOf("skipstone") != -1) return 'SkipStone';
		if (agt.indexOf("netscape") != -1) return 'Netscape';
		if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
		if (agt.indexOf("msie") != -1) {
			let rv = -1;
			if (navigator.appName == 'Microsoft Internet Explorer') {
				let ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
			}
			return 'Internet Explorer '+rv;
		}
	}
	, excelDownload = function(url, params, prop){
		if(confirm("엑셀을 다운로드 하시겠습니까?")){
			if($.fileDownload){
				$.extend(params, prop);
				showProgress();
				$.fileDownload(url, {
					httpMethod :"POST",
					data: params,
					successCallback: function() {
						closeProgress();
					},
					failCallback: function() {
						closeProgress();
						alert("엑셀 다운로드 실패!");
					}
				});
			}else{
				SFPURL.locationHref(url, params);
			}
		}
	}
	, excelDownFormat = function(fileName, list){
		if(confirm(fileName + "을(를) 다운로드 하시겠습니까?")){
			var params = { title : fileName, headers : list ? list : [] };
			if($.fileDownload){
				showProgress();
				$.fileDownload(SFPURL.getUrl("/download/excel/format"), {
					httpMethod :"POST",
					preparingMessageHtml : "test",
					data: params,
					successCallback: function() {
						closeProgress();
					},
					failCallback: function() {
						closeProgress();
						alert("엑셀 다운로드 실패!");
					}
				});
			}else{
				SFPURL.locationHref(url, params);
			}
		}
	};
	return {
		pad : pad
		, numberCount : numberCount
		, getRGBColorByRate : getRGBColorByRate
		, getPercent : getPercent
		, getPercentNoLimit: getPercentNoLimit
		, progressbar : progressbar
		, numberWithCommas: numberWithCommas
		, isEmailCheck : isEmailCheck
		, generateUID : generateUID
		, getBrowser : getBrowser
		, excelDownload : excelDownload
		, excelDownFormat : excelDownFormat
	}
})();

(function () {
	if ( typeof window.CustomEvent === "function" ) return false;

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
})();