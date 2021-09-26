window.sfp = window.sfp || {};

sfp.datepicker = (function($){

	let holidayList = {};//휴일정보객체

	var fn_getHolidayList = function(data){
		var param = $.extend({}, { delYn : "N" }, data);
		SfpAjax.ajax(SFPURL.getUrl("/apps/mdm/holiday/getList"),
			$.extend({}, param)
			, function(list) {
				$.each(list, function(index, row){
					var holidayYmd = row.holidayYmd;
					var holidayName = row.holidayName;
					holidayList[holidayYmd] = holidayName;
				});
			}, {async:false});
		}
		,datePickerSettings = function(){
			/* datepicker 기본 설정 */
			var nowDate = new Date();
			var nowYear = new String( nowDate.getFullYear() );
			var nowMonth = new String( nowDate.getMonth() + 1);
			//var nowDay = new String( nowDate.getDate() );

			// DANIEL ADD START
			var $startDatePicker;
			var $endDatePicker;

			var $doms = $(document).find('.calendar');
			$doms.each(function() {
				var $tag = $(this);
				var periodName = $tag.attr('period');
				if(periodName === 'start'){
					$startDatePicker = $tag;
				} else if(periodName === 'end'){
					$endDatePicker = $tag;
				}
			});

			if($startDatePicker != null && $endDatePicker != null){
				$startDatePicker.on( "change", function() {
					var dateFormat = $(this).datepicker("option", "dateFormat");
					var minDate = $.datepicker.parseDate(dateFormat, this.value );
					$endDatePicker.datepicker( "option", "minDate", minDate );
				});

				$endDatePicker.on( "change", function() {
					var dateFormat = $(this).datepicker("option", "dateFormat");
					var maxDate = $.datepicker.parseDate(dateFormat, this.value );
					$startDatePicker.datepicker( "option", "maxDate", maxDate );
				});
			}
			// DANIEL ADD END

			$.datepicker.setDefaults(
			{
				  closeText: "닫기"
				, prevText: sfp.lang.getInterpreter("이전달", true)
				, nextText: sfp.lang.getInterpreter("다음달", true)
				, currentText: sfp.lang.getInterpreter("오늘", true)
				, monthNames: _getMonths()
				, monthNamesShort: _getMonths()
				, dayNames: _getDays()
				, dayNamesShort: _getDays(true)
				, dayNamesMin: _getDays(true)
				, weekHeader: sfp.lang.getInterpreter("주", true)
				, dateFormat: "yy-mm-dd"
				, firstDay: 0
				, isRTL: false
				, showMonthAfterYear: true
				, yearSuffix: sfp.lang.getInterpreter("년", true)
				, changeYear :true
				, changeMonth: true
				, showOn: "focus" // focus | button | both
				//, buttonImage: "<c:url value='/resources/images/icons/micro/calendar5.png' />"
				, buttonImageOnly: true
				, buttonText: "Select date"
				, beforeShow : function(input,  inst) { // 달력에 휴일 표시 처리
					datePickerBeforeShow(inst, nowYear, nowMonth);
					var custom = $.datepicker._get( inst, "beforeShowCustom" );
					$.isFunction(custom) && custom.apply(this, arguments);
				}
				, beforeShowCustom : null

				, beforeShowDay : function(day) { // 달력에 휴일 표시 처리
					var dayInfo = datePickerBeforeShowDay(day);
					var custom = $.datepicker._get( $.datepicker._getInst(this), "beforeShowDayCustom" );
					if($.isFunction(custom)){
						dayInfo = custom.apply(this, [day, dayInfo]);
					}
					return dayInfo;
				}
				, beforeShowDayCustom : null

				, onChangeMonthYear : function(year, month, inst ) {
					var data = {};
					if(year == "0" || month == "0") {
						data.holidayYear = nowYear;
						data.holidayMonth = nowMonth;
					} else {
						data.holidayYear = year;
						data.holidayMonth = month;
					}
					if($(this).hasClass("calendar")){
						fn_getHolidayList(data);
					}
				}
			}
		);
	}
	, _getMonths = function(isShort){
		return [
			sfp.lang.getInterpreter("1월", isShort)
			, sfp.lang.getInterpreter("2월", isShort)
			, sfp.lang.getInterpreter("3월", isShort)
			, sfp.lang.getInterpreter("4월", isShort)
			, sfp.lang.getInterpreter("5월", isShort)
			, sfp.lang.getInterpreter("6월", isShort)
			, sfp.lang.getInterpreter("7월", isShort)
			, sfp.lang.getInterpreter("8월", isShort)
			, sfp.lang.getInterpreter("9월", isShort)
			, sfp.lang.getInterpreter("10월", isShort)
			, sfp.lang.getInterpreter("11월", isShort)
			, sfp.lang.getInterpreter("12월", isShort)];
	}
	, _getDays = function(isShort){
		return [
			sfp.lang.getInterpreter("일요일", isShort)
			, sfp.lang.getInterpreter("월요일", isShort)
			, sfp.lang.getInterpreter("화요일", isShort)
			, sfp.lang.getInterpreter("수요일", isShort)
			, sfp.lang.getInterpreter("목요일", isShort)
			, sfp.lang.getInterpreter("금요일", isShort)
			, sfp.lang.getInterpreter("토요일", isShort)];
	}
	, datePickerBeforeShow = function(inst, nowYear, nowMonth) {
		var selectedYear = inst.selectedYear;
		var selectedMonth = inst.selectedMonth;

		var data = {};
		if(selectedYear == "0" || selectedMonth == "0") {
			data.holidayYear = nowYear;
			data.holidayMonth = nowMonth;
		} else {
			data.holidayYear = selectedYear;
			data.holidayMonth = selectedMonth + 1;
		}
		if($(this).hasClass("calendar")){
			fn_getHolidayList(data);
		}
	}
	, datePickerBeforeShowDay = function(day) {
		var formattedDay = $.datepicker.formatDate("yy-mm-dd", day);
		var dayInfo = [true, "", ""];
		if( formattedDay in holidayList ){
			dayInfo = [true, "ui-datepicker-holiday", holidayList[formattedDay], "" ];
		} else {
			switch( day.getDay() ) {
				case 0 : dayInfo = [true, "ui-datepicker-sunday", "일요일"]; break;
				case 6 : dayInfo = [true, "ui-datepicker-saturday", "토요일"]; break;
				default: dayInfo = [true, ""]; break;
			}
		}
		return dayInfo;
	}
	return {
		datePickerSettings : datePickerSettings,
	}
}(jQuery));

window.DatePicker = sfp.datepicker;

$(function(){
	sfp.datepicker.datePickerSettings();
	$( ".calendar" ).datepicker({});

	$(".period .calendar:eq(0)").on( "change", function() {
		$(".period .calendar:eq(1)").datepicker( "option", "minDate", $(this).val() );
	});

	$(".period .calendar:eq(1)").on( "change", function() {
		$(".period .calendar:eq(0)").datepicker( "option", "maxDate", $(this).val() );
	});

})
