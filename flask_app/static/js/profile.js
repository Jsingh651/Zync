document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#departureDate');
});
document.addEventListener('DOMContentLoaded', function () {
    const filterElement = document.getElementById('filter2');
    const choices = new Choices(filterElement, {
        searchEnabled: false,
    });
});

        const searchInput = document.getElementById('search-input');
        const suggestions = document.getElementById('suggestions');

        searchInput.addEventListener('input', async (event) => {
            const query = event.target.value;
            if (query.length < 3) {
                suggestions.innerHTML = '';
                return;
            }

            const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${AUTOCOMPLETEAPI}`);
            const data = await response.json();

            displaySuggestions(data.features);
        });

        function displaySuggestions(results) {
            suggestions.innerHTML = '';
            const topResults = results.slice(0, 3);
            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.textContent = result.properties.formatted;
                listItem.addEventListener('click', () => {
                    searchInput.value = result.properties.formatted;
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(listItem);
            });
        }


        function updateStarRating(radioInput) {
            var starInputs = document.querySelectorAll('.star-rating input[type="radio"]');
            var currentStar = parseInt(radioInput.value);
            for (var i = 0; i < starInputs.length; i++) {
                if (parseInt(starInputs[i].value) > currentStar) {
                    starInputs[i].disabled = false;
                } else {
                    starInputs[i].disabled = false;
                }
            }
        }


        function openMenu() {
    document.body.classList += "menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}