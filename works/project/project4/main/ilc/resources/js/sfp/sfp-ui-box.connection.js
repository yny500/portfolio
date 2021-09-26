/*
 * SFP 의 장비 가동상태바 를 도시하기 위한 플러그인
 * by MHD
 */
$.widget( "sfp.connection", {
	// default options
	options: {
		lineColor : '#CDCDCD',
		lineWidth : 1 ,
		'z-index' : 1
	},

	// the constructor
	_create: function() {
		this.svg = $(['<svg  xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0px;left:0px;z-index:', this.options['z-index'],'" height=', this.element.height(),
			' width=', this.element.width(), '>'].join(''));
		this.element.prepend(this.svg);
		this.stack = [];
	},

	_refresh: function() {
		this.redraw();
	},

	redraw : function(){
		this.svg.empty();
		for(var i = 0 , len = this.stack.length ; i < len ; i++){
			this.drawLine(this.stack[i]);
		}
	},

	_getPosition : function(selector){
		var $el = this.element.offset();
		var $selector = $(selector);
		var sx = $selector.offset().left - $el.left;
		var sy = $selector.offset().top - $el.top;
		var sh = $selector.height();
		var sw = $selector.width();
		return {
			left : { x : sx , y : sy + sh / 2}
			, right : { x : sx + sw , y : sy + sh / 2}
			, up : { x : sx + sw / 2, y : sy}
			, down : { x : sx + sw / 2, y : sy + sh}
		}
	},
	_getDistance : function(x1, x2, y1, y2){
		return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
	},
	/*{
	from : selector, // 단일
	to : selector // 다중허용
	lineWidth : // 없으면 기본
	lineColor :	 // 없으면 기본
	fromPostion : // left , right , up, down
	toPostion : // left , right , up, down  없으면 가장 가까운쪽
}*/
	drawLine : function(opt){
		var sPositions = this._getPosition(opt.from);
		var style = ["stroke:" , opt.lineColor ? opt.lineColor : this.options.lineColor ,";stroke-width:" , opt.lineWidth ? opt.lineWidth : this.options.lineWidth].join('');
		var callPosition = this._getPosition;
		$(opt.to).each($.proxy(function(idx , el){
			var minSource;
			var minTarget;
			var minDistance = 9999;
			var tPositions = this._getPosition(el);
			if(opt.fromPosition){
				minSource = sPositions[opt.fromPosition];
				minTarget = this._isMinDistanceTo(minSource, tPositions, opt);
			}else{
				for(var p in sPositions){
					var tempMin = this._isMinDistanceTo(sPositions[p], tPositions, opt);
					var tempDistance = this._getDistance(sPositions[p].x, tempMin.x, sPositions[p].y, tempMin.y);
					if(minDistance > tempDistance){
						minDistance = tempDistance;
						minSource = sPositions[p];
						minTarget = tempMin;
					}
				}
			}
			this._drawLine(minSource, minTarget, style);
		}, this));


	},
	_drawLine : function(from, to, style){
		this.svg.append(this._makeSVG('line', {
			x1 : from.x,
			x2 : to.x,
			y1 : from.y ,
			y2 : to.y,
			style : style
		}));
	},
	_isMinDistanceTo : function(sPostion, tPositions, opt){
		var min;
		var minDistance = 9999;
		if(opt.toPosition){
			return tPositions[opt.toPosition];
		}else{
			for(var p in tPositions){
				var temp = this._getDistance(sPostion.x, tPositions[p].x, sPostion.y, tPositions[p].y);
				if(minDistance > temp){
					minDistance = temp;
					min = tPositions[p];
				}
			}
		}
		return min;
	},
	_destroy: function() {
		this.svg.remove();
	},

	_setOptions: function() {
		this._superApply( arguments );
		this._refresh();
	},

	_setOption: function( key, value ) {
		if(/lineColor|lineWidth/.test(key)){
			value = $.extend({}, this.options[key], value);
		}

		this._super( key, value );
	},

	_makeSVG :function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }
});