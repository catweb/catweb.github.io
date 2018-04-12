'use strict';
(function () {
    /* drop down */
    [].forEach.call(document.querySelectorAll('.jsDrop'), function (base) {
        var buttons = base.getElementsByClassName('jsDropBtn');
        [].forEach.call(buttons, function (el) {
            el.addEventListener('click', function () {
                base.classList.toggle('active');
            }, false);
        });
    });
})();

