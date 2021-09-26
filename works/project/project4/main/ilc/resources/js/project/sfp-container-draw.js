$(function(){
	window.ContainerDraw = (function($){
		var options = {
			displayStock : 'Y'
		}
		var init = function(){
			_setForm();
			_bindEvent();
		}
		, _setForm = function(){
		}
		, _bindEvent = function(){
		}
		//CSS Setting
		, XYCssSetting = function(row, column, selector){
			$(selector).css('grid-template-columns', 'repeat('+column+', 1fr)');
			$(selector).css('grid-template-rows', 'repeat('+row+', 1fr)');
		}
		, drawColumnList = function(cellListResult, selector, params){
			let html = [];
			$.extend(options, params);
			cellListResult.forEach(function(e){
				if(options.displayStock === 'Y' && e.existStockYn === 'Y'){
					e.stockClass = "exist-stock";
				}
				html.push('<span class="',e.stockClass,'" id="',e.containerCellId,'" data-x=',e.xmin,' data-y=',e.ymin,' data-grid-x-min=',e.xmin,' data-grid-x-max=',e.xmax, ' data-grid-y-min=',e.ymin,' data-grid-y-max=',e.ymax,' style="grid-row : ',e.xmin,' / ',e.xmax,'; grid-column : ',e.ymin,' / ',e.ymax,';" >',e.containerFloorAndColumn,'</span>');
			});
			$(selector).empty();
			$(selector).append(html.join(''));
		}
		init();
		return {
			XYCssSetting : XYCssSetting,
			drawColumnList : drawColumnList
		}
	}(jQuery));

});