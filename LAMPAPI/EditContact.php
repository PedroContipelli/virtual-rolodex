<?php
	$inData = getRequestInfo();

	$contactId = $inData["ContactID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["Phone"];
	$email = $inData["Email"];
	$userId = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?,LastName=?,Phone=?,Email=? WHERE ID=? AND UserID=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $email, $contactId, $userId);

		if ($stmt->execute() === True)
		{
			returnWithInfo( "Contact successfully edited", $contactId, $userId );
		} else
		{
			returnWithError("Failed to edit contact");
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
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

	function returnWithInfo( $msg, $contactID, $userID )
	{
		$retValue = '{"contactID":' . $contactID . ',"userID":' . $userID . ',"result":"' . $msg . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
