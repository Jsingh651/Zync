
document.addEventListener('DOMContentLoaded', function () {
    const filterElement = document.getElementById('filter');
    const choices = new Choices(filterElement, {
        searchEnabled: false,
    });
});
function openMenu() {
    document.body.classList += "menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}


document.addEventListener("click", (event) => {
    const searchWrappers = document.querySelectorAll(".search-wrapper");

    searchWrappers.forEach((wrapper) => {
        const suggestionsList = wrapper.querySelector(".suggestions");

        if (!wrapper.contains(event.target)) {
            clearSuggestions(suggestionsList);
        }
    });
});
const filterDropdown = document.getElementById("filter");
filterDropdown.addEventListener("change", () => {
    const storedFlightData = localStorage.getItem("flightData");
    if (storedFlightData) {
        const parsedData = JSON.parse(storedFlightData);
        displayFlights(parsedData, filterDropdown.value);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#departureDate');
});

const API_KEY = "DQ94eb1kiBSSosL3XFuEGp8KtUgbgXXy";
// const API_KEY = "BB1Gixhwq2jBMBsGss1-8NZgJXjFy40q";
const searchFrom = document.getElementById("searchFrom");
const searchTo = document.getElementById("searchTo");
const suggestionsFrom = document.getElementById("suggestionsFrom");
const suggestionsTo = document.getElementById("suggestionsTo");
const departureDate = document.getElementById("departureDate");
const submitBtn = document.getElementById("submitBtn");
const flightResults = document.getElementById("flightResults");

function setupSearch(inputElement, suggestionsElement) {
    const spinnerElement = document.createElement("div");
    spinnerElement.className = "spinner";

    inputElement.addEventListener("input", async (event) => {
        const searchTerm = event.target.value;
        if (searchTerm.length >= 0) {
            try {
                suggestionsElement.appendChild(spinnerElement);

                const results = await searchAirports(searchTerm);
                clearSuggestions(suggestionsElement);
                displaySuggestions(results, suggestionsElement, inputElement);
            } catch (error) {
                console.error("Error fetching airport suggestions:", error);
            } finally {
                suggestionsElement.removeChild(spinnerElement);
            }
        } else {
            clearSuggestions(suggestionsElement);
        }
    });
}


setupSearch(searchFrom, suggestionsFrom);
setupSearch(searchTo, suggestionsTo);

submitBtn.addEventListener("click", async () => {
    const from = searchFrom.value;
    const to = searchTo.value;
    const date = departureDate.value;

    if (from && to && date) {
        try {
            const flightData = await searchFlights(from, to, date);
            displayFlights(flightData);

            searchFrom.value = from;
            searchTo.value = to;
            departureDate.value = date;

            sessionStorage.setItem("from", from);
            sessionStorage.setItem("to", to);
        } catch (error) {
            console.error("Error fetching flight data:", error);
        }
    } else {
        alert("Please enter valid airport codes and date.");
    }
});

searchFrom.value = sessionStorage.getItem("from");
searchTo.value = sessionStorage.getItem("to");

async function searchAirports(term) {
    const response = await fetch(
        `https://tequila-api.kiwi.com/locations/query?term=${term}&location_types=city`,
        {
            headers: {
                apikey: API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch airport suggestions: ${response.status}`);
    }

    const data = await response.json();
    const cities = data.locations;

    // Retrieve airports for each city
    const airports = [];
    for (const city of cities) {
        const airportResponse = await fetch(
            `https://tequila-api.kiwi.com/locations/query?term=${city.code}&location_types=airport`,
            {
                headers: {
                    apikey: API_KEY,
                },
            }
        );

        if (!airportResponse.ok) {
            throw new Error(`Failed to fetch airport data: ${airportResponse.status}`);
        }

        const airportData = await airportResponse.json();
        airports.push(...airportData.locations);
    }

    return airports;
}
function displaySuggestions(airports, suggestionsElement, inputElement) {
    clearSuggestions(suggestionsElement);

    airports.forEach((airport) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${airport.name} (${airport.code}) - ${airport.city.name}, ${airport.city.country.name}`;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => {
            inputElement.value = airport.code;
            clearSuggestions(suggestionsElement);
        });

        suggestionsElement.appendChild(listItem);
    });
}

function clearSuggestions(suggestionsElement) {
    suggestionsElement.innerHTML = "";
}

async function searchFlights(from, to, date) {
    const response = await fetch(
        `https://tequila-api.kiwi.com/v2/search?fly_from=${from}&fly_to=${to}&date_from=${date}&date_to=${date}`,
        {
            headers: {
                apikey: API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch flight data: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = monthNames[date.getMonth()];

    return `${dayName} ${day} ${monthName}`;
}
function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
function displayFlights(flightData, filter = "default") {
    flightResults.innerHTML = "";

    if (flightData.length === 0) {
        flightResults.innerHTML = "<p>No flights found for the given date.</p>";
        return;
    }

    switch (filter) {
        case "duration":
            flightData.sort((a, b) => {
                const durationA = calculateDuration(a.utc_departure, a.utc_arrival);
                const durationB = calculateDuration(b.utc_departure, b.utc_arrival);
                return (durationA.hours * 60 + durationA.minutes) - (durationB.hours * 60 + durationB.minutes);
            });
            break;
        case "price":
            flightData.sort((a, b) => a.price - b.price);
            break;
        case "fewest_stops":
            flightData.sort((a, b) => a.route.length - b.route.length);
            break;
        case "price_desc":
            flightData.sort((a, b) => b.price - a.price);
            break;
        case "price_asc":
            flightData.sort((a, b) => a.price - b.price);
            break;
        default:
            break;
    }

    flightData.forEach((flight) => {
        const duration = calculateDuration(flight.utc_departure, flight.utc_arrival);
        const flightInfo = document.createElement("div");
        flightInfo.className = "flight-info-container";
        flightInfo.innerHTML = `
              <div class="flight-info-left">
                  <p class="locationdepar"> <b> ${flight.cityFrom} </b>  (${flight.flyFrom}) </p>
                  <p class="times" ><i class="fas fa-plane-departure"></i>  ${formatDate(flight.local_departure)}<b> ${formatTime(flight.local_departure)}</b></p>
                  <p>Airline: ${flight.airlines[0]}</p>
                  <p class="duration"> ${duration.hours}h ${duration.minutes}m</p>
                  <p>Stops: ${flight.route.length - 1}</p>
                  <p class="times"><i class="fas fa-plane-arrival"></i> ${formatDate(flight.local_arrival)} <b> ${formatTime(flight.local_arrival)} </b></p>
                  <p> <b>${flight.cityTo} </b> (${flight.flyTo})</p>
              </div>
              <div class="flight-info-right">
                  <p class="price_flight">$${flight.price}</p>
                  <button> <a href="https://www.kiwi.com/en/booking?token=${flight.booking_token}" target="_blank" rel="noopener noreferrer">Buy Ticket</a> <i class="fas fa-arrow-right"></i></button>
              </div>
          `;
        flightResults.appendChild(flightInfo);
    });
    localStorage.setItem("flightData", JSON.stringify(flightData));
}





function calculateDuration(utc_departure, utc_arrival) {
    const departureTime = new Date(utc_departure).getTime();
    const arrivalTime = new Date(utc_arrival).getTime();
    const totalMinutes = Math.floor((arrivalTime - departureTime) / 1000 / 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours, minutes };
}

window.addEventListener("load", () => {
    const storedFlightData = localStorage.getItem("flightData");
    if (storedFlightData) {
        const parsedData = JSON.parse(storedFlightData);
        displayFlights(parsedData);
    }
});

async function fetchAirlineLogo(airlineCode) {
    try {
        const response = await fetch(`https://www.airlinecodes.info/logo/${airlineCode}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch airline logo: ${response.status}`);
        }
        const logoUrl = await response.text();
        return logoUrl;
    } catch (error) {
        console.error("Error fetching airline logo:", error);
        return "";
    }
}