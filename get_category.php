<?php
	$con = mysqli_connect("localhost", "quicknote", "quicknote1234", "quicknote");
	$result = mysqli_query($con, "SELECT DISTINCT category FROM notes;");
	echo "[";
	while($row = mysqli_fetch_array($result)) {
		if($row["category"] != "") echo "'". $row["category"] ."',";
	}
	echo "]";
	mysqli_close($con);
?>