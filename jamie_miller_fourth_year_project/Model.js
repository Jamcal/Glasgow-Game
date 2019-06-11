"use strict";
function Model(){
    var observer, currentLat, currentLong, rounds, gamemode;
    var advanced = ["art_gallery", "bank", "bar", "bowling_alley", "cafe", "casino", "cemetery", "church",
        "city_hall", "courthouse", "gym", "jewelry_store", "library", "lodging", "meal_takeaway",
        "movie_theater", "museum", "night_club", "park", "restaurant", "train_station", "subway_station"];
    var basic = ["bank", "bar", "cafe", "cemetery", "church",
         "night_club", "jewelry_store", "library", "lodging", "meal_takeaway",
        "movie_theater", "park", "restaurant", "train_station", "subway_station"];
    // var basic = ["bowling_alley"];

    // var list = ["train_station"];
    this.setObs = function(obs){
        observer = obs;
    };

    this.getGameMode = function(){
        var x = document.getElementById("gameType");
        gamemode = x.options[x.selectedIndex].value;
        return gamemode;
    }

    this.getRounds = function(){
        var x = document.getElementById("rounds");
        rounds = x.options[x.selectedIndex].value;
        return rounds;
    }

    this.currentGameMode = function() {
        var x = window.location.hash.substring(1);
        if (x.charAt(0) === "B"){
            gamemode = "Basic"
        } else if(x.charAt(0) === "A"){
            gamemode = "Advanced"
        }
        return gamemode;
    }

    this.startingRounds = function() {

        var x = window.location.hash.substring(1);
        if (x === "Basic#3" || x === "Advanced#3"){
            rounds = 3;
        } else if (x === "Basic#5" || x === "Advanced#5"){
            rounds = 5;
        } else if (x === "Basic#10" || x === "Advanced#10"){
            rounds = 10;
        }
        return rounds;
    }


    this.getPrompt = function(){
        var list;
        if (this.currentGameMode()==="Basic"){
             list = basic;
        } else if(this.currentGameMode()==="Advanced"){
             list = advanced;
        }
        var random = Math.floor(Math.random() * list.length);

        var prompt = list[random];
        if(prompt===null){
            return;
        }
        var index = list.indexOf(prompt);
        list.splice(index, 1);

        return prompt;
    }

    this.showPrompt = function(){
        var prompt = this.getPrompt();
        if (prompt != null) {
            var word = prompt;
            if (word.indexOf("_") > -1) {
                word = word.replace(/_/g, " ");
            }
            word = word.charAt(0).toUpperCase() + word.slice(1);
            console.log(word.charAt(0));
            document.getElementById("idPrompt").innerHTML = word;
        }
        console.log("Prompt: " + prompt);
    };


    this.getLocation  = function () {
        var lat = 0,long = 0;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                lat =  position.coords.latitude;
                long = position.coords.longitude;
                observer.updateMap(lat,long);
            });
            navigator.geolocation.watchPosition(model.updatePosition);
        } else {
            window.alert('oh');
            return null;
        }
        currentLat = lat;
        currentLong = long;
        //window.alert(lat + " ? " + long);
        //return {lat : lat,  lng : long};
    };

    this.updatePosition = function(position){
        observer.updateMap(position.coords.latitude, position.coords.longitude);
        observer.drawpoint(position);
    };

    this.init = function(){
        // this.getGameMode();
    }
}
