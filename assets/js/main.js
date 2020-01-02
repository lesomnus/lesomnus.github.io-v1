"use strict"

$(() => {
    // enable Bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // toggle color when devicon hovered
    $('i[class^="devicon"]').each(function () {
        const $trg = $(this);
        $trg.hover(() => {
            $trg.addClass("colored");
        }, () => {
            $trg.removeClass("colored");
        });
    });

    (() => {
        const active = 'active';
        const $btn = $('#btn-show-tp');
        const $trgs = $('article', $('#sect-experiences')).filter((i, e) => {
            let tags = undefined;
            try {
                tags = JSON.parse(e.dataset.tags);
            } catch(_){ return false; }
            if(tags === undefined){ return false; }

            return tags.includes('term-project');
        });

        $btn.click(() => {
            if ($btn.hasClass(active)) {
                $trgs.hide();
                $btn.removeClass(active);
            } else {
                $trgs.show();
                $btn.addClass(active);
            }
        });
    })();
});
