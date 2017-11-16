(function($) {
	'use strict';

	var spektr = (function () {
		function spektr () {
			var _ = this;

			_.items = [];
			_.angles = [];
			_.start = 0;

			_.init();
		}

		return spektr;
	}());

	spektr.prototype.init = function() {
		var _ = this;

		_.menuContainer = $('.js-menu');
		_.spinner = $('.spinner');
		_.itemContainer = $('.menu__item');
		_.calculation();
		_.canvas();

		$(window).resize(function() {
			_.canvas();
		});
	};

	spektr.prototype.canvas = function() {
		this.context = $('canvas')[0].getContext('2d');

		this.dash = {
			width: $('canvas').width(),
			height: $('canvas').height()
		};

		$('canvas')[0].width = this.dash.width;
		$('canvas')[0].height = this.dash.height;

		this.context.lineWidth = parseFloat(this.menuContainer.css('border-right-width'));

		for (var i = 0; i < this.angles.length; i++) {
			var length = this.angles.length, start = i/length, end = (i + 1) / length, step = 0.03, width = this.dash.width / 2;
			this.strokeLine(width, .9 * width, start, start + step, "rgba(0,0,0,0)");
			this.strokeLine(width, .9 * width, start + step, end - step, "rgba(255,255,255,1)");
			this.strokeLine(width, .9 * width, end - step, end, "rgba(0,0,0,0)");
		}

	};

	spektr.prototype.strokeLine = function(size, radius, start, end, strokeColor) {
		this.context.beginPath();
		this.context.strokeStyle = strokeColor;
		this.context.arc(size, size, radius, start * 2 * Math.PI, end * 2 * Math.PI);
		this.context.stroke();
	}

	spektr.prototype.calculation = function(callback) {

		this.center = {
			x: $(window).width() / 2,
			y: $(window).height() / 2
		};

		this.border = parseFloat(this.menuContainer.css('border-right-width'));

		var x = this.menuContainer.height() / 2,
			y = this.menuContainer.width() / 2,
			offset = this.itemContainer.width() * 1 / 3 + this.border,
			radius = x + offset;

		this.circle('.menu__item', radius, x - offset, y - offset);

		this.slick();
	}	

	spektr.prototype.circle = function(selector, radius, x, y) {

		var _ = this,
			total = $(selector).length,
	    	alpha = Math.PI * 2 / total;

	    $(selector).each(function(index) {
	        var theta = alpha * index,
	        	remIndex = parseFloat($('html').css('font-size')),
	        	pointx  =  (Math.floor(Math.cos(theta) * radius) + x) / remIndex,
	        	pointy  = (Math.floor(Math.sin(theta) * radius ) + y) / remIndex;

	        $(this).css({
	        	'margin-left': pointx + 'rem',
				'margin-top': pointy  + 'rem'
	        });

	        this.angle = theta / Math.PI * 180
	        _.angles.push(theta / Math.PI * 180);
	        _.items.push(this);

	        if ($(this).offset().left > _.center.x) {
	        	$(this).addClass('is-right');
	        } else {
	        	$(this).addClass('is-left');
	        }

	        _.setClick(this);
	    });
	}

	spektr.prototype.setClick = function(item) {
		var _ = this;

		$(item).click(function() {
			var index = _.items.indexOf(item);

			_.itemContainer.removeClass('is-selected');
			$(this).addClass('is-selected');

			$('.content__item').hide().eq(index).show().parent().css('background', 'none');
			_.runSlider(index);
			_.rotate(index);
		});
	}
	spektr.prototype.rotate = function(index) {
		var _ = this;

		_.spinner.removeClass('spinner--loaded');

		$({deg: _.start}).animate({
			deg: _.angles[index]
		}, {
			duration: 800,
			easing: 'swing',
			start: function() {
				_.spinner.toggleClass('spinner--animate');
			},
			step: function(now) {
				_.spinner.css({
					transform: 'rotate(' + now + 'deg)'
				});

				_.start = now;
			},
			complete: function() {
				_.start = _.angles[index];
			}
		});
	}

	spektr.prototype.slick = function() {
		$('.js-slick').slick({
			arrows: false,
			autoplaySpeed: 2000
		});
	}

	spektr.prototype.runSlider = function(index) {
		var slider = $('.content__item').eq(index).find('.js-slick');

		$('.content__item').find('.js-slick').slick('slickPause');

		if (slider.length > 0) {
			slider.slick('setPosition').slick('slickPlay');
		}
	}

	return new spektr;
})(jQuery);