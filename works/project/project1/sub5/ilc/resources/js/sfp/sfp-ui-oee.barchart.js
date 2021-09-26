/*
 * SFP 의 장비 가동상태바 를 도시하기 위한 플러그인
 * by MHD
 */
$.widget( "sfp.barchart",{
	options: {
		margin : 20,
		statusColor: {
			auto : "#219244"
			, idling : "#eb9934"
			, setup : "#595858"
			, change : "#00a0e9"
			, alarm : "#ca1134"
			, off : "#9e9e9f"
			, defaultColor : "#FFFFFF"
		},
		oee : {
			second : "second"
			, startDateTime : "start_date"
			, status : "status"
		},
		tickColor : "#AAAAAA",
		tickWidth : 1,
		dutyTime : "00:00",
		hourTxt : '시간' ,
		minTxt : '분' ,
		toolTipPosition : 'up', // tooltip의 위치 up, down
		isShowTooltip : true ,  // 툴팁을 보이게 할지 여부
		isLimitMoveTooltip : false, // 툴팁화살표 컨트롤 여부

		// callbacks
		onChangedDate: null ,  //function(e, addDays){}  param  +1 다음날, -1 전날 날짜 변환 이벤트 발생 function(e, addDays)
								// 선언되지 않으면 날짜 변경이 되지 않음 .. 즉 당일꺼만 볼 경우... 날짜이동이 없는 경우
								// 이벤트에 대한 리턴을 false로 해도 이동이 안됨
		onClickBarChart : null	,//	 functiono(e, timeTxt, index) 클릭시 콜백 timeTxt 값을 리턴, data 상의 index값
		onChangedViewType : null ,//function(e, t, times){}  t = 'day', 'hour', 'min', times 화면에 도시된 시간들 tick
		onChangedTooltip : null, // functiono(e, left, timeTxt, isShow) left 위치좌표, top 은 필요없음, isShow 로 마우스 over 상태 확인, txt 로 시간 체크
		onDrawBar : null		// function(e, oeeResult) oeeResult 안에는 각 상태별 시간과 count 값이 json 구조로 저장되어 있음
	},

	_oeeType : {
					day:{
						rate:24*60*60,
						txt: function(){
							this.options.hourTxt;
							return 24 + this.options.hourTxt;
						},
						getPointTimeTxt:function(lastPoint, width){ // 속도 때문에 width 를 매번 계산하지 않는다 차이가 좀남
							var rate =this._cunrrentType.rate/60/width;
							return this.DateUtil.DateType.Min.execute(this._convertPx(lastPoint*rate + this.oeeTimeTxt[0].data("timepixel")));
						}
					} ,
					hour:{
						rate:60*60,
						txt: function(){
							this.options.hourTxt;
							return 1 + this.options.hourTxt;
						},
						getPointTimeTxt:function(lastPoint, width){
							return this._oeeType.day.getPointTimeTxt.call(this, lastPoint, width);
						}
					} ,
					min:{
						rate:12*60,
						txt: function(){
							this.options.hourTxt;
							return 12 + this.options.minTxt;
						},
						getPointTimeTxt:function(lastPoint, width){
							var rate =this._cunrrentType.rate/width;
							var x = lastPoint*rate + this.oeeTimeTxt[0].data("timepixel")*60;
							return this.DateUtil.DateType.Second.execute(x >= 60*60*24 ? x%(60*60*24) : x, true);
						}
					}
				},
	_cunrrentType : null,
	_lastData : [],

	// the constructor
	_create: function() {
		this._setCurrentType("day");
		this.oeeBar = $("<div>",{"class":"sfp-oee-bar"});
		this.oeeBar.css({height : this.element.height()-30, width:this.element.width()-this.options.margin*2, "marginLeft":this.options.margin});
		this.oeeTimeTick = $('<svg  xmlns="http://www.w3.org/2000/svg" height=50 width='+this.element.width()+'>');
		this.tooltip = $("<div>",{"class":"sfp-oee-tooltip " + this.options.toolTipPosition}).append(this._tooltipHtml())

		this.oeeTimeTxt = [];
		this.element
		  .addClass( "sfp-oee" )
		  .disableSelection().append(this.oeeBar).append(this.oeeTimeTick).append(this.tooltip);

		this._drawTimeTick();
		this.tooltipManager = this.tooltipManager(this);
	},

	_refresh: function() {
    	this._drawbar(this._lastData, this.oeeTimeTxt[0].data("timepixel"));
		this.tooltip.empty().append(this._tooltipHtml());
		this.tooltipManager.initialize.call(this);
	},

	_destroy: function() {
		this.oeeBar.remove();
		this.oeeTimeTick.remove();
		this.tooltip.remove();
		this.element
		  .removeClass( "sfp-oee-bar" )
		  .enableSelection()
		  .css( "background-color", "transparent" ).empty();
	},

	_setOptions: function() {
		this._superApply( arguments );
		this._refresh();
	},

	_setOption: function( key, value ) {
		if("dutyTime" == key && !/[0-9]{2}.[0-9]{2}.[0-9]{2}/.test(value)){
			return;
		}else if("dutyTime" == key){
			var times = value.split(":");
			var hour = parseInt(times[0]);
			this.oeeTimeTxt[0].data("orgpixel", parseInt(times[0])* 60 + parseInt(times[1]));
			this.setStartDateTime("day");
		}

		if(/oee|statusColor/.test(key)){
			value = $.extend({}, this.options[key], value);
		}

		this._super( key, value );
	},

	_drawTimeTick : function(){
		var w = this.element.width();
		var h = this.element.height();
		var style = "stroke:"+this.options.tickColor+";stroke-width:"+this.options.tickWidth
		this.oeeTimeTick.append(this._makeSVG('line', {
			x1 : this.options.margin ,
			x2 : w-this.options.margin,
			y1 : 0 ,
			y2 : 0 ,
			style : style
		}));
		for(var i = 0 ; i <= 24 ; i++){
			var x = this.options.margin + (w-this.options.margin*2)/24*i;
			this.oeeTimeTick.append(this._makeSVG('line', {
				x1 : x ,
				x2 : x ,
				y1 : 0 ,
				y2 : 10 ,
				style : style
			}));
			if( i % 6 == 0 ) {
				this._drawTimeTxt(x, i / 6, this._createTime(x));
			}
		}
		this._updateTimeTxt(0, this.oeeTimeTxt[0].data("orgpixel"));
	},

	_drawTimeTxt : function(x, index, $time){
		var times = this.options.dutyTime.split(":");
		var hour = parseInt(times[0]) + index * 6;
		hour = hour > 24 ? hour % 24 : hour;
		$time.data("orgpixel", parseInt(times[0])* 60 + parseInt(times[1]));
		$time.data("timepixel", parseInt(times[0])* 60 + parseInt(times[1]));
		this.element.append($time);
	},

	_createTime : function(x){
		this.oeeTimeTxt[this.oeeTimeTxt.length] = $("<time>",{"class":"sfp-oee-timetxt",text:"00:00",
			style :["left:", (x-18), "px;top:", ( this.element.height()-10), "px;"].join("")}); // 강제로 값처리한건 나중에..
		return this.oeeTimeTxt[this.oeeTimeTxt.length-1];
	},

	_updateTimeTxt : function(x, startTime){
		var rate = this._cunrrentType.rate/60, DateUtil = this.DateUtil, _convertPx = this._convertPx;
		startTime += startTime < this._getSecond(this.options.dutyTime)/60 ? 1440 : 0;
		x = parseInt(x/rate) * rate + (startTime ? startTime : 0), rate /= 4;
		$.each(this.oeeTimeTxt, function( index, $this ) {
			var px = x + index * rate;
			$this.text(DateUtil.getString(DateUtil.DateType.Min, _convertPx(px), false));
			$this.data("timepixel", px)
		});
	},

	_findStartPoint : function(html, data, startMin, w, status, oeeResult){
		var startSec = startMin*60, seconds = 0, dutySec = this._getSecond(this.options.dutyTime), pixel = 0;
		startSec += (startSec < dutySec ?  60*60*24 : 0)
		for (var i = 0, len = data.length; i < len; i++) {
			seconds = this._getSecond(data[i][this.options.oee.startDateTime])
			seconds = startSec > seconds && dutySec > seconds ? (seconds += 60*60*24) : seconds;
			if(seconds >= startSec){
				pixel = (seconds- startSec)/this._cunrrentType.rate * w;
				if(i > 0){
					status = data[i-1][status];
					this._addOeeResult(oeeResult[status], seconds- startSec);
				}else{
					status = "defaultColor";
				}
				return this._checkOverFirstPixel(html, status, pixel, w, i)
			}else if(i == len -1 && seconds < startSec && startSec < seconds + parseInt(data[i][this.options.oee.second])){
				pixel = (seconds + parseInt(data[i][this.options.oee.second])-startSec)/this._cunrrentType.rate * w;
				return this._checkOverFirstPixel(html, data[i][status], pixel, w, -1)
			}
		}
		return {index : -1,	pixel : pixel};
	},

	_checkOverFirstPixel : function(html, status, pixel, w, i){
		var orgIndex = i ;
		if(pixel > w){ // pixel 이 넓이 보다 큰 경우
			i = -1, pixel = w;
		}
		this._addbaritem(html, status, pixel, w, orgIndex);
		return {index : i,	pixel : pixel}
	},

	_drawbar : function(data, startMin) {
		var html = [], w = this.oeeBar.width(), oeeResult = this._getOeeTemplete(), totalPixel = 0, pixel, leakPixel=0,
		status = this.options.oee.status, second = this.options.oee.second, startDateTime = this.options.oee.startDateTime;

		for (var i = 0, len = data.length; i < len; i++) {
			if(i == 0 && (this.oeeTimeTxt[0].data("orgpixel") != startMin || this.oeeTimeTxt[0].data("orgpixel") != this._getSecond(data[i][startDateTime])/60)){
				var first = this._findStartPoint(html, data, startMin, w, status, oeeResult);
				totalPixel =+ first.pixel;
				i = first.index;
				if(first.index < 0) break;
			}
			pixel = (data[i][second]/this._cunrrentType.rate) * w;

			if(totalPixel + pixel > w){
				pixel = w - totalPixel;
				this._addOeeResult(oeeResult[data[i][status]], parseInt(pixel*this._cunrrentType.rate/w));
				this._addbaritem(html, data[i][status], pixel, w, i);
				break;
			}
			leakPixel += pixel;
			pixel = leakPixel - leakPixel%1;
			leakPixel = leakPixel - pixel;
			totalPixel += pixel;
			if(len - 1 == i && leakPixel > 0){ // 잃어버린 1px 을 찾아서
				pixel += 1;
			}
			this._addOeeResult(oeeResult[data[i][status]], data[i][second]);
			this._addbaritem(html, data[i][status], pixel, w, i);
		}
		this._bindEvent(this.oeeBar.empty().append(html.join('')).children(":not(.defaultColor)"));
		if(this._cunrrentType == this._oeeType.day){ // day 는 굳이 다시 그릴필요 없음
			this._trigger("onDrawBar", null , [oeeResult]);
		}
	},

	_bindEvent: function(bar){
		bar.on({mousemove: $.proxy(this.tooltipManager.calculatePoint, this),
			mouseleave: $.proxy(this.tooltipManager.hideToolTip, this),
			click : $.proxy(this.tooltipManager.clickPoint, this),
			dblclick : $.proxy(this.tooltipManager.nextProgress, this)
			}); // 이벤트는 우선 그냥 다 tooltip 에서 처리하자
	},

	_addbaritem : function(htmlarray, status, pixel, width, i) {
		if(pixel > 0){
			htmlarray.push('<span class="', status,  '" style="width:', pixel, 'px;background-color:',this.options.statusColor[status] ,'" data-index=', i, '></span>');
		}
	},

	_makeSVG :function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    },

	_tooltipHtml : function(){
		return ['<time>00:00</time>','<button type="button" data-value="day" class="on"><span>',this._oeeType.day.txt.call(this),'</span></button>'
            ,'<button type="button" data-value="hour"><span>',this._oeeType.hour.txt.call(this),'</span></button>'
            ,'<button type="button" data-value="min"><span>',this._oeeType.min.txt.call(this),'</span></button>', '<div class="arrow">'].join("");
	},

	_addOeeResult : function(oeeResult, sec){
		if( sec > 0 && oeeResult !== undefined){
			oeeResult.sec += parseInt(sec);
			oeeResult.cnt ++;
		}
	},

	_getOeeTemplete : function(){
		var result = {}
		for(var key in this.options.statusColor){
			result[key] = { sec : 0 , cnt : 0 };
		}
		return result;
	},

	_setCurrentType : function(t){
		if(this._oeeType[t]){
			this._cunrrentType = this._oeeType[t];
		}
	},

	_pad : function(value, length) {
		value = String(value);
		length = parseInt(length,10) || 2;
		while (value.length < length)  { value = '0' + value; }
		return value;
	},

	// 24시간 기준 pixel 변환
	_convertPx : function(val){
		val = (val >= 1440) ? val%1440 : val;
		val = (val < 0) ? 1440 + val%1440 : val;
		return val;
	},

	DateUtil : (function(){
		var sep = ':';
		var DateType = {
			Min : { execute :
				function(min, useSec){
			        var hh = parseInt(min / 60);
					min %= 60;
				    return [pad(hh,2),sep ,pad(parseInt(min),2) ,(useSec ? (sep+"00") : "")].join("");
				}
			},
			Second : { execute :
				function(sec, useSec){
			        var hh = parseInt(sec / 3600);
					sec %= 3600;
				    var mm = parseInt(sec / 60), ss = parseInt(sec % 60);
				    return [pad(hh,2), pad(mm,2), useSec ? pad(ss,2) : ""].join(sep);
				}
			},
			Hour :{ execute :
				function(hour, useSec){
				    return [pad(parseInt(hour),2), "00", useSec ? "00" : ""].join(sep);
				}
			},
		}
		,getString = function(fn, val, useSec){
			return fn.execute.call(this, val, useSec=== undefined ? true : useSec);
		}
		,pad = function(value, length) {
			value = String(value);
			length = parseInt(length,10) || 2;
			while (value.length < length)  { value = '0' + value; }
			return value;
		}

		return{
			DateType : DateType
			,getString : getString
		}
	})(),


    _getdate : function(datestring) {
		var extracted = datestring.match(/([0-9]{4}).([0-9]{2}).([0-9]{2}) ([0-9]{2}).([0-9]{2}).([0-9]{2})/);
		return extracted && extracted.length > 6 ? new Date(extracted[1], parseInt(extracted[2])-1, extracted[3], extracted[4], extracted[5], extracted[6]) : new Date();
	},

	_getSecond : function(datestring) { //XX:XX , XX:XX:XX 둘다 처리 굳이 정규식 필요없음, 횟수가 많을 경우 정규식이 더느림
		var extracted = datestring.split(/[-: ]/);
		var len = extracted.length;
		return extracted && extracted.length > 1 ? (extracted.length % 3 == 0 ?
				parseInt(extracted[len-3])*60*60 + parseInt(extracted[len-2])*60 + parseInt(extracted[len-1])
				: parseInt(extracted[len-2])*60*60 + parseInt(extracted[len-1])*60 ) : 0;
	},

	_getTxt : function(lastPoint, width){
		return this._cunrrentType.getPointTimeTxt.call(this, lastPoint, width);
	},

	_update : function(startMin){
		this._updateTimeTxt(0, startMin);
		this._drawbar(this._lastData, startMin);
	},
	getTimes : function(){
		var result = [];
		for(var i = 0, len = this.oeeTimeTxt.length ; i < len ; i++){
			result[result.length] = [this.oeeTimeTxt[i].text(), ":00"].join("")
		}
		return result;
    },
	// type : "min", "hour", "day"
	setData : function(data, t, startDateTime){
    	this._lastData = data;
		this.setStartDateTime(t, startDateTime);
    },
    setStartDateTime : function(t, startDateTime){
    	var startMin = t == "day" ? this.oeeTimeTxt[0].data("orgpixel") :
    		(startDateTime !== undefined ? this._getSecond(startDateTime)/60 : this.oeeTimeTxt[0].data("timepixel"));
		this._setCurrentType(t);
    	this._updateTimeTxt(0, startMin);
    	this._drawbar(this._lastData, startMin);
    },
    clear : function(){
    	this.setData([], "day", this.options.dutyTime);
    },
    next : function(){
    	console.log(this.isNextDate())
    	if(this.isNextDate()){
    		if($.isFunction( this.options.onChangedDate)){
    			if(this._trigger("onChangedDate", null , [+1])){
					this._updateTimeTxt(0, this.oeeTimeTxt[0].data("orgpixel"));
				}
        		console.log("trigger onChangedDate  +1 day")
    		}else if(this._cunrrentType != this._oeeType.day){ // day 는 굳이 다시 그릴필요 없음
    			this._update(this.oeeTimeTxt[0].data("orgpixel"));
    		}
    	}else{
    		this._update(this.oeeTimeTxt[0].data("timepixel") + this._cunrrentType.rate/60);
    	}

    },
    isNextDate : function(){
    	if( this._getSecond(this.options.dutyTime)/60 +1440 <= this.oeeTimeTxt[0].data("timepixel") + this._cunrrentType.rate/60){
    		return true;
    	}
    	return false;
    },
    prev : function(){
    	if(this.isPrevDate()){
    		if($.isFunction( this.options.onChangedDate)){
    			if(this._trigger("onChangedDate", null , [-1])){
    				this._updateTimeTxt(0, this.oeeTimeTxt[0].data("timepixel") - this._cunrrentType.rate/60);
    			}
	    		console.log("trigger onChangedDate  -1 day");
    		}else if(this._cunrrentType != this._oeeType.day){ // day 는 굳이 다시 그릴필요 없음
    			this._update(this.oeeTimeTxt[0].data("orgpixel") + 1440 - this._cunrrentType.rate/60);
    		}
    	}else{
    		this._update(this.oeeTimeTxt[0].data("timepixel") - this._cunrrentType.rate/60);
    	}
    },
    isPrevDate : function(){
    	if(this._getSecond(this.options.dutyTime)/60 > this.oeeTimeTxt[0].data("timepixel") - this._cunrrentType.rate/60){
    		return true;
    	}
    	return false;
    },
    tooltipManager : function($bar){
		var displayed = false , hideToolTiptimer = [], lastPoint, width, pLeft, tWidth, tHWidth, width, aLeft,
			$parent, $tooltip, $time, $tabs, $arrow;
		// $.proxy 이부분에서는 빼고 내부변수로 바꾸자 굳이 proxy 사용할 이유가 없음(오히려 비효율적)
		var initialize = function(){
			$parent = $bar, $tooltip =$bar.tooltip, $time = $tooltip.find('time'), $tabs = $tooltip.find('button'),$arrow = $tooltip.find('.arrow');
			aLeft = $arrow.position().left, pLeft = $tooltip.parent().offset().left, tWidth = $tooltip.width(), tHWidth = tWidth/2, width =$bar.oeeBar.width();
			$tooltip.on({mouseenter: cancelHideToolTip, mouseleave: $.proxy(hideToolTip, $bar)});

			$tabs.click($.proxy(function(e){
				var $this = $(e.currentTarget), index = $this.index()-1, t = $this.data("value"),x = 0, rate = this._cunrrentType.rate;
				this._setCurrentType(t);
				if(t == 'day'){
            		x = this.oeeTimeTxt[0].data("orgpixel");
            	}else if(t == 'hour' && this._cunrrentType.rate > rate){
					x = this.oeeTimeTxt[0].data("timepixel");
					x = x - (x + this.oeeTimeTxt[0].data("orgpixel")) % 60;
            	}else{
            		x = lastPoint * rate/60/width;
                	rate = this._cunrrentType.rate/60;
                	x = parseInt(x/rate) * rate +this.oeeTimeTxt[0].data("timepixel");
            	}
				$tabs.removeClass('on').eq(index).addClass('on');
				this._update(x);
				this._trigger("onChangedViewType", null , [t, this.getTimes()]);
			}, $bar));
		}
		, calculatePoint = function(e) {
			if(this.options.isLimitMoveTooltip){
				_calculateLPoint(e, this.options.margin + this.options.margin); //덧셈 속도때문에
			}else{
				$tooltip.css({left: e.clientX - pLeft - tHWidth});
			}
			lastPoint = e.clientX - pLeft- this.options.margin;
			$time[0].innerHTML = this._getTxt(lastPoint, width);
			if (this.options.isShowTooltip && !displayed) {
				this.tooltip.show();
				displayed = true;
			}
			cancelHideToolTip();
			this._trigger("onChangedTooltip", null , [lastPoint, $time[0].innerHTML, true]);
		}
		, _calculateLPoint = function(e, fMargin) { // 속도가 왜 Math 함수가 더느릴까...
			var x = e.clientX - pLeft - tHWidth;
			var limit = width- tWidth + fMargin;
			if(x > 0){
				if(x < limit){
					$tooltip.css({left:x});
					$arrow.css({left:"50%"});
				}else{
					$tooltip.css({left:limit});
					$arrow.css({left: x-limit+tHWidth});
				}
			}else{
				$tooltip.css({left:0});
				$arrow.css({left: x + tHWidth});
			}
		}
		, hideToolTip = function(event) {
			event.preventDefault()
			hideToolTiptimer[hideToolTiptimer.length] = setTimeout( $.proxy(hideToolTipAction, this), 100);
		}

		, cancelHideToolTip = function(event) {
			for(var i = 0, len = hideToolTiptimer.length; i < len ; i++){
				clearTimeout(hideToolTiptimer[i]);
			}
			hideToolTiptimer = [];
		}

		, hideToolTipAction = function() {
			$tooltip.hide();
			this._trigger("onChangedTooltip", null , [-1, '', false]);
			displayed = false;
		}
		, nextProgress = function(e){
           	lastPoint = e.clientX - pLeft- this.options.margin;
			var $next = $tabs.filter(".on").next("button");
			if($next.length > 0 ){
				$next.trigger("click");
			}else{
				$tabs.first().trigger("click");
			}
		}
		, clickPoint = function(e){
			console.dir(this._lastData.slice(1, 3));
			this._trigger("onClickBarChart", null , [this._getTxt(lastPoint, width), $(e.target).data()]);
		}
		, clear = function(){
			$tabs.removeClass("on").eq(0).addClass("on");
		};
		initialize();
		return {
			calculatePoint : calculatePoint
			, hideToolTip : hideToolTip
			, cancelHideToolTip : cancelHideToolTip
			, nextProgress : nextProgress
			, clear : clear
			, clickPoint : clickPoint
			, initialize : initialize
			}
	}
});