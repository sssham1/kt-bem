document.querySelectorAll('.product-card').forEach(function (cardElement) {
    var button = cardElement.querySelector('.product-card__button');
    var titleElement = cardElement.querySelector('.product-card__title');

    if (!button || !titleElement) {
        return;
    }

    button.addEventListener('click', function () {
        console.log(titleElement.textContent.trim());
    });
});

document.querySelectorAll('.filter').forEach(function (filterElement) {
    var brandCheckboxes = filterElement.querySelectorAll('.filter__checkbox[data-brand]');

    function logSelectedBrands() {
        var selectedBrands = [];

        brandCheckboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                var label = checkbox.closest('.filter__label');
                if (label) {
                    selectedBrands.push(label.textContent.trim());
                }
            }
        });

        console.log(selectedBrands);
    }

    brandCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', logSelectedBrands);
    });
});

document.querySelectorAll('.pagination').forEach(function (paginationElement) {
    var items = paginationElement.querySelectorAll('.pagination__item');

    items.forEach(function (itemElement) {
        var link = itemElement.querySelector('.pagination__link');

        if (!link) {
            return;
        }

        link.addEventListener('click', function (event) {
            event.preventDefault();

            items.forEach(function (otherItem) {
                otherItem.classList.remove('pagination__item_current');
            });

            itemElement.classList.add('pagination__item_current');
        });
    });
});
