const symbolToEmoji = {
  1:  "☀️",   // Klar himmel
  2:  "🌤️",  // Lätt molnigt
  3:  "⛅",   // Halvklart
  4:  "🌥️",  // Molnigt
  5:  "☁️",   // Mulet
  6:  "☁️",   // Helt mulet
  7:  "🌫️",  // Dimma
  8:  "🌦️",  // Lätt regnskur
  9:  "🌦️",  // Måttlig regnskur
  10: "🌧️",  // Kraftig regnskur
  11: "⛈️",  // Åska
  12: "🌨️",  // Lätt snöblandat regn
  13: "🌨️",  // Måttligt snöblandat regn
  14: "🌨️",  // Kraftigt snöblandat regn
  15: "🌨️",  // Lätt snöfall
  16: "❄️",   // Måttligt snöfall
  17: "❄️",   // Kraftigt snöfall
  18: "🌧️",  // Lätt regn
  19: "🌧️",  // Måttligt regn
  20: "🌧️",  // Kraftigt regn
  21: "⛈️",  // Åska med lätt regn
  22: "⛈️",  // Åska med måttligt regn
  23: "⛈️",  // Åska med kraftigt regn
  24: "🌨️",  // Åska med snöblandat regn
  25: "❄️",   // Åska med snöfall
  26: "🌨️",  // Åska med snöfall
  27: "⛈️",  // Åska med kraftig nederbörd
};

function getCitat() {
    $.ajax({
        url: "https://dummyjson.com/quotes/random",
        method: "GET",
        success: function(data) {
            $("#citat-text").text(data.quote);
            $("#författare").text("- " + data.author);
        },
        error: function() {
            $("#citat-text").text("Kunde inte hämta citat");
        }
    });
}

function uppdateradatum() {
    const nu = new Date();

    const datum = nu.toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const tid = nu.toLocaleTimeString("sv-SE");

    $("#datumtid").text(datum + " • " + tid);
}

function getVader() {
  navigator.geolocation.getCurrentPosition(function(pos) {
    if(!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    const lat = pos.coords.latitude.toFixed(6);
    const lon = pos.coords.longitude.toFixed(6);

    const url = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json`;

    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function(myData) {

        console.log("Väderdata:", myData);
        const firstStep = myData.timeSeries[0];
        const temp = firstStep.data.air_temperature;
        const vind = firstStep.data.wind_speed;
        const symbol = firstStep.data.symbol_code;
        const vindbyar = firstStep.data.wind_speed_of_gust;
        const nederbord = firstStep.data.precipitation_amount_mean;
        const lufttryck = firstStep.data.air_pressure_at_mean_sea_level;

        $("#temperatur").text("Temperatur: " + temp + " " + symbolToEmoji[symbol]);
        $("#vind").text("Vind: " + vind);
        $("#vindbyar").text("Vindbyar: " + vindbyar);
        $("#nederbord").text("Nederbörd: " + nederbord);
        $("#lufttryck").text("Lufttryck: " + lufttryck);
      },
      error: function(err) {
        console.log("Fel:", err);
      }
    });
  });
}

$(document).ready(function() {
    getCitat();
    uppdateradatum();
    getVader();

    setInterval(uppdateradatum, 1000);
    setInterval(getVader, 10 * 60 * 1000); 
});
