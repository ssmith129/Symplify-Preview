/*
Author       : Dreamstechnologies
Template Name: Preadmin - Bootstrap Template
Version      : 1.0
*/

(function ($) {
	"use strict";

	var $wrapper = $('.main-wrapper');
	
	// Sidebar

	if ($(window).width() <= 991) {
		var Sidemenu = function () {
			this.$menuItem = $('.main-nav a');
		};

		function init() {
			var $this = Sidemenu;
			$('.main-nav a').on('click', function (e) {
				if ($(this).parent().hasClass('has-submenu')) {
					e.preventDefault();
				}
				if (!$(this).hasClass('submenu')) {
					$('ul', $(this).parents('ul:first')).slideUp(350);
					$('a', $(this).parents('ul:first')).removeClass('submenu');
					$(this).next('ul').slideDown(350);
					$(this).addClass('submenu');
				} else if ($(this).hasClass('submenu')) {
					$(this).removeClass('submenu');
					$(this).next('ul').slideUp(350);
				}
			});
		}

		// Sidebar Initiate
		init();
	}

       
        /* ==================================================
            # Smooth Scroll
         ===============================================*/
	
	// Sticky Header
	
	$(window).scroll(function () {
		var sticky = $('.header'),
			scroll = $(window).scrollTop();
		if (scroll >= 50) sticky.addClass('fixed');
		else sticky.removeClass('fixed');
	});

	// Mobile menu sidebar overlay
	
	$('.header-fixed').append('<div class="sidebar-overlay"></div>');
	$(document).on('click', '#mobile_btn', function () {
		$('main-wrapper').toggleClass('slide-nav');
		$('.sidebar-overlay').toggleClass('opened');
		$('html').addClass('menu-opened');
		return false;
	});


	$(document).on('click', '.sidebar-overlay', function () {
		$('html').removeClass('menu-opened');
		$(this).removeClass('opened');
		$('main-wrapper').removeClass('slide-nav');
		$('#task_window').removeClass('opened');
	});

	$(document).on('click', '#menu_close', function () {
		$('html').removeClass('menu-opened');
		$('.sidebar-overlay').removeClass('opened');
		$('main-wrapper').removeClass('slide-nav');
	});
	
	// Small Sidebar

	$(document).on('click', '#toggle_btn', function () {
		if ($('body').hasClass('mini-sidebar')) {
			$('body').removeClass('mini-sidebar');
			$('.subdrop + ul').slideDown();
		} else {
			$('body').addClass('mini-sidebar');
			$('.subdrop + ul').slideUp();
		}
		return false;
	});


	    // Loader
    
		setTimeout(function () {
			$('.loader-main');
			setTimeout(function () {
				$(".loader-main").hide();
			}, 1000);
		}, 1000);


	$(document).on('mouseover', function (e) {
		e.stopPropagation();
		if ($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
			var targ = $(e.target).closest('.sidebar').length;
			if (targ) {
				$('body').addClass('expand-menu');
				$('.subdrop + ul').slideDown();
			} else {
				$('body').removeClass('expand-menu');
				$('.subdrop + ul').slideUp();
			}
			return false;
		}
	});

	// fade in scroll 

	if ($('.main-wrapper .aos').length > 0) {
		AOS.init({
			duration: 1200,
			once: true,
		});
	}

	// Mobile menu sidebar overlay

	$('body').append('<div class="sidebar-overlay"></div>');
	$(document).on('click', '#mobile_btns', function () {
		$wrapper.toggleClass('slide-nav');
		$('.sidebar-overlay').toggleClass('opened');
		$('html').toggleClass('menu-opened');
		return false;
	});

	// Sidebar

	var Sidemenu = function () {
		this.$menuItem = $('#sidebar-menu a');
	};

	function initi() {
		var $this = Sidemenu;
		$('#sidebar-menu a').on('click', function (e) {
			if ($(this).parent().hasClass('submenu')) {
				e.preventDefault();
			}
			if (!$(this).hasClass('subdrop')) {
				$('ul', $(this).parents('ul:first')).slideUp(350);
				$('a', $(this).parents('ul:first')).removeClass('subdrop');
				$(this).next('ul').slideDown(350);
				$(this).addClass('subdrop');
			} else if ($(this).hasClass('subdrop')) {
				$(this).removeClass('subdrop');
				$(this).next('ul').slideUp(350);
			}
		});
		$('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
	}

	// Sidebar Initiate
	initi();	
	
	// Invoice Template Slider
	
	if($('.invoive-temp-slider').length > 0) {
		$('.invoive-temp-slider').owlCarousel({
			loop:false,
			margin:24,
			nav:true,
			dots:false,
			smartSpeed: 2000,
			autoplay:false,
			navText: [
				'<i class="fa-solid fa-chevron-left"></i>',
				'<i class="fa-solid fa-chevron-right"></i>'
			],
			responsive:{
				0:{
					items:1
				},				
				550:{
					items:1
				},
				700:{
					items:2
				},
				1000:{
					items:3
				}
			}
		})
	}

	// Horizontal Slide
document.addEventListener("DOMContentLoaded", function () {
	const scrollers = document.querySelectorAll(".horizontal-slide");
	scrollers.forEach((scroller) => {
		scroller.setAttribute("data-animated", true);
		const scrollerInner = scroller.querySelector(".slide-list");
		const scrollerContent = Array.from(scrollerInner.children);
		scrollerContent.forEach((item) => {
			const duplicatedItem = item.cloneNode(true);
			duplicatedItem.setAttribute("aria-hidden", true);
			scrollerInner.appendChild(duplicatedItem);
		});
	});
});

	// Service Slider
	
	if($('.service-slider').length > 0) {
		$('.service-slider').owlCarousel({
			loop:false,
			margin:24,
			nav:false,
			dots:false,
			smartSpeed: 2000,
			autoplay:true,
			navText: [
				'<i class="fa-solid fa-chevron-left"></i>',
				'<i class="fa-solid fa-chevron-right"></i>'
			],
			responsive:{
				0:{
					items:1
				},				
				550:{
					items:2
				},
				700:{
					items:4
				},
				1000:{
					items:6
				}
			}
		})
	}

	$(document).ready(function(){
		$(".close-icon").click(function(){
		  $(".top-header").hide();
		});
	});

	// CURSOR

	function mim_tm_cursor() {

		var myCursor = jQuery('.mouse-cursor');

		if (myCursor.length) {
			if ($("body")) {

				const e = document.querySelector(".cursor-inner"),
					t = document.querySelector(".cursor-outer");
				let n, i = 0,
					o = !1;
				window.onmousemove = function (s) {
					o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
				}, $("body").on("mouseenter", "a, .cursor-pointer", function () {
					e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
				}), $("body").on("mouseleave", "a, .cursor-pointer", function () {
					$(this).is("a") && $(this).closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
				}), e.style.visibility = "visible", t.style.visibility = "visible"
			}
		}
	};
	mim_tm_cursor()


	$(window).scroll(function() { 
        var scroll = $(window).scrollTop();
        if (scroll >= 500) {
         $(".back-to-top-icon").addClass("show");
        } else {
         $(".back-to-top-icon").removeClass("show");
        }
     });

	

	// JQuery counterUp

		// Select 2	
		if ($('.select2').length > 0) {
			$(".select2").select2();
	   }
	   
	   if ($('.select').length > 0) {
		   $('.select').select2({
			   minimumResultsForSearch: -1,
			   width: '100%'
		   });
	   }

	   	// Datetimepicker
	if($('.datetimepicker').length > 0 ){
		$('.datetimepicker').datetimepicker({
			format: 'DD-MM-YYYY',
			icons: {
				up: "fas fa-angle-up",
				down: "fas fa-angle-down",
				next: 'fas fa-angle-right',
				previous: 'fas fa-angle-left'
			}
		});
	}


	if($('.departments-slider.lazy').length > 0) {
		$('.departments-slider.lazy').slick({
			infinite: true,
			slidesToShow: 6,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4,
						infinite: true,
						dots: false
					}
				},
				{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					infinite: true,
					dots: false
				}
				},
				{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				}
				},
				{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
				}
				},
			]
		});
		}


		if($('.testimonials-slider.lazy').length > 0) {
			$('.testimonials-slider.lazy').slick({
				infinite: true,
				slidesToShow: 2,
				slidesToScroll: 1,
				responsive: [
					{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
					}
					},
				]
			});
		}

		// Datetimepicker time

		if ($('.timepicker').length > 0) {
			$('.timepicker').datetimepicker({
				format: 'HH:mm A',
				icons: {
					up: "fas fa-angle-up",
					down: "fas fa-angle-down",
					next: 'fas fa-angle-right',
					previous: 'fas fa-angle-left'
				}
			});
		}


	// counter
	if($('.counterUp').length > 0) {
		$('.counterUp').counterUp({
				delay: 15,
				time: 1500
			});
	}	
	

	// Banner

	var TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }; TxtRotate.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];
        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        this.el.innerHTML = ' <span class = "wrap"> '+this.txt+' </span>';
        var that = this;
        var delta = 300 - Math.random() * 100;
        if (this.isDeleting) {
        delta /= 2;
        }
        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }
        setTimeout(function() {
        that.tick();
        }, delta);
    }; window.onload = function() {
        var elements = document.getElementsByClassName('txt-rotate');
        for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".txt-rotate > .wrap { border-right: 0 }";
        document.body.appendChild(css);
    };

	// Loader
    
    setTimeout(function () {
        $('.loader-main');
        setTimeout(function () {
            $(".loader-main").hide();
        }, 1000);
    }, 1000);

	// Request Mail

	function emailcreate () {
		$.ajax({
			url:"mail.php",    //the page containing php script
			type: "post",    //request type,
			dataType : "json",
			data: $("#contact_form").serialize(),
			success:function(result){
				console.log(result);
				var messageAlert = 'alert-' + result.type;
				var messageText = result.message;
				var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-bs-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
				if (messageAlert && messageText) {
					console.log(alertBox);
					$('.messages').html(alertBox);
					$('#contact_form')[0].reset();
			}
		}
	});
		return false;
	}
	$('#phone-num').keyup(function () {
		if (this.value.match(/[^0-9]/g)) {
		this.value = this.value.replace(/[^0-9^-]/g, '');
		}
	});

	/* Heart Like*/
	document.querySelectorAll('.like-btn').forEach(btn => {
		btn.addEventListener('click', function() {
		  const icon = this.querySelector('i');
		  icon.classList.toggle('ti-heart');
		  icon.classList.toggle('ti-heart-filled');
		});
	  });
	/* /Heart Like*/
	
	/* Blog Carousel */
	$('.blog-carousel').slick({
		dots: false,
		infinite: true,
		autoplay: true,
		speed: 300,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"></button>',
		nextArrow: '<button type="button" class="slick-next"></button>',
		responsive: [
		  {
			breakpoint: 1024,
			settings: {
			  slidesToShow: 3,
			  slidesToScroll: 1,
			  infinite: true
			}
		  },
		  {
			breakpoint: 600,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2
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
	/* /Blog Carousel */

})(jQuery);

	

