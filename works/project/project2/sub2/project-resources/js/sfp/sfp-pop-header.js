if(external && external.clearEvent){
	external.clearEvent();
}

$(function(){
	window.POPHeader = (function($){
		var eventList = [];
		var init = function(){
			_setForm();
			_bindEvent();
			_isPopSettingCheckInit();

			$(".util-menu .setting").css("display", "display");
			if(external && external.setNativeTitle){
				external.setNativeTitle("ILC")
			}
//			getWorkStationInfo();
		}
		, _setForm = function(){
			$("#workStationName").val(getWorkStationName());
//			$("#workerId").val(getWorkerId());
//			$("#workerName").val(getWorkerName());
//			if( getWorkerId() != null &&  getWorkerId() != ''){
//				$("#worker-out").show();
//			}
		}
		, _bindEvent = function(){
			$(document).on("contextmenu",function(e){
				return false;
			});

			$(document).on("touchend click", "button, input, img, li", function(e){
				$(e.target).blur();
				$("#header_title").focus();
			});

			// Header 로고 클릭 시
			$("#header_logo").click(function(e) {
				e.preventDefault();
				goHome();
			});
			// Header 나가기 클릭 시
			$(".util-menu .logout").click(function(e) {
				e.preventDefault();
				var json = getSettingInfo();
				if(json){
					delete json.workerId;
					delete json.workerName;
					setSettingInfoString(JSON.stringify(json));
					goHome();
				}
			});
			// Header
			$(".util-menu .setting").click(function(e) {
				e.preventDefault();
				Dialog.open(SFPURL.getUrl("/solutions/pop/pop-setting.pdialog"), { width : "510px", height : "900px", isHiddenCloseBtn : true }, getSettingInfo(), function(result){
					setSettingInfo(result);
					if(result){
//						getWorkStationInfo();
					}
				});
			});
			$(".util-menu .ing-order").click(function(e) {
				e.preventDefault();
				Dialog.open(SFPURL.getUrl("/solutions/pop/work-ing-order-info.pdialog"), { width : "600px", height : "780px", isHiddenCloseBtn : true }, {workStationId : getWorkStationId()}, function(result){

				});
			});
			// Refresh
			$(".util-menu .refresh").click(function(e) {
				e.preventDefault();
				location.reload();
			});
			$(".btn-area .updown .up").click(function(e) {
				e.preventDefault();
				PageManager.prevPage(".sfp-grid-panel");
			});
			$(".btn-area .updown .down").click(function(e) {
				e.preventDefault();
				PageManager.nextPage(".sfp-grid-panel");
			});
		}
		, goHome = function(){
			SFPURL.locationHref(SFPURL.getUrl("/solutions/pop/pop-main.tpop"));
		}
		, isPopSettingCheck = function(){
			if( getWorkStationId() == null || getWorkStationId() == ''){
				return false;
			}
//			if( getWorkerId() == null || getWorkerId() == ''){
//				return false;
//			}
			return true;
		}
		, _isPopSettingCheckInit = function(){
			var isShowDialog = false;
			if( getWorkStationId() == null || getWorkStationId() == ''){
				MessageBox.alarm("작업장을 설정해주시기 바랍니다.");
				isShowDialog = true;
			}
//			if( getWorkerId() == null || getWorkerId() == ''){
//				MessageBox.alarm("사번을 설정해주시기 바랍니다.");
//				isShowDialog = true;
//			}
			if(isShowDialog){
				$(".util-menu .setting").trigger("click");
			}
		}
		, isAlarmMessage = function(){
//			if(external && external.getStorage){
//				var data = external.getStorage("alarmMessage");
//				if(data){
//					return data == 'Y' ? true : false;
//				}
//			}
//			return false;
			// TODO 이게 뭘까
			return true;
		}
		, getSettingInfo = function(){
			var data;
			if(external && external.getAppData){
				data = external.getAppData("settingInfo");
				if(data){
					data = JSON.parse(data);
				}
			}else{
				// TODO JJO
				data = $.cookie('settingInfo');
				if(data){
					data = JSON.parse(data);
				}
			}
			return data;
		}
		, setSettingInfo = function(json){
			var _data = JSON.stringify($.extend(getSettingInfo(), json));
			setSettingInfoString(_data);
		}
		, setSettingInfoString = function(_data){
			if(external && external.setAppData){
				external.setAppData("settingInfo", _data);// 선택된 작업장, 사번 정보 POP저장소에 세팅
			}else{
				$.cookie('settingInfo', _data, { path: '/' });
			}
//			$("#workerId").val(getWorkerId());
//			$("#workerName").val(getWorkerName());
			$("#workStationName").val(getWorkStationName());

//			if( getWorkerId() != null &&  getWorkerId() != ''){
//				$("#worker-out").show();
//			}

			if(window.POPMain){
				window.POPMain.setMainData();
			}
		}
		, getWorkerId = function(){
			return "SYS";
//			var json = getSettingInfo();
//			if(json){
//				return json.workerId;
//			}else{
//				return null;
//			}
		}
		, getWorkerName = function(){
			return "SYS";
//			var json = getSettingInfo();
//			if(json){
//				return json.workerName;
//			}else{
//				return null;
//			}
		}
		, getWorkStationId = function(){
			var json = getSettingInfo();
			if(json){
				return json.workStationId;
			}else{
				return null;
			}
		}
		, getWorkStationName = function(){
			var json = getSettingInfo();
			if(json){
				return json.workStationName;
			}else{
				return null;
			}
		}
		, onchange = function(callbackFn){
			eventList[eventList.length] = callbackFn;
		}
		// 화면 상단 좌측에 타이틀 세팅
		, setTitle = function(title){
			$("#header_title").text(sfp.lang.getInterpreter(title));
			$("#header_station").text(getWorkStationId());
		}
		, getWorkStationInfo = function() {
			if(getWorkStationId()){
				SfpAjax.ajax(SFPURL.getUrl('/solutions/wmd/workstation/getDetail'), {workStationId : getWorkStationId()}, function(data) {
					$(".work-station-info").setData(data);
				});
			}
		}
		, moveWorkOrderProcess = function(data) {
			SFPURL.locationHref(SFPURL.getUrl(data.url), data);
		};
		init();
		return {
			 setTitle : setTitle
			 ,goHome : goHome
			 ,isPopSettingCheck : isPopSettingCheck
			 ,isAlarmMessage : isAlarmMessage
			 ,getSettingInfo : getSettingInfo
			 ,setSettingInfo : setSettingInfo
			 ,getWorkStationId : getWorkStationId
			 ,getWorkStationName : getWorkStationName
			 ,getWorkStationInfo : getWorkStationInfo
			 ,getWorkerId : getWorkerId
			 ,getWorkerName : getWorkerName
			 ,moveWorkOrderProcess : moveWorkOrderProcess
		}
	})(jQuery);

});