const API_KEY = "fe4da2cfc966441592655250231510";
const UNSPLASH_API_KEY = "SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo";

let target = 'Lucknow'
let temperatureField, locationField, dateandtimeField, weatherField, searchField, form;
async function embedFood(data) {
    const meal = data.dish;
    const calorie = data.calorie;
    const el = document.getElementById("dish1");
    el.getElementsByClassName("dish-name")[0].innerHTML = "Meal: " + meal;
    el.getElementsByClassName("calorie")[0].innerHTML = "Calorie: " + calorie;
    const orderel = el.getElementsByClassName("order")[0];
    orderel.setAttribute("href", `https://www.swiggy.com/search?query=${encodeURIComponent(meal)}`);
    orderel.setAttribute("target", "_blank");
    
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(meal)}&client_id=${UNSPLASH_API_KEY}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const images = data.results;
            if (images.length > 0) {
                const randomIndex = Math.floor(Math.random() * images.length);
                const imageUrl = images[randomIndex].urls.regular;
                const dishImg = document.querySelector(".dish-img");
                dishImg.setAttribute("src", imageUrl);
            } else {
                console.error("No images found for the meal name.");
            }
        })
        .catch((error) => console.error(error));

}
async function fetchResults(targetLocation) {
    if (targetLocation.length === 0) {
        targetLocation = "lucknow";
    }
    let url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${targetLocation}&aqi=no`

    var res = await fetch(url);

    var data = await res.json()

    let locationName = data.location.name
    let time = data.location.localtime

    let temp = data.current.temp_c

    let condition = data.current.condition.text
    let icon_url = data.current.condition.icon;
    let weather_code = data.current.condition.code;
    let diet_type = document.querySelector("input[type='radio'][name='diet-type']:checked").value;
    let age = document.getElementById("age").value;
    if (age.length < 1) age = 10;
    let suggestor_api_url = `https://weatheripr.prabuddhraj88.repl.co/data?age=${age}&code=${weather_code}&diet=${diet_type}`;
    res = await fetch(suggestor_api_url)
    data = await res.json()


    await embedFood(data);
    
    updateDetails(temp, locationName, time, condition, icon_url)
}

function updateDetails(temp, locationName, time, condition, weather_logo) {

    let splitDate = time.split(' ')[0]

    let splitTime = time.split(' ')[1]

    let currentDay = getDayName(new Date(splitDate).getDay())

    temperatureField.innerHTML = temp + "&deg;C"
    locationField.innerText = locationName
    dateandtimeField.innerText = `${splitDate} ${currentDay} ${splitTime}`;
    const icon = document.getElementById("logo");
    icon.setAttribute("src", weather_logo);
    icon.setAttribute("alt", condition);
    weatherField.innerText = condition;
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(condition)}&client_id=${UNSPLASH_API_KEY}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const images = data.results;
            if (images.length > 0) {
                const randomIndex = Math.floor(Math.random() * images.length);
                const imageUrl = images[randomIndex].urls.regular;
                document.getElementsByClassName("container")[0].style["background-image"] = `url(${imageUrl})`;
            } else {
                console.error("No images found for the meal name.");
            }
        })
        .catch((error) => console.error(error));
}

function searchForLocation(e) {
    e.preventDefault()

    target = searchField.value

    fetchResults(target)

}

function getDayName(number) {
    switch (number) {
        case 0:
            return 'Sunday'
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
    }
}

window.onload = () => {
    temperatureField = document.querySelector(".temp");
    locationField = document.querySelector(".time_location p");
    dateandtimeField = document.querySelector(".time_location span");
    weatherField = document.querySelector(".condition p");
    searchField = document.querySelector(".search_area");
    form = document.querySelector('form')
    form.addEventListener('submit', searchForLocation)
    window.navigator.geolocation.getCurrentPosition(async location => {
        const coords = await location.coords;
        await fetchResults(`${coords.latitude},${coords.longitude}`);
    });
}