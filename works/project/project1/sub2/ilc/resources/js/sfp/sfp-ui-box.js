// 새로 만들 예정 by MHD
window.sfp = window.sfp || {};
sfp.boxtag = (function(){
// 메모리 테이블 예시
//	BoxTag.selectBox.draw([
//		{
//			selector : "#markingTypeId",
//			firstTxt : "<s:interpret word='마킹유형'/>",
//			tableNm : "wmd_marking_type",
//			text : "marking_type_name",
//			value : "marking_type_id"
//		}
//	]);
//	BoxTag.multiSelect.draw([
//		{
//			selector : "#multi1"
//			, masterCd : "material_type_cd"
//		}
//	]);
	const DEFAULT_SIZE = 20;
	let typeNm = {"selectBox" : "selectBox", "radioBox" : "radio" , "checkBox" : "checkbox", "multiSelect" : "multiSelect", "multiCheck" : "multiCheck"}
		, _url = "/getBox"
		, serviceMemoryTable = "MemoryTable"
		, options = {
				selector : ""				//선택자
				, serviceName : "CodeGroup" //"MemoryTable"	//서비스 ID , 미포함시 코드에서 조회
				, masterCd : null			//코드에서 조회시 필요한 코드그룹
				, firstTxt : null			//최초의 텍스트 추가. 미포함시 추가안됨
				, value : "slaveCd"			//value 로 사용할 키 , 코드에서 조회시 미포함
				, text : "slaveName"			//text 로 사용할 키, 코드에서 조회시 미포함
				, selectedValue : null		//선택하고싶은값
				, removeValue : []			//삭제하고 싶은 값
				, children : null			// select 에서 만 유형함 다중연계 변경이 필요한 경우 사용
				, tableNm : "sys_code_slave" //
				, vertical : false 			// 기본은 세로 check, radio 만
				, type : "checkBox" 			// 기본은 세로 check, radio 만
				, params : {}				// 추가할 파라미터
				, callFn : null				// function 단일 처리 후 리턴 되면 해당 그려진 데이터만 전달
				, filter : null				// function 리턴 true 일 경우 그림
				, isDraw : true
			};
	const init = function() {
		$(function(){
			if(!window.isMobile){
				$('input[class^="multi-input"]').prop('readonly', true);
				_bindEvent();
			}

			$(document).mouseup(function (e){
				const _layerPopup = $('.multi-input-select-container');
				if(!_layerPopup.is(e.target) && _layerPopup.has(e.target).length === 0){
					_layerPopup.slideUp(10);
				}
			});
			$(document).on('mousewheel', function (e){
				const _layerPopup = $('.multi-input-select-container');
				if(!_layerPopup.is(e.target) && _layerPopup.has(e.target).length === 0){
					_layerPopup.slideUp(10);
				}
			});
		});
	}
	, _replaceArray = function(data, multi_size) {
		let result = [];
		data.forEach(function(el) {
			const check = el.replace(/(\s*)/g, "");
			if(check && result.indexOf(check) === -1) result.push(check);
		});
		result = result.slice(0, multi_size);
		return result;
	}
	, _openDialog = function(){
		const $this = $(this);
		const multi_size = StringUtils.isEmpty($this.data("multi-size")) ? DEFAULT_SIZE : $this.data("multi-size");
		const params = {
			data : $this.val(),
			size : multi_size
		}
		const url = $this.hasClass("multi-input-text") ?
				"/common/multi-input-text-search.dialog" : "/common/multi-input-grid-search.dialog";
		Dialog.open(SFPURL.getUrl(url), {width:"600px", height: "600px"}, params, function(data){
			const result = _replaceArray(data, multi_size);
			$this.val(result);
		});
	}
	, _bindEvent = function(){
		$(".function-area").on("click", ".multi-input-text, .multi-input-grid", _openDialog);
	};

	const selectBox = ( function(){
		var draw = function(service, callFn, isSync){
			BoxTag.draw(service, callFn, isSync, 'selectBox');
		}
		,generate = function(data, settings){
			var $selector = $(settings.selector).empty();

			if(!$selector.data("onchange")){
				$selector.on("change", onChange);
				$selector.data("onchange" , true)
			}
			_generate($selector, data, settings);
			if(settings.selectedValue){
				$selector.val(settings.selectedValue);
			}else{
				$selector.find("option:eq(0)").attr("selected", "selected");
			}
			$selector.trigger("change");
		}
		,_genfirstTxt = function($selector, settings){
			if(settings.firstTxt != null){
				var op = $("<option value=''>" + settings.firstTxt + "</option>");
				$selector.append(op);
			}
		}
		,_generate = function($selector, data, settings){
			_genfirstTxt($selector, settings);
			settings.children != null && (settings.children.type = settings.type);
			$selector.data("box-servie", settings);

			if(data != undefined && data != null){
				for(var i = 0 , len = data.length ; i < len ; i++){
					if(settings.removeValue === undefined || settings.removeValue.indexOf(data[i][settings.value]) < 0){
						if(!$.isFunction(settings.filter) || settings.filter.call(this, data[i]) == true){
							var op = $("<option>" + data[i][settings.text] + "</option>");
							op.attr("value", data[i][settings.value]);
							op.data("org-data", data[i]);
							if(settings.children != null){
								op.data("children", settings.children.name);
							}
							$selector.append(op);
						}
					}
				}
			}
		}
		,onChange = function(e){
			var $this = $(this);
			var service = $this.data("box-servie");
			var $selected =$this.find("option:selected")
			var data = $selected.data("org-data");
			var childrenKey = $selected.data("children");
			if(service["children"] !== undefined && service["children"] !== null){
				service["children"].type = service.type;
				_children(data === undefined ? [] : data[childrenKey], service["children"]);
			}
		}
		return {
			draw : draw,
			generate : generate,
			options : options
		}
	})()
	, checkBox = (function(){
			var _box = "check-mark";
			var draw = function(service, callFn, isSync){
				BoxTag.draw(service, callFn, isSync, 'checkBox');
			},
			generate = function(data, settings, boxClass){
				var _html = [];
				var name = SfpUtils.generateUID();
				boxClass = boxClass ? boxClass : _box;
				for(var i = 0 , len = data.length ; i < len ; i++){
					if(settings.removeValue === undefined || settings.removeValue.indexOf(data[i][settings.value]) < 0){
						if(!$.isFunction(settings.filter) || settings.filter.call(this, data[i]) == true){
							_html.push('<label class="generate-box"><input type="',typeNm[settings.type],'" name="', name ,'" value="', data[i][settings.value] ,
									'" /><span class="', boxClass, '">',data[i][settings.text],'</span></label>');
						}
					}
				}

				var $selector = settings.selector instanceof jQuery ? settings.selector : $(settings.selector);
				$selector.data("org-data", settings.selectedValue);
				if(settings.vertical){
					$selector.addClass("vertical");
				}
				$selector.empty().append(_html.join(""));
				_checkedProp($selector, settings.selectedValue);
			},

			_checkedProp = function($selector, selectedValue){
				var selected = [];
				if(!$.isArray(selectedValue)){
					selectedValue = [selectedValue];
				}
				for(var i = 0, len = selectedValue.length; i < len ; i++){
					selected.push("input[value='" + selectedValue[i] + "']"); // 공백을 위해서 + 로 처리함
				}
				$selector.find(selected.join(", ")).prop("checked", true);
			};

		return {
			draw : draw,
			generate : generate,
			options : options
		}
	}())
	, radioBox = (function(){
		return {
			draw : function(service, callFn, isSync){
				BoxTag.draw(service , callFn, isSync, 'radioBox');// 첫의도와 달라져서 우선 class 넘김
			},
			generate :  function(data, settings){
				checkBox.generate(data, settings, "radio-mark");
				var $selector = $(settings.selector).find("input[type='radio']");
				if( $selector.filter(":checked").length == 0){
					$selector.eq(0).prop("checked", true);
				}
			},
			options : checkBox.options
		};
	}())
	// TODO KEVIN
	, multiSelect = (function(){
		return {
			draw : function(service, callFn, isSync){
				BoxTag.draw(service , callFn, isSync, 'multiSelect');// 첫의도와 달라져서 우선 class 넘김
			},
			generate :  function(data, settings){
				_generateMultiBox(data, settings, false);
			}
		};
	}())
	, multiCheck = (function(){
		return {
			draw : function(service, callFn, isSync){
				BoxTag.draw(service , callFn, isSync, 'multiCheck');// 첫의도와 달라져서 우선 class 넘김
			},
			generate :  function(data, settings){
				_generateMultiBox(data, settings, true);
			}
		};
	}())
	, _generateMultiBox = function(data, settings, isIcon){
		const $selector = $(settings.selector).empty();
		$selector.addClass("multi-input-select").prop('readonly', true);
		const $selectorGroup = $selector.closest("span");

		let _html = [];
		const ico = isIcon ? " ico" : "";
		_html.push('<ul class="multi-input-select-container', ico,'">');

		if(data != undefined && data != null){
			for(var i = 0 , len = data.length ; i < len ; i++){
				if(settings.removeValue === undefined || settings.removeValue.indexOf(data[i][settings.value]) < 0){
					if(!$.isFunction(settings.filter) || settings.filter.call(this, data[i]) == true){
						_html.push('<li data-val="', data[i][settings.value],'">', data[i][settings.text],'</li>');
					}
				}
			}
			_html.push('</ul>');
			const $container = $(_html.join(""));
			$selectorGroup.append($container);
			_bindEventMultiBox($selector, $container);
		}
	}
	,_bindEventMultiBox = function($selector, $selectorContainer){
		$selector.click(function() {
			const $this = $(this);
			const $container = $this.next();// $parent.find(".multi-input-select-container")
			if($container.is(":visible")) {
				$container.slideUp(10);
			} else {
				if(StringUtils.isEmpty($this.val())) {
					$container.children("li").removeClass("checked");
				}
				$container.css({ "width": $this[0].clientWidth ,"left": $this.css("margin-left")});
				$this.parent().css({"position" : "relative"}); // 검토필요
				$container.slideDown(10);
			}
		});

		$selectorContainer.on("click", "li", function() {
			const $input = $(this).closest("span").find(".multi-input-select");
			const text = $(this).text();
			const value = $(this).data("val");
			var textList = $input.val().split(",");
			var valueList = [];
			if($input.data("val")){
				valueList = $input.data("val").split(",");
			}
			//하나도 저장된게 없다면 공백 제거
			if(textList[0] === "") {
				textList.splice(0, 1)
				valueList.splice(0, 1)
			}
			if($(this).hasClass("checked") === false) {
				textList.push(text);
				valueList.push(value);
				//배열을 문자열로 바꾸어 넣어줌 ex) 1,2,3
				$input.val(textList.toString());
				$input.data("val", valueList.toString());
				$(this).addClass("checked");
			} else {
				for (let idx in textList) {
					if(textList[idx] == text){
						textList.splice(idx, 1);
						valueList.splice(idx, 1);
						//배열을 문자열로 바꾸어 넣어줌
						$input.val(textList.toString());
						$input.data("val", valueList.toString());
						break;
					}
				}
				$(this).removeClass("checked");
			}
		});
	}
	,_camelize = function camelize(str) {
		return str.replace(/_(.)/g, function(match, chr) {
			return chr.toUpperCase();
		});
	}
	,_getParam = function(service){
		return $.extend(true, {}
					, { params : { key : options.tableNm, value : options.masterCd }}
					, { serviceName :  !service.serviceName && service.tableNm && service.tableNm != options.tableNm ? serviceMemoryTable : options.serviceName
							, params : { key : service.tableNm, value : service.masterCd }}
					, { serviceName :  service.serviceName, params : service.params } );
	}
	,_children = function(data, service){
		var comp = BoxTag[service.type];
		comp.generate.call(this, data, $.extend( {}, comp.options, service ));
	}
	,draw = function(service, callFn, isSync, serviceType){
		var params = { list : [] };
		if(!$.isArray(service)){
			service = [service]
		}
		for(var i = 0, len = service.length; i < len ; i++){
			service[i].type = service[i].type ? service[i].type : serviceType;
			params.list[params.list.length] = _getParam(service[i])
			service[i] = $.extend( {} , options , service[i]);
		}
		callAjax(params, service, callFn, isSync);
	}
	,callAjax = function(params, settings, completeFn, isSync){
		$.ajax({
			method : "POST",
			url : SFPURL.getUrl(_url),
			data : JSON.stringify(params),
			async : isSync ? false : true,
			contentType: "application/json",
			success : function(data, resultTxt, req) {
				if($.isArray(data)){
					for(var i = 0, len = data.length; i < len ; i++){
						var generate = BoxTag[settings[i].type].generate;
						if((settings[i].isDraw || settings[i].isDraw == undefined) && $.isFunction(generate)){
							generate.call(this, data[i], settings[i]);
							if($.isFunction(settings[i].callFn)){	// 개별 완료 콜백
								settings[i].callFn.call(this, data[i]);
							}
						}
					}
				}
				if($.isFunction(completeFn)){ // 전체 완료 콜백
					completeFn.call(this, data);
				}
			},
			error : function( jqXHR, textStatus, err ){
				console.error(textStatus);
			}
		});
	};
	init();
	return {
		selectBox: selectBox,
		radioBox : radioBox,
		checkBox : checkBox,
		multiSelect : multiSelect,
		multiCheck : multiCheck,
		draw : draw
	}
})();
window.BoxTag = sfp.boxtag;