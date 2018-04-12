'use strict';

(function () {
    /* blocks max size */
    var setBlocksWidth = function setBlocksWidth() {
        [].forEach.call(document.querySelectorAll('.jsMaxSize'), function (el) {
            var blocks = el.children;
            blocks[0].style.maxWidth = el.clientWidth - blocks[1].clientWidth + "px";
        });
    };
    setBlocksWidth();
    window.onresize = setBlocksWidth;

    /* drop down */
    [].forEach.call(document.querySelectorAll('.jsDrop'), function (base) {
        var buttons = base.getElementsByClassName('jsDropBtn');
        [].forEach.call(buttons, function (el) {
            el.addEventListener('click', function () {
                base.classList.toggle('active');
                setBlocksWidth();
            }, false);
        });
    });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsic2V0QmxvY2tzV2lkdGgiLCJmb3JFYWNoIiwiY2FsbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImVsIiwiYmxvY2tzIiwiY2hpbGRyZW4iLCJzdHlsZSIsIm1heFdpZHRoIiwiY2xpZW50V2lkdGgiLCJ3aW5kb3ciLCJvbnJlc2l6ZSIsImJhc2UiLCJidXR0b25zIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQSxZQUFBO0FBQ0E7QUFDQSxRQUFBQSxpQkFBQSxTQUFBQSxjQUFBLEdBQUE7QUFDQSxXQUFBQyxPQUFBLENBQUFDLElBQUEsQ0FBQUMsU0FBQUMsZ0JBQUEsQ0FBQSxZQUFBLENBQUEsRUFBQSxVQUFBQyxFQUFBLEVBQUE7QUFDQSxnQkFBQUMsU0FBQUQsR0FBQUUsUUFBQTtBQUNBRCxtQkFBQSxDQUFBLEVBQUFFLEtBQUEsQ0FBQUMsUUFBQSxHQUFBSixHQUFBSyxXQUFBLEdBQUFKLE9BQUEsQ0FBQSxFQUFBSSxXQUFBLEdBQUEsSUFBQTtBQUNBLFNBSEE7QUFJQSxLQUxBO0FBTUFWO0FBQ0FXLFdBQUFDLFFBQUEsR0FBQVosY0FBQTs7QUFFQTtBQUNBLE9BQUFDLE9BQUEsQ0FBQUMsSUFBQSxDQUFBQyxTQUFBQyxnQkFBQSxDQUFBLFNBQUEsQ0FBQSxFQUFBLFVBQUFTLElBQUEsRUFBQTtBQUNBLFlBQUFDLFVBQUFELEtBQUFFLHNCQUFBLENBQUEsV0FBQSxDQUFBO0FBQ0EsV0FBQWQsT0FBQSxDQUFBQyxJQUFBLENBQUFZLE9BQUEsRUFBQSxVQUFBVCxFQUFBLEVBQUE7QUFDQUEsZUFBQVcsZ0JBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQTtBQUNBSCxxQkFBQUksU0FBQSxDQUFBQyxNQUFBLENBQUEsUUFBQTtBQUNBbEI7QUFDQSxhQUhBLEVBR0EsS0FIQTtBQUlBLFNBTEE7QUFNQSxLQVJBO0FBU0EsQ0FyQkEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgLyogYmxvY2tzIG1heCBzaXplICovXHJcbiAgICB2YXIgc2V0QmxvY2tzV2lkdGggPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanNNYXhTaXplJyksIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gZWwuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGJsb2Nrc1swXS5zdHlsZS5tYXhXaWR0aCA9IGVsLmNsaWVudFdpZHRoIC0gYmxvY2tzWzFdLmNsaWVudFdpZHRoICsgXCJweFwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHNldEJsb2Nrc1dpZHRoKCk7XHJcbiAgICB3aW5kb3cub25yZXNpemUgPSBzZXRCbG9ja3NXaWR0aDtcclxuXHJcbiAgICAvKiBkcm9wIGRvd24gKi9cclxuICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanNEcm9wJyksIGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSBiYXNlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzRHJvcEJ0bicpO1xyXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChidXR0b25zLCBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGJhc2UuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRCbG9ja3NXaWR0aCgpO1xyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTtcclxuIl19
