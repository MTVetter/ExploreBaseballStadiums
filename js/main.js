/* Main JavaScript sheet for ExploringBaseballStadiums by Michael Vetter*/

//Add Leaflet map
function createMap(){
    //Hide panel
    $("#panel").hide();
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
    var infoPopup = L.popup({className: 'help'}).setContent("<h3>How to operate the map:</h3>" + 
    "<ul><li><p>Use <img align='middle' src='img/zoomInTest.jpg'> to zoom in</p></li>"+
    "<li><p>Use <img align='middle' src='img/zoomOutTest.jpg'> to zoom out</p></li>"+
    "<li><p>Use <img align='middle' src='img/homeTest.jpg'> to return to the inital extent of the map</p></li>"+
    "<li><p>Use <img align='middle' src='img/basemapTest.jpg'> to switch from a gray basemap to an imagery basemap</p></li>"+
    "<li><p>Clicking on <img align='middle' src='img/searchTest.jpg'> expands the search option</p></li>"+
    "<li><p>Search based on team name</p></li>"+
    "<li><p>Teams will display based on what you type.</li> <li>Example:<img align='middle' src='img/searchTypedTest.jpg'></p></li>");

    var infoLocation = [30, -98.5];
    
    //Create an info button so the user can get information about the map
    L.easyButton('<span class="fas fa-info-circle fa-lg"</span>', function(btn, map){
        infoPopup.setLatLng(infoLocation).openOn(map);
    }).addTo(map);

    $(document).click(function (){
        $("#welcomePanel").hide();
    });
};

//Function to add a search bar
function search(data, map){
    var featureLayer = L.geoJson(data,{
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: getIcon(feature.properties.Team),
                    iconSize: [45, 45]
                })
            });
        },
        onEachFeature: function (feature, layer){
            //layer.bindPopup(createPopup(feature));
            layer.on('click', function(e){
                $("#panel").show("slide");
                $("#stadium").text(feature.properties.StadiumName);
                $("#team").text(feature.properties.Team);
                $("#year").text(feature.properties.Built);
                $("#attendence").text(feature.properties.AttenanceperGame);
                $("#time").text(feature.properties.Time);
                $("#hr").text(feature.properties.HRperGame);
                $("#ticket").text(feature.properties.TicketPrice);
                document.getElementById("newPic").innerHTML = '<img class="stadiumPic" src=" ' + feature.properties.Photo + '">';
                var data = [
                    {name:'Diamondbacks', value:feature.properties.Diamondbacks},
                    {name:'Braves', value:feature.properties.Braves},
                    {name:'Orioles', value:feature.properties.Orioles},
                    {name:'Red Sox', value:feature.properties.RedSox},
                    {name:'Cubs', value:feature.properties.Cubs},
                    {name:'White Sox', value:feature.properties.WhiteSox},
                    {name:'Reds', value:feature.properties.Reds},
                    {name:'Indians', value:feature.properties.Indians},
                    {name:'Rockies', value:feature.properties.Rockies},
                    {name:'Tigers', value:feature.properties.Tigers},
                    {name:'Astros', value:feature.properties.Astros},
                    {name:'Royals', value:feature.properties.Royals},
                    {name:'Angels', value:feature.properties.Angels},
                    {name:'Dodgers', value:feature.properties.Dodgers},
                    {name:'Marlins', value:feature.properties.Marlins},
                    {name:'Brewers', value:feature.properties.Brewers},
                    {name:'Twins', value:feature.properties.Twins},
                    {name:'Mets', value:feature.properties.Mets},
                    {name:'Yankees', value:feature.properties.Yankees},
                    {name:"A's", value:feature.properties.As},
                    {name:'Phillies', value:feature.properties.Phillies},
                    {name:'Pirates', value:feature.properties.Pirates},
                    {name:'Padres', value:feature.properties.Padres},
                    {name:'Mariners', value:feature.properties.Mariners},
                    {name:'Giants', value:feature.properties.Giants},
                    {name:'Cardinals', value:feature.properties.Cardinals},
                    {name:'Rays', value:feature.properties.Rays},
                    {name:'Rangers', value:feature.properties.Rangers},
                    {name:'Blue Jays', value:feature.properties.BlueJays},
                    {name:'Nationals', value:feature.properties.Nationals}
                ];
                var container = d3.select("#graph")
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", 200)
                    .attr("class", "container");
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
                    .range([60, 120])
                    .domain([0,10]);
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
                    .text("Winning Percentage at  " + feature.properties.StadiumName);
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
                        //var area = d.value * 200;
                        return 3;
                    })
                    .attr("cx", function(d,i){
                        return x(i);
                    })
                    .attr("cy", function(d){
                        return y(d.value)
                    })
                    .on("mouseover", function(d){
                        div.transition()
                            .duration(100)
                            .style("opacity", 0.9);
                        div.html(d.name + "<br/>" + d.value)
                            .style("left", (d3.event.clientX + 10) + "px")
                            .style("top", (d3.event.clientY - 50) + "px");
                    })
                    .on("mouseout", function(d){
                        div.transition()
                            .duration(200)
                            .style("opacity", 0);
                    });
            });
        }
    }).addTo(map);

    var searchControl = new L.Control.Search(
        {layer: featureLayer,
        propertyName: 'Team',
        zoom: 15,
        textErr: 'Team does not exist',
        textPlaceholder: 'Search for Team Name...',
        marker: false,
        animate: false});
    searchControl.on('search_locationfound', function(e){
        e.layer.setStyle({fillColor: 'black', color: 'black', fillOpacity: 1});
        if (e.layer._popup)
            e.layer.openPopup();
    }).on('search_collapsed', function(e){
        featureLayer.eachLayer(function(layer){
            featureLayer.resetStyle(layer);
        });
    });
    map.addControl(searchControl);
}

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
            search(response, map);
        }
    });
};

//Close the panel after user is done looking at the information
$(".button").on("click", function(e){
    $("#panel").hide("slide");
    $("#graph").empty();
});

$(document).ready(createMap);