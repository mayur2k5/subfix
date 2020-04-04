function adjustTimelag(){
	var subFile = $('#subFile'); 
	var delayValue = $('#delayValue'); 
	
	if( subFile.val() == "" || delayValue.val() == ""){
		showMessage("alert-warning", "<strong>Warning!</strong> Please select a file and/or specify the value for delay");
	
	}else{
		var delay = delayValue.val();
		//addDelayToSubFile(subFile.get(0), delay);
		
		var param = {};
		param.timeLag = delayValue.val();
		param.seqLag = 0;
		
		readFile(subFile.get(0), onSubFileReadCompletion, param);
	}
}

function merge(){
	var file1 = $('#subFileToJoin1'); 
	var file1delay = $('#SubFile1Delay'); 
	var file2 = $('#subFileToJoin2'); 
	var file2delay = $('#delayValueToJoin'); 
	
	if( file1.val() == "" || file1delay.val() == "" || file2.val() == "" || file2delay.val() == ""){
		showMessage("alert-warning", "<strong>Warning!</strong> Please select a file and/or specify the value for delay");
	
	}else{
		var param = {};
		param.timeLag = file1delay.val();
		param.seqLag = 0;
		
		readFile(file1.get(0), onFile1ReadCompletion, param);
	}
}

function onSubFileReadCompletion(evt){
	var param = evt.data;
	var fullContent = process(param.lines, param.timeLag, param.seqLag);

	prepareFileDownloadLink(fullContent);

}

function onFile1ReadCompletion(evt){
	var param = evt.data;
	var file1Content = process(param.lines, param.timeLag, param.seqLag);

	var lastIndex = getLastSeqIndex(param.lines);
	
	var file2 = $('#subFileToJoin2'); 
	var file2delay = $('#delayValueToJoin'); 
	
	var param = {};
	param.timeLag = file2delay.val();
	param.seqLag = lastIndex;
	param.file1Content = file1Content;
	
	readFile(file2.get(0), onFile2ReadCompletion, param);
	
}

function onFile2ReadCompletion(evt){
	var param = evt.data;
	var file2Content = process(param.lines, param.timeLag, param.seqLag);

	fullContent = param.file1Content + file2Content;
	prepareFileDownloadLink(fullContent);

}

function getLastSeqIndex(lines){
	var sequenceNumPattern = /[0-9]*/i;
	var timestampPattern = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]\s-->\s[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/i; //00:03:34,519 --> 00:03:38,034

	var lastIndex;
		
	for(var i = lines.length-1; i > 1; i-- )
	{
		if(sequenceNumPattern.test(lines[i-1]) == true && timestampPattern.test(lines[i]) == true){
			lastIndex = parseInt(lines[i-1]);
			return lastIndex;
		}
	}
}

function process(lines, timeLag, seqLag){
	var sequenceNumPattern = /[0-9]*/i;
	var timestampPattern = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]\s-->\s[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/i; //00:03:34,519 --> 00:03:38,034
	var newLines = new Array();
	var fullContent = new String();
	
	//loop through the content, if sequence number/timestamp pattern is found, modify and prepare full content
	for(var i = 0; i < lines.length; i++){
	
		if(sequenceNumPattern.test(lines[i]) == true && timestampPattern.test(lines[i+1]) == true){
			newLines[i] = parseInt(lines[i]) + seqLag;
			
		}else if(timestampPattern.test(lines[i]) == true){
			var timestamps = lines[i].split(" --\> ");
			
			var timestamp1 = new Timestamp(timestamps[0], timeLag);
			var timestamp2 = new Timestamp(timestamps[1], timeLag);
			
			newLines[i] = timestamp1.toString() + " --> " + timestamp2.toString();

		}else{
			newLines[i] = lines[i];
		}
		
		fullContent += newLines[i] + "\r\n";
	}
	
	return fullContent;
}	


