function Timestamp (strTime, add)
{
	this.HRS_FRAC = 36000;
	this.MIN_FRAC = 600;
	this.SEC_FRAC = 10;
	
	if ( 13 == strTime.length || 12 == strTime.length )
	{
		this.hrs = ((strTime[0] - '0') * 10) + (strTime[1] - '0');
		this.min = ((strTime[3] - '0') * 10) + (strTime[4] - '0');
		this.sec = ((strTime[6] - '0') * 10) + (strTime[7] - '0');
		this.fraction = (strTime[9] - '0');
		this.delay = parseInt(add);
	}
	else
	{
		//ERROR condition
		this.hrs = this.min = this.sec = this.fraction = 0;
		this.delay = add;
	}
	
	this.addDelay=addDelay;
	this.toString = toString;

	function addDelay()
	{
		var ulTimeVal = 0;

		ulTimeVal += this.hrs * this.HRS_FRAC;
		ulTimeVal += this.min * this.MIN_FRAC;
		ulTimeVal += this.sec * this.SEC_FRAC;
		ulTimeVal += this.fraction;
		ulTimeVal += this.delay;

		this.hrs = ulTimeVal / this.HRS_FRAC;
		this.min = (ulTimeVal  % this.HRS_FRAC) / this.MIN_FRAC;
		this.sec = ((ulTimeVal % this.HRS_FRAC) % this.MIN_FRAC) / this.SEC_FRAC;
		this.fraction = ((ulTimeVal % this.HRS_FRAC) % this.MIN_FRAC) % this.SEC_FRAC;
	}

	function toString()
	{
		this.addDelay();
		
		modifiedVal = new String("hh:mm:ss,ddd");

		var hrs = Math.floor(this.hrs).toString();
		if(this.hrs < 10)	hrs = "0" + hrs;
		modifiedVal = modifiedVal.replace("hh",hrs);
		
		var min = Math.floor(this.min).toString();
		if(this.min < 10)	min = "0" + min;
		modifiedVal = modifiedVal.replace("mm",min);
		
		var sec = Math.floor(this.sec).toString();
		if(this.sec < 10)	sec = "0" + sec;
		modifiedVal = modifiedVal.replace("ss",sec);
		
		var fraction = Math.floor(this.fraction).toString();
		fraction = fraction + "00";
		modifiedVal = modifiedVal.replace("ddd",fraction);

		return modifiedVal;
	}
	
}