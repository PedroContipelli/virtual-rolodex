<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$username = $inData["Username"];
	$password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

		if ($stmt->execute() === True)
		{
			returnWithInfo( "User successfully created" );
		} else
		{
			returnWithError( "Failed to create user" );
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
		//header('Access-Control-Allow-Origin: *');
		//header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
		echo $obj;
	}
	
	function returnWithError( $msg )
	{
		$retValue = '{"error":"' . $msg . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $msg )
	{
		$retValue = '{"result":"' . $msg . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
