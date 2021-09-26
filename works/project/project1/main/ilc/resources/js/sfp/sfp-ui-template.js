/*
 * SFP 의 Template 플러그인
 * by MHD
 */
window.mergeType = { // grid 의 merge 호출시 사용 기본은 1번
	ALL : 0 ,  				// 완전 새로 그림 원본 변경
	ByName : 1, 			// name 붙은 el 값 변경 원본 변경
	ByNameForRollback : 2	// name 붙은 el 값 변경 원본 유지(롤백가능)
}
$.widget( "sfp.template", {
	// default options
	// data-plain-object
	// data-skip-change-event 	클릭시 이벤트 crud 이벤트 스킵
	// data-skip-sum		써머리시에 제외 대상에 추가
	// data-use-click		클릭 이벤트시 2번 파라미터 row 데이터
	// data-template-checked	Y의 경우 포맷팅			<span data-template-checked name="delYn"></span>
	// data-date-format 	날짜 포맷팅				<span data-date-format="YYYY-MM-DD HH:mm:ss" name="regDt"></span>
	//												<span data-date-format></span> <-- YYYY-MM-DD HH:mm:ss 기본 모바일에서는 YYYY-MM-DD
	// data-sort  			자동 채번				<span data-sort></span>
	// data-float-fixed		숫자 자리수 지정 변환	<span>2.31</span> -> <span data-float-fixed=1>2.3</span>
	// data-number-comma	숫자 자리수 콤마 처리됨 <span>100000</span> -> <span data-number-comma>100,000</span>
	// data-summary-view	해당 attr 이 있으면 target 지정한 정보 summary됨  <span data-summary-view="summary-lot"></span>
	// data-summary-target	summary 할 대상 해당 attr 이 있는 정보들이 summary 되어 같은 이름의 data-summary-view에 들어감
	options: {
		height : '700px'
		, classes : ''  // 기본 클래스
		, addClasses : ''  // 추가 클래스
		, isFocus : false  // 새로운 행 추가 addRows 에 대해 자동 스크롤 및 포커싱
		, isSortable : false
		, isChanged : false // input 내용 변경 확인
		, onAfterDraw : null // function(e, $el, data)
		, templateModel : null
		, emptyTxt : "데이터가 존재하지 않습니다."
	},

	CRUD : {
		"C" : { mode : "C", modeClass : "C", btn : function(obj){}} ,
		"R" : { mode : "R", modeClass : "R", btn : function(obj){}} ,
		"U" : { mode : "U", modeClass : "U", btn : function(obj){}} ,
		"D" : { mode : "D", modeClass : "D", btn : function(obj){}}
	},

	_create : function(){
		this.elTag = "sfp-template-el";
		this.elTagClass = ".sfp-template-el";
		this.crudLabel = "crud-mode";
		this.crudChangeClass = "crud-change-val";
		this.body = this.tbody = this.element;
		this.appendType = {first : 0, last : 1, none :3};
		this._initTemplate();
		this._initialize();
		this._bindEvent();
		if(this.options.boxTag){
			BoxTag.draw(this.options.boxTag, $.proxy(this._setBoxTag, this), true);
		}
	},

	// the constructor
	_initialize : function() {
		this.element.css('height', this.options.height);
		this.element.addClass(this.options.addClasses);
	},

	_bindEvent : function(){
		this.tbody.on("click.s3s", "button.select-line", $.proxy(function(e){
			const $this = $(e.target);
			this.tbody.find(this.elTagClass).removeClass( "selected" );
			$this.closest(this.elTagClass).addClass( "selected" );
		}, this));

		this.element.on("keyup.s3s change.s3s", "[data-summary-target]", function(e){
			const target = $(e.target).data("summary-target");
			let total = 0;
			$("[data-summary-target='"+target+"']").each(function(e){
				var $el = $(this);
				var val = $el.is("input") ? $el.val() : $el.text();
				total += $.isNumeric(val) ? parseInt(val) : 0;
			});
			$("[data-summary-view='"+target+"']").each(function(){
				const $el = $(this);
				$el.is("input") ? $el.val(total).trigger("change.s3s") : $el.text(total);
			});
		});

		if(this.options.isSelected){
			this.tbody.on("click.s3s", this.elTagClass, $.proxy(function(e){
				const $this = $(e.target);
				if($this.find("button.select-line").length == 0){
					this.tbody.find(this.elTagClass).removeClass( "selected" );
					$this.closest(this.elTagClass).addClass( "selected" );
				}
			}, this));
		};

		this.tbody.on("keyup.s3s change.s3s", "input:not([data-skip-change-event]), select:not([data-skip-change-event])", $.proxy(function(e){
			const el = this.getValue($(e.target));

			if(el.parent.data(this.crudLabel) != this.CRUD.C.mode){
				this._setCRUD(el.parent, this.CRUD.R);
				Object.equals(el.target.data("org-data"), el.value) ?
						el.target.removeClass(this.crudChangeClass) : el.target.addClass(this.crudChangeClass);

				if(el.parent.find("[name].crud-change-val").length > 0){
					this._setCRUD(el.parent, this.CRUD.U);
				}
			}
		}, this));
	},
	_setCRUD : function(el, mode){
		mode.modeClass = mode.mode == this.CRUD.C.mode ? mode.mode : mode.modeClass;// TODO KEVIN
		el.removeClass("C R U D").addClass(mode.modeClass).data(this.crudLabel, mode.mode);
		return el;
	},
	mostup : function(obj){
		this.tbody.prepend($(obj).closest(this.elTagClass));
		this.setSortNum();
	},
	up : function(obj){
		var $card = $(obj).closest(this.elTagClass);
		$card.first().prev().before($card);
		this.setSortNum();
	},
	mostdown : function(obj){
		this.tbody.append($(obj).closest(this.elTagClass));
		this.setSortNum();
	},
	down : function(obj){
		var $card = $(obj).closest(this.elTagClass);
		$card.last().next().after($card);
		this.setSortNum();
	},

	refresh: function(opt) {
		$.extend(this.options, opt);
		this.element.empty();
		this._create();
	},

	_initTemplate : function(){
		this.elementId = this.options.templateModel != null ? this.options.templateModel : this.element.attr("id");
		this.template = {};
		$("[data-model=" + this.elementId + "]").each($.proxy(function(idx, el){
			var $el = $(el);
			var id =$el.data("model-id");
			id = id === undefined ? this.elementId : id;
			this.template[id] = $el.html();
		}, this));
	},
	registTemplateHtml : function(key, html){
		this.template[key] = html;
	},
	getTemplateHtml : function(key){
		return key == undefined ? this.template[this.elementId] : this.template[key];
	},
	_setBoxTag : function(data){
		this.boxData = data;
	},

	summary : function(){
		const selector = "body " + this.elTagClass + ":visible:not(.D)";
		$("body [data-summary-view]").each(function(){
			var $this = $(this);
			var val = 0;
			$(selector).find("[data-summary-target='"+$this.data("summary-view")+"']").each(function(idx, el){
				var $el = $(el);
				var elVal = $el.is("input") ? $el.val() : $el.text();
				if($.isNumeric(elVal)){
					val += parseInt(elVal);
				}
			});
			if($this.is("input")){
				$this.val() != val && $this.val(val).trigger("change.s3s")
			}else{
				$this.text(val);
			}
		});
		this.setSortNum();
	},

	removeRows : function(cbFn){
		this.tbody.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $(this).data("org-data"))){
					$this.remove();
				}
			}
		});
		this.summary();
	},

	filter : function(cbFn, isContinueHide){
		isContinueHide = isContinueHide === undefined ? true : isContinueHide;
		this.tbody.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				var isShow = $this.data("show") === undefined ? true : $this.data("show");
				if(cbFn.call(this, $this.data("org-data"), isShow)){
					$this.show();
					$this.data("show", true);
				}else{
					$this.hide();
					$this.data("show", false);
					if(!isContinueHide) return false;
				}
			}
		});
	},
	// 콜백함수에 조건에 해당되는 행만 도시
	show : function(cbFn){
		this.tbody.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $this.data("org-data"))){
					$this.show();
					$this.data("show", true);
				}
			}
		});
	},
	// 콜백함수에 조건에 해당되는 행만 숨김
	hide : function(cbFn){
		this.tbody.find(this.elTagClass).each(function(){
			if($.isFunction(cbFn)){
				var $this = $(this);
				if(cbFn.call(this, $this.data("org-data"))){
					$this.hide();
					$this.data("show", false);
				}
			}
		});
	},
	setFocus : function($card){
		if(this.options.isFocus){
			if($card == undefined){
				this.body.scrollTop(this.tbody.height()+this.body.height()); // filter 관련 처리해야함
				this.tbody.find(this.elTagClass).last().find("input, select").eq(0).focus();
			}else{
				$card.find("input, select").eq(0).focus();
			}
		}
	},
	clear : function(){
		this.tbody.empty();
		this.summary();
	},
	// 특정 tr 삭제 index 로
	removeRowIndex : function(idx){
		const $card = this.tbody.find(this.elTagClass).eq(idx);
		this._remove($card);
	},
	removeRow : function(obj){
		const $card = $(obj).closest(this.elTagClass);
		this._remove($card);
	},
	_remove : function($card){
		if($card.data("crud-mode") == this.CRUD.C.mode || !this.options.isCRUD){
			 $card.remove();
		}else{
			this._setCRUD($card, this.CRUD.D).find("input, select").not("[data-grid-disabled-fix]").attr("disabled", true);
		}
		this.summary();
	},
	addAfter : function(obj, row, cbFn, params){
		row = $.isArray(row) ? row : [row];
		this._addRows("after", obj, row.reverse(), cbFn, params);
	},
	addBefore : function(obj, row, cbFn, params){
		row = $.isArray(row) ? row : [row];
		this._addRows("before", obj, row, cbFn, params);
	},
	_addRows : function(fn, obj, data, callbackFn, params){
		if(obj == null || obj.length == 0){
			this.addRows(data, cbFn);
		}else{
			obj = $(obj).closest(this.elTagClass);
			for(var i = 0 , len = data.length ; i < len ; i++){
				obj[fn](this, this._generateCard(data[i], callbackFn, $.extend(params, { crud : this.CRUD.C })));
			}
		}
		this.setFocus();
		this.summary();
	},
	addRows : function(row, cbFn, params){
		row = $.isArray(row) ? row : [row];
		this._draw(row, cbFn, $.extend(params, { useNotEmpty : true, appendType : this.appendType.last, crud: this.CRUD.C }));
		this.setFocus();
		this.summary();
	},

	addRowHtml : function(html){
		this.tbody.append(html);
	},

	addFirstRows : function(row, cbFn, params){
		if(!$.isArray(row)){
			row = [row];
		}else{
			row = row.reverse();
		}
		this._draw(row, cbFn, $.extend(params, { useNotEmpty : true, appendType : this.appendType.first, crud: this.CRUD.C }));
		this.summary();
	},
	_mergePlainObject : function(f, s){
		var result = {};
		$.extend(result, f, s);
		return result;
	},

	getValue : function($this){
		var result = {target : $this, parent : $this.closest(this.elTagClass), value : ""};
		if($this.is("[data-plain-object][name]")){
			var data = $this.data("org-data");
			var updateData = $this.data("update-data");
			if($.isArray(data) || $.isArray(updateData)){
				result.value = updateData !== undefined ? updateData : data;
			}else{
				result.value = $.extend({}, $this.data("org-data"), $this.data("update-data"));
			}
		}else if($this.is("[type=radio], [type=checkbox]")){
			if($this.parent().hasClass("generate-box")){
				result.target = $this.parent().closest("[name]");
				if($this.is("[type=checkbox]")){
					result.value = [];
					result.target.find(":checked").each(function(idx, el){
						result.value.push(this.value);
					})
				}else{
					result.value = result.target.find(":checked").val();
				}
			}else{
				result.value = $this.prop("checked") ? "Y" : "N";
			}
		}else{
			result.value = $this.val();
		}
		result.value = result.value === "" ? null : result.value;
		return result;
	},

	getData : function(obj, params){
		return this._getData($(obj).closest(this.elTagClass), params);
	},

	_getData : function($card, params){
		let val = {};
		$card.find("input, select").each($.proxy(function(idx, el){
			var $this = $(el);
			var tmp = this.getValue($this);
			if(tmp.target.attr("name") !== undefined){
				val[tmp.target.attr("name")] = tmp.value;
			}
		}, this));
		return $.extend({}, $card.data("org-data"), val, {crudMode : $card.data("crud-mode")});
	},

	_setRowValue : function($card, row, isMerge){ //merge 와 혼용되어 있으니.. 문제임.
		$card.find("[name]").each($.proxy(function(idx, el){
			const $el = $(el);
			const name = $el.attr("name");
			if(row[name] === undefined) return;

			if($el.is("[data-plain-object]")){
				if(isMerge){
					$el.data("update-data", row[name]);
				} else{
					$el.removeData("update-data");
				}
			}else if($el.is("[type=checkbox]")){
				el.checked = row[name] == "Y" ? true : false;
			}else if($el.is("input, select")){
				$el.val(row[name]);
			}else{
				$el.text(row[name]);
			}

			if(isMerge){
				$el.trigger("change.s3s");
			}else{
				$el.data("org-data", row[name]);
			}
		}, this));
		if(!isMerge){
			$card.data("org-data", row);
		}

		this._postProcess($card);
	},
	_postProcess : function($card){
		$card.find("[data-template-checked], [data-date-format], [data-float-fixed], [data-number-comma]").each(function(){
			var $this = $(this);
			if($this.is("[data-template-checked]")){
				$this.html()=="Y" ?  $this.html("<strong>&#10004</<strong>") : $this.html("");
			}
			if($this.is("[data-date-format]") && $.trim($this.html()) != ""){
				const format = $this.data("dateFormat");
				if(format){
					$this.html(moment($this.html()).format(format));
				}else{
					$this.html(moment($this.html()).format(!isMobile ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"));
				}
			}else if($this.is("[data-float-fixed]")){
				const format = $this.data("floatFixed");
				if($this.is("input") && $.isNumeric($this.val())){
					$this.val(parseFloat($this.val()).toFixed(format));7
				}else if($.isNumeric($this.html())){
					$this.html(parseFloat($this.html()).toFixed(format));
				}
			}
			if("[data-number-comma]"){
				if($this.is("input") && $.isNumeric($this.val())){
					$this.val($this.val().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				}else if($.isNumeric($this.html())){
					$this.html($this.html().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				}
			}
		});
	},
	resetRow : function(obj, cbFn){
		const $card = $(obj).closest(this.elTagClass);
		const row = $card.data("org-data");
		$.isFunction(cbFn) && cbFn.call(this, row);
		this._setRowValue($card, row);
		this._drawBoxTag($card, row);
		this._setCRUD($card, this.CRUD.R).find("." + this.crudChangeClass).removeClass(this.crudChangeClass);
		this.summary();
	},

	merge : function(obj, row, type){
		const $card = $(obj).closest(this.elTagClass);
		type === undefined && (type = mergeType.ByName);
		if(type == mergeType.ByNameForRollback ){
			this._setRowValue($card, row, true);
		}else{
			row = $.extend({}, $card.data("org-data"), row);
			type == mergeType.ALL ? this._merge($card, row) : this._setRowValue($card, row);
		}
	},
	redrawData : function(obj, row, cbFn){
		this._merge($(obj).closest(this.elTagClass), row, cbFn);
	},
	redrawDataByIndex : function(idx, row, cbFn){
		this._merge(this.tbody.find(this.elTagClass).eq(idx), row, cbFn);
	},
	_merge : function($card, data, callbackFn){
		const $el = this._generateCard(data, callbackFn, { crud : this.CRUD.U });
		return $card.replaceWith($el);
	},
	getDataListCRUD : function(cbFn){
		return this.getDataList(cbFn, { isChanged :true });
	},
	getDataList : function(cbFn, params){
		const result = [];
		const _this = this;
		params = $.extend({selector : this.elTagClass, include : true}, params);
		this.tbody.find(params.selector).each(function(idx, el){
			var val = _this.getData(this, params);
			val.rowNum = idx + 1;
			val.crudMode = $(el).data("crud-mode");
			if((cbFn === undefined || ($.isFunction(cbFn) && cbFn.call(this, val, idx) != false))
					&& (params === undefined || params.isChanged === undefined || (params.isChanged == true && val.crudMode != "R"))){
				result[result.length] = val;
			}
		});
		return result;
	},
	setSortNum : function(){
		this.element.find(this.elTagClass + " [data-sort]").each(function(idx){
			$(this).text(idx+1);
		})
	},

//	{
//		paging : paging
//		templateId : templateId
//	}
	draw : function(list, callbackFn, params){
		params = this._mergePlainObject(params, { useNotEmpty : false, appendType : this.appendType.last, crud : this.CRUD.R })
		if($.isPlainObject(params.paging)){
			this.pager.pager("setPage", params.paging);
		}
		this._draw(list, callbackFn, params);
		this.summary();
		Dialog.resize();
	},

	_draw : function(list, callbackFn, params){
		!params.useNotEmpty && this.tbody.empty();
		if(list.length > 0){
			for(var i = 0, len= list.length; i < len ; i++){
				if($.type(list[i]) === "string"){
					list[i] = { _val : list[i] };
				}
				list[i].rowNum = i+1;//순번 추가
				var $card = this._generateCard(list[i], callbackFn, params);
				if($card == null){
					continue;
				}
			}
		}else{
			if(!this.options.isCRUD){
				var $card = this._noDataGenerateCard(callbackFn, params);
			}
		}
	},
	_drawBoxTag : function($card, data){
		if(this.options.boxTag){
			for(var i = 0, len= this.options.boxTag.length ; i < len ; i++){
				(this.options.type === undefined || this.options.type === null) && (this.options.type = "selectBox");
				var boxtag = $.extend({}, this.options.boxTag[i]);
				boxtag.selector = $card.find(this.options.boxTag[i].selector);
				boxtag.selectedValue = data[boxtag.selector.attr("name")];
				BoxTag[this.options.boxTag[i].type].generate(this.boxData[i], boxtag);
			}
		}
	},
	_changeBoxSelector : function($card, tag){
		tag.selector = $card.find(tag.selector);
		if($.isPlainObject(tag.children)){
			_changeBoxSelector($card, tag.children);
		}
	},

	_generateCard : function(data, callbackFn, params){//row, crud, cbFn, templateId){ // TODO card draw 완료후에 호출이 필요하다.
		const rowData = $.extend({}, data);
		if($.isFunction(callbackFn) && callbackFn.call(this, rowData, data) == false){
			return null;
		}
		const $card = this._templateTag(rowData,
				params.templateId === undefined ? this.template[this.elementId] : this.template[params.templateId]
				, params.crud);
		this._setRowValue($card, rowData);
		this._drawBoxTag($card, rowData);
		$(this.isNotPriority).each(function(idx, val){
			$card.find("td:eq(" + val + ")").remove();
		});
		$card.find("[data-template-title]").each(function(idx, val){
			var $el = $(this);
			$el.attr("title", $el.text());
		});
		this._append($card, rowData, params);
		if(params === undefined || !params.preventEvent){
			this._trigger("onAfterDraw", null, $card);
		}
		return $card;
	},
	_noDataGenerateCard : function(callbackFn, params){
		const $card = this._templateTag({}, params.templateId === undefined ? this.template[this.elementId] : this.template[params.templateId], params.crud);
		let colspanLength = $card.find("td").length;

		if(this.options.isCRUD){
			colspanLength += 1;
		}

		if(this.options.selectedCheckBox != null){
			colspanLength += 1;
		}

		if(colspanLength > 0){
			this._append("<tr><td colspan="+colspanLength+">"+sfp.lang.getInterpreter(this.options.emptyTxt)+"</td></tr>", { }, params);
		}else{
			this._append("<div class='no-data'><p>"+sfp.lang.getInterpreter(this.options.emptyTxt)+"</p></div>", {}, params);
		}
		return $card;
	},
	_append : function($card, data, params){
		if(params.appendType == this.appendType.first){
			this.tbody.prepend($card);
		}else if(params.appendType == this.appendType.last || params.appendType === undefined){
			this.tbody.append($card);
		}
	},
	_templateTag : function(rowData, tmp, crud){
		const $card = $(tmp.replace(/@{([a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9|_\s-/]+[.]?)+}/g, function(val){
//		var $card = $(tmp.replace(/@{(\w+[.]?)+}/g, function(val){
			const convertValue = function(key, data){
				key = key.replace(/(@{|})/g, "");
				return reculsive(key.split(".") , data);
			},
			reculsive = function(keys, data){
				var result = data[keys[0]];
				if(result === undefined || result === null){
					return "";
				}

				if(keys.length > 1){
					return reculsive( keys.slice(1), result);
				}
				return result;
			}
			return convertValue(val, rowData);
		}));
		this._setCRUD($card.addClass(this.elTag), crud)
		return $card;
	},

	_setOption: function( key, value ) {
		if(/height/.test(key)){
			this.body.css("height", value);
		}
		if(/minHeight/.test(key)){
			this.body.css("min-height", value);
		}
		if(/boxTag/.test(key)){
			BoxTag.draw(this.options.boxTag, $.proxy(this._setBoxTag, this), true);
		}
		this._super( key, value );
	},

	_destroy: function() {
		this.element.empty();
	}
});