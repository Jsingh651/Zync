function openMenu() {
    document.body.classList += "menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}


document.addEventListener("submit", function (event) {
    if (event.target.matches(".activity-form")) {
        event.preventDefault();
        event.target.submit();
    }
});
function capitalizeAndPluralize(term) {
  // Capitalize the first letter
  const capitalized = term.charAt(0).toUpperCase() + term.slice(1);

  // Add an "s" at the end if there isn't one already
  const pluralized = capitalized.endsWith('s') ? capitalized : capitalized + 's';

  return pluralized;
}
const term = session['term'];
const location = session['location'].split(', ')[0];
const processedTerm = capitalizeAndPluralize(term);

const htmlContent = `<h2 class="title_search">${processedTerm}</h2>`;
function updateActiveButton(event) {
    event.preventDefault();
    
    // Remove the 'active' class from all buttons
    $(".filter_btn").removeClass("active");

    // Add the 'active' class to the clicked button
    $(event.target).addClass("active");

    // Submit the form
    $(event.target).closest("form").submit();
}

