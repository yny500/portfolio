$(function(){
    var n=0;
    var pos=0;
    var resizeTimer;
    
    $(".keyvisual li").eq(n).addClass("active");
    $("#page_controller").addClass("active");
    
    // 리사이즈 관련
    $(window).resize(function(){
        clearTimeout(resizeTimer);
        
        resizeTimer=setTimeout(function(){
            h=$(window).height();
            pos=n*h;
            $("html").stop().animate({"scrollTop":pos}, 500);
        }, 100);
    });
    $(window).trigger("resize");
    
    
    // 마우스 휠 관련
    $("body").mousewheel(function(e, delta){
       if($("html").is(":animated")) return;
        
        if(delta > 0){ // up
            if(n > 0){
                n=n-1;
            }
        }
        else { // down
            if(n < 7){
                n=n+1;
            }
        }
        h=$(window).height();
        pos=n*h;
        
        if(n == 0){
            $(".menu_zone").removeClass("fixed");
            $("#page_controller").addClass("active"); // 사라지는 클래스 효과
        }
        else {
            $(".menu_zone").addClass("fixed");
            $("#page_controller").removeClass("active");// 나타나는 클래스 효과
            if(n == 3){
                $("#page_controller").addClass("color");
            }
            else if(n == 7){
                $("#page_controller").addClass("color");
            }
            else{
                $("#page_controller").removeClass("color");
            }
        }
        
        $("html").stop().animate({"scrollTop":pos}, 500, function(){
            $("#page_controller li").removeClass("active");
            $("#page_controller li").eq(n-1).addClass("active");
            $("div[id^=page]").removeClass("active");
            $("#page"+n).addClass("active");
        });
    });
    
    
    // 마우스오버 관련
    $(".menu_zone").mouseenter(function(){
       $(".menu_zone").addClass("over");
    });
    $(".menu_zone").mouseleave(function(){
       $(".menu_zone").removeClass("over");
    });
    $(".show li").mouseenter(function(){
       $(this).addClass("over");
    });
    $(".show li").mouseleave(function(){
       $(".show li").removeClass("over");
    });
    $("#page_controller li").mouseenter(function(){
       $(this).addClass("over");
    });
    $("#page_controller li").mouseleave(function(){
       $("#page_controller li").removeClass("over");
    });
    $(".rental li").mouseenter(function(){
        $(this).addClass("over");
    });
    $(".rental li").mouseleave(function(){
        $(".rental li").removeClass("over");
    });
    $(".top_btn").mouseenter(function(){
        $(this).addClass("over");
    });
     $(".top_btn").mouseleave(function(){
        $(this).removeClass("over");
    });
    
    
    // 메인 슬라이더 관련
    var slideN=0;
    
        $(".keyvisual li").eq(slideN).addClass("active");
        $(".controller li").eq(slideN).addClass("on");
    
    
    $(".controller li").click(function(e){
        e.preventDefault();
        slideN=$(this).index();
        
        $(".controller li").removeClass("on");
        $(".controller li").eq(slideN).addClass("on");
        $(".keyvisual li").removeClass("active");
        $(".keyvisual li").eq(slideN).addClass("active");
    });
    
    
    // 클릭 관련
    $(".main_scroll").click(function(){
        if($("html").is(":animated")) return;
        n=1;
        pos=n*h;
        
        $(".menu_zone").addClass("fixed");
        $("#page_controller").removeClass("active");
        $("#page"+n).addClass("active");
       
        $("html").animate({"scrollTop":pos}, 500, function(){
            $("#page_controller li").removeClass("active");
            $("#page_controller li").eq(n-1).addClass("active");
        });
    });
    
    $("#page_controller li").click(function(e){
        if($("html").is(":animated")) return;
        
        e.preventDefault();
        n=$(this).index()+1;
		pos=n*h;
        
        if(n == 3){
            $("#page_controller").addClass("color");
        }
        else if(n == 7){
                $("#page_controller").addClass("color");
        }
        else {
            $("#page_controller").removeClass("color");
        }
        
        $("html").animate({"scrollTop":pos}, 500, function(){
            $("#page_controller li").removeClass("active");
            $("#page_controller li").eq(n-1).addClass("active");
            $("div[id^=page]").removeClass("active");
            $("#page"+n).addClass("active"); 
        });
    });
    
    // top_btn 클릭 관련
    $(".top_btn").click(function(e){
        e.preventDefault();
        n=0;
        
        $("html").animate({"scrollTop":0}, 500);
    });
    
    // #page3 슬라이더 관련
    var newNode=document.createElement("SCRIPT");

	if(isMobile){
		newNode.setAttribute("src", "js/mobile_drag.js")
		document.getElementsByTagName("head")[0].appendChild(newNode);
	}
	else{
		newNode.setAttribute("src", "js/pc_drag.js")
		document.getElementsByTagName("head")[0].appendChild(newNode);
	}
});