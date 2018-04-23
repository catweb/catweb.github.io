'use strict';

(function () {
    //sub menu
    var $list = $('.menu__list');
    var $items = $list.find('.menu__list__item');
    var $links = $list.find('.menu__list__link-triangle');
    $links.on('click', function (e) {
        e.preventDefault();
        var $parent = $(this).parent();
        if ($parent.hasClass('active')) {
            $parent.removeClass('active');
        } else {
            $items.removeClass('active');
            $parent.addClass('active');
        }
    });
    $(document).on('click', function (e) {
        if ($list.has(e.target).length === 0) {
            $items.removeClass('active');
        }
    });

    //return input
    var $retBlock = $('.tickets__return');
    var $retCheck = $retBlock.find("[type='checkbox']");
    var $retInput = $retBlock.find("[type='text']");
    var checkState = function checkState() {
        if ($retCheck.is(':checked')) {
            $retInput.removeAttr('disabled');
        } else {
            $retInput.attr('disabled', true);
        }
    };
    $retCheck.on('click', checkState);
    checkState();
})();

