(($, fn) => {
    "use strict";
    if (typeof $ === 'undefined') {
        throw new TypeError("jQuery required.");
    }

    $(() => { fn($); });
})(jQuery, ($) => {

    // Enable Bootstrap tooltips.
    $('[data-toggle="tooltip"]').tooltip();

    // Toggle color when devicon hovered.
    $('i[class^="devicon"]').each(function () {
        const $trg = $(this);
        $trg.hover(() => {
            $trg.addClass("colored");
        }, () => {
            $trg.removeClass("colored");
        });
    });

    // Handle filter button in main page.
    (() => {
        const $root = $('#sect-experiences');
        const $menu = $('#dropdown-experiences-filter-menu');

        if ($root.length === 0) {
            // not in the main page
            return;
        }

        if ($menu.length === 0) {
            throw new Error("Dropdown menu not exists.");
        }

        for(const section of $root.children('section')){
            if($(section).children('article').length > 0){
                continue;
            }
            
            throw new Error("The element tree structure is not as expected.");
        }

        // Prevents the menu from being hidden when it clicked.
        $menu.on('click', (e) => {
            e.stopPropagation();
        });


        /** @typedef {{elem:Element,tags:Set<String>}} Article */

        /**
         * Updates the visibility of articles and section.
         * 
         * @param {Array<HTMLElement>} sections
         * @param {Array<Article>} articles 
         * @param {Set<String>} tags 
         */
        function update(sections, articles, tags) {
            const remained = []; // hide
            const filtered = []; // show

            for (const article of articles) {
                if(article.tags.size === 0){
                    // Show article if article has no tags.
                    filtered.push(article);
                    continue;
                }

                const pivot = filtered.length;

                for (const tag of tags) {
                    if (!article.tags.has(tag)) {
                        continue;
                    }

                    filtered.push(article);
                    break;
                }

                if (filtered.length !== pivot) {
                    continue;
                }

                remained.push(article);
            }

            for (const article of remained) {
                article.elem.classList.add('d-none');
            }

            for (const article of filtered) {
                article.elem.classList.remove('d-none');
            }

            for(const section of sections){
                let cnt = 0;
                for(const article of section.children){
                    if(!article.classList.contains('d-none')){
                        continue;
                    }

                    cnt++;
                }

                if(cnt === section.childElementCount - 1){
                    section.classList.add('d-none');
                } else {
                    section.classList.remove('d-none');
                }
            }
        }

        /**
         * Handles the changes of the filter state.
         * 
         * @param {Array<HTMLInputElement>} boxes 
         * @param {Array<Article>} articles 
         */
        function handleChange(boxes, sections, articles) {
            const tags = new Set();

            for (const box of boxes) {
                if (box.dataset.tag === undefined) {
                    console.warn("data-tag attribute is missing in filter");
                    continue;
                }
                
                if(!box.checked){
                    continue;
                }

                tags.add(box.dataset.tag);
            }

            update(sections, articles, tags);
        }


        const $boxes = $('input[type=checkbox]', $menu);
        const $sects = $root.children('section');
        /** @type {Array<Article>} */
        const articles = ((trgs) => {
            const rst = [];

            for (const trg of trgs) {
                const article = {
                    elem: trg,
                    tags: new Set(),
                }

                if (trg.dataset.tags !== undefined) {
                    article.tags = new Set(trg.dataset.tags.split(','));
                };

                rst.push(article);
            }

            return rst;
        })($sects.children('article'));

        $boxes.on('change', () => handleChange($boxes, $sects, articles));

        /**
         * Returns the number of elements with d-none.
         * 
         * @param {Array<Article>} articles 
         */
        function numDisplayNone(articles){
            let rst = 0;
            for(const article of articles){
                if(!article.elem.classList.contains('d-none')){
                    continue;
                }

                rst++;
            }

            return rst;
        }

        const numHidden = numDisplayNone(articles);

        // set initial state
        handleChange($boxes, $sects, articles);

        if(numHidden !== numDisplayNone(articles)){
            console.warn("Static page is not matched to initial filter state.")
        }
    })();

});
