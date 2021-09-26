$.widget( "sfp.reportSearcher", {
	// default options
	options: {
		title : sfp.lang.getInterpreter("기간 선택")
		, startPeriodName : "searchStartDt"
		, endPeriodName : "searchEndDt"
		, classes : "tab-container tab-type2"
		, dayPreviousPeriod : 7
		, weekPreviousPeriod : 4
		, monthPreviousPeriod : 1
	},
	searchType : [
		{ type : "day", name : sfp.lang.getInterpreter("일간"), previousPeriod : function(){return this.options.dayPreviousPeriod;}, checked : true},
		{ type : "week", name : sfp.lang.getInterpreter("주간"), previousPeriod : function(){return this.options.weekPreviousPeriod;}},
		{ type : "month", name : sfp.lang.getInterpreter("월간"), previousPeriod : function(){return this.options.monthPreviousPeriod;}}
	],

	// the constructor
	_create: function() {
		this._createHtml();
		this._setForm();
		this._bindEvent();
	},
	_createHtml : function(){
		this.element.addClass(this.options.classes);
		$.each(this.searchType, $.proxy(function(i, val) {
			i+=1;
			var el = this.element.find(">label:last");
			var str_el = '<input id="tab' + i + '" type="radio" name="tabs" value="' + val.type + '" '
			+ (val.checked ? "checked" : "") + ' ><label for="tab' + i + '">' + val.name + '</label>';
			el.length == 0 ? this.element.append(str_el) : el.after(str_el);
			this.element.append(
					$('<section>', {'class' : 'tab-content'}).addClass("tab0" + i)
						.append($('<div>', {'class' : 'function-area'}).addClass(val.type)
						.append($('<div>', {'class' : 'align-left'}).append($('<span>', {'class' : 'period'})
						.append($('<label class="label-text">' + this.options.title + '</label>'))
						.append($('<input type="text" name="' + this.options.startPeriodName + '" class="calendar '
							+ val.type + '" readonly="readonly" data-previous-period=' + val.previousPeriod.call(this) + ' placeholder="' + sfp.lang.getInterpreter("시작일자") + '"/>'))
						.append($('<input type="text" name="' + this.options.endPeriodName + '" class="calendar '
							+ val.type + '" readonly="readonly" placeholder="' + sfp.lang.getInterpreter("종료일자") + '"/>')))
						.append($('<button class="btn-srch ico">' + sfp.lang.getInterpreter("조회") + '</button>')))));
		}, this));
	},
	_setForm : function(option){
		$('.calendar').datepicker({});

		var today = DateUtils.fnYmd();
		$(".calendar.day").each(function(idx) {
			var previousPeriod = $(this).data("previous-period");
			previousPeriod = previousPeriod ? previousPeriod : 0;
			$(this).val(DateUtils.fnYmd(DateUtils.fnAddTime('d', today, -previousPeriod)));
		});
		var _this = this;
		$('.calendar.month').datepicker("option",{
			closeText: sfp.lang.getInterpreter("선택"),
			showButtonPanel : true,
			beforeShow: function(input) {
				var date = $(input).val();
				$(input).datepicker('setDate', new Date(date));
				$(input).datepicker("widget").addClass('hide-calendar');
			},
			onClose: function(dateText, inst) {
				var date = DateUtils.fnYmd(new Date(inst.selectedYear, inst.selectedMonth, 1));
				$(this).datepicker('widget').removeClass('hide-calendar');
				$(this).datepicker('setDate', date);
				var selectDate = inst.selectedYear + '-' + SfpUtils.pad(inst.selectedMonth + 1, 2);
				var $period = $(this).closest(".period");
				if($(this).attr("name") == _this.options.startPeriodName){
					var $endDt = $period.find("[name=" + _this.options.endPeriodName +"]");
					var setDate = $endDt.val();
					$endDt.datepicker("option", "minDate", date);
					if(DateUtils.fnDiffSecond(date, (setDate + "-" + SfpUtils.pad(1, 2))) > 0){
						setDate = selectDate;
					}
					$endDt.val(setDate);
				}
				else{
					var $startDt = $period.find("[name=" + _this.options.startPeriodName +"]");
					var setDate = $startDt.val();
					$startDt.datepicker("option", "maxDate", date);
					if(DateUtils.fnDiffSecond(date, (setDate + "-" + SfpUtils.pad(1, 2))) < 0){
						setDate = selectDate;
					}
					$startDt.val(setDate);
				}
				$(this).val(selectDate);
			}
		});
		$(".calendar.month").each(function(idx) {
			var previousPeriod = $(this).data("previous-period");
			previousPeriod = previousPeriod ? previousPeriod : 0;
			var monthDate = new Date();
			monthDate.setMonth(monthDate.getMonth() - previousPeriod);
			$(this).val(DateUtils.fnYm(monthDate));
		});

		$('.calendar.week').datepicker("option", {
			showOtherMonths: true,
//			selectOtherMonths: true,
			firstDay: 1,
			showWeek : true,
			beforeShowCustom : function (input,  inst) {
				$('.ui-datepicker').addClass("ui-datepicker-week");
				var selectDate = $(input).val();
				if(selectDate){
					var yearWeek = selectDate.split("-");
					var startDate = moment().year(yearWeek[0]).week(yearWeek[1]).weekday(1).format("YYYY-MM-DD");
					var endDate = moment().year(yearWeek[0]).week(yearWeek[1]).weekday(7).format("YYYY-MM-DD");
					$(this).datepicker('setDate', startDate);
				}
			},
			beforeShowDayCustom : function(date, dayInfo) {
				var selectDate = $(this).datepicker('getDate');
				if(selectDate){
					var arrWeek = date.getFullYear() + '-' + SfpUtils.pad($.datepicker.iso8601Week(new Date(selectDate)), 2);
					var yearWeek = arrWeek.split("-");
					var startDate = moment().year(yearWeek[0]).week(yearWeek[1]).weekday(1);
					var endDate = moment().year(yearWeek[0]).week(yearWeek[1]).weekday(7);
					if(date >= startDate && date <= endDate){
						var css = dayInfo[1];
						dayInfo[1] = css + ' ui-datepicker-current-day';
					}
				}
				return dayInfo;
			},
			onClose : function(date) {
				$('.ui-datepicker').removeClass("ui-datepicker-week");
				if(date){
					var arrDate = date.split("-");
					var arrWeek = arrDate[0] + '-' + SfpUtils.pad($.datepicker.iso8601Week(new Date(date)), 2);
					$(this).val(arrWeek);
				}
			}
		});
		$(".calendar.week").each(function(idx) {
			var previousPeriod = $(this).data("previous-period");
			previousPeriod = previousPeriod ? previousPeriod * 7: 0;
			$(this).val(DateUtils.fnYw(DateUtils.fnAddTime('d', today, -previousPeriod)));
		});
	},
	_bindEvent : function(){

		var _this = this;

		this.element.find(".period").find(".day.calendar:eq(0)").on( "change", function() {
			$(this).closest(".period").find(".day.calendar:eq(1)").datepicker( "option", "minDate", $(this).val() );
		});

		this.element.find(".period").find(".day.calendar:eq(1)").on( "change", function() {
			$(this).closest(".period").find(".day.calendar:eq(0)").datepicker( "option", "maxDate", $(this).val() );
		});

		this.element.find(".period").find(".week.calendar:eq(0)").on( "change", function() {
			//현재 선택일의 startDay, endDay를 구함.
			var $endDt = $(this).closest(".period").find(".week.calendar:eq(1)");
			var endWeek = $endDt.val();
			var endYearWeek = endWeek.split("-");
			var endPeriodStartDate = moment().year(endYearWeek[0]).week(endYearWeek[1]).weekday(1).format("YYYY-MM-DD");

			//시작주간의 주차를 얻어와 startDay, endDay를 구함.
			var selectDate = $(this).val();
			var arrDay = selectDate.split("-");

			var startArrWeek = arrDay[0] + '-' + SfpUtils.pad($.datepicker.iso8601Week(new Date(selectDate)), 2);
			var startYearWeek = startArrWeek.split("-");

			var startPeriodStartDate = moment().year(startYearWeek[0]).week(startYearWeek[1]).weekday(1).format("YYYY-MM-DD");

			$endDt.datepicker( "option", "minDate", DateUtils.fnYmd(startPeriodStartDate));
			var setEndWeek = endWeek;
			//future, past
			if(DateUtils.fnDiffSecond(DateUtils.fnYmd(endPeriodStartDate), DateUtils.fnYmd(startPeriodStartDate)) < 0){
				setEndWeek = startArrWeek;
			}
			$endDt.val(setEndWeek);
		});

		this.element.find(".period").find(".week.calendar:eq(1)").on( "change", function() {
			//시작주간의 주차를 얻어와 startDay, endDay를 구함.
			var $startDt = $(this).closest(".period").find(".week.calendar:eq(0)");
			var startWeek = $startDt.val();
			var startYearWeek = startWeek.split("-");
			var startPeriodEndDate = moment().year(startYearWeek[0]).week(startYearWeek[1]).weekday(7).format("YYYY-MM-DD");

			//현재 선택일의 startDay, endDay를 구함.
			var selectDate = $(this).val();
			var arrDay = selectDate.split("-");

			var endArrWeek = arrDay[0] + '-' + SfpUtils.pad($.datepicker.iso8601Week(new Date(selectDate)), 2);
			var endYearWeek = endArrWeek.split("-");
			var endPeriodEndDate = moment().year(endYearWeek[0]).week(endYearWeek[1]).weekday(7).format("YYYY-MM-DD");

			$startDt.datepicker( "option", "maxDate", DateUtils.fnYmd(endPeriodEndDate));
			var setStartWeek = startWeek;
			//future, past
			if(DateUtils.fnDiffSecond(DateUtils.fnYmd(endPeriodEndDate), DateUtils.fnYmd(startPeriodEndDate)) < 0){
				setStartWeek = endArrWeek;
			}
			$startDt.val(setStartWeek);
		});

		this.element.on('click', '[name=tabs]', function() {
			var reportPeriodType = null;
			$(this).closest(".tab-container").find("input[name=tabs]:checked").each(function() {
				reportPeriodType = $(this).val();
			});
			$("." + reportPeriodType).find(".btn-srch").trigger('click');
		});

		this.element.find(".ui-datepicker" ).on('mouseover', '.ui-datepicker-calendar tr', function() {
			$(this).addClass('ui-state-hover');
		}).on('mouseout', 'tr', function() {
			$(this).removeClass('ui-state-hover');
		});

//		this._dateFromWeekNumber.call()
	}
	, _dateFromWeekNumber : function(year, week) {
		var d = new Date(year, 0, 1);
		var dayNum = d.getDay();
		var diff = --week * 7;

		// If 1 Jan is Friday to Sunday, go to next week
		if (!dayNum || dayNum > 4) {
		  diff += 7;
		}

		// Add required number of days
		d.setDate(d.getDate() - d.getDay() + ++diff);
		var e = new Date(d.getTime() + (6 * 1000 * 60 * 60 * 24));
		return {startDate : d, endDate : e};
	}
	,getSearchParam : function() {
		var reportPeriodType = null;
		this.element.find("input[name=tabs]:checked").each(function() {
			reportPeriodType = $(this).val();
		});
		var searchData = $.extend({}, $("." + reportPeriodType).find("select, input").serializeObject(), {reportPeriodType : (reportPeriodType).toUpperCase()});

		return searchData;
	},
	_destroy: function() {
		this.element.empty();
	}
});
