$(function(){
	// Webview -> Native
	window.app = (function($){
		var init = function(){

		}
		// 바코드 리딩을 위한 카메라 오픈
		, openBarcode = function(){
			if(window.android){
				android.openBarcodeScanner();
			}
		}
		// Native 타이틀 변경
		, setNativeTitle = function(title){
			if(window.android){
				android.setNativeTitle(title);
			}else{
				$("#pda-title").text(title);
			}
		}
		// Native 데이터 세팅
		, setAppData = function(key, value){
			if(window.android){
				android.setAppData(key, value);
			}else{
				// TODO JJO
				$.cookie(key, value, { path: '/' });
			}
		}
		// Native 데이터 얻기
		, getAppData = function(key){
			if(window.android){
				return android.getAppData(key);
			}else{
				return $.cookie(key);
			}
		}
		, _setCookieDevice = function(deviceId){
			var deviceName = getDeviceName();
			if(deviceId === '' || deviceName === ''){
				return;
			}

			if($.cookie("deviceId") !== deviceId){
				SfpAjax.ajax(SFPURL.getUrl("/solutions/wmd/pda/addPda"), $.param({ "pdaId" : deviceId, "pdaName" : deviceName }), function(data) {
					$.cookie("deviceId", deviceId, { path: '/' });
					$.cookie("deviceName", deviceName, { path: '/' });
				});
			}else{
				SfpAjax.ajax(SFPURL.getUrl("/solutions/wmd/pda/modifyPda"), $.param({ "pdaId" : deviceId, "pdaName" : deviceName, "delYn" : "N" }), function(data) {
					$.cookie("deviceId", deviceId, { path: '/' });
					$.cookie("deviceName", deviceName, { path: '/' });
				});
			}
		}
		, getDeviceId = function(){
			if(window.android){
				var _deviceId = window.android.getCustomAndroidId();
				_setCookieDevice(_deviceId);
				return _deviceId;
			}else{
				return $.cookie('deviceId');
			}
		}
		, getDeviceName = function(){
			if(window.android){
				return window.android.getCustomDeviceId();
			}else{
				return $.cookie('deviceName');
			}
		}
		// Native 단말기 IP 얻기
		, getDeviceIp = function(){
			if(window.android){
				return android.getCustomDeviceIp();
			}
			return "";
		}
		// Native Android ID 얻기
		, getAndroidId = function(){
			if(window.android){
				return android.getCustomAndroidId();
			}
			return "";
		}
		// Native 시작 URL 얻기
		, getStartUrl = function(){
			if(window.android){
				return android.getStartUrl();
			}
			return "";
		}

		init();
		return {
			openBarcode : openBarcode
			,setNativeTitle : setNativeTitle
			,setAppData : setAppData
			,getAppData : getAppData
			,getDeviceId : getDeviceId
			,getDeviceName : getDeviceName
			,getDeviceIp : getDeviceIp
			,getAndroidId : getAndroidId
			,getStartUrl : getStartUrl
		}
	})(jQuery);

	window.PDAHeader = (function($){
		var init = function(){
			_setForm();
			_bindEvent();
//			_isPdaSettingCheckInit();
//			isPdaSettingCheck();
		}
		, _setForm = function(){

		}
		, _bindEvent = function(){
			$("footer.mgt20").on("click", ".btn.sp4-size", function(e) {
				e.preventDefault();
				var $this = $(this);

				if(isPdaSettingCheck() == false){
					if(window.android){
						SFPURL.locationHref(SFPURL.getUrl("/solutions/pda/pda-main.pda"));
					}else{
//						SFPURL.locationHref(SFPURL.getUrl("/solutions/pda/pda-main.tpda"));
					}
				}else{
					$(".btn.sp5-size").removeClass("on");
					if(window.android){
						SFPURL.locationHref(SFPURL.getUrl("/solutions/pda/"+$this.data("path")+".pda"));
					}else{
						// TODO JJO
//						SFPURL.locationHref(SFPURL.getUrl("/solutions/pda/"+$this.data("path")+".tpda"));
						SFPURL.locationHref(SFPURL.getUrl("/solutions/pda/"+$this.data("path")+".pda"));
					}
					$this.addClass('on');
				}

			});
			$("#work-setting").on("click", function(e) {
				e.preventDefault();
				Dialog.open(SFPURL.getUrl("/solutions/pda/worker-setting.pdadialog"), { width : "320px", height: "320px", isHiddenCloseBtn : true }, { workerId : getWorkerId() }, function(result){
					if(result){
						setWorkerInfo(result);
						location.reload();

						SfpAjax.ajax(SFPURL.getUrl("/solutions/wmd/pda/modifyPda"), $.param({ "pdaId" : app.getDeviceId(), "workerId" : getWorkerId(), "delYn" : "N" }), function(data) {

						});
					}
				});
			});
			$("#pda-logout").click(function(e) {
				e.preventDefault();
				_initWorkerInfo();
				location.reload();
			});
		}
		, _isPdaSettingCheckInit = function(){
			// TODO JJO
//			if(navigator.userAgent !== "S3S-PDA"){
//				SFPURL.locationHref(SFPURL.getUrl("/"));
//				return;
//			}
			if( getWorkerId() == null || getWorkerId() == ''){
				$("#pda-logout").hide();
				MessageBox.alarm("작업자를 설정해주시기 바랍니다.");
				$("#work-setting").trigger("click");
			}else{
				$("#pda-logout").show();
			}
		}
		, isPdaSettingCheck = function(){
			if( getWorkerId() == null || getWorkerId() == ''){
				return false;
			}
			return true;
		}
		, getWorkerInfo = function(){
			var data = window.app.getAppData("workerInfo");
			if(data){
				data = JSON.parse(data);
			}
			return data;
		}
		, _initWorkerInfo = function(){
			app.setAppData("workerInfo", null);
		}
		, setWorkerInfo = function(json){
			var _data = JSON.stringify($.extend(getWorkerInfo(), json));
			app.setAppData("workerInfo", _data);// 선택된 작업장 정보 POP저장소에 세팅
			$("#pda-logout").show();
		}
		, getWorkerId = function(){
			return "SYS";
//			var data = getWorkerInfo();
//			if(data){
//				return data.workerId;
//			}
//			return "";
		}
		, getWorkerName = function(){
			return "SYS";
//			var data = getWorkerInfo();
//			if(data){
//				return data.workerName;
//			}
//			return "";
		}
		, setTitle = function(title){
//			if( (PDAHeader.getWorkerId() == null || PDAHeader.getWorkerId() == '') && (PDAHeader.getWorkerName() == null || PDAHeader.getWorkerName() == '') ){
//				app.setNativeTitle(title);
//			}else{
//				app.setNativeTitle(title+"\n("+PDAHeader.getWorkerName()+")");
//			}
			app.setNativeTitle(title);
		}

		init();
		return {
			getWorkerId : getWorkerId
			,getWorkerName : getWorkerName
			,setWorkerInfo : setWorkerInfo
			,getWorkerInfo : getWorkerInfo
			,setTitle : setTitle
			,isPdaSettingCheck : isPdaSettingCheck
		}
	})(jQuery);

});