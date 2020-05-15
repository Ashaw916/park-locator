var response;
var parksProp = [];
$(document).ready(function () {

    //function to get the search location from the trails API
    function getSearchLoc(country,state,city){
        //logging search input
        console.log(country,state,city)
        //var to hold URL settings
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://trailapi-trailapi.p.rapidapi.com/?q[city_cont]=" + city + "&q[state_cont]=" + state + "&radius=25&q[country_cont]=united states&limit=25",
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
            flyToPark(response);
        });

    };
   
    // fucntion to convert response to geoJSON format
    function geoJSON(response) {
        // log data
        // console.log(response[i].lon,response[i].lat,response[i].name,response[i].city,response[i].country,response[i].state);

        console.log(response);
        //for loop to get data from response 
        for (var i = 0; i < response.length; i++) {
            //if else statement to deal with empty array 
            if ((response.length) !== 0){
                //var to hold park info
                var parks={  
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates":  [response[i].lon,response[i].lat]
                        },
                        "properties": {
                            "name": response[i].name,
                            "city": response[i].city,
                            "country": response[i].country,
                            "state": response[i].state,
                            "url": "",
                            "length": "",
                            "rating": "",
                            "description": "",
                            "activityType": "",
                            "directions": "",
                        }}
                    ]}; // end of parks array

                            var parksObj = {};
                            if (response[i].activities.length > 0){
                               
                                parks.features[0].properties.url = response[i].activities[0].url;
                                parks.features[0].properties.length = response[i].activities[0].attribs.length
                                parks.features[0].properties.rating = response[i].activities[0].rating
                                parks.features[0].properties.description = response[i].activities[0].description
                                parks.features[0].properties.activityType = response[i].activities[0].activity_type_name
                                parks.features[0].properties.directions = response[i].directions 
                               
                                
                                parksObj.length = response[i].activities[0].attribs.length

                                console.log("if statement works");
                           }

                           
                            //"url": response[i].activities[0].url
                            // "length": response[i].activities[0].attribs.["\"length\""]
                            // "rating": response[i].activities[0].rating
                            //"description": response[i].activities[0].description
                            //"activity-type": response[i].activities[0].activity_type_name
                            //"directions": response[i].directions                  
                           parksProp.push(parksObj);

                //add layer with locations
                map.addLayer({
                    "id": response[i].name,
                    "type": "symbol",
                    // Add a GeoJSON source containing place coordinates and information. 
                    "source": {
                        "type": "geojson",
                        "data": parks,
                        },
                    "layout": {
                        "icon-image": "park-15",
                        "icon-allow-overlap": true,
                        "icon-size": 2,
                        }
                }); // end of addLayer

                console.log(parks)



                    var coordinates = [response[0].lon,response[0].lat]
                
                    map.flyTo({
                        center: coordinates,
                        zoom: 9
                    });

            } // end of if statement
            else {
                console.log("Nothing found");
            }// end of else statement

            parksProp.forEach(function(parks, i){
                //  shortcut for `park.properties`,
            
                // Add a new listing section to the sidebar.
                var listings = document.getElementById('listings');
                var listing = listings.appendChild(document.createElement('div'));
                //   Assign a unique `id` to the listing.
                listing.id = "listing-" + parks.name;
                // Assign the `item` class to each listing for styling. 
                listing.className = 'item';
            
                // Add details to the individual listing. 
                var details = listing.appendChild(document.createElement('div'));
                details.innerHTML = parks.name;
        
                // Add the link to the individual listing created above. 
                var link = listing.appendChild(document.createElement('a'));
                //   link.href = '#';
                link.className = parks.url;
                //   link.id = "link-" + prop.id;
                link.innerHTML = parks.address;
    
                // add code to expand displayed info
    
    
    
            }); //end of forEach function

        } //end of for loop


        
    };// end of geoJSON

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
      });

    //on load fuction to populate map
    map.on('load', function (e) {

    });


    // function buildLocationList(parks) {
    //     parks.features.forEach(function(parks, i){
    //       //*
    //        * Create a shortcut for `park.properties`,
    //        * which will be used several times below.
    //       *
    //       var prop = parks.properties;
      
    //       // Add a new listing section to the sidebar. 
    //       var listings = document.getElementById('listings');
    //       var listing = listings.appendChild(document.createElement('div'));
    //       // Assign a unique `id` to the listing. 
    //       listing.id = "listing-" + prop.name;
    //       // Assign the `item` class to each listing for styling. 
    //       listing.className = 'item';
      
    //       // Add details to the individual listing. 
    //       var details = listing.appendChild(document.createElement('div'));
    //       details.innerHTML = prop.name;

    //       // Add the link to the individual listing created above. 
    //       var link = listing.appendChild(document.createElement('a'));
    //     //   link.href = '#';
    //       link.className = 'title';
    //     //   link.id = "link-" + prop.id;
    //       link.innerHTML = prop.address;
    //     });
    //     //logging variables
    //     console.log("buildLocationList" + prop,listings,listing,details);
    // };

        function flyToPark(response) {
            console.log(response);
            map.flyTo({
                center: response.places[0].coordinates,
                zoom: 9
            });
        };


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
        //clear search field
        $("#search-input").val("");
        //console logging
        console.log(locationName.split(","))
        //clear side bar
        $("#listings").empty();
        // array to hold search input
        var locationParts = locationName.split(",");
        //calling funtion with split search term
        getSearchLoc(locationParts[2],locationParts[1],locationParts[0]);
        //calling 
        
  
    });



});