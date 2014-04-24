<?php
	date_default_timezone_set("Asia/Bangkok");
	$date_str;
	$time_str;
	if($_POST["date"]) $date_str = $_POST["date"];
	else $date_str = date("Y-m-d");
	if($_POST["time"]) $time_str = $_POST["time"];
	else $time_str = date("H:i:s");
	$con = mysqli_connect("localhost", "quicknote", "quicknote1234", "quicknote");
	if($_POST["type"] == "create") {
		$result = mysqli_query($con, 
			"INSERT INTO notes (note,datetime,category,ishighlight) VALUES ('". $_POST["note"] ."','". ($date_str." ".$time_str) ."','". $_POST["category"] ."',". $_POST["isHighlight"] .");");
		if($result) echo "success";
	} else if($_POST["type"] == "edit") {
		
	}
	mysqli_close($con);
?>