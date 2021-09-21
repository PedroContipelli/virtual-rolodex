<?php
	$inData = getRequestInfo();

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
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES (?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $email, $userId);

		if ( $stmt->execute() == True)
		{
			returnWithInfo("Contact successfully added", $userId);
		}
		else
		{
			returnWithError("Failed to add contact");
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

	function returnWithInfo( $msg, $userId )
	{
		$retValue = '{"userID":' . $userId . ',"result":"' . $msg . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
