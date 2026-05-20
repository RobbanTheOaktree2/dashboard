const symbolToEmoji = {
  1:  "☀️",
  2:  "🌤️",
  3:  "⛅",
  4:  "🌥️",
  5:  "☁️",
  6:  "☁️",
  7:  "🌫️",
  8:  "🌦️",
  9:  "🌦️",
  10: "🌧️",
  11: "⛈️",
  12: "🌨️",
  13: "🌨️",
  14: "🌨️",
  15: "🌨️",
  16: "❄️",
  17: "❄️",
  18: "🌧️",
  19: "🌧️",
  20: "🌧️",
  21: "⛈️",
  22: "⛈️",
  23: "⛈️",
  24: "🌨️",
  25: "❄️",
  26: "🌨️",
  27: "⛈️",
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

  console.log("Hej");

  // Kontrollera om geolocation finns
  if (!navigator.geolocation) {
    $("#vader-header").text(
      "Geolocation stöds inte av den här webbläsaren."
    );
    return;
  }

  // Hämta position
  navigator.geolocation.getCurrentPosition(

    // SUCCESS CALLBACK
    function(pos) {

      console.log("Position tillåten");

      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);

      console.log("Lat:", lat);
      console.log("Lon:", lon);

      const url =
        `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json`;

      $.ajax({
        url: url,
        method: "GET",
        dataType: "json",

        success: function(myData) {

          const nu = new Date();
          const timmeNu = nu.getHours();
          const datumNu = nu.toISOString().slice(0, 10);

          console.log("Nuvarande timme:", timmeNu);
          console.log("myData:", myData);

          let middagSteg = myData.timeSeries.filter(
            s => s.time.includes("T12:")
          );

          console.log("Middagsteg:", middagSteg);

          if (timmeNu > 12) {

            middagSteg[0] = myData.timeSeries.find(
              s => s.time.includes(
                datumNu + "T" + timmeNu.toString() + ":"
              )
            );
          }

          for (let i = 0; i < 7; i++) {

            const n = i + 1;
            const d = middagSteg[i].data;

            const dagDatum = new Date();
            dagDatum.setDate(dagDatum.getDate() + i);

            const dagNamn = dagDatum.toLocaleDateString(
              "sv-SE",
              { weekday: "long" }
            );

            $("#vaderDag" + n).text(
              dagNamn.charAt(0).toUpperCase() +
              dagNamn.slice(1)
            );

            $("#temperatur" + n).text(
              "Temperatur: " +
              d.air_temperature +
              "°C " +
              symbolToEmoji[d.symbol_code]
            );

            $("#vind" + n).text(
              "Vind: " +
              d.wind_speed +
              " m/s"
            );

            $("#vindbyar" + n).text(
              "Vindbyar: " +
              d.wind_speed_of_gust +
              " m/s"
            );

            $("#nederbord" + n).text(
              "Nederbörd: " +
              d.precipitation_amount_mean +
              " mm"
            );

            $("#lufttryck" + n).text(
              "Lufttryck: " +
              d.air_pressure_at_mean_sea_level +
              " hPa"
            );
          }
        },

        error: function(err) {
          console.log("Fel vid hämtning av väder:", err);

          $("#vader-header").text(
            "Kunde inte hämta väderinformation."
          );
        }
      });
    },

    function(error) {
      console.log("Geolocation-fel:", error);
        $("#vader-header").text(
          "Du måste tillåta platsåtkomst för att se vädret."
        );
    }
  );
}

$(document).ready(function() {

  getCitat();
  uppdateradatum();
  getVader();

  setInterval(uppdateradatum, 1000);

  setInterval(getVader, 10 * 60 * 1000);

  setInterval(getCitat, 120 * 1000);
});