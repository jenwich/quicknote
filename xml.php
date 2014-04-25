<?php
	date_default_timezone_set("Asia/Bangkok");
	$xml = new DOMDocument( "1.0", "utf-8" );
	$xml_notes = $xml->createElement("notes");
	$xml->appendChild($xml_notes);
	$con = mysqli_connect("localhost", "quicknote", "quicknote1234", "quicknote");
	$result = mysqli_query($con, "SELECT * FROM notes ORDER BY id;");
	while($row = mysqli_fetch_array($result)) {
		$xml_note = $xml->createElement("note", $row["note"]);
		$xml_note->setAttribute("id", $row["id"]);
		$xml_note->setAttribute("datetime", $row["datetime"]);
		$xml_note->setAttribute("category", $row["category"]);
		$xml_note->setAttribute("ishighlight", $row["ishighlight"]);
		$xml_notes->appendChild($xml_note);
	}
	mysqli_close($con);
	$xml->save("tmp/notes_". date("Y-m-d") .".xml");
?>