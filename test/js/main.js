'use strict';

(function () {
    $('.slider').each(function () {
        var $base = $(this);
        var $items = $base.find('.slider__item');
        var itemsLength = $items.length;
        var $prev = $base.find('.slider__arrow-prev');
        var $next = $base.find('.slider__arrow-next');
        var current = 0;
        var showCurrent = function showCurrent() {
            $items.removeClass('active').eq(current).addClass('active');
        };
        $prev.on('click', function () {
            current = current - 1 >= 0 ? current - 1 : itemsLength - 1;
            showCurrent();
        });
        $next.on('click', function () {
            current = current + 1 < itemsLength ? current + 1 : 0;
            showCurrent();
        });
    });

    $('.catalog__button-selected').on('click', function (e) {
        e.preventDefault();
        var $button = $(this);
        if ($button.hasClass('active')) {
            alert('Уже нажимали');
            return;
        }
        $.ajax({
            url: 'ajax.json',
            dataType: 'json',
            data: {
                id: $button.attr('data-id')
            },
            error: function error(err) {
                console.log(err);
            },
            success: function success(response) {
                if (!!response.success) {
                    $button.addClass('active');
                }
            }
        });
    });
})();
//function CoffeeMachine(power) {
//    this._waterAmount = 0;
//
//    this._WATER_HEAT_CAPACITY = 4200;
//
//    this._getTimeToBoil = function() {
//        return this._waterAmount * this._WATER_HEAT_CAPACITY * 80 / power;
//    };
//
//    //this.run = function() {
//    //    setTimeout(function() {
//    //        alert( 'Кофе готов!' );
//    //    }, getTimeToBoil());
//    //};
//    //
//    //this.setWaterAmount = function(amount) {
//    //    waterAmount = amount;
//    //};
//
//}
//
//CoffeeMachine.prototype.run = function() {
//    setTimeout(function() {
//        alert( 'Кофе готов!' );
//    }, this._getTimeToBoil());
//};
//CoffeeMachine.prototype.setWaterAmount = function(amount) {
//    this._waterAmount = amount;
//};
//
//var coffeeMachine = new CoffeeMachine(10000);
//coffeeMachine.setWaterAmount(50);
//coffeeMachine.run();

function Hamster() {
    this.food = [];
}

Hamster.prototype.found = function (something) {
    this.food.push(something);
};

// Создаём двух хомяков и кормим первого
var speedy = new Hamster();
var lazy = new Hamster();

speedy.found("яблоко");
speedy.found("орех");

alert(speedy.food.length); // 2
alert(lazy.food.length); // 2 (!??)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0LmpzIl0sIm5hbWVzIjpbIiQiLCJlYWNoIiwiJGJhc2UiLCIkaXRlbXMiLCJmaW5kIiwiaXRlbXNMZW5ndGgiLCJsZW5ndGgiLCIkcHJldiIsIiRuZXh0IiwiY3VycmVudCIsInNob3dDdXJyZW50IiwicmVtb3ZlQ2xhc3MiLCJlcSIsImFkZENsYXNzIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCIkYnV0dG9uIiwiaGFzQ2xhc3MiLCJhbGVydCIsImFqYXgiLCJ1cmwiLCJkYXRhVHlwZSIsImRhdGEiLCJpZCIsImF0dHIiLCJlcnJvciIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJIYW1zdGVyIiwiZm9vZCIsInByb3RvdHlwZSIsImZvdW5kIiwic29tZXRoaW5nIiwicHVzaCIsInNwZWVkeSIsImxhenkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQSxZQUFBO0FBQ0FBLE1BQUEsU0FBQSxFQUFBQyxJQUFBLENBQUEsWUFBQTtBQUNBLFlBQUFDLFFBQUFGLEVBQUEsSUFBQSxDQUFBO0FBQ0EsWUFBQUcsU0FBQUQsTUFBQUUsSUFBQSxDQUFBLGVBQUEsQ0FBQTtBQUNBLFlBQUFDLGNBQUFGLE9BQUFHLE1BQUE7QUFDQSxZQUFBQyxRQUFBTCxNQUFBRSxJQUFBLENBQUEscUJBQUEsQ0FBQTtBQUNBLFlBQUFJLFFBQUFOLE1BQUFFLElBQUEsQ0FBQSxxQkFBQSxDQUFBO0FBQ0EsWUFBQUssVUFBQSxDQUFBO0FBQ0EsWUFBQUMsY0FBQSxTQUFBQSxXQUFBLEdBQUE7QUFDQVAsbUJBQ0FRLFdBREEsQ0FDQSxRQURBLEVBRUFDLEVBRkEsQ0FFQUgsT0FGQSxFQUdBSSxRQUhBLENBR0EsUUFIQTtBQUlBLFNBTEE7QUFNQU4sY0FBQU8sRUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBO0FBQ0FMLHNCQUFBQSxVQUFBLENBQUEsSUFBQSxDQUFBLEdBQUFBLFVBQUEsQ0FBQSxHQUFBSixjQUFBLENBQUE7QUFDQUs7QUFDQSxTQUhBO0FBSUFGLGNBQUFNLEVBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQTtBQUNBTCxzQkFBQUEsVUFBQSxDQUFBLEdBQUFKLFdBQUEsR0FBQUksVUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBQztBQUNBLFNBSEE7QUFJQSxLQXJCQTs7QUF1QkFWLE1BQUEsMkJBQUEsRUFBQWMsRUFBQSxDQUFBLE9BQUEsRUFBQSxVQUFBQyxDQUFBLEVBQUE7QUFDQUEsVUFBQUMsY0FBQTtBQUNBLFlBQUFDLFVBQUFqQixFQUFBLElBQUEsQ0FBQTtBQUNBLFlBQUFpQixRQUFBQyxRQUFBLENBQUEsUUFBQSxDQUFBLEVBQUE7QUFDQUMsa0JBQUEsY0FBQTtBQUNBO0FBQ0E7QUFDQW5CLFVBQUFvQixJQUFBLENBQUE7QUFDQUMsaUJBQUEsV0FEQTtBQUVBQyxzQkFBQSxNQUZBO0FBR0FDLGtCQUFBO0FBQ0FDLG9CQUFBUCxRQUFBUSxJQUFBLENBQUEsU0FBQTtBQURBLGFBSEE7QUFNQUMsbUJBQUEsZUFBQUMsR0FBQSxFQUFBO0FBQ0FDLHdCQUFBQyxHQUFBLENBQUFGLEdBQUE7QUFDQSxhQVJBO0FBU0FHLHFCQUFBLGlCQUFBQyxRQUFBLEVBQUE7QUFDQSxvQkFBQSxDQUFBLENBQUFBLFNBQUFELE9BQUEsRUFBQTtBQUNBYiw0QkFBQUosUUFBQSxDQUFBLFFBQUE7QUFDQTtBQUNBO0FBYkEsU0FBQTtBQWVBLEtBdEJBO0FBdUJBLENBL0NBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQUFtQixPQUFBLEdBQUE7QUFDQSxTQUFBQyxJQUFBLEdBQUEsRUFBQTtBQUNBOztBQUVBRCxRQUFBRSxTQUFBLENBQUFDLEtBQUEsR0FBQSxVQUFBQyxTQUFBLEVBQUE7QUFDQSxTQUFBSCxJQUFBLENBQUFJLElBQUEsQ0FBQUQsU0FBQTtBQUNBLENBRkE7O0FBSUE7QUFDQSxJQUFBRSxTQUFBLElBQUFOLE9BQUEsRUFBQTtBQUNBLElBQUFPLE9BQUEsSUFBQVAsT0FBQSxFQUFBOztBQUVBTSxPQUFBSCxLQUFBLENBQUEsUUFBQTtBQUNBRyxPQUFBSCxLQUFBLENBQUEsTUFBQTs7QUFFQWhCLE1BQUFtQixPQUFBTCxJQUFBLENBQUEzQixNQUFBLEUsQ0FBQTtBQUNBYSxNQUFBb0IsS0FBQU4sSUFBQSxDQUFBM0IsTUFBQSxFLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgJCgnLnNsaWRlcicpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgJGJhc2UgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciAkaXRlbXMgPSAkYmFzZS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcbiAgICAgICAgdmFyIGl0ZW1zTGVuZ3RoID0gJGl0ZW1zLmxlbmd0aDtcclxuICAgICAgICB2YXIgJHByZXYgPSAkYmFzZS5maW5kKCcuc2xpZGVyX19hcnJvdy1wcmV2Jyk7XHJcbiAgICAgICAgdmFyICRuZXh0ID0gJGJhc2UuZmluZCgnLnNsaWRlcl9fYXJyb3ctbmV4dCcpO1xyXG4gICAgICAgIHZhciBjdXJyZW50ID0gMDtcclxuICAgICAgICB2YXIgc2hvd0N1cnJlbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkaXRlbXNcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgIC5lcShjdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHByZXYub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQtMSA+PTAgPyBjdXJyZW50LTEgOiBpdGVtc0xlbmd0aC0xO1xyXG4gICAgICAgICAgICBzaG93Q3VycmVudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRuZXh0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50KzEgPCBpdGVtc0xlbmd0aCA/IGN1cnJlbnQrMSA6IDA7XHJcbiAgICAgICAgICAgIHNob3dDdXJyZW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuY2F0YWxvZ19fYnV0dG9uLXNlbGVjdGVkJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciAkYnV0dG9uID0gJCh0aGlzKTtcclxuICAgICAgICBpZigkYnV0dG9uLmhhc0NsYXNzKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICAgIGFsZXJ0KCfQo9C20LUg0L3QsNC20LjQvNCw0LvQuCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJ2FqYXguanNvbicsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAkYnV0dG9uLmF0dHIoJ2RhdGEtaWQnKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgIGlmKCEhcmVzcG9uc2Uuc3VjY2Vzcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSgpOyIsIi8vZnVuY3Rpb24gQ29mZmVlTWFjaGluZShwb3dlcikge1xyXG4vLyAgICB0aGlzLl93YXRlckFtb3VudCA9IDA7XHJcbi8vXHJcbi8vICAgIHRoaXMuX1dBVEVSX0hFQVRfQ0FQQUNJVFkgPSA0MjAwO1xyXG4vL1xyXG4vLyAgICB0aGlzLl9nZXRUaW1lVG9Cb2lsID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICByZXR1cm4gdGhpcy5fd2F0ZXJBbW91bnQgKiB0aGlzLl9XQVRFUl9IRUFUX0NBUEFDSVRZICogODAgLyBwb3dlcjtcclxuLy8gICAgfTtcclxuLy9cclxuLy8gICAgLy90aGlzLnJ1biA9IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAvLyAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4vLyAgICAvLyAgICAgICAgYWxlcnQoICfQmtC+0YTQtSDQs9C+0YLQvtCyIScgKTtcclxuLy8gICAgLy8gICAgfSwgZ2V0VGltZVRvQm9pbCgpKTtcclxuLy8gICAgLy99O1xyXG4vLyAgICAvL1xyXG4vLyAgICAvL3RoaXMuc2V0V2F0ZXJBbW91bnQgPSBmdW5jdGlvbihhbW91bnQpIHtcclxuLy8gICAgLy8gICAgd2F0ZXJBbW91bnQgPSBhbW91bnQ7XHJcbi8vICAgIC8vfTtcclxuLy9cclxuLy99XHJcbi8vXHJcbi8vQ29mZmVlTWFjaGluZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICBhbGVydCggJ9Ca0L7RhNC1INCz0L7RgtC+0LIhJyApO1xyXG4vLyAgICB9LCB0aGlzLl9nZXRUaW1lVG9Cb2lsKCkpO1xyXG4vL307XHJcbi8vQ29mZmVlTWFjaGluZS5wcm90b3R5cGUuc2V0V2F0ZXJBbW91bnQgPSBmdW5jdGlvbihhbW91bnQpIHtcclxuLy8gICAgdGhpcy5fd2F0ZXJBbW91bnQgPSBhbW91bnQ7XHJcbi8vfTtcclxuLy9cclxuLy92YXIgY29mZmVlTWFjaGluZSA9IG5ldyBDb2ZmZWVNYWNoaW5lKDEwMDAwKTtcclxuLy9jb2ZmZWVNYWNoaW5lLnNldFdhdGVyQW1vdW50KDUwKTtcclxuLy9jb2ZmZWVNYWNoaW5lLnJ1bigpO1xyXG5cclxuZnVuY3Rpb24gSGFtc3RlcigpIHtcclxuICAgIHRoaXMuZm9vZCA9IFtdO1xyXG59XHJcblxyXG5IYW1zdGVyLnByb3RvdHlwZS5mb3VuZCA9IGZ1bmN0aW9uKHNvbWV0aGluZykge1xyXG4gICAgdGhpcy5mb29kLnB1c2goc29tZXRoaW5nKTtcclxufTtcclxuXHJcbi8vINCh0L7Qt9C00LDRkdC8INC00LLRg9GFINGF0L7QvNGP0LrQvtCyINC4INC60L7RgNC80LjQvCDQv9C10YDQstC+0LPQvlxyXG52YXIgc3BlZWR5ID0gbmV3IEhhbXN0ZXIoKTtcclxudmFyIGxhenkgPSBuZXcgSGFtc3RlcigpO1xyXG5cclxuc3BlZWR5LmZvdW5kKFwi0Y/QsdC70L7QutC+XCIpO1xyXG5zcGVlZHkuZm91bmQoXCLQvtGA0LXRhVwiKTtcclxuXHJcbmFsZXJ0KCBzcGVlZHkuZm9vZC5sZW5ndGggKTsgLy8gMlxyXG5hbGVydCggbGF6eS5mb29kLmxlbmd0aCApOyAvLyAyICghPz8pIl19
