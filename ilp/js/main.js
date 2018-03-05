/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

/* my nice slider */
(function($){
    var MySlider = function(element, options)
    {
        var obj = this;

        var settings = $.extend({
            startSlideIndex: 1,
            btnPrevClass: '.slider__controls__btn_prev',
            btnNextClass: '.slider__controls__btn_next',
            itemContClass: '.slider__item__content',
            moveSpeed: 1000,
            moveTimeout: 500
        }, options || {});

        // elements
        var $slider = $(element),
            $items = $slider.children(),
            itemsLength = $items.length,
            $btnPrev = $slider.find(settings.btnPrevClass),
            $btnNext = $slider.find(settings.btnNextClass),
            CURRENT_INDEX = settings.startSlideIndex,
            FLAG = true;

        // Public methods
        this.setSlide = function(index)
        {
            $slider.css({left: '-'+index+'00%'});
            CURRENT_INDEX = index;
        };
        this.getFlag = function(){
            return FLAG;
        };
        this.getCurrentIndex = function(){
            return CURRENT_INDEX;
        };
        this.animateCurrentSlide = function()
        {
            animateSection($items.eq(CURRENT_INDEX));
        };
        this.moveTo = function(index)
        {
            if(index < 0 || index > itemsLength-1 || index == CURRENT_INDEX || !FLAG) return;

            FLAG = false;

            var left = index > CURRENT_INDEX ? '-100%' : '100%',
                $item = $items.eq(CURRENT_INDEX),
                $itemContent = $item.find(settings.itemContClass);

            //$itemContent.animate({left: left},settings.moveSpeed);

            //setTimeout(function(){
                $slider.animate({left: '-'+index+'00%'},
                    settings.moveSpeed,
                    function(){
                        $itemContent.css({left: 0});
                        CURRENT_INDEX = index;
                        animateSection($items.eq(CURRENT_INDEX));
                        FLAG = true;
                    }
                );
            //},settings.moveTimeout);
        };


        // Private methods
        var init = function()
        {
            obj.setSlide(CURRENT_INDEX);

            // nav buttons
            $btnPrev.on('click',function(e){
                e.preventDefault();
                obj.moveTo(CURRENT_INDEX-1);
            });
            $btnNext.on('click',function(e){
                e.preventDefault();
                obj.moveTo(CURRENT_INDEX+1);
            });
        };

        var animateSection = function(section){
            if(section.data('animated') == true) return;
            section.data('animated', true);

            var aEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                i = 0,
                $items = section.find('[data-animate]'),
                last = 0,
                isAnimationCss = Modernizr.cssanimations;

            function animate(){
                var $current = $items.filter('[data-animate="'+i+'"]');

                if(isAnimationCss){
                    $current.addClass('animated');
                    $current.eq(0).one(aEnd, function(){
                        if(i != last){
                            i++;
                            animate();
                        }
                    });
                } else {//fallback if no support
                    $current.css('opacity',0);
                    $current.addClass('animated');
                    $current.fadeTo(500, 1, function(){
                        if(i != last){
                            i++;
                            animate();
                        }
                    });
                }

            }

            for(var c = 0; c < $items.length; c++){
                var val = parseInt($items.eq(c).attr('data-animate'));
                last = last > val ? last : val;
            }

            animate();
        };

        //initialization
        init();
    };

    $.fn.mySlider = function(options)
    {
        return this.each(function()
        {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('myslider')) return;

            // pass options to plugin constructor
            var myslider = new MySlider(this, options);

            // Store plugin object in this element's data
            element.data('myslider', myslider);
        });
    };
})(jQuery);

/* contacts popup form */
(function(){
    var $base = $('.section_contacts__popup'),
        $formPop = $('.section_contacts__form'),
        $respPop = $('.section_contacts__response'),
        $respText = $('.section_contacts__response__text');

    $('.section_contacts__btn').on('click', function(e){
        e.preventDefault();
        $base.fadeIn();
    });
    $('.section_contacts__form__close').on('click', function(e){
        e.preventDefault();
        $base.fadeOut();
    });

    $('.section_contacts__form__submit').on('click', function(e){
        e.preventDefault();
        var $form = $(this).closest('form');

        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            type: $form.attr('method'),
            dataType: "json",
            error: function(error){
                console.log(error);
            },
            success: function(response){
                console.log(response);

                $respText.html(response.text);
                $formPop.hide();

                if(response.success){
                    $formPop
                        .find('.section_contacts__form__input, .section_contacts__form__textarea')
                        .val('');
                }

                $respPop.show();
            }
        });
    });

    $('.section_contacts__response__close').on('click', function(e){
        e.preventDefault();
        $base.hide();
        $formPop.show();
        $respPop.hide();
    });

})();
/* diagonal description items */
(function(){
    var $base = $('.section_rule__bottom'),
        $items = $base.children();

    $base.on('mouseleave', function(){
        $items.removeClass('active inactive');
    });
    $items.on('mouseenter', function(){
        $(this)
            .removeClass('inactive')
            .addClass('active')
            .siblings()
            .removeClass('active')
            .addClass('inactive');
    });
})();

/* page actions */
var page = (function(){
    var $content,
        $sections,
        $menuPoints,
        $mainMenu,
        $logo,
        $navLinks,
        sectionsLength,
        scrollSpeed,
        slidersBase = [],
        CURRENT_LEVEL,
        FLAG;

    var setup = function(){
        //init page sliders and create sliders base
        initSliders();

        //animate main section
        animateSection($sections.eq(0));

        //open close main menu
        $('.sidebar__burger').on('click', function(e){
            e.preventDefault();
            showMenu();
        });
        $('.menu__close').on('click', function(e){
            e.preventDefault();
            hideMenu();
        });

        //page navigation links
        $navLinks.on('click', function(e){
            e.preventDefault();
            var $this = $(this),
                section = $this.attr('data-section'),
                slide = $this.attr('data-slide');

            hideMenu();

            if(parseInt(section) == CURRENT_LEVEL){
                if(typeof slide !== 'undefined'){
                    slidersBase[section].moveTo(parseInt(slide));
                }
            } else {
                if(typeof slide !== 'undefined'){
                    slidersBase[section].setSlide(parseInt(slide));
                }
                scrollTo(parseInt(section));
            }
        });

        //strategy popup
        var $strategyPopup = $('.popup');
        $('.section_strategy__about__btn').on('click', function(e){
            e.preventDefault();
            $strategyPopup.addClass('active');
            setTimeout(function(){
                animateSection($strategyPopup);
            },300);
        });
        $('.popup__close').on('click', function(e){
            e.preventDefault();
            $strategyPopup.removeClass('active');
        });

        //maincontent scroll
        $content.scrollTop(0);
        $content.on('mousewheel', onMouseWheel);
        $(window).on('resize', function(){
            if(FLAG){
                $content.scrollTop($(window).height()*CURRENT_LEVEL);
            }
        });

        //maincontent touchMove
        onTouchMove();

        //aside points
        $menuPoints.on('click', function(e){
            e.preventDefault();
            scrollTo($(this).index());
        });

    };

    var initSliders = function(){
        $sections.each(function(index){
            var $slider = $(this).find('.slider'),
                data;
            if($slider.length){
                $slider.mySlider();
                data = $slider.data('myslider');
            } else {
                data = false;
            }
            slidersBase.push(data);
        });
    };

    var showMenu = function(){
        $mainMenu.addClass('active');
    };

    var hideMenu = function(){
        $mainMenu.removeClass('active');
    };

    var scrollTo = function(index){
        if(!FLAG || index > sectionsLength-1 || index < 0) return;

        FLAG = false;
        $content.stop(true, true).animate({scrollTop: $(window).height()*index},
            scrollSpeed,
            function(){
                CURRENT_LEVEL = index;
                scrollAfter();
            });
    };

    var scrollAfter = function(){
        changePointsActive();

        if(typeof slidersBase[CURRENT_LEVEL] == 'object'){//if there is a slider, animate current slide
            slidersBase[CURRENT_LEVEL].animateCurrentSlide();
        }

        if(CURRENT_LEVEL > 0){//if it's not 1st section show logo
            $logo.addClass('active');
        } else {
            $logo.removeClass('active');
        }

        FLAG = true;
    };

    var changePointsActive = function(){
        $menuPoints
            .removeClass('active')
            .eq(CURRENT_LEVEL)
            .addClass('active');
    };

    var animateSection = function(section){
        if(section.data('animated') == true) return;
        section.data('animated', true);

        var aEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            i = 0,
            $items = section.find('[data-animate]'),
            last = 0,
            isAnimationCss = Modernizr.cssanimations;

        function animate(){
            var $current = $items.filter('[data-animate="'+i+'"]');

            if(isAnimationCss){
                $current.addClass('animated');
                $current.eq(0).one(aEnd, function(){
                    if(i != last){
                        i++;
                        animate();
                    }
                });
            } else {//fallback if no support
                $current.css('opacity',0);
                $current.addClass('animated');
                $current.fadeTo(500, 1, function(){
                    if(i != last){
                        i++;
                        animate();
                    }
                });
            }

        }

        for(var c = 0; c < $items.length; c++){
            var val = parseInt($items.eq(c).attr('data-animate'));
            last = last > val ? last : val;
        }

        animate();
    };

    var onMouseWheel = function(e){
        e.preventDefault();
        var next_level = e.deltaY < 1 ? CURRENT_LEVEL+1 : CURRENT_LEVEL-1,
            currSlider = slidersBase[CURRENT_LEVEL];

        if(typeof currSlider == 'object'){
            if(currSlider.getFlag()){
                scrollTo(next_level);
            }
        }
        else {
            scrollTo(next_level);
        }
    };

    var onTouchMove = function(){
        var eStartX, eStartY;

        $content
            .on('touchstart', function(e){
                eStartX = e.originalEvent.touches[0].clientX;
                eStartY = e.originalEvent.touches[0].clientY;
            })
            .on('touchmove', function(e){
                var eEndX = e.originalEvent.changedTouches[0].clientX,
                    eEndY = e.originalEvent.changedTouches[0].clientY,
                    next_level = eStartY > eEndY ? CURRENT_LEVEL+1 : CURRENT_LEVEL-1,
                    currSlider = slidersBase[CURRENT_LEVEL],
                    xMovement = Math.abs(eEndX - eStartX),
                    yMovement = Math.abs(eEndY - eStartY);

                if( xMovement < yMovement ){
                    if(typeof currSlider == 'object'){
                        if(currSlider.getFlag()){
                            scrollTo(next_level);
                        }
                    }
                    else {
                        scrollTo(next_level);
                    }
                }
            });
    };

    return {
        init: function(){
            $content = $('.maincontent');
            $sections = $content.children();
            sectionsLength = $sections.length;
            $menuPoints = $('.sidebar__menu__item');
            $mainMenu = $('.menu');
            $navLinks = $('.nav_link');
            $logo = $('.sidebar__logo');
            scrollSpeed = 1000;
            CURRENT_LEVEL = 0;
            FLAG = true;

            setup();
        }
    }
})();
$(document).ready(page.init);

//-----------------------------Ресайз всея begin
(function(){
    function pageResize(data){
        if(!data.normalSize){
            data.normalSize = {
                width: 1400,
                height: 900
            }
        }
        if(!data.normalFont){
            data.normalFont = 12;
        }
        var win = data.wrapper,
            winWidth = win.width(),
            winHeight = win.height(),
            normalWidth = data.normalSize.width,
            normalHeight = data.normalSize.height,
            ratio = normalWidth/normalHeight,
            normalSize = data.normalFont,
            perc = 1,
            elem = data.resizeElem;
        $(window).resize(function(){
            winWidth = win.width();
            winHeight = win.height();
            var tmpHeight = 0,
                tmpWidth = 0;
            if(ratio < winWidth/winHeight){
                tmpHeight = winHeight;
                tmpWidth = tmpHeight * ratio;

            } else {
                tmpWidth = winWidth;
                tmpHeight = tmpWidth / ratio;
            }
            perc = tmpWidth/normalWidth;
            var newSize = normalSize*perc;
            //if(newSize > 19){
            //    newSize = 19;
            //}
//            if(newSize < 10){
//                newSize = 10;
//            }
            elem.css({
                fontSize: newSize
            });
        });
        $(window).trigger("resize");
    }

    pageResize({
        wrapper: $(".wrapper"),
        resizeElem: $(".wrapper"),
        normalSize: {
            width: 1300,
            height: 850
        },
        normalFont: 100
    });

})();

//-----------------------------Ресайз всея end
