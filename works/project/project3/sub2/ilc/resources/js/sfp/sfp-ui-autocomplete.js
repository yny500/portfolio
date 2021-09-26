
window.AutoComplete = (function(){
	var options = {
			selector : '', //select tag id
			searchKey : '', //autoComplete 대상 컬럼(snake 타입으로 해야 된다!!)
			dropBoxShow : false, //드롭 다운 사용 여부
			checkLength : 1, // LIKE 검색시 자리수 만족 기준
			tableNm : '', //메모리 table 이름
			visibleProperties : [],
			url : '',
			filterKey : '', // 목록 필터 컬럼
			filterValue : '', // 목록 필터 값
			params : {}
	},
	_defaultUrl = "/getMemoryTable"; //default 는 메모리 테이블에서 가져 온다!
	var init = function(service){
		if(!$.isArray(service)){
			service = [service]
		}
		for(var i = 0, len = service.length; i < len ; i++){
			var params = {tableNm : service[i].tableNm};
			service[i] = $.extend( {} , options , service[i]);
			service[i].searchKey = (service[i].url !== '' && service[i].url !== undefined) ? service[i].searchKey : _snake(service[i].searchKey);
			if(service[i].visibleProperties.length >= 1){
				service[i].visibleProperties.forEach(function(element){
					service[i].visibleProperties.push(_snake(element));
				})
			}else if(service[i].visibleProperties.length == 0){
				service[i].visibleProperties.push(service[i].searchKey);
			}

			callAjax(params, service[i]);
		}
	},
	callAjax = function(params, service){
		$.ajax({
			method : "POST",
			url : SFPURL.getUrl((service.url !== '' && service.url !== undefined) ? service.url :_defaultUrl),
			data : params,
			success : function(data, resultTxt, req) {
				if(data !== undefined && data.length > 0){
					var filterData = data.filter(function (element){
						return function(){
							if(element[_snake(service.filterKey)]){
								if(element[_snake(service.filterKey)] == service.filterValue){
									return true;
								}
							}else{
								return true;
							}
						}();
					})

					$(service.selector).flexdatalist({
						searchIn : service.searchKey,
						visibleProperties: service.visibleProperties,
						minLength: service.dropBoxShow === true ? 0 : service.checkLength,
						searchContain : true,
						//maxShownResults : 2, 검색 결과 수량
						data: filterData
					});
				}
			},
			error : function( jqXHR, textStatus, err ){
				console.error(textStatus);
			},
			complete : function(response){
				if (response && response.responseJSON) {
				}
			}
		});
	},
	_snake = function snake(str) {
		return str.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
	}
	return {
		init : init
	}
})();