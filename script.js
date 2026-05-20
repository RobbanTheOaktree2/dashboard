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
  if (!navigator.geolocation) {
    $("#vader-header").text("Geolocation stöds inte av den här webbläsaren.");
    return;
  }

  navigator.geolocation.getCurrentPosition(function(pos) {
    const lat = pos.coords.latitude.toFixed(6);
    const lon = pos.coords.longitude.toFixed(6);
    const url = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json`;

    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function(myData) {
        const nu = new Date();
        const timmeNu = nu.getHours();
        const datumNu = nu.toISOString().slice(0,10);
        console.log("Nuvarande timme:", timmeNu);
        console.log("myData:", myData);
        middagSteg = myData.timeSeries.filter(s => s.time.includes("T12:"));
        console.log("Middagsteg:", middagSteg);

        if(timmeNu > 12) {
          middagSteg[0] = myData.timeSeries.find(s => s.time.includes(datumNu + "T" + timmeNu.toString() + ":"));
        }

        for (let i = 0; i < 7; i++) {
          const n = i + 1;
          const d = middagSteg[i].data;

          const dagDatum = new Date();
          dagDatum.setDate(dagDatum.getDate() + i);
          const dagNamn = dagDatum.toLocaleDateString("sv-SE", { weekday: "long" });
          $("#vaderDag" + n).text(dagNamn.charAt(0).toUpperCase() + dagNamn.slice(1));
          $("#temperatur" + n).text("Temperatur: " + d.air_temperature + "°C " + symbolToEmoji[d.symbol_code]);
          $("#vind" + n).text("Vind: " + d.wind_speed + " m/s");
          $("#vindbyar" + n).text("Vindbyar: " + d.wind_speed_of_gust + " m/s");
          $("#nederbord" + n).text("Nederbörd: " + d.precipitation_amount_mean + " mm");
          $("#lufttryck" + n).text("Lufttryck: " + d.air_pressure_at_mean_sea_level + " hPa");
        }
      },
      error: function(err) {
        console.log("Fel:", err);
        $("#vader-header").text("Kunde inte hämta väderinformation.");
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
  setInterval(getCitat, 120 * 1000);
});
