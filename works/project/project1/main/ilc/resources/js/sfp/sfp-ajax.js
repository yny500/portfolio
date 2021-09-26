window.sfp = window.sfp || {};
window.sfp.context = (function($){
	let _context = '/sfp2.0', onLoadCbFn = [], _menuUrl, _menuId = ""; // 외부세팅으로 한군데서 공통관리하는게 맞는데..

	const setContextUrl = function(context){
		_context = context;
		for(var i = 0, len = onLoadCbFn.length ; i < len ; i ++){
			$.isFunction(generate) &&  onLoadCbFn.call(this);
		}
	}
	, getContextUrl = function(){
		return _context;
	}
	, getUrl = function(url){
		return [_context , (url.indexOf('/') == 0 ? '' : '/') , url].join('');
	}
	, register = function(cb){
		onLoadCbFn[onLoadCbFn.length] = cb;
	}
	, locationHref = function(url, params){
		if(params === undefined || params == null){
			location.href = url;
			return;
		}
		var query = jQuery.param(params);
		if(query != "") {
			if( query.indexOf("?") == -1 ){
				location.href = url + "?" + query;
			} else {
				location.href = url + "&" + query;
			}
		} else {
			location.href = url;
		}
	}
	, setMenuUrl = function(){
		_menuUrl = $(location).attr('pathname').replace(_context, "").split(".")[0];
	}
	, getMenuUrl = function(){
		return _menuUrl;
	}
	, setMenuId = function(id){
		_menuId = id;
	}
	, getMenuId = function(){
		return _menuId;
	}
	, getQueryParams = function() {
		var params = {};
		window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value){ params[key] = decodeURIComponent(value); });
		return params;
	};
	return {
		setContextUrl : setContextUrl
		, getContextUrl : getContextUrl
		, getUrl : getUrl
		, locationHref : locationHref
		, setMenuUrl : setMenuUrl
		, getMenuUrl : getMenuUrl
		, setMenuId : setMenuId
		, getMenuId : getMenuId
		, getQueryParams : getQueryParams
	}
})(jQuery);

sfp.ajax = (function($){
	let default_opt = {
		method : "POST",
		loader : 'yes',
		error : function(jqXHR, textStatus, errorThrown ){
			console.error(textStatus);
		},
		statusCode: {
			401: function() {
				alert(sfp.lang.getPhrase("login", "유효한 세션이 아닙니다. 다시 로그인해주세요."));
				top.location.href = sfp.context.getUrl('login');
			}
			,
			403: function() {
				401();
			}
			,
			500: function() {
				alert(sfp.lang.getPhrase("contact-admin", "정상적으로 처리되지 않았습니다.\r\n관리자에게 문의하세요."));
			}
		}
	};
	const getMemoryName = function(tableNm, key, cbFn){//멀티키는 나중에
		$.ajax({
			method : "POST",
			url : sfp.context.getUrl('getMemoryName'),
			loader : 'no',
			data : {
				'key' : key,
				'tableNm' : tableNm,
			},
			success : function(data, resultTxt, req) {
				if($.isFunction(cbFn)){
					cbFn.call(this, data);
				}
			},
			error : function(jqXHR, textStatus, errorThrown ){
				console.error(textStatus);
			}
		});
	}
	, _ajax = function(cbFn, opt){
		opt =  $.extend({
			success : function(data, resultTxt, req) {
				if(_validate(data, opt) && $.isFunction(cbFn)){
					cbFn.call(this, data);
				}
			}}, default_opt, opt);

		if(opt.loader === 'yes'){
			opt =  $.extend(opt, {
				beforeSend:function(){
					showProgress();
				},
				complete:function(){
					closeProgress();
				}
			});
		}
		$.ajax(opt);
	}
	, ajax = function(url, param, cbFn, opt){
		if($.isArray(param)){
			ajaxRequestBody(url, param, cbFn, opt);
			return;
		}
		_ajax(cbFn , $.extend({url : url, data : param}, opt));
	}
	, _getOption = function(o, url, params, method){
		let opts = o || {};
		opts.url = url;
		opts.data = params;
		opts.method = method;
		return opts;
	}
	, get = function(url, params, cbFn, opts){
		_ajax(cbFn , _getOption(opts, url, params, "GET"));
	}
	, post = function(){
		ajax(url, param, cbFn, opt);
	}
	, put = function(){
		_ajax(cbFn , _getOption(opts, url, params, "PUT"));
	}
	, patch = function(){
		_ajax(cbFn , _getOption(opts, url, params, "PATCH"));
	}
	, ajaxRequestBody = function(url, param, cbFn, opt){
		_ajax(cbFn , $.extend({ contentType: "application/json", url : url, data : JSON.stringify(param) }, opt));
	}
	, _validate = function(result, opt) {
		if($.isPlainObject(result) && result.hasOwnProperty('code')){
			if(result.code == "EXPIRATION"){
				alert(sfp.lang.getPhrase("login", "유효한 세션이 아닙니다. 다시 로그인해주세요."));
				top.location.href = sfp.context.getUrl('login');
				return;
			}
			if(result.code !== "000") {
				console.info(result.error);
				alert(result.message);
				$.isFunction(opt.error) && opt.error.call(this);
				return false;
			}
		}
		return true;
	}
	, setOptions = function(opts){
		$.extend(default_opt, opts);
	};
	return {
		  getMemoryName : getMemoryName
		, ajaxRequestBody : ajaxRequestBody
		, ajax : ajax
		, setOptions : setOptions
		, get : get
		, delete : function(){
			_ajax(cbFn , _getOption(opts, url, params, "DELETE"));
		}
		, put : put
		, post : post
		, patch : patch
	}
})(jQuery);

window.SFPURL = sfp.context;
window.SfpAjax = sfp.ajax;