$(function(){
	var n=0;
	var t=0;
	var pos=0;
	var timer=0;
	var sum=0;
    var speedGap=200;

	$("#main_slider").addClass("active");
	$(".controller li").eq(0).addClass("on");
	
	// GNB 스크롤 관련
	$(window).scroll(function(){
		t=$(window).scrollTop();
		
		if(t > 80) {
			$("#header").addClass("fixed");
		}
		else{
			$("#header").removeClass("fixed");
		}
		
		clearTimeout(timer);
		
		timer=setTimeout(function(){
			t=$(window).scrollTop();
			sum+=1;
			
			if(t < $("#page1").offset().top-speedGap){
				n=0;
			}
			else if(t < $("#page2").offset().top-speedGap){
				n=1;
			}
			else if(t < $("#page3").offset().top-speedGap){
				n=2;
			}
			else if(t < $("#page4").offset().top-speedGap){
				n=3;
			}
			else if(t < $("#page5").offset().top-speedGap){
				n=4;
				
				if($(document).height() <= Math.round(t + $(window).height())){
					n=5;
				}
			}
			else {
				n=5;
			}
			
			if(n == 0){
				$("#main_slider").addClass("active");
			}
			else {
				$("#page"+n).addClass("active");
			}
			
			$(".controller li").removeClass("on");
			$(".controller li").eq(n).addClass("on");
            $("#gnb li").removeClass("active");
            $("#gnb li").eq(n).addClass("active");
		}, 100);
	});
    $(window).trigger("scroll");
    
    // 메뉴 클릭 관련
    $("#gnb li, #mobile li").click(function(e){
        e.preventDefault();
        n=$(this).index();
        
        if(n == 0){
		  pos=$("#main_slider").offset().top;
        }
        else {
         pos=$("#page"+n).offset().top;
        }
        
        $("#mobile").removeClass("active");
		$(".main_tab").removeClass("active");
		$(".dim").removeClass("active");
        $("body").removeClass("fixed");
        
        $("html").animate({scrollTop:pos}, 800);
    });
	
	// 컨트롤러 관련
	$(".controller li").click(function(e){
       e.preventDefault();
        n=$(this).index();
        
        if(n == 0){
		  pos=$("#main_slider").offset().top;
        }
        else {
         pos=$("#page"+n).offset().top;
        }
        
        $("html").animate({scrollTop:pos}, 800);
    });
	
	// 탭 이동 관련
	$(".main_tab").click(function(e){
		e.preventDefault();
		$("#mobile").toggleClass("active");
		$(".main_tab").toggleClass("active");
		$(".dim").toggleClass("active");
        $("body").toggleClass("fixed");
	});
	$(".dim").click(function(){
		$("#mobile").removeClass("active");
		$(".main_tab").removeClass("active");
		$(".dim").removeClass("active");
        $("body").removeClass("fixed");
	});
    
    // 상단 이동 관련
	$(".btn_top").click(function(e){
		e.preventDefault();
		$("html").animate({scrollTop:0}, 400);
	});
});