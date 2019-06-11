<?php
    session_start();
    //Connect to MySQL
    $host = "devweb2018.cis.strath.ac.uk";
    $user = "njb15178";
    $pass = "iePhied3xiZe";
    $dbname = "njb15178";
    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error){
        die("Connection failed");
    };
    if(isset($_SESSION['username'])){
        $username = $_SESSION['username'];

        $sqlHS="SELECT highscore  FROM login WHERE username = '$username'";
        $resultHS=mysqli_query($conn, $sqlHS);
        $row = mysqli_fetch_row($resultHS);
        $oldHS = $row[0];
        $_SESSION['highscore'] = $oldHS;

        if(isset($_POST['backToMenu'])){
            $newHS = $_POST['newHS'];
            if ($newHS < $oldHS) {
                $_SESSION['highscore'] = $newHS;
                $sql = "UPDATE login SET highscore='$newHS' WHERE username='$username'";
                mysqli_query($conn, $sql);
            };
        };
    };

if(isset($_POST['backToMenu'])){
        header("location: index.html");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gamescreen</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <link rel="stylesheet" href = "style.css"/>
</head>
<body>
<div id="head">
    <p id="idRounds"> </p>
    <p id="idPrompt" class="test"></p>
    <p id="idScore" class="test"></p>
</div>

    <div id="main2">
    <section id="map"></section>
    <form method="POST" action="gamescreen.php">
    <section id="end">
            <p id="oldHighscore"><?php
                if(isset($_SESSION['highscore'])){
                    echo $_SESSION['highscore'];
                }?></p>
            <input type="hidden" id="newHighscore" name="newHS">
            <p id="scoreText"></p>
            <p id="highscore"></p>
            <p id="record"><?php
                if(!isset($_SESSION['highscore'])){
                    echo "Log in to keep track of high scores!";
                }?></p>
            <input type="submit" name="backToMenu" value="Return" id="Return">
    </section>
    </form>
    </div>
    <div id="buttonsGame">
        <input type="button" name="select" class = "selectButton" value="Begin" id="Select" onclick="controller.select()">
        <input type="button" name="returnToMenu" class = "backButton" value="Back" id="ReturnToMenu" onclick="controller.returnToMenu()">
    </div>

</body>

<script src = "Model.js"></script>
<script src = "View.js"></script>
<script src = "Controller.js"></script>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places">
</script>
<script>
    window.addEventListener("load", view.initMap);
    window.addEventListener("load", model.currentGameMode);
    window.addEventListener("load", model.startingRounds);

    document.getElementById("idPrompt").innerHTML = "Mode: " + model.currentGameMode();
    document.getElementById("idRounds").innerHTML = "Rounds: " + model.startingRounds()
</script>
</html>