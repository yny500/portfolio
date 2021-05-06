$(function(){
    
    // 스크롤 관련
	var wint;
	$(window).scroll(function(){
		wint=$(window).scrollTop();
		
		if(wint > 30){
			$(".top_bg").addClass("fixed");
		}
		else{
			$(".top_bg").removeClass("fixed");
		}
	});
    
	// 마우스오버 관련
	$("#gnb > ul > li").mouseenter(function(){
		$("#header .top").addClass("over");
		$("#header .sub_shadow").addClass("over");
	});
	$(".top").mouseleave(function(){
		$("#header .top").removeClass("over");
		$("#header .sub_shadow").removeClass("over");
	});
	
    // 포커스 관련
	$("#gnb > ul > li:first-child > a").focusin(function(){
		$("#header .top").addClass("over");
		$("#header .sub_shadow").addClass("over");
	});
	$("#gnb > ul > li:last-child li:last-child").focusout(function(){
		$("#header .top").removeClass("over");	
		$("#header .sub_shadow").removeClass("over");
	});
	$("#gnb > ul > li > a").focusin(function(){
		$(this).parent().addClass("over");
	});
	$("#gnb li li:last-child a").focusout(function(){
		$(this).parent().parent().parent().removeClass("over");
	});
	
    // 슬라이더 관련
	var pagen=0;
	var targetx=0;
	$(".controller li:first-child").addClass("active");
	
	$(".controller li").click(function(e){
		e.preventDefault();
		$(".controller li").removeClass("active");
		$(this).addClass("active");
		
		pagen=$(this).index();
		targetx=-1*1180*pagen;
		$(".slider_inner ul").css({"left": targetx});
	});
	
	$(".direction_nav li.left").click(function(e){
		e.preventDefault();
		if(pagen > 0){
			pagen=pagen-1;
		$(".controller li").removeClass("active");
		$(".controller li").eq(pagen).addClass("active");
		
		pagen=$(this).index();
		targetx=-1*1180*pagen;
		$(".slider_inner ul").css({"left": targetx});
		}
	});
	$(".direction_nav li.right").click(function(e){
		e.preventDefault();
		if(pagen < 1){
			pagen=pagen+1;
		$(".controller li").removeClass("active");
		$(".controller li").eq(pagen).addClass("active");
		
		pagen=$(this).index();
		targetx=-1*1180*pagen;
		$(".slider_inner ul").css({"left": targetx});
		}
	});
});