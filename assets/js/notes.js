/*
Author       : Dreamstechnologies
Template Name: Symplify - Bootstrap Admin Template
*/
(function () {
    "use strict";
	
	//Notes Slider
	if ($('.notes-slider').length > 0) {
		$('.notes-slider').owlCarousel({
			loop: true,
			margin: 24,
			dots: false,
			nav: true,
			smartSpeed: 2000,
			navContainer: '.slide-nav5',
			navText: ['<i class="ti ti-chevron-left"></i>', '<i class="ti ti-chevron-right"></i>'],
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				},
				1300: {
					items: 3
				}
			}
		})
	}
	
})();