window.sfp = window.sfp || {};

sfp.lang = (function($){
	let interpreter = {}, phrase = {}, locale = "ko";
	var init = function(newlocale){
		locale = newlocale;
		$.ajax({
			url : sfp.context.getUrl('interpreter')
			, async : false
		}).done(function (data, textStatus, xhr) {
			interpreter = data;
		});
		$.ajax({
			url : sfp.context.getUrl('phrase')
			, async : false
		}).done(function (data, textStatus, xhr) {
			phrase = data;
		});
	}
	, _format = function(str, params){
		return str.replace(/{([0-9]+)}/g, function(s, g){
			let idx = parseInt(g);
			if(params == undefined || params == null ||params.length <= idx){
				return "";
			}
			return params[idx];
		});
	}
	, getPhrase = function(key, defaultMessage){
		let msg = phrase[key + "." + getLocale()];
		let params = Array.prototype.slice.call(arguments, 2);
		if(msg == undefined || msg  == null) {
			if(defaultMessage == undefined || defaultMessage  == null) {
				return key;
			}
			return _format(defaultMessage, params);
		}
		return _format(msg, params);
	}
	, getInterpreter = function(word, isShort){
		const key = word + "." + getLocale();
		if(isShort == true) {
			const rowAbbr = interpreter[key + "." + "short"];
			if(rowAbbr != undefined || rowAbbr  != null) {
				return rowAbbr;
			}
		}
		const row = interpreter[key];
		if(row != undefined || row  != null) {
			return row;
		}
		return word;
	}
	, getLocale = function() {
		return locale;
	}
	, setLocale = function(newLocale){
		locale = newLocale;
	};
	return {
		getPhrase : getPhrase
		, getInterpreter : getInterpreter
		, getLocale : getLocale
		, setLocale : setLocale
		, init : init
	}
})(jQuery);