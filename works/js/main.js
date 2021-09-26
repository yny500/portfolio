$(function(){
    var n=0;

    $(".menu li").eq(n).addClass("active");

    // slider 관련
    var swiper = new Swiper(".content-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        freeMode: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            clickable: true,
        },
      });
      var swiper2 = new Swiper(".list2", {
        slidesPerView: 2,
        spaceBetween: 30,
        freeMode: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            clickable: true,
        },
      });

      // menu 관련
      var contentLi=$(".main > div");
      var sliderLi=$(".slider-zone > div > div");

      contentLi.hide().eq(0).show();
      sliderLi.hide().eq(0).show();

      $(".menu li").click(function(e){
        e.preventDefault();
        n=$(this).index();

        $(".menu li").removeClass("active");
        $(".menu li").eq(n).addClass("active");
        contentLi.css("display","none");
        contentLi.eq(n).css("display","block");
        sliderLi.css("display","none");
        sliderLi.eq(n).css("display","block");
      });
});