/*
 * SFP 의 Grid 플러그인
 * by MHD
 */
$.widget( "sfp.grid", $.sfp.template, {
	// default options
	// data-plain-object
	// data-skip-change-event 	클릭시 이벤트 crud 이벤트 스킵
	// data-grid-disabled-fix 	CRUD 의 D 상태에서도 disabled 되지 않게 함
	// data-skip-sum		써머리시에 제외 대상에 추가
	// data-use-click		클릭 이벤트시 2번 파라미터 row 데이터
	// data-grid-checked	Y의 경우 포맷팅			<td data-template-checked name="delYn"></td>
	// data-date-format 	날짜 포맷팅				<td data-date-format="YYYY-MM-DD HH:mm:ss" name="regDt"></td>
	//												<td data-date-format></td> <-- YYYY-MM-DD HH:mm:ss 기본 모바일에서는 YYYY-MM-DD
	// data-sort  			자동 채번				<td data-sort></td>
	// data-float-fixed		숫자 자리수 지정 변환	<td>2.31</td> -> <td data-float-fixed=1>2.3</td>
	// data-number-comma	숫자 자리수 콤마 처리됨 <td>100000</td> -> <td data-number-comma>100,000</td>
	// options , onAfterDraw : null // function(e, $el, data, groupId) sub모드가 활성화되면
	// grid.paste.s3s 이벤트
	options: {
		isHeaderFix : true
		, isFooterFix : true
		, height : "640px"
		, minHeight : "640px"
		, classes : "sfp-grid"  // 기본 클래스
		, header : [[]] // {name:"", width :"", colspan : 2, rowspan :2, summary: "name~~", isPriority : true // 모바일에서 필수로 보일 값}
						// isSortable true 인 경우, sort 추가 페이징인 경우 false 만 가능, property 추가 exceldown 또는 sort 조회에서 사용
		, isSelected : false  // 선택 모드 활성화 .tbtn-select 클래스가 눌렀을 경우만 셀렉트되도록 막았음
		, isFocus : false  // 새로운 행 추가 addRows 에 대해 자동 스크롤 및 포커싱
		, isSortable : false
		, isChanged : false // input 내용 변경 확인
		, isScrollY : true  // 이름 변경해야함
		, isScrollX : false
		, isCRUD : false
		, isHideHeader : false
		, isHeaderResizable : false
		, selectedCheckBox : null	// selectedCheckBox : true, 또는 disabledFn 있는 경우 function 구현하면 활성화
		/*{
			disabledFn : function(row){ return true or false;  }
		}*/
		, isCRUD_U : false
		, optCRUD : {
			icon : {
				width : "40px"
				, text :""
			}
			,btn : {
				width : "60px"
				, text : "작업" // default 변경가능하니 거기서 변경할 것
			}
		}
		, onClickCRUD : null //function(event, data)
		, boxTag : null
		, pager : null
		, isSubMode : false
		, subModelId : "children"
		, subExtend : true
		, enabledExcelClipboard : false
		, excelClipboard : {limitSize : 200, message: "200 줄을 초과하는 데이터를 붙여넣을 수 없습니다."}
	},
	_excelUrl : "/download/excel",
	_getCRUD : function(){
		return {
			"C" : { mode : "C", modeClass : "C", btn : function(obj){
				this.removeRow(obj);
			}} ,
			"R" : { mode : "R", modeClass : "R", btn : function(obj){
				this.removeRow(obj);
			}},
			"U" : { mode : "U", modeClass : "U", btn : function(obj){
				this.resetRow(obj);
			}},
			"D" : { mode : "D", modeClass : "D", btn : function(obj){
				var $card = $(obj).closest(this.elTagClass);
				this._setCRUD($card, this.CRUD.R).find("input, select").not("[data-grid-disabled-fix]").attr("disabled", false);
				if(this.options.isSubMode){
					if($card.hasClass("grid-main-row")){
						this._setCRUD(this.tbody.find(".grid-sub-row[data-grid-group-id="+$card.data("grid-group-id")+"]"), this.CRUD.R)
							.find("input, select").not("[data-grid-disabled-fix]").attr("disabled", false);
					}
				}
			}}
		};
	},

	// the constructor
	_initialize: function() {
		this._setOptionCRUD_U();
		this._checkMinHeight();
		this._createInner();
		this._setHeader(this.options.header);
		this._setFooter(this.options.footer);
		this._setPager(this.options.pager);
		this._setSort();
		this._setHeaderResizable();
	},
	_setOptionCRUD_U: function() {
		this.CRUD = this._getCRUD();
		if(this.options.isCRUD_U == true){
			$.each(this.CRUD, $.proxy(function( key, val ) {
				val.mode != "U" && (val.modeClass = "crud-none");
			}, this));
			this.options.isCRUD = true;
		}
	},
	_setHeader : function(header){
		this.colgroup.empty();
		this._appendHF(this.thead, header, "<th>", this._hasPriority(header));
		this.header.empty().append(this.table.clone()).find("tbody, tfoot").remove();
		if(this.options.isHideHeader == false){
			this.header.find("thead").show();
		}else{
			this.header.find("thead").hide();
		}
		this.setFixHeader(this.options.isHeaderFix);
	},
	_setFooter : function(footer){
		this._appendHF(this.tfoot, footer, "<td>", this._hasPriority(footer));
		this.footer.empty().append(this.table.clone()).find("thead, tbody").remove();
		this.footer.find("tfoot").show();
		this.setFixFooter(this.options.isFooterFix);
	},
	_setPager : function(pager){
		if($.isPlainObject(pager)){
			if(pager.selector){
				this.pager = $(pager.selector);
			}else{
				this.pager = $("<div class='footer-wrap'></div>");
				this.element.append(this.pager);
			}
			this.pager.pager(pager);
		}
	},
	_setHeaderResizable : function(){
		if(this.options.isHeaderFix && this.options.isHeaderResizable){
			this.header.find("table").colResizable({onResize:$.proxy(function(e){
				this.body.find("table colgroup").html(this.header.find("table colgroup").html());
			}, this)});
		}else if(this.options.isHeaderResizable){
			this.body.find("table").colResizable();
		}
	},

	_hasPriority : function(list){
		var hasPriority = false;
		$(list).each(function(idx, val){
			$(val).each(function(idx, item){
				if(item.isPriority){
					hasPriority = true;
					return false;
				}
			});
		});
		return hasPriority;
	},

	_setSort : function(){
		if(this.options.isSortable){
			this.element.on("click", "th", $.proxy(function(e){
				let $th = $(e.target);
				if($th.data("row-sort") != false){
					let prop = $th.attr("headerProperty");
					if(this.pager && prop){ // pager 가 설정되어있지만 prop 없으면 패스
						if(!$th.hasClass("arrow") || $th.hasClass("bottom")){
							$th.removeClass("bottom");
							this.pager.pager("triggerSort", prop,  "DESC");
						}else{
							$th.addClass("bottom");
							this.pager.pager("triggerSort", prop, "ASC");
						}
						$th.closest("thead").find("th").removeClass("arrow");
						$th.addClass("arrow");
					}else if(!this.pager){
						if(!$th.hasClass("arrow") || $th.hasClass("bottom")){
							$th.removeClass("bottom");
							this.sort(this._cellPos($th).left, 1);
						}else{
							$th.addClass("bottom");
							this.sort(this._cellPos($th).left,-1);
						}
						$th.addClass("arrow");
					}
				}
			}, this));
		}
	},
	_scanTable : function( $table ) {
        let m = [];
        $table.children( "tr" ).each( function( y, row ) {
            $( row ).children( "td, th" ).each( function( x, cell ) {
                var $cell = $( cell ),
                    cspan = $cell.attr( "colspan" ) | 0,
                    rspan = $cell.attr( "rowspan" ) | 0,
                    tx, ty;
                cspan = cspan ? cspan : 1;
                rspan = rspan ? rspan : 1;
                for( ; m[y] && m[y][x]; ++x );
                for( tx = x; tx < x + cspan; ++tx ) {
                    for( ty = y; ty < y + rspan; ++ty ) {
                        if( !m[ty] ) { m[ty] = []; }
                        m[ty][tx] = true;
                    }
                }
                var pos = { top: y, left: x };
                $cell.data( "cellPos", pos );
            } );
        } );
    },
    _cellPos : function( $el, rescan ) {
        var $cell = $el.first(),
            pos = $cell.data( "cellPos" );
        if( !pos || rescan ) {
            var $table = $cell.closest( "table, thead, tbody, tfoot" );
            this._scanTable( $table );
        }
        pos = $cell.data( "cellPos" );
        return pos;
    },
	_checkMinHeight : function(){
		if( (this.options.height.indexOf("px") != -1) && (this.options.minHeight.indexOf("px") != -1) ){
			var intHeight = Number(this.options.height.replace("px", ""));
			var intMinHeight = Number(this.options.minHeight.replace("px", ""));
			if((intMinHeight - intHeight) > 0){
				this.options.minHeight = String(intHeight).concat('px');
			}
		}
	},

	_createInner : function(){
		this.header = $("<div>", {"class" : "sfp-grid-header-panel", "style" : "overflow-x: hidden;overflow-y:hidden"});
		this.body = $("<div>", {"class" : "sfp-grid-body-panel",
			"style" : ["overflow-y:hidden","; overflow-x:",( this.options.isScrollX ? "scroll" : "hidden")
				,";min-height: ", this.options.minHeight ,";height: ", this.options.height].join("")
			});
		this.footer = $("<div>", {"class" : 'sfp-grid-footer-panel', "style" : "overflow-x:hidden;overflow-y:hidden"});
		this.table = $('<table>', {"class" : this.options.classes }).addClass(this.options.addClasses);
		this.options.isCRUD && this.table.addClass("sfp-crud");
		this.colgroup = $("<colgroup>");
		this.thead = $("<thead>")
		this.tbody = $("<tbody>");
		this.tfoot = $("<tfoot>");
		this.element.addClass("sfp-grid-panel").append(
				this.header,
				this.body.append(this.table.append(this.colgroup, this.thead, this.tbody, this.tfoot)),
				this.footer)
			.on("click", "[data-use-click], img.crud-btn, .crud-evt-target", $.proxy(function(e, t){ // button:not(.flow-controller > button)
				if(t === undefined){
					var $this = $(e.target);
					e.stopImmediatePropagation();
					$this.trigger(e.handleObj.type, [this.getData($this), $this.closest(this.elTagClass).index()]);
				}
				return false;
			}, this));
	},

	_bindEvent : function(){
		this.table.on("click", this.elTagClass + ":not(.crud-none) span.crud-btn", $.proxy(function(e) {
			var $target = $(e.target).closest(this.elTagClass);
			var param = this._getData($target);
			delete param[this.options.subModelId];
			this.CRUD[$target.data(this.crudLabel)].btn.call(this, e.target);
			this._trigger('onClickCRUD', new CustomEvent('build', { detail: e.target }), param);
		}, this));

		if(this.options.isScrollX){
			this.body.on("scroll", $.proxy(function(){
				this.header.scrollLeft(this.body.scrollLeft());
				this.footer.scrollLeft(this.body.scrollLeft());
			}, this));
		}

		if(this.options.selectedCheckBox != null){
			this.element.on("click", "thead th input.grid-check-all", $.proxy(function(e){
				this.tbody.find("tr td input.grid-tr-checkbox:enabled").prop("checked", $(e.target).prop("checked"))
			}, this));
		}
		if(this.options.isSubMode){
			this.element.on("click", ".grid-main-row > td:first-child", $.proxy(function(e){
				var $this = $(e.target).closest(this.elTagClass);
				if($this.hasClass("open")){
					$this.removeClass("open")
					this.tbody.find(".grid-sub-row[data-grid-group-id='"+$this.data("grid-group-id") +"']").hide();
				}else{
					$this.addClass("open");
					this.tbody.find(".grid-sub-row[data-grid-group-id='"+$this.data("grid-group-id") +"']").show();
				}
			}, this));
		}

		if(this.options.enabledExcelClipboard){
			var $this = this;
			if(!isChrome){
				var ctrlDown = false,
				ctrlKey = 17,
				cmdKey = 91,
				vKey = 86,
				cKey = 67;

				$(document).keydown(function(e) {
					if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
				}).keyup(function(e) {
					if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
				});
				$(document).keydown(function(e) {
					console.log(e.target.tagName);
//					if (ctrlDown && (e.keyCode == cKey)) console.log("Ctrl+C");
					if (ctrlDown && (e.keyCode == vKey)) $(document).trigger('paste', e);
				});
			}

			$(document).on('paste', function(e) {
				if("INPUT" == e.target.tagName) return;
				e.stopPropagation();
			    e.preventDefault();
				var pasteObj = (event.clipboardData || window.clipboardData);
 				try {
					var keys = [];
					$($this.getTemplateHtml()).find("input").each(function(idx){
						keys[idx] = $(this).attr("name");
					});
					var rows = pasteObj.getData('text').split("\n");
					if($this.options.excelClipboard && rows.length > $this.options.excelClipboard.limitSize + 1){
						alert(rows.length - 1 + " 줄이 입력되었습니다.\n" + $this.options.excelClipboard.message);
						return;
					}

					$(pasteObj.getData('text').split("\n")).each(function(rIdx,r){
						if(r == "") return;
						var p = {};
						$(r.split("\t")).each(function(vIdx, v){ p[keys[vIdx]] = $.trim(v);});
						$this.addRows(p);
					});
					$this.body.find("input").trigger("keyup.s3s");
					$this.element.trigger("grid.paste.s3s", $this.body.find($this.elTagClass).length);
 				}
 				catch(e) {
 					console.log(e);
 				}
			});
		}
		this._super();
	},
	setFixHeader : function(used){
		this._setFixHF(this.header, this.thead, used);
	},
	setFixFooter : function(used){
		this._setFixHF(this.footer, this.tfoot, used);
	},
	_setFixHF : function($panel, $t, used){
		if(used){
			$t.hide()
			$panel.show();
		}else {
			$t.show()
			$panel.hide();
		}
	},
	_appendHF : function(target, list, html, hasPriority){
		target.empty();
		if(list != null && list.length > 0){
			var maxRow = 1;
			var rowCnt = 0;
			var cnt = 0;
			this.isNotPriority = [];
			for(var i = 0 , ilen = list.length ; i < ilen ; i++){
				var $tr =  $("<tr>")
				var row = list[i];
				for(var j = 0 , jlen = row.length ; j < jlen ; j++){
					if(!isMobile || !hasPriority|| (isMobile && row[j].isPriority)){
						var $th =  $(html)
						if(typeof row[j] === "string"){
							target == this.thead && i == 0 && this._addcol($th, 1);
							$th.html(row[j]);
						}else{
							var colspan = row[j].colspan === undefined ? 1 : row[j].colspan;
							if($.isArray(row[j].width) && row[j].width.length != colspan){
								row[j].width = row[j].width.slice(0, row[j].width.length-1);
							}
							target == this.thead && i == 0 && this._addcol($th, colspan, row[j].width);

							row[j].colspan !== undefined && $th.attr("colspan", row[j].colspan);
							row[j].rowspan !== undefined && ($th.attr("rowspan", row[j].rowspan), maxRow=row[j].rowspan);
							row[j].id !== undefined && $th.attr("id", row[j].id);
							row[j].summary !== undefined && $th.attr("data-summary-name",row[j].summary);
							$th.html(row[j].name);
							$th.addClass(row[j].classes)
							row[j].sort == false && $th.attr("data-row-sort", false);
							row[j].property && $th.attr("headerProperty", row[j].property);
						}
						$tr.append($th);
					}else{
						this.isNotPriority.push(cnt);
					}
					cnt++;
				}
				this.isNotPriority.reverse()
				if(i == 0){
					this._appendCheckBoxHF($tr, html, maxRow, target);
					this._appendCRUDHF($tr, html, maxRow, target);
					this._appendSubHF($tr, html, maxRow, target);
				}
				target.append($tr);
			}
		}
	},
	_appendCRUDHF : function($tr, html, maxRow, target){
		if(this.options.isCRUD){
			var $icon = $(html), $btn = $(html);
			target == this.thead && $icon.text(this.options.optCRUD.icon.text);
			$icon.attr("rowspan", maxRow);
			target == this.thead && $btn.text(this.options.optCRUD.btn.text);
			$btn.attr("rowspan", maxRow);
			target == this.thead && this.colgroup.prepend($("<col>", {"style" : "width:" + this.options.optCRUD.icon.width}))
			.append($("<col>", {"style" : "width:" + this.options.optCRUD.btn.width}));
			$tr.prepend($icon).append($btn);
		}
	},
	_appendCheckBoxHF : function($tr, html, maxRow, target){
		if(this.options.selectedCheckBox != null){
			var $th = $(html);
			$th.prepend("<label><input type='checkbox' class='grid-check-all'><span class='check-mark'></span></label>");
			$th.attr("rowspan", maxRow);
			target == this.thead && this.colgroup.prepend($("<col>", {"style" : "width:40px"}));
			$tr.prepend($th);
		}
	},
	_appendSubHF : function($tr, html, maxRow, target){
		if(this.options.isSubMode){
			var $th = $(html);
			$th.attr("rowspan", maxRow);
			target == this.thead && this.colgroup.prepend($("<col>", {"style" : "width:40px"}));
			$tr.prepend($th);
		}
	},
	_addcol : function($th, rec, width){
		if(rec > 1){
			$th.attr("data-row-sort", false);
		}
		this.colgroup.append($("<col>", {"style" : "width:" + (width === undefined ? '*':
			$.isArray(width) ? width[width.length-rec] : width)}));
		--rec > 0 && this._addcol($th, rec, width);
	},

	_setCRUD : function(el, mode){
		el.removeClass("crud-none");
		this._super(el, mode);
		return el;
	},

	_remove : function($card){
		if(this.options.isSubMode){
			if($card.hasClass("grid-main-row")){
				this.tbody.find(".grid-sub-row[data-grid-group-id="+$card.data("grid-group-id")+"]")
					.each($.proxy(function(idx, el){
						var $el = $(el);
						$el.data(this.crudLabel) == this.CRUD.U.mode && this.resetRow($el);
						this._remove($el);
						$el.addClass("crud-none");
				}, this));
			}
		}
		this._super($card);
		this._setScroll();
	},
	filter : function(cbFn, isContinueHide){
		this._super(cbFn, isContinueHide);
		this._setScroll();
	},

	show : function(cbFn){
		this._super(cbFn);
		this._setScroll();
	},
	hide : function(cbFn){
		this._super(cbFn);
		this._setScroll();
	},
	removeRows : function(cbFn){
		this._super(cbFn);
		this._setScroll();
	},
	_addRows : function(fn, obj, data, callbackFn, params){
		if(this.options.isSubMode){
			obj = $(obj).closest(this.elTagClass);
			params === undefined && (params = { isSub : false});
			if( (obj.hasClass("grid-sub-row") && !params.isSub) ||
				(obj.hasClass("grid-main-row") && params.isSub) ) return;
			params.groupId = obj.data("grid-group-id");
		}
		this._super(fn, obj, data, callbackFn, params);
	},

	addSubRows : function(target, row, cbFn, params){
		row = $.isArray(row) ? row : [row];
		target = target instanceof jQuery ? target : $(target).closest(this.elTagClass);
		if(!target.hasClass("grid-main-row")) {
			console.info("target is not main card")
			return;
		}
		this._draw(row, cbFn,
				$.extend(params, { target : target,
					useNotEmpty : true,
					appendType : this.appendType.none,
					crud: this.CRUD.C,
					isSub:true,
					groupId : target.data("grid-group-id") }));
		this.setFocus();
	},

	getParent : function(target){
		var $card = $(target).closest(this.elTagClass);
		var groupId = $card.data("grid-group-id");
		$card = $card.hasClass("grid-main-row") ? $card :
			this.tbody.find(".grid-main-row[data-grid-group-id="+groupId+"]");
		return $card;
	},

	clear : function(){
		this._super();
		this._setScroll();
	},

	isSub : function($card){
		return $card.hasClass("grid-sub-row");
	},

	_getData : function($card, params){ //{ include : true // 부모포함, isChanged :true // 변경된것만} 트리였으면 리컬시브로 구현(단 group 변경)
		var _this = this;
		var result = this._super($card);
		if(this.options.isSubMode && $card.hasClass("grid-main-row") &&
				params !== undefined && params.include == true){
			result[_this.options.subModelId] = [];
			var groupId = $card.data("grid-group-id");
			var selector = ".grid-sub-row[data-grid-group-id="+groupId+"]";
			if(params.isChanged == true){
				selector += ":not(.R)";
			}
			this.tbody.find(selector).each(function(idx, el){
				var val = _this.getData(el);
				result[_this.options.subModelId].push(val);
			});
		}
		return result;
	},

	getParentData : function(target){
		var result;
		var $card = $(target).closest(this.elTagClass);
		var groupId = $card.data("grid-group-id");
		$card = $card.hasClass("grid-main-row") ? $card :
			this.tbody.find(".grid-main-row[data-grid-group-id="+groupId+"]");
		result = this.getData($card);
		return result;
	},

	getDataListCRUD : function(cbFn){
		if(this.options.isSubMode){
			var _this = this; //this.options.isSubMode &&
			var result = this.getDataList(cbFn);
			result = result.filter(function (val) {
				val[_this.options.subModelId] = val[_this.options.subModelId].filter(function (child) {
				    return child.crudMode != "R";
				});
			    return val.crudMode != "R" || val[_this.options.subModelId].length > 0;
			});
			return result;
		}
		return this._super(cbFn);
	},

	getDataList : function(cbFn, params){
		if(this.options.isSubMode){
			return this._super(cbFn, $.extend({selector : ".grid-main-row"}, params));
		}
		return this._super(cbFn, params);
	},

	draw : function(list, callbackFn, params){
		this._super(list, callbackFn, params);
		if(!this.options.subExtend){
			this.tbody.find(".grid-main-row").removeClass("open");
			this.tbody.find(".grid-sub-row").hide();
		}
		return this;
	},
	setPage : function(paging){
		if(this.pager != null){
			this.pager.pager("setPage", paging);
		}
		return this;
	},
	_draw : function(list, cbFn, setting){
		this._super(list, cbFn, setting);
		if(setting.isSub){
			var $main = this.tbody.find(".grid-main-row[data-grid-group-id=" + setting.groupId + "]");
			if(!$main.hasClass("open")){
				$main.find("td:eq(0)").trigger("click");
			}
		}
		this._setScroll();
	},
	_setScroll : function(){
		var scroll = this.options.isScrollY && this.body.height() < this.tbody.height() ? "scroll" : "hidden";
		this.header.css("overflowY", scroll);
		this.body.css("overflowY", scroll);
		this.footer.css("overflowY", scroll);
	},

	getCheckList : function(){
		var result = [];
		var _this = this;
		this.tbody.find("td input.grid-tr-checkbox:checked").each(function(idx, el){
			var val = _this.getData(this);
			result[result.length] = val;
		});
		return result;
	},

	sort : function(idx , order){ // order =>  내림 차순 -1, 오름차순 = 1
		var rows = this.tbody.find("tr").get();
		order === undefined &&  (order = 1);
		var rows = this.tbody.find("tr").get();
		rows.sort(function(prev , next) {
			var $prev = $(prev).children("td").eq(idx);
			var $next = $(next).children("td").eq(idx);
			var A = $prev.has("input").length > 0 ? $prev.find("input").val().toUpperCase() : $prev.text().toUpperCase();
			var B = $next.has("input").length > 0 ? $next.find("input").val().toUpperCase() : $next.text().toUpperCase();
			A = $.isNumeric(A) == true ? Number(A) : A;
			B = $.isNumeric(B) == true ? Number(B) : B;
			if (A < B) {return -1 * order;}
			if (A > B) {return 1 * order;}
			return 0;
		});
		this.tbody.append(rows);
	},

	_appendSub : function($tr){
		if(this.options.isSubMode){
			$tr.prepend("<td/>");
		}
	},

	_appendCRUD : function($tr){
		if(this.options.isCRUD){
			$tr.prepend("<td><span class='crud-icon'></span></td>");
			$tr.append("<td><span class='crud-btn'></span></td>");
		}
	},
	_appendCheckBox : function($tr, data, params){
		if(this.options.selectedCheckBox != null){
			if((this.options.isSubMode && params.isSub) || $tr.data("crud-mode") == this.CRUD.C.mode){
				$tr.prepend("<td></td>");
			}else{
				var $td = $("<td><label><input type='checkbox' class='grid-tr-checkbox' data-skip-change-event data-grid-disabled-fix><span class='check-mark'></span></label></td>")
				if($.isFunction(this.options.selectedCheckBox.disabledFn)){
					$td.find("input").prop("disabled", this.options.selectedCheckBox.disabledFn.call(this, data))
				}
				$tr.prepend($td);
			}
		}
	},
	_append : function($card, data, params){
		// TODO 흠...
		if(Object.keys(data).length > 0){
			this._appendCheckBox($card, data, params)
		}

		this._appendCRUD($card);
		this._appendSub($card);
		this._super($card, data, params);
	},
	_generateCard : function(data, callbackFn, params){
		this.options.isSubMode && (params.preventEvent = true);
		var $card = this._super(data, callbackFn, params);
		if(this.options.isSubMode){
			//$card.attr("data-grid-group-id-target", params.groupId);
			if(params.isSub){
				params.groupId = params.groupId;
				$card.addClass("grid-sub-row");
				this.tbody.find("[data-grid-group-id=" +params.groupId +"]:last").after($card);
			}else{
				params.groupId = SfpUtils.generateUID();
				$card.addClass("grid-main-row");
			}
			$card.attr("data-grid-group-id", params.groupId);
			this._trigger("onAfterDraw", null, [$card, data, params.groupId, this.isSub($card)]);
			if($.isArray(data[this.options.subModelId]) && data[this.options.subModelId].length > 0){
				this._draw(data[this.options.subModelId], callbackFn, $.extend({}, params,
						{ appendType : this.appendType.last, isSub : true, useNotEmpty : true, templateId : params.subTemplateId }));
			}
		}
		return $card;
	},
	downloadExcel : function(url, fileNm, params){
		if(this.getDataList().length == 0){
			alert("다운받을 내용이 없습니다.");
			return;
		}
		if(this.pager){
			let $th = this.element.find("th.arrow");
			SfpUtils.excelDownload(url, params, {"fileNm":fileNm, "rows": this.options.header[0]
				, "sortProp" : $th.attr("headerProperty"), "direction" : $th.hasClass("bottom") ? "ASC" : "DESC"});
		}else{
			SfpUtils.excelDownload(url, params, {"fileNm":fileNm,	"rows": this.options.header[0]});
		}
	},
	downloadExcelView : function(fileNm){
		var list = this.getDataList();
		if(list.length == 0){
			alert("다운받을 내용이 없습니다.");
			return;
		}
		SfpUtils.excelDownload(SFPURL.getUrl(this._excelUrl), { "list" : list, "fileNm":fileNm, "rows": this.options.header[0]});
	},
	downloadCsvView : function(fileNm){
		var list = this.getDataList();
		if(list.length == 0){
			alert("다운받을 내용이 없습니다.");
			return;
		}
		if(!confirm("엑셀을 다운로드 하시겠습니까?")) return;

		var exportTable = this.table.clone();
		exportTable.find('input').each(function(index, elem) {
			$(elem).remove();
		});
		var tab_text = [
			'<html xmlns:x="urn:schemas-microsoft-com:office:excel">'
			, '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
			, '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
			, '<x:Name>', fileNm, '</x:Name>'
			, '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>'
			, '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>'
			, "<table border='1px'>"
			, exportTable.html()
			, '</table></body></html>'];
		tab_text = tab_text.join('')
		var data_type = 'data:application/vnd.ms-excel';
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		var fileName = fileNm + '.xls';
		//Explorer 환경에서 다운로드
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			if (window.navigator.msSaveBlob) {
				var blob = new Blob([ tab_text.join('') ], {
					type : "application/csv;charset=utf-8;"
				});
				navigator.msSaveBlob(blob, fileName);
			}
		} else {
			var blob2 = new Blob([ tab_text ], {
				type : "application/csv;charset=utf-8;"
			});
			var filename = fileName;
			var elem = window.document.createElement('a');
			elem.href = window.URL.createObjectURL(blob2);
			elem.download = filename;
			document.body.appendChild(elem);
			elem.click();
			document.body.removeChild(elem);
		}
	},
	_setOption: function( key, value ) {
		if(/isHeaderFix/.test(key)){
			this.setFixHeader(value);
		}
		if(/isFooterFix/.test(key)){
			this.setFixFooter(value);
		}
		if(/header/.test(key)){
			this._setHeader(value);
			this.summary();
		}
		if(/footer/.test(key)){
			this._setFooter(value);
			this.summary();
		}
		if(/isCRUD/.test(key)){
			this.options[key] = value;
			this.options[key] && this.table.addClass("sfp-crud");
			this.clear();
			this._setHeader(this.options.header);
			this._setFooter(this.options.footer);
		}
		this._super( key, value );
	},

	_destroy: function() {
		this.element.empty();
	}
});