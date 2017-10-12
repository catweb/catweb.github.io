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

var pageApp = (function(){
    var $content,
        $sections,
        $menuItems,
        $navScroll,
        $navScrollUp,
        $navScrollDown,
        sectionsLength,
        scrollSpeed,
        CURRENT_LEVEL,
        FLAG;

    var animateSection = function(section){
        section.data('flag', true);

        var aEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            i = 0,
            $items = section.find('[data-animate]'),
            last = 0,
            isAnimationCss = Modernizr.cssanimations;

        function animate(){
            if(section.data('flag') == false)  return;

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

    var changeSlide = function(index){
        if(!FLAG || index > sectionsLength-1 || index < 0) return;
        FLAG = false;

        var $sectionCurrent = $sections.eq(CURRENT_LEVEL);
        var $sectionNext = $sections.eq(index);

        if(!$sectionCurrent.hasClass('jsHideOff')){
            var hideClass = index > CURRENT_LEVEL ? 'hideUp' : 'hideDown';
            var showClass = index > CURRENT_LEVEL ? 'showUp' : 'showDown';
            $sectionCurrent.addClass(hideClass);
            $sectionNext.addClass(showClass);
        }

        changeNavScrollState(index);

        $content.animate({scrollTop: $content.height()*index},
            scrollSpeed,
            function(){
                CURRENT_LEVEL = index;
                $sectionNext.removeClass('showUp showDown');
                resetSectionAnimation($sectionCurrent);
                changeSlideAfter();
            });
    };

    var switchSlide = function(index){
        if(!FLAG || index > sectionsLength-1 || index < 0) return;
        FLAG = false;

        var $sectionCurrent = $sections.eq(CURRENT_LEVEL);

        $content.scrollTop($content.height()*index);
        CURRENT_LEVEL = index;
        resetSectionAnimation($sectionCurrent);
        changeNavScrollState(index);
        changeSlideAfter();
    };

    var resetSectionAnimation = function(section){
        if(CURRENT_LEVEL == 7) return;// when we scroll to footer

        section.data('flag', false);
        section.find('.animated').removeClass('animated');
        section.removeClass('hideUp hideDown');
    };

    var changeSlideAfter = function(){
        animateSection($sections.eq(CURRENT_LEVEL));
        FLAG = true;
    };

    var changeNavScrollState = function(index){
        switch (index){
            case 0:
                $navScrollUp.hide();
                break;
            case 7:
                $navScrollDown.hide();
                $navScroll.addClass('nav_scroll__bottom');
                break;
            default:
                $navScrollDown.show();
                $navScrollUp.show();
                $navScroll.removeClass('nav_scroll__bottom');
        }
    };

    var setup = function(){
        //animate main
        animateSection($sections.eq(CURRENT_LEVEL));
        changeNavScrollState(CURRENT_LEVEL);

        //maincontent scroll
        $content.scrollTop(0);
        $content.on('mousewheel', function(e){
            e.preventDefault();
            if(e.deltaY < 1){
                changeSlide(CURRENT_LEVEL+1);
            } else if(e.deltaY == 1){
                changeSlide(CURRENT_LEVEL-1);
            }
        });
        $(window).on('resize', function(){
            if(FLAG){
                $content.scrollTop($(window).height()*CURRENT_LEVEL);
            }
        });

        //on touch
        var eStartX;
        var eStartY;
        $content
            .on('touchstart', function(e){
                eStartX = e.originalEvent.touches[0].clientX;
                eStartY = e.originalEvent.touches[0].clientY;
            })
            .on('touchmove', function(e){
                var eEndX = e.originalEvent.changedTouches[0].clientX,
                    eEndY = e.originalEvent.changedTouches[0].clientY,
                    new_level = eStartY > eEndY ? CURRENT_LEVEL+1 : CURRENT_LEVEL- 1,
                    xMovement = Math.abs(eEndX - eStartX),
                    yMovement = Math.abs(eEndY - eStartY);

                if( xMovement < yMovement ){
                    changeSlide(new_level);
                }
            });

        //menu nav
        $menuItems.on('click', function(e){
            e.preventDefault();
            var index = parseInt($(this).attr('data-index'));
            switchSlide(index);
        });

        //scroll buttons nav
        $navScrollUp.on('click', function(e){
            e.preventDefault();
            changeSlide(CURRENT_LEVEL-1);
        });
        $navScrollDown.on('click', function(e){
            e.preventDefault();
            changeSlide(CURRENT_LEVEL+1);
        });
    };

    return {
        init: function(){
            $content = $('.maincontent');
            $sections = $content.children();
            $menuItems = $('.section_main__list__item');
            $navScroll = $('.nav_scroll');
            $navScrollUp = $('.nav_scroll__btn_up');
            $navScrollDown = $('.nav_scroll__btn_down');
            sectionsLength = $sections.length;
            scrollSpeed = 600;
            CURRENT_LEVEL = 0;
            FLAG = true;

            setup();
        }
    }
})();
$(document).ready(pageApp.init);
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
            width: 1400,
            height: 860
        },
        normalFont: 100
    });

})();

//-----------------------------Ресайз всея end
