/* Main JavaScript sheet for ExploringBaseballStadiums by Michael Vetter*/

//Add Leaflet map
function createMap(){
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
    var infoPopup = L.popup({className: 'help'}).setContent("<p>Click on the box next to the team names to filter the logos</p>" +
    "<select id='team-select'><option value='Angels'>Angels</option>" +
    "<option value='Astros'>Astros</option>"+"</select>" +
    "<div style='text-align: center;'>"+"<button class='search' type='button'>Search</button>"+"</div>"+
    "<p>Multiple team selection is supported</p>");
    
    //Create an info button so the user can get information about the map
    L.easyButton('<span class="fas fa-filter fa-lg"</span>', function(btn, map){
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
            var featureLayer = L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: getIcon(feature.properties.Team),
                            iconSize: [45, 45]
                        })
                    });
                },
                onEachFeature: function (feature, layer){
                    layer.bindPopup(createPopup(feature));
                    layer.on('click', function(e){
                        $("#panel").show("slide");
                        $("#stadium").text(feature.properties.StadiumName);
                        $("#team").text(feature.properties.Team);
                        $("#year").text(feature.properties.Built);
                        $("#attendence").text(feature.properties.AttenanceperGame);
                        $("#time").text(feature.properties.Time);
                        $("#hr").text(feature.properties.HRperGame);
                        $("#ticket").text(feature.properties.TicketPrice);
                        document.getElementById("newPic").innerHTML = '<img src=" ' + feature.properties.Photo + '">';
                        // var data = [
                        //     {name:feature.properties.Team, value:feature.properties.Diamondbacks}
                        // ];
                        // var container = d3.select("#graph")
                        //     .append("svg")
                        //     .attr("width", 300)
                        //     .attr("height", 200)
                        //     .attr("class", "container")
                        //     .style("background-color", "rgba(0,0,0,0.2)");
                        // var innerRect = container.append("rect")
                        //     .datum(200)
                        //     .attr("width", function(d){
                        //         return d;
                        //     })
                        //     .attr("height", function(d){
                        //         return d - 59;
                        //     })
                        //     .attr("class", "innerRect")
                        //     .attr("x", 50)
                        //     .attr("y", 50)
                        //     .style("fill", "#FFFFFF");
                        // var minWin = d3.min(data, function(d){
                        //     return d.value;
                        // });
                        // var maxWin = d3.max(data, function(d){
                        //     return d.value;
                        // });
                        // var y = d3.scaleLinear()
                        //     .range([190, 50])
                        //     .domain([0,1]);
                        // var x = d3.scaleLinear()
                        //     .range([70, 180])
                        //     .domain([0,3]);
                        // var yAxis = d3.axisLeft(y)
                        //     .scale(y);
                        // var axis = container.append("g")
                        //     .attr("class","axis")
                        //     .attr("transform", "translate(50,0)")
                        //     .call(yAxis);
                        // var title = container.append("text")
                        //     .attr("class", "title")
                        //     .attr("text-anchor", "middle")
                        //     .attr("x", 150)
                        //     .attr("y", 30)
                        //     .text("Winning Percentage");
                        // var div = d3.select("#graph")
                        //     .append("div")
                        //     .attr("class", "tooltip")
                        //     .style("opacity", 0);
                        // var circles = container.selectAll(".circles")
                        //     .data(data)
                        //     .enter()
                        //     .append("circle")
                        //     .attr("class", "circles")
                        //     .attr("id", function(d){
                        //         return d.name;
                        //     })
                        //     .attr("r", function(d){
                        //         var area = d.value * 200;
                        //         return Math.sqrt(area/Math.PI);
                        //     })
                        //     .attr("cx", function(d,i){
                        //         return x(i);
                        //     })
                        //     .attr("cy", function(d){
                        //         return y(d.value)
                        //     })
                        //     .on("mouseover", function(d){
                        //         div.transition()
                        //             .duration(200)
                        //             .style("opacity", 0.9);
                        //         div.html(d.name + "<br/>" + "<p>Winning %: " + d.value +"</p>")
                        //             .style("left", (d3.event.clientX) + "px")
                        //             .style("top", (d3.event.clientY + 420) + "px");
                        //     })
                        //     .on("mouseout", function(d){
                        //         div.transition()
                        //             .duration(200)
                        //             .style("opacity", 0);
                        //     });
                    });
                }
            });
            map.addLayer(featureLayer);
        }
    });
};

function createPopup(feature){
    //Function to create the graph in the popup
    var prop = feature.properties;
    var popup = L.popup().setContent(container);
    //var graphData = [];
    var data = [
        {name:feature.properties.Team, value:feature.properties.Diamondbacks}
    ];
    //console.log(graphData);
    var container = d3.select("#graph")
        .append("svg")
        .attr("width", 300)
        .attr("height", 200)
        .attr("class", "container")
        .style("background-color", "rgba(0,0,0,0.2)");
    var innerRect = container.append("rect")
        .datum(200)
        .attr("width", function(d){
            return d;
        })
        .attr("height", function(d){
            return d - 59;
        })
        .attr("class", "innerRect")
        .attr("x", 50)
        .attr("y", 50)
        .style("fill", "#FFFFFF");
    var minWin = d3.min(data, function(d){
        return d.value;
    });
    var maxWin = d3.max(data, function(d){
        return d.value;
    });
    var y = d3.scaleLinear()
        .range([190, 50])
        .domain([0,1]);
    var x = d3.scaleLinear()
        .range([70, 180])
        .domain([0,3]);
    var yAxis = d3.axisLeft(y)
        .scale(y);
    var axis = container.append("g")
        .attr("class","axis")
        .attr("transform", "translate(50,0)")
        .call(yAxis);
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 150)
        .attr("y", 30)
        .text("Winning Percentage");
    var div = d3.select("#graph")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    var circles = container.selectAll(".circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("id", function(d){
            return d.name;
        })
        .attr("r", function(d){
            var area = d.value * 200;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d,i){
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.value)
        })
        .on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html(d.name + "<br/>" + "<p>Winning %: " + d.value +"</p>")
                .style("left", (d3.event.clientX) + "px")
                .style("top", (d3.event.clientY + 420) + "px");
        })
        .on("mouseout", function(d){
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
};

//Hide the panel on initial loading of the application
$("#panel").hide();

//Close the panel after user is done looking at the information
$(".button").on("click", function(e){
    $("#panel").hide("slide");
});

$(document).ready(createMap);