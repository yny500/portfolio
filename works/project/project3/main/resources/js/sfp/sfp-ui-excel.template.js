
window.ExcelTemplate = (function(){
	var options = {
			dataModelId : '',
			keyList : [],
			headerList : [],
			titleFilter : ["선택","삭제여부", "작업"],
			bodyFilter : [],
			param : {title : ""}
	};
	var download = function(param){
		if(param.titleFilter !== undefined && param.titleFilter.length > 0){
			param.titleFilter = options.titleFilter.concat(param.titleFilter);
		}
		if(param.bodyFilter !== undefined && param.bodyFilter.length > 0){
			param.bodyFilter = options.bodyFilter.concat(param.bodyFilter);
		}
		_call($.extend({}, options, param));
	},
	_call = function(param){

		//그리드 템플릿에서 id를 뽑아 온다.
		var templateTr = $('[data-model='+param.dataModelId+']').html();
		$($(templateTr).find('td > input , td > select, td > span').not('[name=delYn], [type=checkbox]').each(function(){
			if(param.bodyFilter.indexOf($(this).attr('name')) < 0){
				param.keyList.push($(this).attr('name'));
			}
		}));

		//header에서 타이틀을 뽑아 온다.
		$("#" + param.dataModelId + " > .sfp-grid-header-panel").find("thead tr").eq(0).find('th').not(':eq(0)').each(function(index){
			if(param.titleFilter.indexOf($(this).text()) < 0){
				param.headerList.push($(this).text());
			}
		});

		//그리드 템플릿 + 타이틀로 객체 생성
		if(param.headerList.length == param.keyList.length){
			for(var i = 0; i < param.headerList.length; i++){
				param.param[param.keyList[i]] = param.headerList[i];
			}
			SFPURL.locationHref(SFPURL.getUrl("/common/getExcelTemplateDown"), param.param);
		}else{
			console.log("그리드 템플릿과 타이틀 개수가 맞지 않습니다!!");
		}
	}
	return {
		download : download
	}
})();