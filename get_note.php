<?php
	$con = mysqli_connect("localhost", "quicknote", "quicknote1234", "quicknote");
	$result;
	$sql;
	if($_POST["type"] == "recent") {
		if($_POST["category"]) $sql = "SELECT * FROM notes WHERE ishighlight=false AND category='". $_POST["category"] ."' ORDER BY datetime DESC";
		else $sql = "SELECT * FROM notes WHERE ishighlight=false ORDER BY datetime DESC";
		if($_POST["amount"] != 0) $sql = $sql ." LIMIT ". $_POST["amount"];	
		$sql = $sql .";";		
	} else if($_POST["type"] == "date") {
		$sql = "SELECT * FROM notes WHERE YEAR(datetime)=". $_POST["year"] ." AND MONTH(datetime)=". $_POST["month"] ." AND DAYOFMONTH(datetime)=". $_POST["day"] ." ORDER BY datetime;";
	} else if($_POST["type"] == "highlight") {
		$sql = "SELECT * FROM notes WHERE YEAR(datetime)=". $_POST["hl_year"] ." AND MONTH(datetime)=". $_POST["hl_month"] ." AND ishighlight=true ORDER BY datetime;";
	}
	$result = mysqli_query($con, $sql);
	echo "[";
	while($row = mysqli_fetch_array($result)) {
		echo "{";
		echo "id:". $row["id"]. ",";
		echo "note:'". $row["note"]. "',";
		echo "datetime:'". $row["datetime"]. "',";
		echo "category:'". $row["category"]. "',";
		echo "isHighlight:". $row["ishighlight"]. ",";
		echo "},";
	}
	echo "]";
	mysqli_close($con);
?>