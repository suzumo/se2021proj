/**
 * Created by Jiyong on 18-Sep-16.
 */
    //testing: pin from JSON object
    // below function is hack job to access the populated NYT articles, which is now stored in response
var pinBuilder = new Cesium.PinBuilder();

// function to translate from location name to longitude and latitude
function getLocationFromBingAPI(location, name, next) {

    $.getJSON('http://dev.virtualearth.net/REST/v1/Locations?q='+name+'&key=AoFgEWwWs5F5jvzub_gTZzRfF0DLFUNj-2hoS2xIsM-RlGZ33SAEXTdN7vxaEmX4&jsonp=?', function(result) {
        location.push(result.resourceSets["0"].resources["0"].point.coordinates["1"]); // longitude
        location.push(result.resourceSets["0"].resources["0"].point.coordinates["0"]); // latitude
        next()
    });
};
// second loop to put pins on map

function getLocationsFromBingAPI(response, i, next) {
    if (i == 10) {
        next(response);
        return;
    }
    coord[i] = [];
    var j = i.toString();
    var k = (response[j].geo_facet.length -1).toString();
    getLocationFromBingAPI(coord[i], response[j].geo_facet[k], function () {
        getLocationsFromBingAPI(response, i + 1, next);
    });
}
var coord = []; // this will hold all the coordinates (longitude,latitude) of the articles in 2D array
var pin = []; // store all pins in this array

function populateSidebar (response) {
    getLocationsFromBingAPI(response, 0, function(response) {
        viewer.entities.removeAll();
        for (i = 0; i < 10; i++) {
            var j = i.toString();
            pin[i] = viewer.entities.add({
                name: "New York Times",
                position: Cesium.Cartesian3.fromDegrees(coord[i][0], coord[i][1]),
                billboard: {
                    image: pinBuilder.fromText((i+1).toString(), colors[i], 48).toDataURL(),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                id: i,
                description: '<iframe src='+response[j].url+' height=98% width=100% value=\"' +i+ '\"> </iframe>',
                //description: '<embed src=\"'+response[j].short_url+'\"></embed>',
                outline : true
            });

            // populate accordion menu
            var newstitle = '<img src=\"img\/' +(i+1)+ '.png\" class=\"article-numbers\" alt=\"' +(i+1)+ '\">' + response[j].title;
            var newsabstract = "";
            if (response[j].multimedia.length != 0) {
                newsabstract += '<img src=\"'+response[j].multimedia["0"].url+'\" align=\"right\" style=\"padding-left: 5px\">';
            }
            newsabstract += response[j].abstract;
            newsabstract += '<a class=\"btn btn-link btn-sm read-more\" id=\"readmore' + i +'\" title="Click to read more">' +
                '<span class=\"glyphicon glyphicon-new-window\" aria-hidden=\"true\"></span></a>';
            $("#news"+i+"title").html(newstitle);
            $("#news"+i+"abstract").html(newsabstract);

            var k = (response[j].geo_facet.length -1).toString();
            console.log("complete "+i+" news located at "+response[j].geo_facet[k]);
            console.log("The title of article " +i+ " is: " +response[i].title);
            console.log("location of news " +i+": " + coord[i][0]+ " "+coord[i][1]);
        }
        $('#testSidebar').css("opacity",1);
    });
}
// first loop to find coordinates for the articles first
getFromNYT(populateSidebar);

var iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0];
iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms'); 
var colors = [ Cesium.Color.RED,
               Cesium.Color.DARKORANGE,
               Cesium.Color.GOLD,
               Cesium.Color.GREENYELLOW,
               Cesium.Color.DARKTURQUOISE,
               Cesium.Color.DEEPSKYBLUE,
               Cesium.Color.INDIGO,
               Cesium.Color.MEDIUMORCHID,
               Cesium.Color.HOTPINK,
               Cesium.Color.GREY
];

// testing function to see if everything is working as expected -- prints in browser console
setTimeout(function() {
//    console.log(response); // print out the results from NYT in browser console
    console.log(coord); // print out the results of all the coordinates
    console.log(pin);
    populateEarthquakes();
}, 5000);

$(function () {

});