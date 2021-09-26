$(function(){
	window.Barcode = (function($){
		var barcodePatterns = {
//			CONTAINER_BARCODE : /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/
			CONTAINER_CELL_BARCODE : /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/
			,BOX_BARCODE : /^T[0-9]{4}$/
//			,WORKER_BARCODE : /^(1|9){1}[0-9]{13}$/
//			,ITEM : /^P[0-9]+$/
//			,LOT : /^LOT-[0-9]+$/
		}
		var init = function(){
			_setForm();
			_bindEvent();
		}
		, _setForm = function(){

		}
		, _bindEvent = function(){

		}
		, getBarcodePattern = function(str){
			if(str == undefined || str == null || str == ''){
				return "";
			}
			var result = "ITEM";
			$.each(barcodePatterns, function(key) {
				if(barcodePatterns[key].test(str)){
					result = key;
				}
			});
			return result;
		}
		, isWorkerPattern = function(str){
			var workerPattern = /^(1|9){1}[0-9]{13}$/;
			if(workerPattern.test(str)){
				return true;
			}
			return false;
		}

		init();
		return {
			getBarcodePattern : getBarcodePattern
			,isWorkerPattern : isWorkerPattern
		}
	})(jQuery);

});