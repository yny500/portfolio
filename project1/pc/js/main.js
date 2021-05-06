$(function(){
    // 마우스오버 관련
	$("#gnb > ul > li").mouseenter(function(){
		$(this).find(".sub").addClass("over");
	});
	$("#gnb > ul > li").mouseleave(function(){
		$(this).find(".sub").removeClass("over");
	});
	
    // 포커스 관련
	$("#gnb > ul > li> a").focusin(function(){
		$(this).next().addClass("over");
	});
	$("#gnb .list li:last-child a").focusout(function(){
		$(this).parents(".sub").removeClass("over");
	});
    
    // 슬라이더 관련
    var main_swiper=new Swiper(".main_slider .swiper-container", {
        autoplay: {
                delay: 5000,
        },
        spaceBetween: 100,
        effect: 'fade',
        navigation: {
            nextEl: ".main_slider .swiper-button-next",
            prevEl: ".main_slider .swiper-button-prev",
        },
        pagination: {
            el: '.main_slider .swiper-pagination',
            clickable: true,
          },
    });
    
    $(".btn_pause").click(function(e){
        e.preventDefault();
        
        if(main_swiper.autoplay.running){
            main_swiper.autoplay.stop();
            $(this).addClass("play");
        }
        else {
            main_swiper.autoplay.start();
            $(this).removeClass("play");
        }
    });
});
