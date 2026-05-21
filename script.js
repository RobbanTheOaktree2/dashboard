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
      $("#författare").text("- " + data.author); // Hämtar och visar citat och författare
    },

    error: function() {
      $("#citat-text").text("Kunde inte hämta citat"); //felmeddelande om det inte går att hämta citat
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
  }); // Hämtar och formaterar datumet på svenska

  const tid = nu.toLocaleTimeString("sv-SE"); // Hämtar tiden på svenska

  $("#datumtid").text(datum + " • " + tid);
}

function getVader() {
  // Hämta position
  navigator.geolocation.getCurrentPosition(

    function(pos) {

      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6); // Hämtar användarens latitud och longitud


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

          let middagSteg = myData.timeSeries.filter(
            s => s.time.includes("T12:") //Letar upp alla timeseries från kl 12
          );

          if (timmeNu > 12) {

            middagSteg[0] = myData.timeSeries.find(
              s => s.time.includes(
                datumNu + "T" + timmeNu.toString() + ":"
              )
            ); // Ser till att den första dagen i väderprognosen är den som gäller för kl 12 idag, 
            // om det redan är efter kl 12.
          }

          for (let i = 0; i < 7; i++) { // Loopar igenom de 7 första dagarna i väderprognosen

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
            ); // Lägger in dagens namn i väderprognosen

            $("#temperatur" + n).text(
              "Temperatur: " +
              d.air_temperature +
              "°C " +
              symbolToEmoji[d.symbol_code]
            ); // Lägger in temperatur och vädersymbol i väderprognosen

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
          // Felmeddelande om det inte går att hämta väderinformation
        }
      });
    },

    function(error) {
      console.log("Geolocation-fel:", error);
        $("#vader-header").text(
          "Du måste tillåta platsåtkomst för att se vädret."
        );
        // Felmeddelande om det inte går att hämta position
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

  //Uppdaterar datum och tid varje sekund, väder varje 10 minuter och citat varje 2 minuter
});