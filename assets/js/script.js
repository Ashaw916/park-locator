



$(document).ready(function () {
    //background image
    $("body").css("background-image", "url('assets/image/park.png')");

    //on click for search button
    $("#search-button").on("click", function (event) {
        var locationName = $("#search-input").val();
        //console logging
        console.log(locationName)


    });
});