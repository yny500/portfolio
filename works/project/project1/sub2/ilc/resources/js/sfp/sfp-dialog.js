window.sfp = window.sfp || {};
sfp.dialog = (function($) {
	var $doc = $(document.documentElement), $body, layers = [], $dimmed = $('<div class="layer-dimmed" />'),
	insideclassname = '.layer-inside', openers = [],
	handleclassname = ".layer-handle"
	defaultwidth = 400,
	istoppage = location.href == top.location.href,
	numlayers = 0;

	const addlayer = function(type, style, params, closedFn, cancelFn) {

		var $layer = $(['<div class="layer-wrap">',
							'<div class="layer-inside">',
								'<div class="layer-handle"/>',
								$.isPlainObject(style) && style.isHiddenCloseBtn ? '<p class="close"/>' : '<p class="close"><button type="button">'+sfp.lang.getInterpreter("닫기")+'</button></p>',
							'</div>',
						'</div>' ].join(''));
		if (type == 'iframe') {
			$([
				'<div class="iframe-wrap">',
					'<iframe src="about:blank" name="layer-iframe" width="100%" height="0px" frameborder="0" scrolling="no" allowTransparency="true"></iframe>',
					'</div>'
			].join('')).insertBefore($layer.find('p.close'));
			$layer.find('iframe').on('load', resize);
		}

		$layer.data('type', type).find(insideclassname).css('opacity', 0).find('p.close button').click(cancel);

		return {
			type : type,
			$layer : $layer,
			params : params,
			closedFn : closedFn,
			cancelFn : cancelFn
		};

	}
	, _getHeight = function($iframe){
		var height = 0;
		var $section = $iframe.find("section");
		var $header = $iframe.find("header");
		var $footer = $iframe.find("footer");
		$section.length > 0 && (height += $section[0].scrollHeight);
		$header.length > 0 && (height += $header[0].scrollHeight);
		$footer.length > 0 && (height += $footer[0].scrollHeight);
		$section.css("overflow-y", "hidden");
		return height;
	}
	, open = function(_url, style, params, closedFn, cancelFn, _window) {

		var $layer, url, type;
		style = window.isMobile ? 'full' : style;

		if (typeof (_url) == 'string') {
			url = _url;
		} else if (_url.length) {
			_url = _url[0];
		}
		if (_url.nodeType) {
			url = _url;
			if (_url.nodeName.toLowerCase() == 'a') {
				url = $(_url).attr('href');
			}
		}
		if (!url) {
			return;
		}

		type = url.indexOf && url.indexOf('/') != -1 ? 'iframe' : 'content';
		if (type == 'content') {
			url = $(url);
			if (!url.length) {
				return;
			}
		}

		// TODO 다이얼로그 관련 타일즈 추가 시 붙여야 한다 안 붙이면 .dialog로 간다.
		// 유형 체킹으로  유형이 없는건 dialog 있으면 붙여서 dialog
		if(url.indexOf('.') == -1){
			let locationType = top.locationType;
			if(locationType !== undefined && locationType != ''){
				url = url +"." + top.locationType + "dialog";
			}else{
				url = url +".dialog";
			}
		}

		if (!istoppage) {
			return top.Dialog.open(_url, style, params, closedFn, cancelFn, window);
		}

		openers.push(_window || window);

		if (!$body) {
			$body = $(document.body);
		}

		layers.push(addlayer(type, style, params, closedFn, cancelFn));
		$layer = layers[layers.length - 1].$layer;

		numlayers++;

		$dimmed.appendTo($body);
		if (style == 'full') {
			$layer.addClass('full');
		} else if($.isPlainObject(style)){
			$layer.find(insideclassname).css('width', style.width || defaultwidth);
			style.height && $layer.data('height', style.height);
		} else {
			$layer.find(insideclassname).css('width', style || defaultwidth);
		}

		$layer.appendTo($body);

		if (type == 'iframe') {
			$layer.find('iframe').attr('src', url);
			if(style != 'full' && (!$.isPlainObject(style) || style.fixed != true)){
				$layer.find(insideclassname).draggable({ containment: 'body' , handle: handleclassname, scroll: true,
					start:function(){
						var inside = $(this);
						inside.append($("<div>",{"class":"drag-shortcut"})
								.css({"height":inside.height(), "width": inside.width()})).find("iframe").hide();
					}
					, stop:function(){
						$layer.find("iframe").show();
						$layer.find(".drag-shortcut").remove();
					}})
					.css('left', $("body").width()/2-$layer.find(insideclassname).width()/2);
			}else{
				$layer.find(insideclassname).addClass('fixed');
				$layer.find(handleclassname).remove();
			}
		} else {
			url.insertBefore($layer.find('p.close'));
			reposition();
		}
		_setzclasses();
		window["POP_TOUCH"] && POP_TOUCH.hide();
		return $layer;
	}

	, close = function(data) {
		var args = arguments;
		setTimeout(function() {
			_close(args);
		}, 10);
	}
	, cancel = function() {
		_close(null, true);
	}
	, _close = function(data, isNotUsedCallBack) {
		if (!istoppage) {
			top.Dialog._close(data, isNotUsedCallBack);
		} else {
			if (numlayers) {
				_closeLayer(layers[numlayers - 1], data, isNotUsedCallBack);
				layers.length = --numlayers;
			}
			!numlayers && $dimmed.detach();
			_setzclasses();
			openers.pop();
		}
	}
	, _closeLayer = function(layer, data, isNotUsedCallBack){
		var $layer = layer.$layer;
		var closedFn = layer.closedFn;
		var cancelFn = layer.cancelFn;
		if ($layer.data('type') == 'content') {
			$layer.find(insideclassname).children(':first').hide()
					.appendTo($body);
		}
		if (!isNotUsedCallBack && $.isFunction(closedFn)) {
			closedFn.apply(this, data);
		}else if (isNotUsedCallBack && $.isFunction(cancelFn)) {
			cancelFn.apply(this, null);
		}
		$layer.remove();
	}
	, closeAll = function(depth) {
		depth = depth === undefined ? 0 : depth;
		if (!istoppage) {
			top.Dialog.closeAll(++depth);
		} else {
			if (numlayers) {
				for(var i = numlayers-1; i >= depth; i--){
					_closeLayer(layers[i], null, true);
				}
				layers.length = depth;
				numlayers = depth;
			}
			!numlayers && $dimmed.detach();
			_setzclasses();
			openers.pop();
		}
	}
	, _setzclasses = function() {
		$.each(layers, function(i) {
			this.$layer.decideClass('low-priority', i != numlayers - 1);
		});
	}
	, reposition = function() {
		var $iframedocument;
		if (istoppage) {
			$.each(layers,
					function(i) {
						var $layer = this.$layer;
						if ($layer.data('type') == 'iframe') {
							if (!$layer.hasClass('full')) {
								$layer.find(insideclassname).css('width', $layer.find('iframe').width());
							}
							$iframedocument = $($($layer).find('iframe')[0].contentWindow.document);
							$($layer).find('iframe')[0].height = $layer.data('height') ? $layer.data('height') : _getHeight($iframedocument);
						}
						$layer.find(".layer-inside").css({ top :
										Math.max(0, ($dimmed[0].offsetHeight - $layer.find(insideclassname)[0].offsetHeight) / 2)
								});
						if (!$layer.data('displayed')) {
							if ($layer.hasClass('full')) {
								$layer.find(insideclassname).css({
									opacity : 1
								});
							} else {
								$layer.find(insideclassname)
										.css({
											scale : 0.93,
											opacity : 0,
											force3D : true
										})
										.animate(
												{
													scale : 1,
													opacity : 1
												},
												{
													duration : 150,
													easing : 'easeOutCubic',
													complete : function() {
														$layer[0].style.transform = $layer[0].style.webkitTransform = '';
													}
												});
							}
							$layer.data('displayed', true);
						}
					});
		}
	}

	, hidebutton = function() {
		if (!istoppage) {
			return top.Dialog.hidebutton();
		} else if (numlayers) {
			layers[numlayers - 1].$layer.find('.close').remove();
		}
	}
	, opener = function() {
		if (!istoppage) {
			return top.Dialog.opener();
		} else {
			return openers[numlayers - 1].$layer;
		}
	}, getParams = function() {
		if (!istoppage) {
			return top.Dialog.getParams();
		} else {
			return $.isPlainObject(layers[numlayers - 1]) ? layers[numlayers - 1].params : false;
		}
	}
	, resize = function() {
		if (this && (/^about/i).test(this.src)) {
			return;
		}
		if (!istoppage) {
			top.Dialog.resize();
		} else {
			reposition();
		}
	}, isDialog = function() {
		return !istoppage;
	}, callFn = function(fn, param){
		var layer = layers[numlayers - 1];
		var $iframe = layer.$layer.find('iframe');
		if($iframe.length > 0){
			var callFn = $iframe.get(0).contentWindow[fn];
			if($.isFunction(callFn)){
				callFn.call(this, param);
			}
		}
	}, hasDialog = function(num){
		num = num === undefined ? 0 : num;
		if (!istoppage) {
			return top.Dialog.hasDialog(++num);
		} else {
			return layers.length > num;
		}
	};

	return {
		open : open,
		close : close,
		closeAll : closeAll, // 모든 다이얼로그 닫음
		cancel : cancel,
		_close : _close,
		opener : opener,
		reposition : reposition,
		hidebutton : hidebutton,
		resize : resize,
		getParams : getParams,
		isDialog : isDialog,
		hasDialog : hasDialog,
		callFn : callFn
	}
})(jQuery);

window.Dialog = sfp.dialog;