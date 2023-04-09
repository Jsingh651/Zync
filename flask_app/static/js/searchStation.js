const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');
const apiKey = '025c442e38884f13ae715db4f47f7c71';

searchInput.addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length < 3) {
        suggestions.innerHTML = '';
        return;
    }

    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${apiKey}`);
    const data = await response.json();

    displaySuggestions(data.features);
});

function displaySuggestions(results) {
    suggestions.innerHTML = '';
    const topResults = results.slice(0, 3);
    if (results.length > 0) {
        hideExploreButton();
    } else {
        showExploreButton();
    }
    results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = result.properties.formatted;
        listItem.addEventListener('click', () => {
            searchInput.value = result.properties.formatted;
            suggestions.innerHTML = '';
            showExploreButton();
        });
        suggestions.appendChild(listItem);
    });
}

function hideExploreButton() {
    const exploreButton = document.getElementById('explore-button');
    exploreButton.style.display = 'none';
}

function showExploreButton() {
    const exploreButton = document.getElementById('explore-button');
    exploreButton.style.display = 'block';
}
function openMenu() {
document.body.classList += "menu--open"
}

function closeMenu() {
document.body.classList.remove('menu--open')
}
