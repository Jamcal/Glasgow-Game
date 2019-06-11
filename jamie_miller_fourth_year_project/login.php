<?php
//Connect to MySQL
$host = "devweb2018.cis.strath.ac.uk";
$user = "njb15178";
$pass = "iePhied3xiZe";
$dbname = "njb15178";
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error){
    die("Connection failed");
}

if((isset($_POST['loginButton'])) ){
    session_start();
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    $sql="SELECT * FROM login WHERE username='$username' AND password='$password' limit 1";
    $result=mysqli_query($conn, $sql);
    $sql="SELECT highscore  FROM login WHERE username = '$username'";
    if(mysqli_num_rows($result)==1){
        $_SESSION['username'] = $username;
        $sql="SELECT highscore  FROM login WHERE username = '$username'";
        $resultHS=mysqli_query($conn, $sql);
        $row = mysqli_fetch_row($resultHS);
        $highscore = $row[0];
        $_SESSION['highscore'] = $highscore;
        header("location: index.html");
    } else{
        echo '<script language="javascript">';
        echo 'window.alert("Invalid login details!")';
        echo '</script>';
    };
};

?>

<!DOCTYPE html>

<html>
    <head>
        <title> Login </title>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8">
        <link rel = "stylesheet" href="loginStyle.css"/>
    </head>
<body>
<div class="container">
    <img src="login.png" height="64" width="64">
    <form method="POST" action="login.php">
        <div class="form_input">
            <input type="text" id="username" name="username" placeholder="Enter your Username">
        </div>
        <div class="form_input">
            <input type="password" id="password" name="password" placeholder="Enter your Password">
        </div>
        <br>
        <input type="submit" id="submit" name="loginButton" value="Log in">
        <input type="button" name="returnToMenu" class = "backButton" value="Back" id="ReturnToMenu" onclick="controller.returnToMenu()">
        <p id="registerLink">Not got an account? <a href="register.php"> Register here! </a> </p>
    </form>
</div>
</body>

    <script src = "Model.js"></script>
    <script src = "View.js"></script>
    <script src = "Controller.js"></script>
</html>

