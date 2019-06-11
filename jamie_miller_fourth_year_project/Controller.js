"use strict";
var model = new Model();
var view = new View();
function Controller(){
    var count = 0, inProgress  = false, points = 0;
    this.updateMap = function(lat,long){
        view.centerMap({lat:lat, lng:long});
    };

    this.drawpoint = function(position){
        view.drawPoint(position.coords.latitude, position.coords.longitude);
    };

    this.showOptions = function () {
        view.showOptions();
    };

    this.returnToMenu = function(){
        if(count===model.startingRounds()){
            this.finalScore();
            document.getElementById("map").style.display = "none";
            document.getElementById("end").style.display = "block";
            document.getElementById("Select").style.display = "none";
            document.getElementById("ReturnToMenu").style.display = "none";
        }
        else{
            if (confirm("Return to menu?")){
                window.location.href = 'https://devweb2018.cis.strath.ac.uk/~njb15178/glasgow_game/';
            }
        }
    };
    this.return = function(){
        window.location.href = 'https://devweb2018.cis.strath.ac.uk/~njb15178/glasgow_game/';
    };
    this.goToLogin = function(){
        window.location.href = 'https://devweb2018.cis.strath.ac.uk/~njb15178/glasgow_game/login.php';
    };
    this.addPoints = function(distance){
        var d = parseInt(distance);
        points = points + d;
        console.log("Points: " + points);
        document.getElementById("idScore").innerText = points;
    };

    this.select = function(){
        if (count === model.startingRounds()){
            document.getElementById("Select").disabled = true;
            document.getElementById("ReturnToMenu").value = "Finish";
        }
        if (inProgress === true) {
            view.performSearch();
        }
        if (document.getElementById("Select").value === "Begin") {
            document.getElementById("Select").value = "Select";
            inProgress = true;
        }
        view.deleteMarkers();
        model.showPrompt();


        if (count === model.startingRounds()) {

            document.getElementById("idPrompt").innerHTML = "Game over!";
            return;
        }
        document.getElementById("idRounds").innerHTML = "Round " + (count + 1);
        count++;



    };

    this.finalScore = function(){
        var oldhs = document.getElementById("oldHighscore").innerText;
        document.getElementById("scoreText").innerText="Congratulations, you scored " + points + " points!";
        if(points < oldhs){
            document.getElementById("record").innerHTML = "New high score!" ;
            document.getElementById("highscore").innerText += "Your highscore: " + oldhs;
            document.getElementById("newHighscore").value = points;
        }else{
            document.getElementById("highscore").innerText += "Highscore:" + oldhs;
        }
    };

    this.passwordNotMatching = function(){
        document.getElementById("errorText").innerText = "Passwords don't match!";
    };

    this.init = function () {
        view.init();
        model.init();
        view.initMap();
        model.setObs(controller);
        if (navigator.geolocation){
            model.getLocation();
        }
        view.hideOptions();

    };
}

var controller = new Controller();
window.addEventListener("load", controller.init);