$(function() {
	const DEFAULT_SIZE = 20;
	const init = function() {
		$('input[class^="multi-input"]').prop('readonly', true);
		//$('.multi-input-select-container').hide();
	}

	// 공백제거, 중복제거 후 지정된 사이즈 크기의 새 배열 생성
	const _replaceArray = function(data, multi_size) {
		let result = [];
		data.forEach(function(el) {
			const check = el.replace(/(\s*)/g, "");
			if(check && result.indexOf(check) === -1) result.push(check);
		});
		result = result.slice(0, multi_size);
		return result;
	}

	// Class => multi-input-text
	$(".function-area").on("click", ".multi-input-text", function() {
		const $this = this;
		const multi_size = StringUtils.isEmpty($($this).data("multi-size")) ? DEFAULT_SIZE : $($this).data("multi-size");
		const params = {
			data : $(this).val(),
			size : multi_size
		}

		Dialog.open(SFPURL.getUrl("/common/multi-input-text-search.dialog"), {width:"600px", height: "600px"}, params, function(data){
			data = $(data).text().split("\n");
			const result = _replaceArray(data, multi_size);
			$($this).val(result);
		});
	});

	// Class =>  multi-input-grid
	$(".function-area").on("click", ".multi-input-grid", function() {
		const $this = this;
		const multi_size = StringUtils.isEmpty($($this).data("multi-size")) ? DEFAULT_SIZE : $($this).data("multi-size");
		const params = {
			data : $(this).val(),
			size : multi_size
		}

		Dialog.open(SFPURL.getUrl("/common/multi-input-grid-search.dialog"), {width:"600px", height: "600px"}, params, function(data){
			const result = _replaceArray(data, multi_size);
			$($this).val(result);
		});
	});


/*
	<ul class="multi-input-select-container ico">
	<ul class="multi-input-select-container">
		<li data-val>선택사항1</li>
		<li>선택사항2</li>
		<li>선택사항3</li>
	</ul>
*/
	// Class => multi-input-select ** select 창 열고 닫기
	$(".function-area").on("click", ".multi-input-select", function() {
		const $parent = $(this).closest("span");
		const $container = $parent.find(".multi-input-select-container")
		if($container.is(":visible")) {
			$container.slideUp(10);
		} else {
			if(StringUtils.isEmpty($(this).val())) {
				const arr = $container.children("li");
				for(var i = 0; i < arr.length; i++) {
					$(arr[i]).removeClass("checked");
				}
			}

			const $input = $parent.find(".multi-input-select");
//			$container.css({ "width": $input[0].clientWidth, "left": $input.offset().left ,"top": $input.offset().top + $input.outerHeight() });
			$container.css({ "width": $input[0].clientWidth, "left": $input.offset().left });
			$container.slideDown(10);
		}
	});

	// multi-select 가 열려 있으면 닫기
	$(document).mouseup(function (e){
		const _layerPopup = $('.multi-input-select-container');
		if(!_layerPopup.is(e.target) && _layerPopup.has(e.target).length === 0){
			_layerPopup.slideUp(10);
		}
	});

	// li 값 클릭 시
	$(".function-area").on("click", ".multi-input-select-container > li", function() {
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
	init();
});