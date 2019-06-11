"use strict";
function View() {


    var map, pos, infoWindow, curLocMark, markers=[], curLoc = {lat:0, lng:0};
    var Glasgow = {lat: 55.86115196314761, lng: -4.243533611297608};        //Coords for Livingstone Tower, for testing purposes.
    var places = [];
    var distance = [];
    var closest = [];
    var placeNames = [];

    this.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 15
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos =
                    {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                curLocMark = new google.maps.Marker({
                    map: map, position: pos
                });
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    };

    this.performSearch = function(){
        var prompt = document.getElementById("idPrompt").innerHTML;
        var rad;
        if (prompt.indexOf(" ") > -1){
            prompt = prompt.replace(/ /g, "_");
        }
        prompt = prompt.charAt(0).toLowerCase() + prompt.slice(1);
        if (prompt==="cafe" || prompt==="restaurant" || prompt==="bar" || prompt==="meal_takeaway"){
            rad = 500;
        } else{
            rad = 1000;
        }
        var request = {
            location: pos,
            radius: rad,
            types: [prompt]
        };
        var service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);

    };

    function callback(results, status, pagetoken) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                // view.createMarker(results[i]);
                view.addToClosest(results[i]);
            }
            if (pagetoken.hasNextPage) {
                pagetoken.nextPage();
            } else {
                view.sortClosest();
                var closestPlace = closest[0];
                var index = distance.indexOf(closestPlace);
                var close = places[index];
                var closeName = placeNames[index];
                view.createMarker(close, closeName)
            }



        }else{
            window.alert("No objective nearby.");
            controller.addPoints(1000);
        }
    }

    this.addToClosest = function(place){
        var placeLoc = place.geometry.location;
        var d = this.getDistance(pos,placeLoc);
        d = d.toFixed(0);
        distance.push(d);
        places.push(placeLoc);
        placeNames.push(place.name);
    };

    this.sortClosest = function(){
        closest = distance.slice().sort(function (a, b) { return a - b });
    };


    this.createMarker = function(place, placeName) {
        var placeLoc = place;
        //getting closest location
        var distance = this.getDistance(pos, placeLoc).toFixed(0);
        console.log("Distance: " + distance);
        controller.addPoints(distance);
        var marker = new google.maps.Marker({
            map: map,
            position: placeLoc
        });

        markers.push(marker);
        window.alert("Closest: " + placeName + ". Distance: " + distance + " meters.");

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(placeName);
            infoWindow.open(map, this);
        });
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Haversine formula - - - - Not my work! Credit goes to https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    var rad = function(x) {
        return x * Math.PI / 180;
    };

    this.getDistance = function(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meters
        var dLat = rad(p2.lat() - p1.lat);
        var dLong = rad(p2.lng() - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meters
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // Removes the markers from the map, but keeps them in the array.
   this.clearMarkers = function() {
        this.setMapOnAll(null);
    };

    // Deletes all markers in the array by removing references to them.
    this.deleteMarkers = function () {
        this.clearMarkers();
        markers.length = 0;
        places.length = 0;
        distance.length = 0;
        closest.length = 0;
        placeNames.length = 0;
    };

    // Sets the map on all markers in the array.
   this.setMapOnAll = function(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    };
    // Shows any markers currently in the array.
    this.showMarkers = function() {
        this.setMapOnAll(map);
    };

    this.drawPoint = function(lat, long){
        curLocMark = new google.maps.Marker({
            map: map,
            position: {lat : lat, lng : long}
        });
    };

    this.centerMap = function(location){
        curLoc.lat = location.lat;
        curLoc.lng = location.lng;
        map.setCenter(location);
        map.setZoom(16);
    };

    this.showOptions = function(){
        document.getElementById("playPopup").style.display = "block";
        document.getElementById("PlayButton").style.display = "none";
        document.getElementById("InfoButton").style.display = "none";
    };

    this.hideOptions = function(){
        document.getElementById("playPopup").style.display = "none";
        document.getElementById("PlayButton").style.display = "block";
        document.getElementById("InfoButton").style.display = "block";
    };

    this.showInfo = function(){
        document.getElementById("info").style.display = "block";
        document.getElementById("PlayButton").style.display = "none";
        document.getElementById("InfoButton").style.display = "none";
    };

    this.hideInfo = function(){
        document.getElementById("info").style.display = "none";
        document.getElementById("PlayButton").style.display = "block";
        document.getElementById("InfoButton").style.display = "block";
    };


    //Mark Dunlop's Menu Code//
    this.addMouseAndTouchUp = function (elementID, handler) {
        //window.alert("adding to :" + elementID)
        //utility function to add both mouseup and touchend events and prevent double events
        var element = document.getElementById(elementID),
            f = function (e) {
                e.preventDefault();//stops mobile browsers faking the mouse events after touch events
                handler(e);
                return false;
            };
        element.addEventListener("mouseup", f, false);
        element.addEventListener("touchend", f, false);
    };

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);

        window.addEventListener("load", this.initMap);
    }

    this.init = function(){
        this.addMouseAndTouchUp("ReturnToMenu", this.returnToMenu());
        this.addMouseAndTouchUp("Select", this.select());
        this.addMouseAndTouchUp("PlayButton", this.showOptions());
        this.addMouseAndTouchUp("closeOptions", this.hideOptions());
    }
}