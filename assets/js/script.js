var response;
var layerNames = [];
// var trails={  
//     "type": "FeatureCollection",
//     "features": [{
//         "type": "Feature",
//         "geometry": {
//             "type": "Point",
//             "coordinates":  []
//         },
//         "properties": {
//             "name": "",
//             "city": "",
//             "country": "",
//             "state": "",
//             "url": "",
//             "trailLength": "",
//             "rating": "",
//             "description": "",
//             "activityType": "",
//             "directions": "",
//         }}
// ]}; // end of trails array

$(document).ready(function () {

    //function to get the search location from the trails API
    function getSearchLoc(country,state,city){
        //logging search input
        // console.log(country,state,city)
        //var to hold URL settings
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://trailapi-trailapi.p.rapidapi.com/?q[city_cont]=" + city + "&q[state_cont]=" + state + "&radius=25&q[country_cont]=&" + country + "limit=25",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
                "x-rapidapi-key": "e7756eb0e8msh0ee80a6074e6840p18c867jsna31949dd8a7d"
                }
        }
        // ajax call
        $.ajax(settings)
        .then(function(response) {

            //log response
            console.log(response)
            //global=local
            response=response;
            // var to hold response
            var array = response.places;
            //call geoJSON converter with array
            geoJSON(array)
            // flyToPark(response);
        });

    };
   
// *********** fucntion to convert response to geoJSON format, store in array, and populate sidebar
    function geoJSON(response) {
        // log data
        // console.log(response[i].lon,response[i].lat,response[i].name,response[i].city,response[i].country,response[i].state);

        // console.log(response);
    //*** for loop to get data from response 
        for (var i = 0; i < response.length; i++) {
            layerNames.push(response[i].name);
            
        //*** if else statement to deal with empty array 
            if ((response.length) !== 0){
                //var to hold park info
                
                var trails={  
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates":  []
                        },
                        "properties": {
                            "name": "",
                            "city": "",
                            "country": "",
                            "state": "",
                            "url": "",
                            "trailLength": "",
                            "rating": "",
                            "description": "",
                            "activityType1": "",
                            "activityType2": "",
                            "directions": "",
                        }}
                    ]}; // end of trails array

                // adding location data to array
                trails.features[0].geometry.coordinates = [response[i].lon,response[i].lat]
                trails.features[0].properties.name = response[i].name
                trails.features[0].properties.city = response[i].city
                trails.features[0].properties.country = response[i].country
                trails.features[0].properties.state = response[i].state
                    console.log(response[i].name);  
                    
                // if statement to deal with inconsistant response objects info
                if (response[i].activities.length > 0){
                    
                    trails.features[0].properties.url = response[i].activities[0].url;
                    trails.features[0].properties.trailLength = response[i].activities[0].length;
                    trails.features[0].properties.rating = response[i].activities[0].rating;
                    trails.features[0].properties.description = response[i].activities[0].description;
                    trails.features[0].properties.activityType1 = response[i].activities[0].activity_type_name;
                    trails.features[0].properties.directions = response[i].directions;
                    // console.log("if statement works");
                } // end of if(2)       

                // if statement to deal with inconsistant response objects activity names
                if (response[i].activities[1]) {
                     trails.features[0].properties.activityType2 = response[i].activities[1].activity_type_name + ", ";
                }// end of if (3)

                //add layers with locations
                map.addLayer({
                    "id": response[i].name,
                    "type": "symbol",
                    // Add a GeoJSON source containing place coordinates and information. 
                    "source": {
                        "type": "geojson",
                        "data": trails,
                        },
                    "layout": {
                        "icon-image": "park-15",
                        "icon-allow-overlap": true,
                        "icon-size": 2,
                        }
                }); // end of addLayer

                // console.log(trails);
                
            //*** if else statement to deal with missing coordinates
                // get coordinates of first array item
                if (response[0].lon != 0) {
                    var coordinates1 = [response[0].lon,response[0].lat]

                    //center map on first array item
                    map.flyTo({
                        center: coordinates1,
                        zoom: 9
                    })
                }
                else if (response[1].lon != 0) {
                    var coordinates2 = [response[1].lon,response[1].lat]

                    //center map on first array item
                    map.flyTo({
                        center: coordinates2,
                        zoom: 9
                    })


                }
                else {
                    console.log("bad coordinates");
                    alert("bad coordinates");
                }


            } // end of if statement (1)

                else {
                    console.log("Nothing found");
                }// end of else statement

                trails.features.forEach(function(trails, i){
                    trails.properties.id = i;
                    //  shortcut for `park.properties`,
                    var prop = trails.properties
                    // Add a new listing section to the sidebar.
                    var listings = document.getElementById('listings');
                    var listing = listings.appendChild(document.createElement('div'));
                    //   Assign a unique `id` to the listing.
                    listing.id = "listing-" + prop.name;
                    // Assign the `item` class to each listing for styling. 
                    listing.className = 'item';
                
                    // Add details to the individual listing. 
                    var details = listing.appendChild(document.createElement('h4'));
                    details.className = "search-item";
                    details.innerHTML = prop.name;
            
                    // Add the link to the individual listing created above. 
                    var link = listing.appendChild(document.createElement('a'));
                    //   link.href = '#';
                    link.className = "url";
                    $(link)
                    .attr("href", prop.url)
                    .attr("target", "_blank");
                    //   link.id = "link-" + prop.id;
                    link.text = "link";

                    var propList = listing.appendChild(document.createElement('ul'));
                    var rating = propList.appendChild(document.createElement('li'));
                    var length = propList.appendChild(document.createElement('li'));
                    var Type1 = propList.appendChild(document.createElement('li'));

                    rating.append("Rating: " + prop.rating + " ");
                    length.append("Length: " + prop.trailLength + " mi.");
                    Type1.append("Type: " + prop.activityType2 + " " +  prop.activityType1);


            }); //end of forEach function


        } //end of for loop
        

    };// end of geoJSON


// *********** mapbox api call and geocoding

    //mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoicHJhYmhkZWVwIiwiYSI6ImNrOXp3aG9mYzBmMnMzamx0eDU5ZzRxd2IifQ.wkiG09WU_O8N0tVlzlb2tA';

    //display map and style
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        //  longitude (west is negative, east is positive)
        //  latitude (north is pisitive, south is negative)      
        //  format is [lng,lat]
        center: [-121.4944,38.5816],
        zoom: 10
    });// end of map

    map.addControl(
        new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    }))

    map.on('load', function() {
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'trails', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });
        
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function() {
            map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function() {
            map.getCanvas().style.cursor = '';
        });
    });

// *********** event listeners

    //on click for search button
    $("#search-button").on("click", function (event) {
        var locationName = $(".mapboxgl-ctrl-geocoder--input").val();
        //clear search field
        $(".mapboxgl-ctrl-geocoder--input").val("");
        //console logging
        console.log(locationName.split(","))
        //clear side bar
        $("#listings").empty();
        // array to hold search input
        var locationParts = locationName.split(", ");
        //calling funtion with split search term
        getSearchLoc(locationParts[2],locationParts[1],locationParts[0]);
        var trails = {};
    });//end of on click

    //var to store element
    var input = document.getElementsByClassName(".mapboxgl-ctrl-geocoder--input");
    //on key up function to make enter key submit search terms
    document.addEventListener("keyup", function(event) {
        if(event.key === "Enter"){
            var locationName = $(".mapboxgl-ctrl-geocoder--input").val();
            //clear search field
            $(".mapboxgl-ctrl-geocoder--input").val("");
            //console logging
            console.log(locationName.split(","))
            //clear side bar
            $("#listings").empty();
            // array to hold search input
            var locationParts = locationName.split(", ");
            //calling funtion with split search term
            getSearchLoc(locationParts[2],locationParts[1],locationParts[0]);
            var trails = {};
        }

    }); //end of key up

 


    $(".search-item").on("click", function (event) {
        // var locationName = $("#search-input").val();
        // //clear search field
        // $("#search-input").val("");
        // //console logging
        // console.log(locationName.split(","))
        // //clear side bar
        // $("#listings").empty();
        // // array to hold search input
        // var locationParts = locationName.split(", ");
        // //calling funtion with split search term
        // getSearchLoc(locationParts[2],locationParts[1],locationParts[0]);
        // //calling 
        console.log("works");
  
    });//end of on.click


    var item = document.getElementsByClassName("sidebar");
    item.children.addEventListener("click", function(event) {

        console.log("item");
    });

    //event listener for search result items

        // $("button").onclick = function(){
            // var clickedListing = trails.features[this.dataPosition];
            // console.log("works");
            
            //     map.flyTo({
            //         center: clickedListing,
            //         zoom: 15
            //     });
            // var activeItem = document.getElementsByClassName('active');
            // if (activeItem[0]) {
            // activeItem[0].classList.remove('active');
            // }
            // this.parentNode.classList.add('active');


                // pop up fucntion
            // var popUps = document.getElementsByClassName('mapboxgl-popup');
            // /** Check if there is already a popup on the map and if so, remove it */
            // if (popUps[0]) popUps[0].remove();
            
            // var popup = new mapboxgl.Popup({ closeOnClick: false })
            // .setLngLat(currentFeature.geometry.coordinates)
            // .setHTML('<h3>Sweetgreen</h3>' +
            // '<h4>' + currentFeature.properties.address + '</h4>')
            // .addTo(map);
        // };



    // map.on('click', function(e) {
    // /* Determine if a feature in the "locations" layer exists at that point. */ 
    // var features = map.queryRenderedFeatures(e.point, {
    //     layers: [layerNames[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]]
    // });
    
    // /* If yes, then: */
    // if (features.length) {
    //     var clickedPoint = features[0];
        
    //     /* Fly to the point */
    //     flyToTrail(clickedPoint);
        
    //     /* Close all other popups and display popup for clicked Trail */
    //     createPopUp(clickedPoint);
        
    //     /* Highlight listing in sidebar (and remove highlight for all other listings) */
    //     var activeItem = document.getElementsByClassName('active');
    //     if (activeItem[0]) {
    //     activeItem[0].classList.remove('active');
    //     }
    //     var listing = document.getElementById('listing-' + clickedPoint.properties.id);
    //     listing.classList.add('active');
    // }
    // });

}); // end of document.ready