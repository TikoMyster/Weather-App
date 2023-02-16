var ApiKey = "108a84ae96ffbc66ffaabb3ee114d403";

var searchButton = $("#search-button");
var City = $("#input")
var temp = $("#fahrenheit");

var currentCity = $("#current-city");
var Humidity = $("#humidity");
var Wind = $("#wind-speed");

var city = "";

var Search = [ ];

let WeatherDisplay = function(event) {
    event.preventDefault();
    if (Search.val().trim() !== "") {
        city = Search.val().trim();
        currentcityWeather(city);
    }
}

let loadHistory = function() {
    $("ul").empty();
    var Search = JSON.parse(localStorage.getItem("cityname"));
    if (Search !== null) {
        Search = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < Search.length; i++) {
            addList(Search[i]);
        }
        city = Search[i - 1];
        currentcityWeather(city);
    }
}

let currentcityWeather = function(city) {
    var ApiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + ApiKey + "&units=imperial";
    $.ajax({
        url: ApiURL,
        method: "GET",
    }).then(function (response){
        console.log(response);
        var icon = response.weather[0].icon;
        var IconURL = "https://openweathermap.org/img/wn/" + icon + "@3x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        $(currentCity).html(response.name + " " + "(" + date + ")" + "<img src=" + IconURL + ">");
        var mainTemp = response.main.temp;

        $(temp).html(" " + (mainTemp).toFixed(2) + " &#8457");
        $(Humidity).html("" + response.main.humidity + "%");
        var Speed = response.wind.speed;
        $(Wind).html("" + Speed + "" + "mph");

        forecast(response.id);
        if (response.cod == 200) {
            Search = JSON.parse(localStorage.getItem("cityname"));
            console.log(Search);

            if (Search == null) {
                Search = [];
                Search.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(Search));
                addList(city);
            }
            else {
                if (find(city) > 0) {
                    localStorage.setItem("cityname", JSON.stringify(Search));
                    addList(city);
                }
            }
        }
    });
}

let futureForecast = function(cityId) {
    var futureURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + ApiKey + "&units=imperial";
    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function (response) {
        for (i = 0; i < 6; i++) {
            var day = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var IconURL = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            var futureTemp = response.list[((i + 1) * 8) - 1].main.temp;

            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;
            var windSpeed = response.list[((i + 1) * 8) - 1].wind.speed;

            $("#Date" + i).html(day);
            $("#Img" + i).html("<img src=" + IconURL + ">");
            $("#Temp" + i).html(" " + futureTemp + " &#8457");
            $("#Humidity" + i).html(" " + humidity + "%");
            $("#Wind" + i).html(" " + windSpeed + " MPH");
        }
    });
}

let addList = function(c) {
    var  ListElement = $("<li>" + c.toUpperCase() + "</li>");
    $(ListElement).attr("class", "list-group-item");
    $(ListElement).attr("data-value", c.toUpperCase());
    $(".list-group").append(ListElement);
}

let searchHistory = function(event) {
    var ListEl = event.target;
    if (event.target.matches("li")) {
        city = ListEl.textContent.trim();
        currentcityWeather(city);
    }
}

$("#search-button").on("click", WeatherDisplay);
$(document).on("click", searchHistory);
$(window).on("load", loadHistory);