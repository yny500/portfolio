$(function(){
    // Mobile 버전
    if(isMobile){
        $("body").addClass("mobile");
    }
    
    // 로드 관련
     $("#gnb li").eq(0).addClass("active");
    $("#header").addClass("active");
    
    // 리사이즈 관련
    var resizeTimer;
    var w;
    
    $(window).resize(function(){
        clearTimeout(resizeTimer);
        
        resizeTimer=setTimeout(function(){
           h=$(window).height();
            pos=n*h;
            $("html").stop().animate({"scrollTop": pos}, 500);

            w=window.innerWidth;
            if(w < 540){
                
            }
            else if(w > 540){

            }
        }, 100);
    });
    $(window).trigger("resize");
    
    // 스크롤 관련
    var t=0;
    
    $(window).scroll(function(){
        t=$(window).scrollTop();
        
        if(t > 100){
            $(".menu_zone").addClass("fixed");
        }
        else{
            $(".menu_zone").removeClass("fixed");
        }
        
       if(n == 5){
            if(!$("#page5").hasClass("active")){
                $("#page5").addClass("active");
            }
        }
        else{
            $("#page5").removeClass("active");
        }
    });
    
    
    // 마우스 휠 관련 변수
    var n=0;
    var h=0;
    var pos=0;
    
    function dolayout(){
        if(n == 0){
            $(".menu_zone").removeClass("fixed");
            $(".btn_top").removeClass("fixed");
        }
        else {
             $(".menu_zone").addClass("fixed");
             $(".btn_top").addClass("fixed");
        }
        
        $("html").stop().animate({"scrollTop":pos}, 600, function(){
            $("#gnb li").removeClass("active");
            $("#gnb li").eq(n).addClass("active");
        });
    }
    
    // 마우스 휠 관련
    $("body").mousewheel(function(e, delta){
//        console.log(e.target);
        if($("html").is(":animated") || e.target.className.indexOf("gp_") !== -1 || e.target.className == "swiper-pagination" || $("#mobile").hasClass("active")) return;
        
       if(delta > 0){ // up
           if(n > 0){
               n=n-1;
           }
       } 
        else { // down
            if(n < 6){
                n=n+1;
            }
        }
        h=$(window).height();
        pos=n*h;
        
        dolayout();
    });
    
    // 클릭 관련
    $("#gnb li, #mobile li").click(function(e){
        if($("html").is(":animated")) return;
        e.preventDefault();          
        n=$(this).index();
        pos=n*h;
        
        dolayout();
        
        $(".dim").fadeOut(300);
        $("#mobile").removeClass("active");
    });
    
    $(".btn_top").click(function(e){
        if($("html").is(":animated")) return; 
        n=0;
        pos=n*h;
        
        e.preventDefault();
        $("html").animate({scrollTop: 0}, 400);
    });
    
    $(".tab").click(function(e){
       e.preventDefault();
        $(".dim").fadeIn(300);
        $("#mobile").toggleClass("active");
        $("body").addClass("fixed");
    });
    $(".dim, .close_tab").click(function(e){
       e.preventDefault();
        $(".dim").fadeOut(300);
        $("#mobile").removeClass("active");
        $("body").removeClass("fixed");
    });
    
    // 마우스오버 관련
    $("#page1 .swiper-slide").mouseenter(function(){
        $(this).addClass("over");
    });
    $("#page1 .swiper-slide").mouseleave(function(){
        $(this).removeClass("over");
    });
    $("#page3 .publishing_zone li").mouseenter(function(){
        $(this).addClass("over");
    });
     $("#page3 .publishing_zone li").mouseleave(function(){
        $(this).removeClass("over");
    });
    $("#page4 .swiper-slide, #page4 .gp_list_image_zone").mouseenter(function(){
        $(this).addClass("over");
    });
    $("#page4 .swiper-slide, #page4 .gp_list_image_zone").mouseleave(function(){
        $(this).removeClass("over");
    });
    $("#page6 .link li").mouseenter(function(){
        $(this).addClass("over");
    });
    $("#page6 .link li").mouseleave(function(){
        $(this).removeClass("over");
    });
    
    
    // 슬라이더 관련
    var skills_slider = new Swiper('#page1 .skills .swiper-container', {
        breakpoints: {
            540: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            360: {
                slidesPerView: 2,
                spaceBetween: 30
            },
           330: {
                slidesPerView: 1,
            }, 
        }
    });
    
    $(".btn_arrow .prev").click(function(e){
           e.preventDefault();
            skills_slider.slidePrev(300);
        });
        $(".btn_arrow .next").click(function(e){
           e.preventDefault();
            skills_slider.slideNext(300);
    });

    var graphic_slider = new Swiper('#page4 .graphic_slider .swiper-container', {
        speed: 1000,
        direction: 'vertical',
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    $(".graphic_slider").mousewheel(function(evt){
        graphic_slider.mousewheel.enable();
    });


    
    // 메인페이지 텍스트 효과
    var textWrapper = document.querySelector('.project_tit2 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
      .add({
        targets: '.project_tit2 .letter',
        scale: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: (el, i) => 45 * (i+1)
      })
        .add({
        targets: '.project_tit2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
    
    // 마지막페이지 텍스트 효과
    var textWrapper = document.querySelector('.end_tit');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
      .add({
        targets: '.end_tit .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i+1)
      }).add({
        targets: '.end_tit',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
    
    // 메인페이지 배경 사진 효과
   AOS.init(); 
    
    AOS.init({
		easing: "ease-in-out-sine",
		once: false, // 재동작 못하게 함.
	});
});