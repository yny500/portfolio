$(function(){
    var n=0;
    var t=0;
    var pos=0;
    var scrollTimer;
    
    // 스크롤 관련
    $(window).scroll(function(){
       clearTimeout(scrollTimer);
        
        scrollTimer=setTimeout(function(){
            t=$(window).scrollTop();
            
            if(t > 75) {
                if($(".header_top").hasClass("show") == false){
                    $(".header_top").addClass("show");
                }
            }
            else {
                 if($(".header_top").hasClass("show") == true){
                    $(".header_top").removeClass("show");
                }
            }
        }, 100);
    });
    
    // 슬라이더 관련
    var slideN=0;
    
    var main_swiper = new Swiper('#main_slider .swiper-container', {
            autoplay: {
                delay: 5000,
            },
          spaceBetween: 100,
          effect: 'fade',
          pagination: {
            el: '#main_slider .swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '#main_slider .swiper-button-next',
            prevEl: '#main_slider .swiper-button-prev',
          },
    });
    
    var gallery_swiper = new Swiper('#gallery_slider .swiper-container', {
          pagination: {
            el: '#gallery_slider .swiper-container .swiper-pagination',
        },
    });
    
    // 클릭 관련
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

    // 탭 메뉴 관련
    $(".tab").click(function(e){
        e.preventDefault();
        
        $("body").addClass("fixed");
        $("#header .dim").addClass("active");
        $("#header .mobile_menu").addClass("active");
    });
    $(".close_tab").click(function(e){
       e.preventDefault();
        tabClose();
    });
    $(".dim").click(function(e){
       e.preventDefault();
        tabClose();
    });
    
    function tabClose() {
        $("body").removeClass("fixed");
        $("#header .dim").removeClass("active");
        $("#header .mobile_menu").removeClass("active");
        $("#gnb > ul > li").removeClass("active");
        $("#gnb ul ul.sub").slideUp(300);
    }
    
    $("#gnb > ul > li").click(function(e){
        e.preventDefault(); 
        
       if($(this).hasClass("active") == false) {
           $("#gnb > ul > li").removeClass("active");
           $(this).addClass("active");
           
           $("#gnb ul ul.sub").slideUp(300);
           $(this).find("ul.sub").slideDown(300);
        }
        else {
            $(this).removeClass("active");
            $(this).find("ul.sub").slideUp(300);
        }
    });
    
    // 상단 이동 관련
    $(".move_top").click(function(e){
       e.preventDefault();
        $("html").animate({scrollTop: 0}, 500);
    });
});