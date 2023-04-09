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


        $(document).ready(function () {
            var apiKey = "58fd1bea6e72578e15d8bf7566527dac";
            var location = "{{ session['location'] }}";
            var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + apiKey;
            $.ajax({
                url: apiUrl,
                method: "GET",
                success: function (response) {
                    console.log(response);
                    var temp = response.main.temp.toFixed(0);
                    var feelsLike = response.main.feels_like.toFixed(0);
                    var description = response.weather[0].description;
                    var weatherIcon = "";
                    switch (response.weather[0].icon) {
                        case "01d":
                            weatherIcon = "<i class='fas fa-sun'></i>";
                            break;
                        case "01n":
                            weatherIcon = "<i class='fas fa-moon'></i>";
                            break;
                        case "02d":
                        case "02n":
                        case "03d":
                        case "03n":
                        case "04d":
                        case "04n":
                            weatherIcon = "<i class='fas fa-cloud'></i>";
                            break;
                        case "09d":
                        case "09n":
                        case "10d":
                        case "10n":
                            weatherIcon = "<i class='fas fa-cloud-showers-heavy'></i>";
                            break;
                        case "11d":
                        case "11n":
                            weatherIcon = "<i class='fas fa-bolt'></i>";
                            break;
                        case "13d":
                        case "13n":
                            weatherIcon = "<i class='fas fa-snowflake'></i>";
                            break;
                        case "50d":
                        case "50n":
                            weatherIcon = "<i class='fas fa-smog'></i>";
                            break;
                    }
                    var locationParts = location.split(",");
                    var city = locationParts[0];
                    $("#weather").html("The weather in " + city + " is " + temp + "&deg;F and " + description + " " + weatherIcon);
                }
            });
        });


        
        