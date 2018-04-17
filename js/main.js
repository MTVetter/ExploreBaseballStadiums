/* Main JavaScript sheet for ExploringBaseballStadiums by Michael Vetter*/

//Add Leaflet map
function createMap(){
    //Hide the panel div until a point is clicked
    // $('#panel').hide();

    //Set up the initial location of the map
    var initialLocation = [40, -98.5];

    //Set up the initial zoom of the map
    var initialZoom = 5;

    //create the map
    var map = L.map("map",{zoomControl: false}).setView(initialLocation, initialZoom);

    //Add the home button with the zoom in and zoom out buttons
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

    //call getData function
    getData(map);

    //add CartoDB base tilelayer
    var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.jpg', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd'
    }).addTo(map);

    //Add ESRI base tilelayer
    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    //Create the base maps
    var baseLayers = {
        "Grayscale": CartoDB_Positron,
        "Imagery": esri
    };

    //Add the base maps to the map so the user can decide
    L.control.layers(baseLayers).addTo(map);

    //Create a popup for the info button
    var infoPopup = L.popup({className: 'help'}).setContent("<p>Use the home button to return the initial extent of the map</p>" +
    "<p>In the upper right hand corner, you can change the type of basemap being displayed</p>" +
    "<p>Click on the arrow buttons to display the number of deposits for different years</p>" +
    "<p>Source: https://www.kaggle.com/chasebank/bank-deposits/data</p>" +
    "<p><a href='data/ChaseDeposits.csv' download>Click to download data source</a></p>");
    
    //Create an info button so the user can get information about the map
    L.easyButton('<span class="fas fa-info fa-lg"</span>', function(btn, map){
        infoPopup.setLatLng(map.getCenter()).openOn(map);
    }).addTo(map);

};

//Function to determine the appropriate icon
function getIcon(team){
    if (team == "Diamondbacks"){
        return 'img/diamondbacks.jpg';
    } else if (team == "Braves"){
        return 'img/braves.jpg';
    } else if (team == "Orioles"){
        return 'img/orioles.jpg';
    } else if (team == "Red Sox"){
        return 'img/redsox.jpg';
    } else if (team == "Cubs"){
        return 'img/cubs.jpg';
    } else if (team == "White Sox"){
        return 'img/whitesox.jpg';
    } else if (team == "Reds"){
        return 'img/reds.jpg';
    } else if (team == "Indians"){
        return 'img/indians.jpg';
    } else if (team == "Rockies"){
        return 'img/rockies.jpg';
    } else if (team == "Tigers"){
        return 'img/tigers.jpg';
    } else if (team == "Astros"){
        return 'img/astros.jpg';
    }else if (team == "Royals"){
        return 'img/royals.jpg';
    } else if (team == "Angels"){
        return 'img/angels.jpg';
    } else if (team == "Dodgers"){
        return 'img/dodgers.jpg';
    } else if (team == "Marlins"){
        return 'img/marlins.jpg';
    } else if (team == "Brewers"){
        return 'img/brewers.jpg';
    } else if (team == "Twins"){
        return 'img/twins.jpg';
    } else if (team == "Mets"){
        return 'img/mets.jpg';
    } else if (team == "Yankees"){
        return 'img/yankees.jpg';
    } else if (team == "As"){
        return 'img/as.jpg';
    } else if (team == "Phillies"){
        return 'img/phillies.jpg';
    } else if (team == "Pirates"){
        return 'img/pirates.jpg';
    } else if (team == "Padres"){
        return 'img/padres.jpg';
    } else if (team == "Mariners"){
        return 'img/mariners.jpg';
    } else if (team == "Giants"){
        return 'img/giants.jpg';
    } else if (team == "Cardinals"){
        return 'img/cardinals.jpg';
    } else if (team == "Rays"){
        return 'img/rays.jpg';
    } else if (team == "Rangers"){
        return 'img/rangers.jpg';
    } else if (team == "Blue Jays"){
        return 'img/bluejays.jpg';
    } else {
        return 'img/nationals.jpg';
    }
};


//function to get the points
function getData(map){
    //Load the data through AJAX
    $.ajax("data/stadiums.geojson", {
        dataType: "json",
        success: function(response){
            //Create a Leaflet GeoJSON layer and add to map
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: getIcon(feature.properties.Team),
                            iconSize: [45, 45]
                        })
                    });
                },
                onEachFeature: function (feature, layer){
                    layer.on('click', function(e){
                        document.getElementById("stadium").innerHTML = feature.properties.StadiumName;
                        document.getElementById("team").innerHTML = feature.properties.Team;
                        document.getElementById("year").innerHTML = feature.properties.Built;
                        document.getElementById("attendence").innerHTML = feature.properties.AttenanceperGame;
                        document.getElementById("time").innerHTML = feature.properties.Time;
                        document.getElementById("hr").innerHTML = feature.properties.HRperGame;
                        document.getElementById("ticket").innerHTML = feature.properties.TicketPrice;
                        document.getElementById("pic").innerHTML = '<img src=" ' + feature.properties.Photo + '">';
                        var div = $('<div class="graph" style="width: 200px; height: 200px;"><svg/></div>')[0];
                        var svg = d3.select(div)
                            .select("svg")
                            .attr("width", 200)
                            .attr("height", 200);
                        svg.append("rect")
                            .attr("width", 150)
                            .attr("height", 150)
                            .style("fill", "lightBlue");
                    });
                }
            }).addTo(map);
        }
    });
};

$(document).ready(createMap);