    //background image
    //$("body").css("background-image", "url('assets/image/park.png')");

$(document).ready(function () {
    //mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoicHJhYmhkZWVwIiwiYSI6ImNrOXp3aG9mYzBmMnMzamx0eDU5ZzRxd2IifQ.wkiG09WU_O8N0tVlzlb2tA';
    //display map and style
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-77.034084, 38.909671],
        zoom: 14
      });

    //array of park object
    var parks = {
        "type": "FeatureCollection",
        "features": 
        [
        { 
            "type": "Feature",
            "geometry": 
            {
              "type": "Point",
              "coordinates": [
                -77.034084142948,
                38.909671288923]
            },
            "properties": 
            {
              "phoneFormatted": "(202) 234-7336",
              "phone": "2022347336",
              "address": "1471 P St NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at 15th St NW",
              "postalCode": "20005",
              "state": "D.C."
            }
        },
        {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [125.6, 10.1]
            },
            "properties": {
              "name": "Dinagat Islands"
            }
          }
        ]
        };

        //on load fuction to populate map
        map.on('load', function (e) {
            // Add the data to your map as a layer 
            map.addLayer({
              "id": "locations",
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
          });

    //for eah function for obj id
    // parks.features.forEach(function(park, i){
    //     park.properties.id = i;
    //   });

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
      
          /* Add the link to the individual listing created above. */
          var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = "link-" + prop.id;
          link.innerHTML = prop.address;
      
          /* Add details to the individual listing. */
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML = prop.name;
          
          if (prop.phone) {
            details.innerHTML += ' · ' + prop.phoneFormatted;
          }
        });
      }




    //on click for search button
    $("#search-button").on("click", function (event) {
        var locationName = $("#search-input").val();
        $("#search-input").val("");
        //console logging
        console.log(locationName)
        // parks.push(locationName);
        buildLocationList();

    });



});