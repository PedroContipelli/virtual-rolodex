var urlBase = 'http://contactmanagers.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contactMap = {};	// key = tableRow, value = customerID
var contactRow = -1;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "manage-contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function signUp() {

    userId = 0;

    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;

//	var hash = md5( password );

	var tmp = {Username:username,Password:password,
            FirstName:firstName,LastName:lastName};
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SignUp.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // process user input (post request)
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

                // NOTE: may need to handle more than one user with same credentials!

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}


function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var phoneNumber = document.getElementById("phoneNumber").value;
        var email = document.getElementById("email").value;
        document.getElementById("contactAddResult").innerHTML = "";

        var tmp = {FirstName:firstName,LastName:lastName,Phone:phoneNumber,Email:email,UserID:userId};
        var jsonPayload = JSON.stringify( tmp );

        var url = urlBase + '/AddContact.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                        }
                };
                xhr.send(jsonPayload);

		window.location.href = "manage-contacts.html";
        }
        catch(err)
        {
                document.getElementById("contactAddResult").innerHTML = err.message;
        }
}

function searchContact()
{
	var srch = document.getElementById("searchText").value;
	contactMap = {};

	var contactList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.results !== undefined)
				{

					for( var i=0; i<jsonObject.results.length; i++ )
					{
						contactList += "<tr>\n";
						contactList += "<th scope=\"row\">" + (i+1) + "</th>";

						contactMap[i + 1] = jsonObject.results[i][0];

						for ( var j=1; j < jsonObject.results[i].length; j++ )
						{
							contactList += "<td>" + jsonObject.results[i][j] + "</td>\n";
						}


						contactList += "<td id=\"buttonsCell\">\n";
						contactList += "<button type=\"button\" name=\"editBtn\" class=\"btn btn-primary btn-sm editBtn\" onclick=\"editReady();\"><i class=\"fas fa-user-edit\"></i></button>\n";
						contactList += "<button type=\"button\" name=\"deleteBtn\" class=\"btn btn-primary btn-sm\" data-bs-toggle=\"modal\" data-bs-target=\"#Modal\" onclick=\"getContactRowIndex();\"><i class=\"fas fa-trash\"></i></button>\n";
						contactList += "</td>\n";
						contactList += "</tr>\n";
					}
				}

				document.getElementsByTagName("tbody")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function getContacts()
{
	var contactList = "";

	var tmp = {userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/GetContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				for(var i=0; i < jsonObject.results.length; i++)
				{
					contactList += "<tr>\n";
					contactList += "<th scope=\"row\">" + (i+1) + "</th>";

					contactMap[i + 1] = jsonObject.results[i][0];

					for ( var j=1; j < jsonObject.results[i].length; j++ )
					{
						contactList += "<td>" + jsonObject.results[i][j] + "</td>\n";
					}

					contactList += "<td id=\"buttonsCell\">\n";
					contactList += "<button type=\"button\" name=\"editBtn\" class=\"btn btn-primary btn-sm editBtn\" onclick=\"editReady();\"><i class=\"fas fa-user-edit\"></i></button>\n";
					contactList += "<button type=\"button\" name=\"deleteBtn\" class=\"btn btn-primary btn-sm\" data-bs-toggle=\"modal\" data-bs-target=\"#Modal\" onclick=\"getContactRowIndex();\"><i class=\"fas fa-trash\"></i></button>\n";
					contactList += "</td>\n";
					contactList += "</tr>\n";
				}

				document.getElementsByTagName("tbody")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function getContactRowIndex()
{
	const cells = document.querySelectorAll('td');
	cells.forEach(cell => {
		cell.addEventListener('click', () => {
    		console.log("Row index: " + cell.closest('tr').rowIndex + " | Customer ID: " + contactMap[cell.closest('tr').rowIndex]);
			contactRow = cell.closest('tr').rowIndex;
		});
	});
}

function editReady()
{
	getContactRowIndex();
	var minutes = 20;
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        setTimeout(() => {document.cookie = "contactId=" + contactMap[contactRow] + ";expires=" + date.toGMTString(); window.location.href = 'edit-contact.html';}, 300);
}

function editContact()
{
	var contactId = parseInt(document.cookie.match('(^|;)\\s*' + 'contactId' + '\\s*=\\s*([^;]+)')?.pop() || '');
	var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var phoneNumber = document.getElementById("phoneNumber").value;
        var email = document.getElementById("email").value;
	document.getElementById("contactEditResult").innerHTML = "";

        var tmp = {ContactID:contactId,FirstName:firstName,LastName:lastName,Phone:phoneNumber,Email:email,UserID:userId};
        var jsonPayload = JSON.stringify( tmp );

        var url = urlBase + '/EditContact.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                document.getElementById("contactEditResult").innerHTML = "Contact has been edited";
                        }
                };
                xhr.send(jsonPayload);

                window.location.href = "manage-contacts.html";
        }
        catch(err)
        {
                document.getElementById("contactEditResult").innerHTML = err.message;
        }
}

function deleteContact()
{
	var tmp = {contactID:contactMap[contactRow],userID:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );

				contactRow = -1;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	setTimeout(searchContact, 300);
}

function displayContact()
{
        var contactData = "";
	var contactId = parseInt(document.cookie.match('(^|;)\\s*' + 'contactId' + '\\s*=\\s*([^;]+)')?.pop() || '');
        var tmp = {ContactID:contactId,UserID:userId};
        var jsonPayload = JSON.stringify( tmp );

        var url = urlBase + '/GetContact.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                var jsonObject = JSON.parse( xhr.responseText );

                                if (jsonObject.results !== undefined)
                                {
                                        for( var i=0; i<jsonObject.results.length; i++ )
                                        {
                                                contactData += jsonObject.results[i] + " ";
                                        }
                                }

                                document.getElementsByTagName("p")[0].innerHTML = contactData;
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById("contactGetResult").innerHTML = err.message;
        }
}
