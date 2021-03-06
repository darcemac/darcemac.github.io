(function ($) {
    "use strict"; 

    // fade page in on load
    var page_load = function() {
        $('body').removeClass('fade-out');
    };

    // service image sliders
    var imageSlider = function() {

        $(".slider").each(function(key) {
            
            var sliderId = "slider" + key;
            this.id = sliderId;
            
            $(this).glide({
                type: "slideshow", //type - slider, carousel, slideshow
                autoplay: false
            });
        
        });

    };

    // testimonial slider
    var testSlider = function() {
        
        $('.carousel').each(function() {
            
            $(this).glide({
                type: "carousel", 
                autoplay: 8000,  
            });
        
        });

    };


    var scrollTo = function() {
        
        // Smooth scrolling when clicking on a hash link
        $('a[href^="\\#"]').on('click',function (e) {
            e.preventDefault();

            var target = this.hash;
            var $target = $(target);

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top-100
            }, 600, 'swing');
        });

    };

    // init
    $(function(){
        imageSlider();
        testSlider();
        page_load();
        scrollTo();
    });

})(jQuery); 


// When the user scrolls down 400px from the top of the document, slide down the navbar
// When the user scrolls to the top of the page, slide up the navbar (100px out of the top view = navbar height)
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById("hidden-navbar").style.top = "0";
    } else {
        document.getElementById("hidden-navbar").style.top = "-100px";
    }
} 


