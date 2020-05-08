

$(document).ready(function () {

    $("body").css("background-image", "url('assets/image/park.png')");

    $("#search-button").on("click", function (event) {
        var locationName = $("#search-input").val();
        console.log(locationName)


    });
});