<!DOCTYPE html>
<?php
//session_start();
//Connect to MySQL
$host = "devweb2018.cis.strath.ac.uk";
$user = "njb15178";
$pass = "iePhied3xiZe";
$dbname = "njb15178";
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error){
    die("Connection failed");
}

if (isset($_POST['register_btn'])) {
    session_start();
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $password2 = mysqli_real_escape_string($conn, $_POST['password2']);


    if ($password == $password2) {
//        $password = md5($password); //hash password before storing

        $sqlCheckName = "SELECT * FROM login WHERE username='$username'";
        $resultCheck = mysqli_query($conn, $sqlCheckName);
        if(mysqli_num_rows($resultCheck)>0){
        {
            echo '<script language="javascript">';
            echo 'window.alert("Username already exists")';
            echo '</script>';
        }}
        else {
            $sql = "INSERT INTO login(id, username, password, highscore) VALUES(NULL, '$username', '$password', 10000)";
            $result = mysqli_query($conn, $sql);
            if(!$result){
                die('query has failed' . mysqli_connect_error());
            }
            $_SESSION['username'] = $username;
            $sql="SELECT highscore  FROM login WHERE username = '$username'";
            $resultHS=mysqli_query($conn, $sql);
            $row = mysqli_fetch_row($resultHS);
            $highscore = $row[0];
            $_SESSION['highscore'] = $highscore;
            header("location: index.html");
        }


    } else {
        echo '<script language="javascript">';
        echo 'window.alert("Passwords don\'t match!")';
        echo '</script>';
//        echo '<p> Passwords don\'t match!</p>';
    }
}
?>


<html>
<head>
    <title> Register </title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <link rel = "stylesheet" href="loginStyle.css"/>
</head>
<body>
<div class="container">
    <p><img src="login.png" height="64" width="64"></p>
    <p id="errorText"></p>
    <form method="post" action="register.php">
        <div class="form_input">
            <input type="text" id="username" name="username" placeholder="Enter Username">
        </div>
        <div class="form_input">
            <input type="password" id="password" name="password" placeholder="Enter Password">
        </div>
        <div class="form_input">
            <input type="password" id="passwordConfirm" name="password2" placeholder="Confirm Password">
        </div>
        <br>
        <input type="submit" id="register_btn" name="register_btn" value="Register">
        <input type="button" name="returnToMenu" class = "backButton" value="Back" id="ReturnToMenu" onclick="controller.returnToMenu()">
    </form>
</div>
</body>

<script src = "Model.js"></script>
<script src = "View.js"></script>
<script src = "Controller.js"></script>
</html>