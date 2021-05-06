$(function(){
	var w;
	var wint;
    
    // 비디오 관련
    var video=document.getElementById("main_video");
    video.muted=true;
    video.play();
        
    // 리사이즈 관련
	$(window).resize(function(){
		w=$(window).width();

		if(w > 600){
			if($(".mobile_menu").hasClass("active")){
				$("mobile_menu").removeClass("active");
				$(".dim").removeClass("active");
			}
		}
	});
	
    // 스크롤 관련
	$(window).scroll(function(){
		wint=$(window).scrollTop();
		// console.log(wint);
		
		if(wint > 90) {
			$("#header").addClass("fixed");
			$(".logo").addClass("fixed");
			$(".tab").addClass("fixed");
		}
		else {
			$("#header").removeClass("fixed");
			$(".logo").removeClass("fixed");
			$(".tab").removeClass("fixed");
		}
	});

    // 클릭 관련
	$(".tab").click(function(e){
		e.preventDefault();
		$(".mobile_menu").addClass("active");
		$(".dim").addClass("active");
		$("body").addClass("fixed");
	});
	$("a.close_tab").click(function(e){
		e.preventDefault();
		
		$(".mobile_menu").removeClass("active");
		$(".dim").removeClass("active");
		$("body").removeClass("fixed");
		$("#gnb ul ul.sub").slideUp(300);
		$("#gnb > ul > li").removeClass("active");
	});
	$("#gnb > ul > li").click(function(e){
		e.preventDefault();
		
		if($(this).hasClass("active") == false) {
			$("#gnb > ul > li").removeClass("active");
			$(this).addClass("active");
			
			$("#gnb ul ul.sub").slideUp(300);
			$(this).find("ul.sub").slideDown(300);
		}
		else{
			$(this).removeClass("active");
			$(this).find("ul.sub").slideUp(300);
		}
	});
    $("#main_slider .btn").click(function(e){
		e.preventDefault();

		if(main_swiper.autoplay.running){
			main_swiper.autoplay.stop();
			$(this).addClass("pause");
		} 
        else {
			main_swiper.autoplay.start();
			$(this).removeClass("pause");
		}
	});

	var main_swiper=new Swiper("#main_slider .swiper-container", {
		autoplay: {
			delay: 5000,
		},
		pagination: {
			el: "#main_slider .swiper-pagination",
		}
	});

	var content_swiper = new Swiper('.content_slider .swiper-container', {
		slidesPerView: 1.2,
		spaceBetween: 20,
		pagination: {
			el: '.content_slider .swiper-pagination',
			clickable: true,
		},
		breakpoints: { 
			640: {
				slidesPerView: 2.3,
				spaceBetween: 20
			},
			1000: {
				slidesPerView: 3,
				spaceBetween: 20
			}
		}
	});
	
	var prod_swiper = new Swiper('.container3 .swiper-container', { 
		slidesPerView: 1.2, 
		spaceBetween: 20, 
		scrollbar: {
			el: '.container3 .swiper-scrollbar',
		},
		breakpoints: { 
			640: {
				slidesPerView: 2.3,
				spaceBetween: 20
			}
		}
	});
});