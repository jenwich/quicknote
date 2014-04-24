<?php
	$con = mysqli_connect("localhost", "quicknote", "quicknote1234", "quicknote");
	$result = mysqli_query($con, "DELETE FROM notes WHERE id=". $_POST["id"] .";");
	if($result) echo "success";
	else echo "error";
	mysqli_close($con);
?>