$(document).ready(function () {

function getSearchLoc(country,state,city){

    console.log(country,state,city)

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://trailapi-trailapi.p.rapidapi.com/?q[city_cont]=" + city + "&q[state_cont]=" + state + "&radius=25&q[country_cont]=" + country + "&limit=25",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
            "x-rapidapi-key": "e7756eb0e8msh0ee80a6074e6840p18c867jsna31949dd8a7d"
            }
        }

    $.ajax(settings)
    .then(function(response) {
        console.log(response)
        response=response;

        var array = response.places;
        geoJSON(array)
        
    })

};
   //responce.places[0].lat

    function geoJSON(response) {
        // console.log(lat,lon,name,city,country,state);
        for (var i = 0; i < response.length; i++) {
           var parks={ "type": "FeatureCollection",
                        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates":  [response[i].lat,response[i].lon]
                },
                "properties": {
                    "name": response[i].name,
                    "city": response[i].city,
                    "country": response[i].country,
                    "state": response[i].state
                }
           
            }
            ]}

            map.addLayer({
                "id": i,
                "type": "symbol",
                // Add a GeoJSON source containing place coordinates and information. 
                "source": {
                    "type": "geojson",
                    "data": parks
                    },
                "layout": {
                "icon-image": "park-15",
                "icon-allow-overlap": true,
                }
            });
        }
        console.log(parks)
    };




    //mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoicHJhYmhkZWVwIiwiYSI6ImNrOXp3aG9mYzBmMnMzamx0eDU5ZzRxd2IifQ.wkiG09WU_O8N0tVlzlb2tA';
    //display map and style
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [38.5816, 10.1],
        zoom: 14
      });

    //on load fuction to populate map
    map.on('load', function (e) {

        
        // // Add the data to your map as a layer 
        // map.addLayer({
        //     "id": "locations",
        //     "type": "symbol",
        //     // Add a GeoJSON source containing place coordinates and information. 
        //     "source": {
        //         "type": "geojson",
        //         "data": parks
        //         },
        //     "layout": {
        //     "icon-image": "park-15",
        //     "icon-allow-overlap": true,
        //     }
        // });
    });

    function buildLocationList(data) {
        parks.features.forEach(function(park, i){
          /**
           * Create a shortcut for `store.properties`,
           * which will be used several times below.
          **/
          var prop = park.properties;
      
          /* Add a new listing section to the sidebar. */
          var listings = document.getElementById('listings');
          var listing = listings.appendChild(document.createElement('div'));
          /* Assign a unique `id` to the listing. */
          listing.id = "listing-" + prop.id;
          /* Assign the `item` class to each listing for styling. */
          listing.className = 'item';
      
          /* Add details to the individual listing. */
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML = prop.name;

          /* Add the link to the individual listing created above. */
          var link = listing.appendChild(document.createElement('a'));
        //   link.href = '#';
          link.className = 'title';
        //   link.id = "link-" + prop.id;
          link.innerHTML = prop.address;
        });
    };

    // function flyToPark(currentFeature) {
    //     map.flyTo({
    //         center: currentFeature.geometry.coordinates,
    //         zoom: 15
    //     });
    // };

    // function changeLocation() {
    //        //mapbox token
    //     mapboxgl.accessToken = 'pk.eyJ1IjoicHJhYmhkZWVwIiwiYSI6ImNrOXp3aG9mYzBmMnMzamx0eDU5ZzRxd2IifQ.wkiG09WU_O8N0tVlzlb2tA';
    //      //display map and style
    //     var map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/light-v10',
    //     center: [125.6, 10.1],
    //     zoom: 14
    //     });
    // }

    //on click for search button
    $("#search-button").on("click", function (event) {
        var locationName = $("#search-input").val();
        $("#search-input").val("");
        //console logging
        console.log(locationName.split(","))
        
        $("#listings").empty();
        // buildLocationList();
        
        var locationParts = locationName.split(",");
        getSearchLoc(locationParts[2].trim(),locationParts[1].trim(),locationParts[0].trim());

        // geoJSON(response);
        // flyToPark();
    });



});