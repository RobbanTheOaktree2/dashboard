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

    console.log("Datum och tid uppdaterade: " + datum + " " + tid);
}

$(document).ready(function() {
    getCitat();
    uppdateradatum();

    setInterval(uppdateradatum, 1000);
});
