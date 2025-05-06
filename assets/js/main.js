(function($) {
  "use strict";

  /*-------------------------------------------
  preloader active
  --------------------------------------------- */
  jQuery(window).load(function () {
    jQuery(".preloader").fadeOut("slow");
  });
  jQuery(document).ready(function(){
    
    /*-------------------------------------------
    js wow active
    --------------------------------------------- */
    new WOW().init();

    /*-------------------------------------------
    js scrollup
    --------------------------------------------- */
    $.scrollUp({
      scrollText: '<i class="fa fa-angle-up"></i>',
      easingType: 'linear',
      scrollSpeed: 900,
      animation: 'fade'
    }); 

    /*-------------------------------------------
    toggle-password
    --------------------------------------------- */
    $(".toggle-password").click(function() {

      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
    /*-------------------------------------------
    metismenu active
    --------------------------------------------- */
    $("#metismenu").metisMenu();
    // mobile menu active code 
    $('.menu-bar').on('click', function(e) {
      e.preventDefault();
      $('.main-sidebar').toggleClass('show');
      $('.body-overlay').toggleClass('active');
    });
    $('.body-overlay').on('click', function() {
      $('.main-sidebar').removeClass('show');
      $(this).removeClass('active');
    });
    
    /*-------------------------------------------
    scrollbar-inner active
    --------------------------------------------- */
    jQuery('.scrollbar-inner').scrollbar();
    /*-------------------------------------------
    slider active
    --------------------------------------------- */
    $('.testimonial-slide').slick({
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false,
      dots: false,
      arrows: true,
      prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
      nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
      vertical: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          }
        }
      ]
    });
    /*-------------------------------------------
    welcome-slide active
    --------------------------------------------- */
    $('.welcome-slide').slick({
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false,
      dots: false,
      arrows: false,
      prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
      nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
      vertical: false,
      responsive: [
        {
          breakpoint: 1080,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    /*-------------------------------------------
    account-slide active
    --------------------------------------------- */
    $('.account-slide').slick({
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false,
      dots: false,
      arrows: false,
      prevArrow: '<i class="slick-prev fas fa-angle-left"></i> ',
      nextArrow: '<i class="slick-next fas fa-angle-right"></i> ',
      vertical: false,
      responsive: [
        {
          breakpoint: 1080,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    /*---------------------------------
    venobox Popup active
    -----------------------------------*/
    $('.popup-video').venobox(); 

    /*---------------------------------
    counterUp active
    -----------------------------------*/
    jQuery('.counter').counterUp({
      delay: 10,
      time: 1000
    });

    /*---------------------------------
    niceSelect active
    -----------------------------------*/
    jQuery('select').niceSelect();

    /*---------------------------------
    barfiller active
    -----------------------------------*/
    $('#bar1').barfiller({ 
      barColor:'#605BFF',
      tooltip:true,
      duration: 1000,
      animateOnResize:true,
      symbol:"%",
    });
    $('#bar2').barfiller({ 
      barColor:'#605BFF',
    });
    $('#bar3').barfiller({ 
      barColor:'#605BFF',
    });
    $('#bar4').barfiller({ 
      barColor:'#605BFF',
    });
    $('#bar5').barfiller({ 
      barColor:'#605BFF',
    });
    $('#bar6').barfiller({ 
      barColor:'#FF8F6B',
    });
    $('#bar7').barfiller({ 
      barColor:'#FF8F6B',
    });
    $('#bar8').barfiller({ 
      barColor:'#FF8F6B',
    });
    $('#bar9').barfiller({ 
      barColor:'#FF8F6B',
    });
    $('#bar10').barfiller({ 
      barColor:'#FF8F6B',
    });

    /*---------------------------------
    calendar active
    -----------------------------------*/
    $("#calendar").simpleCalendar({
      fixedStartDay: 1, // begin weeks by sunday
      disableEmptyDetails: true,
      events: [
        // generate new event after tomorrow for one hour
        {
          startDate: new Date(new Date().setHours(new Date().getHours() + 24)).toDateString(),
          endDate: new Date(new Date().setHours(new Date().getHours() + 25)).toISOString(),
          summary: 'Physical Therapy'
        },
        // generate new event for yesterday at noon
        {
          startDate: new Date(new Date().setHours(new Date().getHours() - new Date().getHours() - 12, 0)).toISOString(),
          endDate: new Date(new Date().setHours(new Date().getHours() - new Date().getHours() - 11)).getTime(),
          summary: 'Gynecologist'
        },
        // generate new event for the last two days
        {
          startDate: new Date(new Date().setHours(new Date().getHours() - 48)).toISOString(),
          endDate: new Date(new Date().setHours(new Date().getHours() - 24)).getTime(),
          summary: 'Medicine Specialist'
        }
      ],

    });

              
  });
            
})(jQuery);

