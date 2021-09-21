<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ii", $inData["contactID"], $inData["userID"]);

		if ($stmt->execute() === True)
		{
			returnWithInfo( "Contact successfully deleted", $inData["contactID"], $inData["userID"] );
		} else
		{
			returnWithError("Failed to delete contact");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithInfo( $msg, $contactID, $userID )
	{
		$retValue = '{"contactID":' . $contactID . ',"userID":' . $userID . ',"result":"' . $msg . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $msg )
	{
		$retValue = '{"error":"' . $msg . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
