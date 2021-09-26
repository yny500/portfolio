window.sfp = window.sfp || {};

sfp.stringutils = (function($){

	var isEmpty = function(_str){
		return !isNotEmpty(_str);
	}
	, isNotEmpty = function(_str){
		var obj = String(_str);
		return !(obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '' );
	}
	, isBlank = function(_str){
		var strLen;
		if (_str == null || (strLen = _str.length) == 0) {
			return true;
		}
		for (var i = 0; i < strLen; i++) {
			if (!Character.isWhitespace(_str.charAt(i))) {
				return false;
			}
		}
		return true;
	}
	, isNotBlank = function(_str){
		return !isBlank(_str);
	}
	, equals = function(str1, str2){
		if(isEmpty(str1) || isEmpty(str2)){
			return false;
		}
		if(str1 === str2){
			return true;
		}
		return false;
	}
	, equalsIgnoreCase = function(str1, str2){
		if(!equals(str1, str2)){
			return false;
		}
		if(str1.toUpperCase() === str2.toUpperCase()){
			return true;
		}
		return false;
	}
	, removeEmptyOrNull = function(obj){
		Object.keys(obj).forEach(function(k){
			(obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) || (!obj[k] && obj[k] !== undefined) && delete obj[k]
		})
		return obj;
	}
	, format = function(str, args){
		return str.replace(/{([0-9]+)}/g, function(s, g){
			let idx = parseInt(g);
			if(args.length <= idx){
				return "";
			}
			return args[idx];
		});
	};
	return {
		  isEmpty : isEmpty
		, isNotEmpty : isNotEmpty
		, isBlank : isBlank
		, isNotBlank : isNotBlank
		, equals : equals
		, equalsIgnoreCase : equalsIgnoreCase
		, removeEmptyOrNull : removeEmptyOrNull
		, format : format
	}

})(jQuery);

window.StringUtils = sfp.stringutils;