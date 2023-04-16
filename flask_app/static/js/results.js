
function openMenu() {
    document.body.classList += "menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');
// const AUTOCOMPLETEAPI = '025c442e38884f13ae715db4f47f7c71';

searchInput.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length < 2) {
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