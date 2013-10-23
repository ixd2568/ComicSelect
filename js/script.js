var project = 
{
	content: document.getElementById("content"),
	selection: new Array(),
	depth: 0,
	xmlDoc: null,
	
	parseXML: function(xmlFile)
	{
		if (window.XMLHttpRequest)
		{
			xmlhttp = new XMLHttpRequest();
		}
		else
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.open("GET", xmlFile, false);
		xmlhttp.send();
		project.xmlDoc = xmlhttp.responseXML; 
	},
	
	initialize: function()
	{
		if (!document.getElementById)
			window.location = "http://www.mozilla.org/en-US/firefox/all/";
		
		project.parseXML("xml/questions.xml");
		project.build(project.depth);
	},
	
	setHeader: function(header)
	{
		document.getElementById("header").removeChild(document.getElementById("header").childNodes[0]);
		document.getElementById("header").appendChild(document.createTextNode(header));
	},
	
	build: function(id)
	{
		var sel = document.getElementsByTagName("select");
		var content = document.getElementById("content");
		var target = new Array();
				
		for (var i = 0; i < sel.length; i++)
		{
			content.removeChild(sel[i]);
		}
				
		for (var i = 0; i < project.xmlDoc.getElementsByTagName("question")[id].getElementsByTagName("option").length; i++)
		{
			target.push(project.xmlDoc.getElementsByTagName("question")[id].getElementsByTagName("option")[i].childNodes[0].nodeValue);
		}
		
		project.setHeader(project.xmlDoc.getElementsByTagName("question")[id].getElementsByTagName("header")[0].childNodes[0].nodeValue);
				
		if (target.length != 0)
		{
			var select = document.createElement("select");
			select.id = "select";
			
			for (var i = 0; i < target.length; i++)
			{
				var option = document.createElement("option");
				option.appendChild(document.createTextNode(target[i]));
				option.value = target[i];
				select.appendChild(option);
			}
			content.appendChild(select);
			
			project.depth = id+1;
		}
	},
	
	displayForm: function()
	{
		var chosenChar = project.xmlDoc.getElementsByTagName("result")[0].getElementsByTagName(project.selection[0])[0].getElementsByTagName(project.selection[1])[0].getElementsByTagName(project.selection[2])[0].getElementsByTagName(project.selection[3])[0].childNodes[0].nodeValue;
		project.setHeader(project.xmlDoc.getElementsByTagName("result")[0].getElementsByTagName("header")[0].childNodes[0].nodeValue + chosenChar);
		
		project.parseXML("xml/answers.xml");
		
		var image = document.createElement("img");
		image.src = project.xmlDoc.getElementsByTagName(chosenChar.replace(" ", "_"))[0].getElementsByTagName("image")[0].childNodes[0].nodeValue;
		image.alt = chosenChar;
		image.id = "image";
		image.style.opacity = 0;
		image.style.filter  = 'alpha(opacity=0)';
		
		var text = document.createElement("p");
		text.appendChild(document.createTextNode(project.xmlDoc.getElementsByTagName(chosenChar.replace(" ", "_"))[0].getElementsByTagName("text")[0].childNodes[0].nodeValue));
		text.id = "text";
		document.getElementById("content").appendChild(image);
		project.fadeIn(document.getElementById('image'));
		document.getElementById("content").appendChild(text);
		project.fadeIn(document.getElementById('text'));
		
		document.getElementById("content").removeChild(document.getElementById("select"));
		document.getElementById("buttons").removeChild(document.getElementById("next"));
		document.getElementById("buttons").removeChild(document.getElementById("reset"));
		
		if (window.localStorage)
		{
			if (localStorage.length != 0)
			{
				document.getElementById("firstname").value = localStorage.getItem("firstname");
				document.getElementById("lastname").value = localStorage.getItem("lastname");
				document.getElementById("email").value = localStorage.getItem("email");
			}
		}
		else if (document.cookie.length > 0)
		{
			document.getElementById("firstname").value = document.cookie.split("comicChar=")[1].split(",")[0];
			document.getElementById("lastname").value = document.cookie.split("comicChar=")[1].split(",")[1];
			document.getElementById("email").value = document.cookie.split("comicChar=")[1].split(",")[2];
		}
		
		var id = document.getElementById('inputs');
		document.getElementById("inputs").setAttribute("style", "visibility: visible");
		project.fadeIn(document.getElementById("inputs"));
	},
	
	fadeIn: function(element)
	{
		var opacity = 0;
		var handle = window.setInterval(function()
		{
			element.style.opacity = opacity;
			element.style.filter  = 'alpha(opacity=' + opacity*100 + ')';
			if (opacity >= 1)
				window.clearInterval(handle);
			else	
				opacity += 0.1;
		}, 50);
	},
	
	next: function()
	{
		project.selection.push(document.getElementById("select").value);
		if (project.depth != project.xmlDoc.getElementsByTagName("question").length)
			project.build(project.depth);
		else
		{
			project.displayForm();
		}
	},
	
	reset: function()
	{
		project.selection = new Array();
		project.depth = 0;
		project.initialize();
	},
	
	validateForm: function()
	{
		if (!project.validateName(document.getElementById("firstname").value))
		{
			alert("Please use only alphanumeric characters for your first name (2 characters minimum).");
			return false;
		}
		else if (!project.validateName(document.getElementById("lastname").value))
		{
			alert("Please use only alphanumeric characters for your last name (2 characters minimum).");
			return false;
		}
		else if (!project.validateEmail(document.getElementById("email").value))
		{
			alert("Please enter a valid e-mail address.");
			return false;
		}
		
		if (window.localStorage)
		{
			localStorage.clear();
			localStorage.setItem("firstname", document.getElementById("firstname").value);
			localStorage.setItem("lastname", document.getElementById("lastname").value);
			localStorage.setItem("email", document.getElementById("email").value);
		}
		else
		{
			project.createCookie("comicChar", document.getElementById("firstname").value + "," + document.getElementById("lastname").value + "," + document.getElementById("email").value);
		}
		
		return true;
	},
	
	validateName: function(name)
	{
		var regex = /^[a-zA-Z ]{2,30}$/;
		return regex.test(name);
	},
	
	validateEmail: function(email) 
	{ 
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	},
	
	createCookie: function(name, value)
	{
		var nextyear = new Date();
		nextyear.setFullYear(nextyear.getFullYear() + 1);
		document.cookie = name + "=" + value;
//		+ ";expires=" + nextyear.toGMTString() + ";path='/';domain='dekic.rit.edu';secure"; 
	}
}