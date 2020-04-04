var reader;

function showMessage(styleClass, message){
	
	$("#messageBoard").addClass(styleClass);
	$("#messageBoard").text("");
	$("#messageBoard").append(message);

	$("#messageBoard").css("display", "block");
}

function init()
{
	document.addEventListener("readFileComplete", readFileCompleteHandler, false);
	return checkForFileApiSupport();
}

function checkForFileApiSupport() {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		reader = new FileReader();
		return true; 
	} else {
		showMessage("alert-danger", "<strong>Oops! your browser's not supported!</strong> You could try using Chrome");
		alert('The File APIs are not fully supported by your browser. Fallback required.');
		return false;
	}
}

function readFileCompleteHandler(data){
	data.cb(data);
}

function readFile(filePath, cb, param) {
	var output = ""; //placeholder for text output
	
	if(filePath.files && filePath.files[0]) {           
		reader.onload = function (e) {
			output = e.target.result;
			var lines = e.target.result.split("\n");
			
			var evt = document.createEvent("Event");
			evt.initEvent("readFileComplete",true,true);
			
			// custom param
			evt.cb = cb;
			param.lines = lines;
			evt.data = param;

			//invoke
			document.dispatchEvent(evt);
		};
		reader.readAsText(filePath.files[0]);

	}else {
		//browser not supported
		showMessage("alert-danger", "<strong>Oops! your browser's not supported!</strong> You could try using Chrome");
  
	}   
	return true;
} 

function prepareFileDownloadLink(content){
	try{
		//encode to base64
		uriContent = "data:text/plain;base64," + window.btoa(unescape(encodeURIComponent(content))); //uriContent = "data:text/plain;base64," + window.btoa(content);

		//$("#dowloadLink").attr("href", uriContent);
		showMessage("alert-success", "<a id=\"dowloadLink\" href=\""+ uriContent + "\" class=\"alert-link\" download=\"out.srt\">Download modified subtitle file</a>");
	}catch(err){
		showMessage("alert-danger", "<strong>Error!</strong> Sorry, something's gone wrong! <a href=\"mailto:helpdesk.subfix@gmail.com\">Please report back to me with the file(s) you're trying to fix.</a>");
	}
}