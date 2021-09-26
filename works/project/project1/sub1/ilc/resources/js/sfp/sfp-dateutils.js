window.sfp = window.sfp || {};

sfp.dateutils = (function($){

	//yyyy-MM-dd hh:mm:ss 형식의 문자열 반환
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	var fnYmdhms = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		return ymdhmsArray[0] + "-" + ymdhmsArray[1] + "-" + ymdhmsArray[2] + " " + ymdhmsArray[3] + ":" + ymdhmsArray[4] + ":" + ymdhmsArray[5];
	}
	, fnYmdhmsArray = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		return fnToArray(pYmdhms);// 배열로 변환
	}
	//yyyy 형식의 문자열 반환
	,fnYyyy = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		return ymdhmsArray[0];
	}
	//mm 형식의 문자열 반환
	,fnMm = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		return ymdhmsArray[1];
	}
	//dd 형식의 문자열 반환
	,fnDd = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		return ymdhmsArray[2];
	}
	//yyyy-MM-dd 형식의 문자열 반환
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	,fnYmd = function(pYmdhms){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		return ymdhmsArray[0] + "-" + ymdhmsArray[1] + "-" + ymdhmsArray[2];
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = YY MM 사이에 들어갈 구분자 없으면 .
	,fnYm = function(pYmdhms, gubun){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		if(gubun === undefined) gubun = "-";
		return ymdhmsArray[0] + gubun + ymdhmsArray[1];
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = YY MM 사이에 들어갈 구분자 없으면 .
	,fnYw = function(pYmdhms, gubun){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		if(gubun === undefined) gubun = "-";
		return ymdhmsArray[0] + gubun + SfpUtils.pad($.datepicker.iso8601Week(new Date(this.fnYmd(pYmdhms))), 2);
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = MM dd 사이에 들어갈 구분자 없으면 -
	,fnMd = function(pYmdhms, gubun){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		if(gubun === undefined) gubun = "-"
		return ymdhmsArray[1] + gubun + ymdhmsArray[2];
	}
	//pYmdhms = 변환할 날짜 형식의 문자열, yyyyMMddhhmmss | Date 객체
	//gubun = MM dd 사이에 들어갈 구분자 없으면 -
	,fnDm = function(pYmdhms, gubun){
		pYmdhms = _getYmdhms(pYmdhms);
		if(pYmdhms == "") return "";
		let ymdhmsArray = fnToArray(pYmdhms); // 배열로 변환
		if(gubun === undefined) gubun = "-"
		return ymdhmsArray[2] + gubun + ymdhmsArray[1];
	}
	//문자열을 Date 객체로 변환
	//ymdhms14 = yyyymmddhhmmss || y-m-d h:m:s || yyyy-mm-dd
	,fnToDate = function (ymdhms14) {
		let array = fnToArray(ymdhms14);

		let year = parseInt( array[0] );
		let month = parseInt( array[1] ) - 1;
		let day = parseInt( array[2] );
		let hour = parseInt( array[3] );
		let minute = parseInt( array[4] );
		let second = parseInt( array[5] );

		return new Date(year, month, day, hour, minute, second);
	}
	//yyyyMMddhhmmss 형식의 현재일시 반환
	,fnNowYmdhms14 = function(){
		return fnDateToYmdhms14(new Date());
	}
	//Date() 형식을 yyyyMMddhhmmss 문자열로 변환
	,fnDateToYmdhms14 = function(date){
		let json = _getJsonYmdhms(date);
		return json.year + json.month + json.day + json.hour + json.minute + json.second;
	}
	//Date() 형식을 yyyy-MM-dd hh:mm:ss 문자열로 변환
	,fnDateToYmdhms = function(date){
		let json = _getJsonYmdhms(date);
		return json.year + "-" + json.month + "-" + json.day + " " + json.hour + ":" + json.minute + ":" + json.second;
	}
	//yyyymmddhhMMss 형식의 문자열 => yyyy-mm-dd hh:MM:ss 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmdhms = function(ymdhms14){
		let json = _getJsonYmdhmsSplit(ymdhms14);
		return json.year + "-" + json.month + "-" + json.day + " " + json.hour + ":" + json.minute + ":" + json.second;
	}
	//yyyymmddhhMMss 형식의 문자열 => yyyy-mm-dd hh:MM 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmdhm = function(ymdhms14){
		let json = _getJsonYmdhmsSplit(ymdhms14);
		return json.year + "-" + json.month + "-" + json.day + " " + json.hour + ":" + json.minute;
	}
	//yyyymmdd 형식의 문자열 => yyyy-mm-dd 형식으로 변환
	//- ymdhms14 전달하지 않으면 현재일자
	,fnFormatToYmd = function(ymdhms14){
		let json = _getJsonYmdhmsSplit(ymdhms14);
		return json.year + "-" + json.month + "-" + json.day;
	}
	//hhMMss 형식의 문자열 => hh:MM:ss 형식으로 변환
	,fnFormatToHms = function(ymdhms14){
		let json = _getJsonYmdhmsSplit(ymdhms14);
		return json.hour + ":" + json.minute + ":" + json.second;
	}
	//문자열에서 "-", ":", " " 삭제
	,fnRefineYmdHms14 = function(ymdhms14){
		if(ymdhms14 == undefined || ymdhms14 == null) return "";
		ymdhms14 = ymdhms14.replace(/\-/g, "");
		ymdhms14 = ymdhms14.replace(/\:/g, "");
		ymdhms14 = ymdhms14.replace(/ /g, "");
		return ymdhms14;
	}
	//두 날짜의 차이 (초 단위로 반환)
	//result = future - past
	,fnDiffSecond = function (future, past) {
		var futureDate = fnToDate(fnRefineYmdHms14(future));
		var pastDate = fnToDate(fnRefineYmdHms14(past));
		return (futureDate - pastDate) / 1000;
	}
	//HH:MM:SS 를 초로 계산하여 리턴
	,fnHhmmssToSec = function (hhmmss) {
		let array = hhmmss.split(':');
		return parseInt(array[0] * 60 * 60) + parseInt(array[1] * 60) + parseInt(array[2]);
	}
	//ymdhms 에 일, 시간, 분, 초를 더한다.
	//r = d+v
	//w : "d" | "h" | "m" | "s",
	//d : "yyyyMMddhhmmss 또는 yyyy-MM-dd hh:mm:ss
	//v : 정수
	//return : yyyyMMddhhmmss
	,fnAddTime = function (w, d, v) {
		let date = fnToDate(d); // Date 형식으로 바꾸고
		let result;
		if(w == "d") {// 일
			result = date.getTime() + (v * 1000 * 60 * 60 * 24);
		} else if(w == "h"){ // 시간
			result = date.getTime() + (v * 1000 * 60 * 60);
		} else if(w == "m"){ // 분
			result = date.getTime() + (v * 1000 * 60);
		} else if(w == "s"){ // 초
			result = date.getTime() + (v * 1000);
		}
		return fnDateToYmdhms( new Date(result) );
	}
	//ymdhms14를 배열로 반환
	,fnToArray = function (ymdhms14) {
		ymdhms14 = fnRefineYmdHms14(ymdhms14);

		let yyyy = ymdhms14.substring(0, 4);
		let MM = ymdhms14.substring(4, 6);
		let dd = ymdhms14.substring(6, 8);
		let hh = ymdhms14.substring(8, 10);
		let mm = ymdhms14.substring(10, 12);
		let ss = ymdhms14.substring(12, 14);

		let array = new Array();
		array.push(yyyy);
		array.push(MM);
		array.push(dd);

		if(ymdhms14.length == 8) {
			array.push("00");
			array.push("00");
			array.push("00");
		} else {
			array.push(hh);
			array.push(mm);
			array.push(ss);
		}
		return array;
	}
	//HH:MM:SS를 배열로 반환
	,fnHHMMSStoArray = function (hhmmss) {
		hhmmss = fnRefineYmdHms14(hhmmss);

		let hh = hhmmss.substring(0, 2);
		let mm = hhmmss.substring(2, 4);
		let ss = hhmmss.substring(4, 6);

		let array = new Array();
		array.push(hh);
		array.push(mm);
		array.push(ss);
		return array;
	}
	//value에 해당하는 분을 hh:mm 형식으로 반환
	//minutes : 분
	//return : hh:mm
	,fnMinToHHMM = function (minutes) {
		let pad = function(x) { return (x < 10) ? "0"+x : x; }
		return pad(parseInt(minutes / (60*60))) + ":" + pad(parseInt(minutes / 60 % 60));
	}
	//value 에 해당하는 분을 hh:mm:ss 형식으로 반환
	//seconds : 초
	//return : hh:mm:ss
	,fnSecToHHMMSS = function (seconds) {
		let pad = function(x) { return (x < 10) ? "0"+x : x; }
		return pad(parseInt(seconds / (60*60))) + ":" + pad(parseInt(seconds / 60 % 60)) + ":" + pad(seconds % 60);
	}
	//startYmd ~ endYmd 사이의 모든 날짜(yyyy-mm-dd) 배열을 반환
	,fnGetBetweenYmd = function(startYmd, endYmd) {
		let startDt = fnToDate(fnYmd(startYmd)); // Date 형식으로 바꾸고
		let endDt = fnToDate(fnYmd( endYmd )); // Date 형식으로 바꾸고
		let indexDt = startDt;

		let dateArray = new Array();
		while(indexDt.getTime() <= endDt.getTime() ) {
			dateArray.push( fnYmd(indexDt)  );
			indexDt.setDate( indexDt.getDate() + 1 );
		}
		return dateArray;
	}
	, _getYmdhms =function(pYmdhms){
		pYmdhms = (pYmdhms == undefined) ? fnNowYmdhms14() : pYmdhms;// 매개변수가 없으면 현재일시 값으로 설정

		// ymdhms 가 string 인지 Date() 인지 판별
		if( typeof(pYmdhms) == "object" && pYmdhms instanceof Date ) {
			pYmdhms = fnDateToYmdhms14(pYmdhms);
		}
		return pYmdhms;
	}
	, _getJsonYmdhms = function(date){
		let year = new String( date.getFullYear() );
		let month = new String( date.getMonth()+1 );
		let day = new String( date.getDate() );
		let hour = new String( date.getHours() );
		let minute = new String( date.getMinutes() );
		let second = new String( date.getSeconds() );

		if(month.length == 1) month = ("0" + month);
		if(day.length == 1) day = ("0" + day);
		if(hour.length == 1) hour = ("0" + hour);
		if(minute.length == 1) minute = ("0" + minute);
		if(second.length == 1) second = ("0" + second);

		let result = new Object();
		result.year = year;
		result.month = month;
		result.day = day;
		result.hour = hour;
		result.minute = minute;
		result.second = second;
		return result;
	}
	, _getJsonYmdhmsSplit= function(ymdhms14){
		ymdhms14 = (ymdhms14 == undefined) ? fnNowYmdhms14() : ymdhms14;// 매개변수가 없으면 현재일시 값으로 설정
		if(ymdhms14 == "") return "";

		ymdhms14 = fnRefineYmdHms14(ymdhms14);
		if(ymdhms14 == "") return "";

		let ymd = ymdhms14.substring(0, 8);
		let hms = ymdhms14.substring(8, 14);

		let result = new Object();
		result.ymd = ymd;
		result.hms = hms;
		result.year = ymd.substring(0, 4);
		result.month = ymd.substring(4, 6);
		result.day = ymd.substring(6, 8);
		result.hour = hms.substring(0, 2);
		result.minute = hms.substring(2, 4);
		result.second = hms.substring(4, 6);
		return result;
	}
	;
	return {
		 fnYmdhms : fnYmdhms
		,fnYmdhmsArray : fnYmdhmsArray
		,fnNowYmdhms14 : fnNowYmdhms14
		,fnYyyy : fnYyyy
		,fnMm : fnMm
		,fnDd : fnDd
		,fnYmd : fnYmd
		,fnYm : fnYm
		,fnYw : fnYw
		,fnMd : fnMd
		,fnDm : fnDm
		,fnToDate : fnToDate
		,fnDateToYmdhms14 : fnDateToYmdhms14
		,fnDateToYmdhms : fnDateToYmdhms
		,fnFormatToYmdhms : fnFormatToYmdhms
		,fnFormatToYmdhm : fnFormatToYmdhm
		,fnFormatToYmd : fnFormatToYmd
		,fnFormatToHms : fnFormatToHms
		,fnRefineYmdHms14 : fnRefineYmdHms14
		,fnDiffSecond : fnDiffSecond
		,fnHhmmssToSec : fnHhmmssToSec
		,fnAddTime : fnAddTime
		,fnToArray : fnToArray
		,fnHHMMSStoArray : fnHHMMSStoArray
		,fnMinToHHMM : fnMinToHHMM
		,fnSecToHHMMSS : fnSecToHHMMSS
		,fnGetBetweenYmd : fnGetBetweenYmd
	}
}(jQuery));

window.DateUtils = sfp.dateutils;