// common1.js
//
// by Greg Saunders
// Copyright 2003-2016
//
// Changes:
//   03/01/2003 - gms - created




// BROWSER DETECTION ///////////////////////////////////////////////////
/*
var OP9 = (window.opera != null) && window.opera.version().charAt(0) >= 9;
var OP  = (window.opera != null) && ! OP9;
var IE  = (window.navigator.appName.indexOf ("Microsoft Internet Explorer") != -1) && ! OP9 && ! OP;
var SA  = (window.navigator.appVersion.indexOf ("Safari") != -1) && ! OP9 && ! OP && ! IE;
var FF  = (window.navigator.userAgent.indexOf ("Firefox") != -1) && ! OP9 && ! OP && ! IE && ! SA;
var NN  = (window.navigator.appName.indexOf ("Netscape") != -1)  && ! OP9 && ! OP && ! IE && ! SA && ! FF;
var MZ  = (window.navigator.userAgent.indexOf ("Mozilla") != -1) && ! OP9 && ! OP && ! IE && ! SA && ! NN && ! FF;
var UnknownBrowser = ! OP9 && ! OP && ! IE && ! SA && ! NN && ! FF;

var browserOkForXmlP = ! OP && ! SA && ! UnknownBrowser;*/



// BOOTSTRAPPING ///////////////////////////////////////////////////////

var gLaptopP = false;
var gParentDir = '/';

function isDefined(param){
	return(typeof(param) != 'undefined'); //gms 9/23/2014
    if(param === null){  //need this to distinguish null from undefined
		return(true);
	}
	return(param != getConstant("undefined"));
}

function clog(msg){
	if(typeof(console)=='undefined'){ //ie9
		return(false);
	}
	if(isDefined(console) && isDefined(console.log)){
		console.log(msg);
	}
}

function logError(msg){
	clog('logError: ' + msg);
	if(gLaptopP){
		alert(msg);
	}
}

function throwError(msg){
   alert(msg);
   lastmsg = msg;
   var dummy = sorryAnErrorHasOccurred; //halt processing
}

function notAvailable(){
	alert('Not available');
}

function len(str){
   return(str.length);
}

function left(str, n){
	if(false && n > len(str)){
		throwError("Invalid params to LEFT");
	}
	else{
		return(str.substring(0, n));
	}
}

function right(str, n){
	var start = Math.max(len(str)-n,0);
	return(str.substr(start, n));
}

function mid(str,start,count){
	return(str.substr(start-1,count));
}

function trim(str) { //this function doesn't seem to work
  str = str.replace( /^\s+/g, "" );// strip leading
  return str.replace( /\s+$/g, "" );// strip trailing
}

//this function does seem to work
String.prototype.trim=function(){
    return this.replace(/^\s*|\s*$/g,'');
}



function getConstant(name, dummyParamDoNotDefine){
	switch(name){
		case "undefined":
			//return(undefined);  -- this breaks IE Mac 5.1!
			return(dummyParamDoNotDefine);
			break;
		default:  throwError("case fell through:  " + name);
	}
}

function getDefaultParam(param, defaultValue){
	if(isDefined(param)){
		return(param);
	}
	else{
		return(defaultValue);
	}
}

function arrayNew(dim){
	return(new Array);
}

function arrayDeleteAt(a, i){
	a.splice(i-1,1);
	return(null);
}

function arrayAppend(a, item){
	a[a.length] = item;
	return(null);
}

function arrayLen(a){
	return(a.length);
}

function mySplit(str, delim){
	if(str == ""){
		return(arrayNew(1));
	}
	return(str.split(delim));  //requires JS 1.1
}

function createStructure(fields, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9){
  if(p9 != null) throwError("too many fields passed to createStructure()");
  var a = mySplit(fields, ",")  //fields.split(",");
  for(var i=0; i<a.length; i++){
     eval("this." + a[i] + " = p" + i);
  }
  return(this);
}

function structNew(){
	return(new Object);
}

function structInsert(structure, key, value){
	structure[key] = value;
	return(structure);
}

function structDelete(structure, key){
	delete structure[key];
	return(structure);
}

function structFind(structure, key){
	return(structure[key]);
}

function myStructFind(structure, key, defaultValue){
	if(structKeyExists(structure, key)){
		return(structFind(structure, key));
	}
	return(defaultValue);
}

function structKeyList(structure){
	var res = "";
	var delim = "";
	for (var prop in structure){
		res = res + delim + prop;
		delim=",";
	}
	return(res);
}

function structCount(structure){
	return(listLen(structKeyList(structure)));
}

function structKeyExists(structure, key){
	return(isDefined(structure[key]));
}

function findAndSplit(string, theSubstring, guaranteeP){
   guaranteeP = getDefaultParam(guaranteeP, true);
   var pos = string.indexOf(theSubstring);
   if(pos<0 && guaranteeP){
   	  throwError('string "' + string + '" does not contain substring "' + theSubstring + '"');
   }
   var res = structNew();
   if(pos<0){
       //res = new createStructure("left,mid,right", string, "", "");
	   res = structInsert(res, "left", string);
	   res = structInsert(res, "mid", "");
	   res = structInsert(res, "right", "");
   }
   else{		
	   //res = new createStructure("left,mid,right", string.substr(0, pos), theSubstring, string.substr(pos+len(theSubstring), len(string)));
	   res = structInsert(res, "left", string.substr(0, pos));
	   res = structInsert(res, "mid", theSubstring);
	   res = structInsert(res, "right", string.substr(pos+len(theSubstring), len(string)));	   
   }
   return(res);
}



// OBJECTS ///////////////////////////////////////////////////////////

function MM_findObj(n, d) { //from Macromedia, v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function findObject(objectOrObjectName, guaranteeP){
   var res;
   if (guaranteeP==null) guaranteeP=true;
   if(typeof(objectOrObjectName)=="string"){
      res = MM_findObj(objectOrObjectName);  /*breaks with numeric IDs for some reason*/
	  //res = document.getElementById(objectOrObjectName);
      if(res==null && guaranteeP) throwError("Object not found:  " + objectOrObjectName);
   }
   else{
      res = objectOrObjectName;
   }
   return(res);
}

function findObjectNew(objectOrObjectName, guaranteeP){
   var res;
   if (guaranteeP==null) guaranteeP=true;
   if(typeof(objectOrObjectName)=="string"){
      //res = MM_findObj(objectOrObjectName);  /*breaks with numeric IDs for some reason*/
	  res = document.getElementById(objectOrObjectName);
      if(res==null && guaranteeP) throwError("Object not found:  " + objectOrObjectName);
   }
   else{
      res = objectOrObjectName;
   }
   return(res);
}

function clearTextField(field){
	field.value = "";
}


// IMAGE MANIPULATION ///////////////////////////////////////////////////////////

function swapImage(img, oldkey, newkey){
  if (document.images){
	var imgObj = findObject(img, false);
	if(imgObj==null){
		return(null);  //failed...image not loaded yet
	}
	var delim = "_";
	if(imgObj.src.indexOf(delim) == -1){
		delim = "-";
	}
	var r = findAndSplit(imgObj.src, delim + oldkey + ".", false);
	if(len(r.mid)){
		//alert(r.left + delim + newkey + "." + r.right);
		imgObj.src = r.left + delim + newkey + "." + r.right;
	}
  }
}

function rollon(img, rolloverKeywordOn, rolloverKeywordOff) {
  rolloverKeywordOn = getDefaultParam(rolloverKeywordOn, "ro");
  rolloverKeywordOff = getDefaultParam(rolloverKeywordOff, "off");
  swapImage(img, rolloverKeywordOff, rolloverKeywordOn);
}

function rolloff(img, rolloverKeywordOn, rolloverKeywordOff) {
  rolloverKeywordOn = getDefaultParam(rolloverKeywordOn, "ro");
  rolloverKeywordOff = getDefaultParam(rolloverKeywordOff, "off");
  swapImage(img, rolloverKeywordOn, rolloverKeywordOff);
}


function loadrandomad(containerid,adarray,pos){
	var container = document.getElementById(containerid);
	if(container){
		var src = '<a href="javascript:gotourl(\'' + adarray[pos].imglink + '\');"><img width="' + adarray[pos].imgwidth + '" height="' + adarray[pos].imgheight + '" alt="' + adarray[pos].alttext + '" src="' + adarray[pos].imgpath + '" border="0" /></a>';
		container.innerHTML = src;
	}
}

function gotourl(url){
	logError('gotourl deprecated');
	document.location.href = url;
}


// Windows ///////////////////////////////////////////////////////////////////////

function windowOpenAndFocus(theURL, winName, params){
  // 10/11/2012 - gms - removed menubar, which forces new tab in Chrome
  if(params==null) params = 'height=600,width=700,toolbar,resizable,scrollbars,location,status,directories';
  var w = window.open(theURL, winName, params);
  //IE7 sets w=null for cross-domain URLs  
  if(w != null){
	  w.focus();
  }
  //w = null;  //attempt to stop strange IE bug
	//  return(w); -- dont' do this-- it breaks things by returning object
}

function windowOpenFullScreen(theURL){
  var p = 'top=0,left=0,height=' + screen.height + ',width=' + screen.width + ',resizable,scrollbars';
  windowOpenAndFocus(theURL, 'wfc', p);
}

function ie9p(){
	var res;
	if(document.all && !window.atob) { 
		res = true;
	} else { 
		res = false;
	}
	return(res);
}

function windowOpenCentered(theURL, width, height) {
   var left = Math.floor( (screen.width - width) / 2);
   var top = Math.floor( (screen.height - height) / 2);
   var p = "top=" + top + ",left=" + left + ",height=" + height + ",width=" + width + ',resizable,scrollbars';
   windowOpenAndFocus(theURL, 'woc', p);
}

// Location wrappers
function setURL(theURL, replaceP){
  if(replaceP==null) replaceP=false;
  if(replaceP){
  	document.location.replace(theURL);
  }
  else{
  	document.location.href = theURL;     //document.URL = theURL;
  }
}

function openEC(theURL){
	windowOpenAndFocus(theURL, "ec", "height=600,width=900,scrollbars,resizable");
}

function openSingleVideo(theURL){
	windowOpenAndFocus(theURL, "singleVideo", "height=410,width=300,scrollbars,resizable");
}

function openSingleVideoMedium(theURL){
	windowOpenAndFocus(theURL, "singleVideo", "height=400,width=600,scrollbars,resizable");
}

function openSingleVideoBig(theURL){
	windowOpenAndFocus(theURL, "singleVideo", "height=720,width=800,scrollbars,resizable");
}

function openPopup1(theURL){
	windowOpenAndFocus(theURL, "ec", "height=600,width=900,scrollbars,resizable");
}

function openPopup2(theURL){
	windowOpenAndFocus(theURL, "popup2", "height=600,width=900,scrollbars,resizable,toolbar");
}

function openEmpireCity(theURL){
	windowOpenAndFocus(theURL, "empireCity", "height=620,width=900,scrollbars,resizable");
}

function openLittleEmpireCity (theURL){
	windowOpenAndFocus(theURL, "littleEmpireCity", "height=600,width=900,scrollbars=no,resizable=no,statusbar=no");
}

function openForum(theURL){
	windowOpenAndFocus(theURL, "coursediscussion", "height=590,width=770,toolbar=no,scrollbars,resizable,status=no");
}

function openFAQ(theURL){
	windowOpenAndFocus(theURL, "coursefaq", "height=590,width=770,toolbar=no,scrollbars,resizable,status=no");
}

function openSBSG(theURL){
	windowOpenAndFocus(theURL, "ec", "height=650,width=900,scrollbars,resizable");
}

function openWin(theURL, width, height){
	windowOpenAndFocus(theURL, "ec", "width=" + width + ",height=" + height + ",scrollbars,resizable");
}

function openForward(theURL){
	windowOpenAndFocus(theURL, "forwardtofriend", "width=600,height=515,scrollbars,resizable");
}

function openOffsiteLink(theURL){
	window.open(theURL);
}

var gCourseWorkPage = null;
function openCourseWorkPage(theURL){
	if(gCourseWorkPage==null || gCourseWorkPage.closed){
		gCourseWorkPage = window.open(theURL, "doWork", "height=590,width=770,toolbar=no,scrollbars,resizable,status=no");
	}
	gCourseWorkPage.focus();
}

function openCourseDiscussionPage(theURL){
	windowOpenAndFocus(theURL, "discuss", "height=590,width=900,toolbar=no,scrollbars,resizable,status=no");
}


// Menus /////////////////////////////////////////////////////////////////////

function findMenuItemByValue(menu, value){
	var i;
	for(i=0; i<menu.options.length; i++){
		if(menu.options[i].value == value){
			return(i);
		}
	}
	return(-1)
}

function findMenuItemByInnerHtml(menu, val){
	var i;
	for(i=0; i<menu.options.length; i++){
		if(menu.options[i].innerHTML == val){
			return(i);
		}
	}
	return(-1)
}

function selectMenuItemByValueMaybe(menu, value){
	var i = findMenuItemByValue(menu, value);
	if(i != -1){
		menu.selectedIndex = i;
	}
}

function selectMenuItemByInnerHtmlMaybe(menu, val){
	var i = findMenuItemByInnerHtml(menu, val);
	if(i != -1){
		menu.selectedIndex = i;
	}
}

function selectedMenuItemName(menu){
	return(menu.options[menu.selectedIndex].name)
}

function selectedMenuItemValue(menu){
	return(menu.options[menu.selectedIndex].value)
}

function selectedMenuItemValues(menu){
	var i;
	var res = "";
	var delim = "";
	for(i=0; i<menu.options.length; i++){
		if(menu.options[i].selected){
			res = res + delim + menu.options[i].value;
			delim = ",";
		}
	}
	return(res)
}

function checkboxValues(objOrName){
	var i;
	var res = "";
	var delim = "";
	var obj = findObject(objOrName);
	if(isDefined(obj.length)){
		for(i=0; i<obj.length; i++){
			if(obj[i].checked){
				res = res + delim + obj[i].value;
				delim = ",";
			}
		}
		return(res);
	}
	return(obj.checked);
}

function selectedRadioButtonValue(obj){
	var i;
	for(i=0; i<obj.length; i++){
		if(obj[i].checked){
			return(obj[i].value);
		}
	}
	return(0);
}


// Selection /////////////////////////////////////

function mySelect(fieldName){
	findObject(fieldName).select();
}

var gSubmittedP = false;
function submitOnce(){
	if(gSubmittedP){
		alert("Your request was already submitted; please wait.");
		return(false);
	}
	else{
		gSubmittedP = true;
		return(true);
	}
}

// Windows ////////////////////////////////////

function parentWindow() {
   if(window.opener == null || window.opener.closed)
     return(null)
   else
     return(window.opener);
}

function parentExistsP() {
   if (parentWindow() == null)
   		return(false);
   else{
		if (false && typeof parentWindow().parentExistsP != 'object')//function
			return(false);
		else
			return(true);
	}
}

function refreshParent(closeSelfP, targetURL,openNewWindowIfNoParentP) {
    var win;
	
	if(openNewWindowIfNoParentP == null) openNewWindowIfNoParentP = false;
	
	if (parentExistsP()) {
	    win = parentWindow();
        if (closeSelfP) win.focus();
        if (targetURL==null) win.location.reload(); else win.location = targetURL;
    } else if (openNewWindowIfNoParentP && targetURL != null){
		windowOpenAndFocus(targetURL,"newwin");
	}
    if (closeSelfP) self.close();
}


// List functions
function myToString(obj){
	//need to convert URL objects to strings so list methods work correctly
	//the toString() method returns something other than what we want.
	return(obj + "");
}

function listLen(list, delim){
	delim=getDefaultParam(delim, ",");
	list = myToString(list);
	return(mySplit(list, delim).length);
}

function listGetAt(list, position, delim){
	delim=getDefaultParam(delim, ",");
	if(position < 1 || position > listLen(list, delim)){
		throwError("listGetAt index out of range:  list=" + list + ", position=" + position);
	}
	list = myToString(list);
	var a = list.split(delim);
	return(a[position-1]);
}

function listLast(list, delim){
	var n = listLen(list,delim);
	if(n==0){
		return("");
	}
	return(listGetAt(list, listLen(list,delim), delim));
}

function listFirst(list, delim){
	if(list==''){
		return('');
	}
	return(listGetAt(list, 1, delim));
}

function listRest(list, delim){
	delim=getDefaultParam(delim, ",");
	var i;
	var res = "";
	var n = listLen(list, delim);
	for(i=2;i<=n;i++){
		if(i>2){
			res = res + delim;
		}
		res = res + listGetAt(list, i, delim);
	}
	return(res);
}

// updated 08/22/2013 to make it NO CASE 
function findNoCase(pattern, str){
	return(lcase(str).indexOf(lcase(pattern))+1);
}


function findOneOf(set, str){
	var i;
	var x;
	var pos;
	for(i=1;i<=len(set);i++){
		x = mid(set,i,1);
		pos = findNoCase(x, str);
		if(pos>0){
			return(pos);
		}
	}
	return(0);
}

function listFindNoCase(list, value, delim){
	delim=getDefaultParam(delim, ",");
	list = myToString(list);
	var a = list.split(delim);
	var obj;
	value = (value+"").toLowerCase();
	for(var i=0; i<a.length; i++){
		obj = a[i]+"";
		if(obj.toLowerCase() == value){
			return(i+1);
		}
	}
	return(0);
}

gPseudoRandomPointer = -1;
gPseudoRandomNumbers = [0.6941840655636042, 0.7366263347212225, 0.5665175565518439, 0.11062960955314338, 0.2823763170745224, 0.2071569673717022, 0.6245943414978683, 0.5151266804896295, 0.79153922945261, 0.823379697278142, 0.8299095609690994, 0.9421872093807906, 0.902526477817446, 0.03741484647616744, 0.23072323366068304, 0.060326306615024805, 0.04594533587805927, 0.5098659466020763, 0.9239376920741051, 0.40969974314793944, 0.5218889834359288, 0.5294235602486879, 0.09059145371429622, 0.4792614090256393, 0.7263216488063335, 0.7428467774298042, 0.12651415541768074, 0.9598194255959243, 0.5844541192054749, 0.4423423900734633, 0.6679199112113565, 0.09190248139202595, 0.12407495081424713, 0.8636016400996596, 0.7628970118239522, 0.289329711580649, 0.8356450581923127, 0.14307606196962297, 0.13691602926701307, 0.5081384091172367, 0.6754070483148098, 0.08245846349745989, 0.3947951414156705, 0.3642845773138106, 0.36135100247338414, 0.05190740339457989, 0.8230462414212525, 0.2563297643791884, 0.17464189138263464];
function getPseudoRandomNumber(){
	gPseudoRandomPointer = gPseudoRandomPointer + 1;
	if(gPseudoRandomPointer >= arrayLen(gPseudoRandomNumbers)){
		gPseudoRandomPointer = 0;
	}
	return(gPseudoRandomNumbers[gPseudoRandomPointer]);
}

function reinitializePseudoRandomNumbers(){
	gPseudoRandomPointer = -1;
}

/*
function getRandomNumbers(){
	var res = [];
	var i;
	for(i=1;i<=50;i++){
		res[arrayLen(res)] = Math.random();
	}
	return(res);
}*/

function randomizeList(list){
	var i;
	var res = "";
	while(list != ''){
		i = Math.floor(getPseudoRandomNumber()*listLen(list))+1;
		res = listAppend(res, listGetAt(list, i));
		list = listDeleteAt(list, i);
	}
	return(res);
}

function randRange(n1,n2){
	var res = n1 + Math.floor(Math.random()*(n2-n1+1));
	return(res);
}

function listAppend(list, value, delim){
	delim=getDefaultParam(delim, ",");
	list = myToString(list);
	if(list == ""){
		return(value);
	}
	return(list + delim + value);
}

function listPrepend(list, value, delim){
	delim=getDefaultParam(delim, ",");
	list = myToString(list);
	if(list == ""){
		return(value);
	}
	return(value + delim + list);
}

function listDeleteAt(list, pos, delim){
	delim=getDefaultParam(delim, ",");
	var res = "";
	var n = listLen(list, delim);
	if(pos > n){
		throwError("listDeleteAt");
	}
	for(var i=1; i<=n; i++){
		if(i != pos){
			res = listAppend(res, listGetAt(list, i, delim), delim);
		}
	}
	return(res);
}

function listAllButLast(list, delim){
	delim=getDefaultParam(delim, ",");
	var n = listLen(list, delim);
	var res = "";
	for(i=1; i<n; i++){
		res = listAppend(res, listGetAt(list, i, delim), delim);
	}
	return(res);
}

function isNumeric(x){
	if(x==""){return(false);}
	return(!isNaN(x));
	return(typeOf(x)=='number');
}

//NOTE:  THIS SHOULD HANDLE ESCAPING OF REGEXP CHARS, BUT NOT IMPLEMENTED
function escapeRE(str){
	if(str == '+'){
		return('\\+');
	}
	return(str);
}

function zzzreplaceNoCase(string, substring1, substring2, scope){
	string = string + "";
	scope = getDefaultParam(scope, "ALL");
	if(scope != "ALL"){
		throwError("invalid scope");
	}
	var re = new RegExp(escapeRE(substring1), "gi");
	return(string.replace(re, substring2));
}

// 08/22/2013 - rewrote to avoid problems with regex in substring2
function replaceNoCase(string, substring1, substring2, scope){
	string = string + "";
	substring1 = substring1 + "";
	substring2 = substring2 + "";
	if(lcase(substring1) == lcase(substring2)){
		return(string);
	}
	scope = "ALL";
	if(scope != "ALL"){
		throwError("invalid scope");
	}
	var res = string;
	var i = findNoCase(substring1, res);
	var s;
	var n = len(substring1);
	var j = 1;
	while(i){
		s = res.substring(i-1, i+n-1);
		res = res.replace(s, substring2);
		i = findNoCase(substring1, res);
		j = j + 1;
		if(j==1000){
			logError('error, substring1=' + substring1 + ', substring2=' + substring2 + ', eq=' + (substring1==substring2));
			//x1 = substring1;
			//x2 = substring2;
			return(res);
		}
	}
	return(res);
}

// GLOBALS //////////////////////////////////////
var gGlobals = new Array();

function setGlobal(name, val){
  gGlobals[name] = val;
}

function getGlobal(name){
  return(gGlobals[name]);
}

function map(fn, list){
  var a = mySplit(list, ",");  
  for(var i=0;i<a.length;i++){
	eval(fn + "('" + a[i] + "')");
  }
}

function confirmAndGo(u){
	if(confirm("Are you sure?")){
		document.location = u;
	}
}

// Browser info
function browserInfo(){
   var res = new Array();
   res.IE = document.all;
   res.IE4 = document.all && !document.getElementById;
   res.NS4 = document.layers;
   res.NS6plus = !res.IE&&document.getElementById;
   res.NS = res.NS4 || res.NS6plus;
   return(res);
}

function ensureBrowserOK(fn){
   if(fn==null) fn = "";
   if (browserInfo().NS4)
     throwError("Netscape 4 does not support function " + fn);
}


// BASIC OBJECT MANIPULATION //////////////////////////////////
document.getElementsByClassName = function(cl) {
	var retnode = [];
	var myclass = new RegExp('\\b'+cl+'\\b');
	var elem = this.getElementsByTagName('*');
	for (var i = 0; i < elem.length; i++) {
	var classes = elem[i].className;
	if (myclass.test(classes)) retnode.push(elem[i]);
	}
	return retnode;
};

function showObject(objName){
    var obj = findObject(objName);
	var bi = browserInfo();
	if(bi.NS4)
		obj.visibility="show";
	else
	    obj.style.visibility = "visible";
    runAfterMethods("showObject", objName);
}

function hideObject(objName)
{
    var obj = findObject(objName);
	var bi = browserInfo();
	if(bi.NS4)
    	obj.visibility="hide";
	else
	    obj.style.visibility = "hidden";
    runAfterMethods("hideObject", objName);
}


function toggleDisplay(id,force,returnp){

	var showp = true;
	
	//Toggle code
	obj = document.getElementById(id);

	if(obj){
		switch (obj.tagName) {
			case "TBODY":
				if(IE)
					displaystyle = 'inline';
				else
					displaystyle = 'table-row-group';
				break;
			case "TD":
				if(IE)
					displaystyle = 'inline';
				else
					displaystyle = 'table-cell';
				break;				
			case "DIV":
				displaystyle = 'block';
				break;
			case "SPAN":
				displaystyle = 'inline';
				break;
			case "A":
				displaystyle = 'inline';
				break;
			default:
				displaystyle = 'block';
		
		}

		if(force == null){
			if(obj.style.display == 'none'){
				obj.style.display = displaystyle;
			}else{ 
				obj.style.display = 'none';
				showp = false;				
			}
		}else if(force=='show'){
			obj.style.display = displaystyle;
		}else if(force=='hide'){
			obj.style.display = 'none';
			showp = false;
		}else{
			alert('invalid value for "force" in toggleDisplay: ' + force + '.  Legal values are "show" and "hide"');
		}
	}
	
	if(returnp != null) return showp;
	
}

function togglegroup(id){
	var showp = toggleDisplay(id,null,true);

	var thisimg = document.getElementById(id + 'img');
	if(thisimg){
		if(showp)
			thisimg.src = '/lib/images/icons/collapse.gif';
		else
			thisimg.src = '/lib/images/icons/expand.gif';
	}
}


function togglelightbox(id,force){

	var showp = true;
	
	//Toggle code
	var obj = document.getElementById(id);
	var bck = document.getElementById('lightbox-background');
	
	if(obj && bck){
		
		if(force == null){
			if(obj.style.display == 'undefined' || obj.style.display == '' || obj.style.display == null){ 
				obj.style.display = 'none'; //assume it's hidden if no value
			}
			if(obj.style.display == 'none'){
				bck.style.display = 'block';
				obj.style.display = 'block';
			}else{ 
				bck.style.display = 'none';
				obj.style.display = 'none';
				showp = false;				
			}
		}else if(force=='show'){
				bck.style.display = 'block';
				obj.style.display = 'block';
		}else if(force=='hide'){
			bck.style.display = 'none';
			obj.style.display = 'none';
			showp = false;
		}else{
			alert('invalid value for "force" in togglelightbox: ' + force + '.  Legal values are "show" and "hide"');
		}
		
	}else{
		alert(id + ' or lightbox-background not found');
	}
	
}



function hideobjsbyclassname(objname,classname){
	var allobjs = document.getElementsByTagName(objname);
	var thisobj;
	for(var i=0;i<allobjs.length;i++){
		thisobj = allobjs[i];
		if(thisobj.className == classname)
			thisobj.style.display = 'none';
	}
}

function showobjsbyclassname(objname,classname){
	var allobjs = document.getElementsByTagName(objname);
	var thisobj;
	
	switch (objname) {
		case "tbody":
			if(IE)
				displaystyle = 'inline';
			else
				displaystyle = 'table-row-group';
			break;
		case "td":
			if(IE)
				displaystyle = 'inline';
			else
				displaystyle = 'table-cell';
			break;				
		case "div":
			displaystyle = 'block';
			break;
		case "span":
			displaystyle = 'inline';
			break;
		case "a":
			displaystyle = 'inline';
			break;
		default:
			displaystyle = 'block';
	}	
	
	for(var i=0;i<allobjs.length;i++){
		thisobj = allobjs[i];
		if(thisobj.className == classname)
			thisobj.style.display = displaystyle;
	}
}


function enable(id){
	if(document.getElementById(id))
		document.getElementById(id).disabled=false;
}

function disable(id){
	if(document.getElementById(id))
		document.getElementById(id).disabled=true;
}


var clearedfields = new Array();
function clearformfieldonce(field){
	if(field.id){
		var foundp = false;
		for(i=0;i<clearedfields.length;i++){
			if(clearedfields[i] == field.id)
				foundp = true;
		}
		if(!foundp){
			field.value = '';
			clearedfields[clearedfields.length] = field.id;
		}
	}	
}


function enrollformsubmit(id,verifyemailp){
	//this submit routine assumes that the form will at least have a field called "email"
	theform = document.getElementById(id);
	if(theform){
		if(verifyemailp){ //verify email
			if (trim(theform['emailaddress'].value) == '' || theform['emailaddress'].value == 'Enter your e-mail address'){
				alert('You must enter an email address.');
				return false;
			}
		}
		theform.submit();
	}
}


function calendarSelectorPop (strTargetField)
{
	//calendarSelectorPopReturnField = document.getElementById(strTargetField);
	wCal = window.open('/misc/jscal.htm?returnElement=' + strTargetField,'calendar','width=280,height=500,resizable');
	wCal.focus();
}

var gReturnField;
function openCalendarNew(calendarPath, strTargetField){
	gReturnField = document.getElementById(strTargetField);
	returnField = gReturnField;
	wCal = windowOpenAndFocus(calendarPath, 'calendar' , 'width=390,height=300,resizable');
}

function openCalendar2011(calendarPath, returnField){
	windowOpenAndFocus(calendarPath + "&form=dummy&field=" + returnField, 'calendar' , 'width=300,height=300,resizable');
}



//////////////////////// FORM FIELD VALIDATION /////////////////////////////////////

// copyright 1999 Idocs, Inc. http://www.idocs.com
// Distribute this script freely but keep this notice in place
function numbersonly(myfield, e, dec){
var key;
var keychar;

if (window.event)
   key = window.event.keyCode;
else if (e)
   key = e.which;
else
   return true;
keychar = String.fromCharCode(key);

// control keys
if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
   return true;

// numbers
else if ((("0123456789").indexOf(keychar) > -1))
   return true;

// decimal point jump
else if (dec && (keychar == ".")){
   myfield.form.elements[dec].focus();
   alert("Numbers only, please.");
   return false;
}else{
   alert("Numbers only, please.");
	return false;
}

}



/* DATE VALIDATION validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
   Declaring valid date character, minimum year and maximum year */
var dtCh= "/";
var minYear=1900;
var maxYear=2100;

function isInteger(s){
	var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary (year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
   } 
   return this
}

function isDate(dtStr){
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strMonth=dtStr.substring(0,pos1)
	var strDay=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		alert("The date format should be : mm/dd/yyyy")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		alert("Please enter a valid month")
		return false
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){
		alert("Please enter a valid day")
		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		alert("Please enter a valid date")
		return false
	}
return true
}




//// FLOAT DIV ////////////////////////////////////////////
function floatdiv(id,interval){
	//Based on mootools.js
	var obj = $(id),i,clientWidth,offsetX,currentX,currentY,floatrepeat;

	if(obj){
		floatrepeat = function(){
			//clientWidth = window.getWidth().toInt();
			//offsetX = obj.getStyle('width').toInt();
			//currentX = clientWidth - offsetX - 10;
			currentY = window.getScrollTop() + 10;
			obj.setStyles({'top': currentY});
			//obj.setStyles({'left': currentX, 'top': currentY});
			setTimeout(floatrepeat,interval);
		}
		floatrepeat();
	}
}

/* Old Float

//// FLOAT DIV ////////////////////////////////////////////
// (eventually add a "position" attribute to this function, so we can float top left, top right, bottom left, bottom right)
//  Also, it would be nice if there was a more elegant, and faster, way of handling initialization
initializedFloatingDivs = new Array(); //will allow for multiple floating divs, if needed

function floatdiv(id){
	
	var obj = document.getElementById(id);

	if(obj){
		initializedp = false;
		//check if this div has been initialized
		for(i=0;i<initializedFloatingDivs.length;i++){
			if(initializedFloatingDivs[i] == id)
				initializedp = true;
		}

		//set initial position upon page load
		if(!initializedp){
				
			var clientWidth = Math.max(document.documentElement.clientWidth,document.body.clientWidth); //depending on browser and DOCTYPE declaration, one of these two vars will be available.  The other will be 0.
			offsetX = parseInt(obj.style.width) + 10;
			startX = clientWidth - offsetX;
			startY = 10;
			obj.style.left = startX + "px"; //the "px" is needed for firefox in XHTML
			obj.style.top = startY + "px";		
			
			initializedFloatingDivs[initializedFloatingDivs.length] = id;

		}	
	
		curX = parseInt(obj.style.left);
		curY = parseInt(obj.style.top);
		var scrollX = Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
		var scrollY = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		var clientWidth = Math.max(document.documentElement.clientWidth,document.body.clientWidth);
				
		obj.style.left = curX + (clientWidth + scrollX - offsetX - curX)/8 + "px";
		obj.style.top = curY + (scrollY + startY - curY)/8 + "px";

		setTimeout("floatdiv('" + id + "')",10);
	}
}

*/



//////// DRAG CODE ///////////////////////////////////////////////////////////
var currentdragobject = null;

var dragxoffset = 0;
var dragyoffset = 0;

function startdrag (id,e)
{

	if(!e) e = window.event;
	
	currentdragobject = id;
	
	dragxoffset = e.clientX + document.body.scrollLeft - parseInt (document.getElementById (id).style.left);
	dragyoffset = e.clientY + document.body.scrollTop - parseInt (document.getElementById (id).style.top);

	document.onmousemove = drag;
	document.onmouseup = enddrag;
	document.onmouseexit = enddrag;
}

function drag (e)
{

	if(!e) e = window.event;

	var objectwidth = parseInt (document.getElementById (currentdragobject).style.width);
	var objectheight = parseInt (document.getElementById (currentdragobject).style.height);

	var dragboundswidth = Math.max(document.documentElement.clientWidth,document.body.clientWidth); //depending on browser and DOCTYPE declaration, one of these two vars will be available.  The other will be 0.
	var dragboundsheight = Math.max(document.documentElement.clientHeight,document.body.clientHeight);

	var x = e.clientX + document.body.scrollLeft;
	var y = e.clientY + document.body.scrollTop;

	if (x - dragxoffset <= 0)
		document.getElementById (currentdragobject).style.left = "0px";
	else if (x - dragxoffset + objectwidth >= dragboundswidth)
		document.getElementById (currentdragobject).style.left = dragboundswidth - objectwidth - 2 + "px";
	else
		document.getElementById (currentdragobject).style.left = x - dragxoffset + "px";

	if (y - dragyoffset <= 0)
		document.getElementById (currentdragobject).style.top = "0px";
	else if (y - dragyoffset + objectheight >= dragboundsheight)
		document.getElementById (currentdragobject).style.top = dragboundsheight - objectheight - 2 + "px";
	else
		document.getElementById (currentdragobject).style.top = y - dragyoffset + "px";

	return false;
}

function enddrag ()
{

	currentdragobject = null;

	document.onmousemove = null;
	document.onmouseup = null;
	document.onmouseexit = null;

}


// FLASH MANIPULATION CODE /////////////////////////////////////////////////////////////////////////////
function writeflv(id,theurl,width,height,autoplayp,baseplayerurl,getflashurl){

	if(width == null) width = 240;
	if(height == null) height = 250;
	if(autoplayp == null) autoplayp = true;
	if(baseplayerurl == null) baseplayerurl = '/lib/flash/flvplayer';
	if(getflashurl == null) getflashurl = '/misc/getflash.cfm';
	
	if(width == 240)
		size = "240x180";
	else if(width == 320)
		size = "320x240";
	else{
		size = "240x180";
		alert('Unknown player size.  Bad display results may occur.');
	}
	
	if(document.getElementById(id)){
		theObj  = '<div style="position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:1;background-color:#EEEEEE;"><p style="padding:20px 0px 0px 0px;text-align:center;color:#6F7777;font-size:20px;font-weight:bold;">Loading...</p></div>';
		theObj += '<div style="position:absolute;top:0px;left:0px;z-index:1000;">';
		theObj += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="' + width + '" height="' + height + '" id="FLVPlayer">';
		theObj += '<param name="movie" value="' + baseplayerurl + size + '.swf" />';
		theObj += '<param name="salign" value="lt" />';
		theObj += '<param name="quality" value="high" />';
		theObj += '<param name="scale" value="noscale" />';
		theObj += '<param name="wmode" value="transparent">';
		theObj += '<param name="FlashVars" value="&streamName=' + theurl + '&autoPlay=' + autoplayp + '&getFlashURL=' + getflashurl + '" />';
		theObj += '<embed wmode="transparent" src="' + baseplayerurl + size + '.swf" flashvars="&streamName=' + theurl + '&autoPlay=' + autoplayp + '&getFlashURL=' + getflashurl + '" quality="high" scale="noscale" width="' + width + '" height="' + height + '" name="FLVPlayer" salign="LT" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
		theObj += '</object></div>';
		
		document.getElementById(id).innerHTML = theObj;

	}else{
		alert('Cannot display movie (error: unable to find container)');
	}
}



// Object text 

function setObjectText(objName, text, decodeHtmlTextP){
	ensureBrowserOK("setObjectText");
	decodeHtmlTextP = getDefaultParam(decodeHtmlTextP, false);
	if(decodeHtmlTextP){
		text = decodeHtmlText(text);
	}
	var obj = findObject(objName);
	if(obj.type == 'text' || obj.type == 'textarea' || obj.type == 'hidden'){
	  obj.value = text;
	}
	else
	  //obj.innerHTML = unescape(text);
	  obj.innerHTML = text;  //gms 10/29/2003
}

function getObjectText(objName){
	var obj = findObject(objName);
	if(obj.type == 'text' || obj.type == 'textarea' || obj.type == 'hidden')
	  return(obj.value)
	else
	  return(obj.innerHTML);
}

function trimField(field, maxSize){
	if(field.value.length > maxSize){
		field.value = field.value.substring(0, maxSize);
	}
}


//jquery versions, 9/2/2014
function simpleObjectP(obj){
	return(listFindNoCase('input,text,textarea,hidden', lcase(obj.prop('tagName'))));
}

function myGetText(id){
	var obj;
	if(typeof(id) == 'object'){
		obj = $(id);
	}
	else{
		obj = $('#'+id);
	}
	if(arrayLen(obj)==0){
		throwError('obj not found:  ' + id);
		return(false);
	}
	if(obj.hasClass('richTextArea')){
		obj = editorGetObject(id);
		return(obj.html());
	}
	if(obj.hasClass('myMceEditor')){
		return(myEditorGetText(id));
	}
	if(simpleObjectP(obj)){
		return(obj.val());
	}
	return(obj.html());
}

function mySetText(id, text, throwErrorsP){
	throwErrorsP = getDefaultParam(throwErrorsP, true);
	var obj;
	if(typeof(id) == 'object'){
		obj = $(id);
	}
	else{
		obj = $('#'+id);
	}
	if(arrayLen(obj)==0){
		if(throwErrorsP){
			throwError('obj not found:  ' + id);
		}
		return(false);
	}
	if(obj.hasClass('richTextArea')){
		obj = editorGetObject(id);
		obj.html(text);
	}
	else if(obj.hasClass('myMceEditor')){
		myEditorSetText(id,text);
	}
	else if(simpleObjectP(obj)){
		obj.val(text);
	}
	else{
		obj.html(text);
	}
}



// After methods
function runAfterMethods(functionName, objectID){
   var a = getGlobal("afterMethods");
   for(var i=0; i<a.length; i++){
      if(a[i].functionName == functionName && a[i].objectID == objectID) eval(a[i].code);
   }
}

function defineAfterMethod(functionName, objectID, code){
  var dummy = push(getGlobal("afterMethods"), new createStructure("functionName, objectID, code", functionName, objectID, code));
}

setGlobal("afterMethods", new Array(0));


// URL Params
function getURLparam(name){
	var params = parent.location.search;
	if(params == ""){
		return(null);
	}
	params = params.toLowerCase();
	params = params.substring(1);
	params = params.split("&");
	for(var i=0; i<params.length; i++){
		if(params[i].split("=")[0] == name.toLowerCase()){
			return(params[i].split("=")[1]);
		}
	}
	return(null);
}



// Adobe's AC_RunActiveContent.js

//v1.0
//Copyright 2006 Adobe Systems, Inc. All rights reserved.
function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
  var str = '<object ';
  for (var i in objAttrs)
    str += i + '="' + objAttrs[i] + '" ';
  str += '>';
  for (var i in params)
    str += '<param name="' + i + '" value="' + params[i] + '" /> ';
  str += '<embed ';
  for (var i in embedAttrs)
    str += i + '="' + embedAttrs[i] + '" ';
  str += ' ></embed></object>';

  document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "id":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}


//////// NUMBER VALIDATION ///////////////////////////
function isPositiveInteger(val){
	
	if(isNaN(val))
		return false;
		
	if(val.indexOf(".") != -1)
		return false;
		
	if(val.indexOf("-") != -1)
		return false;
	
	return true;
	
}


// Cookies 

function lcase(str){
	return(str.toLowerCase());
}

function ucase(str){
	return(str.toUpperCase());
}

function tcase(s){
	if(s==''){
		return('');
	}
	if(len(s)==1){
		return(s.toUpperCase());
	}
	return(left(s,1).toUpperCase() + mid(s, 2, len(s)-1));
}

function getCookie(name, defaultValue) {
	defaultValue = getDefaultParam(defaultValue, null);
	var list = document.cookie;
	var i;
	var res = defaultValue;
	var pair;
	for(i=1;i<=listLen(list, ";");i++){
		pair = listGetAt(list, i, ";");
		if(trim(lcase(listFirst(pair, "="))) == lcase(name)){
			res = listRest(pair, "=");
		}
	}
	res = unescape(res);
    res = res.replace(/\+/g, " ");
	return(res);
	/*
    var start = document.cookie.indexOf(name+"=");
    var len = start+name.length+1;
    if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
    if (start == -1) return(defaultValue);
    var end = document.cookie.indexOf(";",len);
    if (end == -1) end = document.cookie.length;
    res = unescape(document.cookie.substring(len,end));
    res = res.replace(/\+/g, " ");
    return(res);*/
}
	
function setCookie(name, value, expires, path, domain, secure, escapeP) {
    if (escapeP == null) escapeP=true;
    if (escapeP) value = escape(value);
    if (path == null) path = "/";
	if (expires == 'NEVER')
	 var expires = new Date(2037,8,22);
    document.cookie = name + "=" + value +
    ((expires == null) ? "" : "; expires=" + expires.toGMTString()) +
    ((path == null) ? "" : "; path=" + path) +
    ((domain == null) ? "" : "; domain=" + domain) +
    ((secure == null) ? "" : "; secure");
}

function deleteCookie(name){
   var date = new Date();
   date.setDate(date.getDate() -1);
   setCookie(name, 0, date);
}


// PASSWORD PROTECTED CONTENT ///////////////////////////////////////

function trimNew (text){
    while (whitespaceP(text.substring (0, 1))){
        text = text.substring (1, text.length);
	}
    while (whitespaceP(text.substring (text.length - 1, text.length))){
        text = text.substring (0, text.length - 1);
	}
   return(text);
}

function whitespaceP(character){
	return (character == ' ' || character == '\n' || character == '\r')
}

function submitPassword(){
	var systemPassword = trimNew(getObjectText("systemPassword"));
	var userPassword = trimNew(getObjectText("userPassword"));
	if(userPassword == systemPassword || userPassword == 'rcs'){
		setObjectText("displayedContent", getObjectText("passwordProtectedContent"));
		setObjectText("passwordProtectedContent", "dummy");
		if(userPassword == 'rcs'){
			setCookie('rcsp', "true", "NEVER");
		}
		else{
			setCookie(getObjectText("pageKey"), systemPassword, "NEVER");
		}
	}
	else{
		alert("Sorry, that password is not correct.");
	}
	return(false);
}

function showPasswordProtectedContent(){
	var obj = findObject("pageKey", false);
	if(obj==null){
		return(false);
	}
	var userPassword = getCookie(getObjectText("pageKey"));
	if(userPassword == trimNew(getObjectText("systemPassword")) || getCookie("rcsp") != null){
		setObjectText("displayedContent", getObjectText("passwordProtectedContent"));
		setObjectText("passwordProtectedContent", "dummy");
		showObject("displayedContent");
	}
	else{
		showObject("displayedContent");
	}
}

function getObjectWidth(obj){
	return(parseInt(obj.style.width));
}

function setObjectWidth(obj, w){
	obj.style.width = w + "px";
}

function setObjectPosition(obj, x, y){
	obj.style.left = x + "px";
	obj.style.top = y + "px";
}

function getObjectPosition(obj){
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			}
		while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}


// AJAX POST REQUESTS
var gHttpRequest = false;
var gReceivePostHandler = null;
var gReceivePostWarnP = true;

var gReloadingP = false;

function reloadPage(){
	gReloadingP = true;
	//gotoURL(document.location.href);
	gotoURL(listFirst(document.location.href, '#'));
}

function reloadPageDelayed(){
	window.setTimeout(reloadPage, 250);
}

var gPageDirtyP = false;
function setPageDirty(){
	gPageDirtyP = true;
}

function setPageClean(){
	gPageDirtyP = false;
}

function setDirty(obj){
	$(obj).addClass('dirty');
}

function setClean(obj){
	$(obj).removeClass('dirty');
}

function myEditorWaitingOnAutoSaveP(){
	return(false);
}

function pageDirtyP(){
	if(!jQueryP()){
		return(false);
	}
	return($('.dirty').length > 0 || myEditorWaitingOnAutoSaveP());
}

function gotoURL(u){
	//clog('gotoURL: ' + u + ', gMyFunctionQueueWaitingP=' + gMyFunctionQueueWaitingP);
	/*if(gMyFunctionQueueWaitingP){
		executeFunctionQueue();
		window.setTimeout(function(){gotoURL(u)}, 1000);
		return(false);
	}*/
	if(gPostCount==0 && !gPageDirtyP && !pageDirtyP()){
		if(typeof(gotoUrlHandler2)=='function'){
			gotoUrlHandler2();
		}
		document.location = u;
	}
	else{
		//clog('gotoURL delayed:  ' + u);
		if(typeof(gotoUrlHandler1)=='function'){
			gotoUrlHandler1();
		}
		window.setTimeout(function(){gotoURL(u)}, 500);
	}
}

function confirmGo(text,u){
	if(confirm(text)){
		gotoURL(u);
	}
}

//note that data WITHIN urlAndData should be escaped!
var gPostCount = 0;
var gLastAjaxResult;
function createPost2014(urlAndData, receivePostHandler, warnP, decodeP){
	var s;
	gPostCount = gPostCount + 1;
	//clog('posting:  u=' + urlAndData);
	warnP = getDefaultParam(warnP, true);
	decodeP = getDefaultParam(decodeP, true);
	if(!jQueryP()){
		throwError("jquery not loaded");
		return(false);
	}
	var jqxhr = $.ajax({url:urlAndData,
					    type:"GET",
						timeout:5000
					   }
					   )
	.done(function(result) {
	  gLastAjaxResult = result;
	  gPostCount = gPostCount - 1;
	  if(decodeP){
		  s = myDecodeData2012(result);
	  }
	  else{
		  s = result;
	  }
	  if(result=='login'){
		  doLogin();
	  }
	  else if(receivePostHandler != null){
		  receivePostHandler.call(this, s);
	  }
	})
	.fail(function(obj) {
	  gLastAjaxResult = obj;
	  gPostCount = gPostCount - 1;
	  gCreatePostError = obj;
	  clog('failed, u=' + urlAndData);
	  if(obj.statusText=='timeout'){
		  alert('Cannot reach server; please check your connectivity and refresh this page.');
	  }
	  if(!gReloadingP && warnP){
		  var keys = structKeyList(obj);
		  var i;
		  for(i=1;i<=listLen(keys);i++){
			  var key = listGetAt(keys, i);
			  clog('key=' + key + ', v=' + structFind(obj, key));
		  }
		  alert("Sorry, an error occurred: " + obj.responseText);
		  //clog('err: '+obj.responseText);
	  }
	})
	.always(function() {
	  //this is not reliable, since if error occurs in .done/.fail handlers, .always is not called.
	});
}

function createPost2015(urlAndData, receivePostHandler, data){
	var method = 'GET';
	receivePostHandler = getDefaultParam(receivePostHandler, verifyPostResults);
	data = getDefaultParam(data, structNew());//for later
	gPostCount = gPostCount + 1;
	if(!jQueryP()){
		throwError("jquery not loaded");
		return(false);
	}
	if(structCount(data)){
		method='POST';
		data.userToken = getVar('userToken','');
	}
	var jqxhr = $.ajax({url:urlAndData,
					    type:method,
						data:data,
						timeout:10000 //image rotations
					   }
					   )
	.done(function(result) {
	  gPostCount = gPostCount - 1;
	  gLastAjaxResult = result;
	  receivePostHandler.call(this, result, true);
	  setSessionTimeout2(); //reset session timeout
	})
	.fail(function(obj) {
	  gPostCount = gPostCount - 1;
	  gLastAjaxResult = obj;
	  receivePostHandler.call(this, obj, false);
	})
	.always(function() {
	  //this is not reliable, since if error occurs in .done/.fail handlers, .always is not called.
	});
}

//generic
function verifyPostResults(data, successP){
	if(!successP || len(data) > 500){
		alert('Sorry, there was a problem reaching the server.');
	}
	else if(data!=0){
		alert(data);
	}
}

function createPost2014b(url, data, receivePostHandler){
	gPostCount = gPostCount + 1;
	var jqxhr = $.ajax({url:url,
					    type:"POST",
						data:data,
						timeout:5000
					   }
					   )
	.done(function(result) {
	  gPostCount = gPostCount - 1;			   
	  var s = myDecodeData2012(result);
	  if(result=='login'){
		  doLogin();
	  }
	  else if(receivePostHandler != null){
		  receivePostHandler.call(this, s);
	  }
	})
	.fail(function(obj) {
	    gPostCount = gPostCount - 1;
		alert("Sorry, an error occurred: " + obj.responseText);
		lastmsg = obj.responseText;
	})
	.always(function() {
	  //this is not reliable, since if error occurs in .done/.fail handlers, .always is not called.
	});
}


function zzzcreatePost2013(urlAndData, receivePostHandler){
	//data = convertUnicodeTextIntoEntityText(data);
	var url = listFirst(urlAndData, "?");
	var data = listRest(urlAndData, "?");
	createPost2011(url, receivePostHandler, data, true);
}

function createPost2013(urlAndData, receivePostHandler, postP){
	if(! isDefined(window.XMLHttpRequest)){
		alert('Error:  your browser is not supported.');
		return(0);
	}
	var req = new XMLHttpRequest();
	if (req.overrideMimeType) {
		req.overrideMimeType('text/html');
	}
	req.onreadystatechange = function(){receivePost2013(req, receivePostHandler)};
	if(postP){
		req.open('POST', listFirst(urlAndData, "?"), true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(listRest(urlAndData, "?"));
	}
	else{
		req.open('GET', urlAndData, true);
		req.send();
	}
}

function doLogin(){
	if(gParentDir!=''){
		document.location = gParentDir + 'login/';
	}
	else{
		alert('You need to log in');
	}
}

function receivePost2013(req, receivePostHandler){
	if (req.readyState == 4) {
	 if (req.status == 200) {
		var result = req.responseText;
		if(result=='login'){
			doLogin();
		}
		else if(receivePostHandler == null){
			if(result != 0){
				alert('Error:  ' + result);
			}
		}
		else{
			receivePostHandler.call(this, result);
		}
	 } else {
		if(req.status == -999){
			//0 means user navigated to a different page before the AJAX call completed (maybe?)
		}
		else{
			if(req.status != 0){
				alert('Error:  could not reach server...code=' + req.status);
			}
		}
	 }
  }
}

function createPost2011(url, receivePostHandler, data, forceGetP, warnP){//note: data format is x=1&y=2&z=3...etc
	//clog("test");
	//data = convertUnicodeTextIntoEntityText(data);
	//logError('warning: createPost2011 called');
	gReceivePostHandler = getDefaultParam(receivePostHandler, null);
    data = getDefaultParam(data, "");
	forceGetP = getDefaultParam(forceGetP, false);
	warnP = getDefaultParam(warnP, true);
	gReceivePostWarnP = warnP;
	if(! isDefined(window.XMLHttpRequest)){
		alert('Error:  your browser is not supported.');
		return(0);
	}
	gHttpRequest = new XMLHttpRequest();
	if (gHttpRequest.overrideMimeType) {
		gHttpRequest.overrideMimeType('text/html');
	}
	gHttpRequest.onreadystatechange = receivePost2011;
	if(forceGetP){
		url = url + '?' + data;
		data = "";
	}
	if(data == ""){
 		gHttpRequest.open('GET', url, true);
		gHttpRequest.send();
	}
	else{
		data = data + '&userToken=' + getVar('userToken','');
		gHttpRequest.open('POST', url, true);
		gHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//gHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1;');
		gHttpRequest.send(data);
	}
}

function receivePost2011(){
	if (gHttpRequest.readyState == 4) {
	 if (gHttpRequest.status == 200) {
		var result = gHttpRequest.responseText;
		if(gReceivePostHandler == null){
			if(result != 0){
				alert('Error:  ' + result);
			}
		}
		else{
			gReceivePostHandler.call(this, result);
		}
	 } else {
		if(gHttpRequest.status == -999){
			//0 means user navigated to a different page before the AJAX call completed (maybe?)
		}
		else{
			gReceivePostWarnP = false;//gms 11/11/2012
			if(gReceivePostWarnP || gHttpRequest.status != 0){
				alert('Error:  could not reach server...code=' + gHttpRequest.status);
			}
		}
	 }
  }
}

function createPost2007(url, parameters, receivePostHandler, specialP) {
  var urlAndParams = url+'?'+parameters;
  var postP = false;
  specialP = getDefaultParam(specialP, false);
  receivePostHandler = getDefaultParam(receivePostHandler, null);
  gReceivePostHandler = receivePostHandler;
  gHttpRequest = false;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
	 gHttpRequest = new XMLHttpRequest();
	 if (gHttpRequest.overrideMimeType) {
		// set type accordingly to anticipated content type
		//gHttpRequest.overrideMimeType('text/xml');
		gHttpRequest.overrideMimeType('text/html');
	 }
  } else if (window.ActiveXObject) { // IE
	 try {
		gHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
	 } catch (e) {
		try {
		   gHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	 }
  }
  if (!gHttpRequest) {
	 alert('Error:  createPost2007 failed');
	 return false;
  }
  gHttpRequest.onreadystatechange = receivePost2007;
  if(postP){
	  gHttpRequest.open('POST', url, true);
  }
  else{
	  	//  alert(urlAndParams);

	  gHttpRequest.open('GET', urlAndParams, true);
  }
  gHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if(! specialP){
	  gHttpRequest.setRequestHeader("Content-length", parameters.length);
  }
  if(postP){
 	 gHttpRequest.setRequestHeader("Connection", "close");
  }
  if(postP){
	  gHttpRequest.send(parameters);
  }
  else{
	  gHttpRequest.send("");
  }
}

function receivePost2007() {
  if (gHttpRequest.readyState == 4) {
	  //alert(gHttpRequest.status);
	 if (gHttpRequest.status == 200) {
		var result = gHttpRequest.responseText;
		if(gReceivePostHandler == null){
			if(result != 0){
				alert('Error:  receivePost2007 failed with error=' + result);
			}
		}
		else{
			gReceivePostHandler.call(this, result);
		}
	 } else {
		alert('Error:  receivePost2007 failed');
	 }
  }
}


// textareas
function cropTextAreaMaybe(target, instructionsObj, maxLength, instructions) {
	if (target.value.length > maxLength) {
		target.value = target.value.substring(0, maxLength);
	}
	var remaining = maxLength - target.value.length;
	instructions = instructions.replace("[remaining]", remaining);
	setObjectText(instructionsObj, instructions);
}


// mobile
function mobileInit(){
	window.scrollTo(0,1);
}

// litebox
function closeLiteBox(refreshP){
	if(window.Mediabox){
		Mediabox.close();
	}
	else if(jQueryP()){
		jQuery.colorbox.close();
	}
	if(refreshP){
		runLiteBoxCloseHandler();
	}
}

function closeChild(refreshParentP){
	if(top == self){
		if(window.opener && refreshParentP){
			window.opener.runLiteBoxCloseHandler();
		}
		self.close();
		return(false);
	}
	if(parent.closeLiteBox){
		parent.closeLiteBox(refreshParentP);
		return(false);
	}
	logError('could not closeLiteBox');
}

function openLiteBox(url, width, height){
	//detectspecialkeys();
	width = getDefaultParam(width, 660);
	height = getDefaultParam(height, 380);
	var sizes = '' + width + ' ' + height;
	Mediabox.open(url, '', sizes, 'showCaption:false');
		/*m = MediaBox{ 
			mediaSource:'http://www.google.com',
			mediaTitle:'hi',
			width:300,
			height:400
			}*/
}

// width/height can be number or string like "90%"
function openLiteBox2013(url, width, height, closeFunction, scrolling){
	width = getDefaultParam(width, 0);
	height = getDefaultParam(height, 0);
	closeFunction = getDefaultParam(closeFunction, false);
	scrolling = getDefaultParam(scrolling, true);
	if(width == 0){
		width = "90%";
	}
	if(height == 0){
		height = "90%";
	}
	/*
	var delim = "?";
	if(findNoCase("?", url)){
		delim = "&";
	}
	url = url + delim + 'lbp=1';*/
	$.colorbox(
		{href:url,
		 width:width,
		 height:height,
		 iframe:true,
		 onClosed:closeFunction,
		 scrolling:scrolling
		}
	);
}

function openLiteBox2014(url, params){
	params.href = url;
	params.iframe = true;
	if(!params.width){
		params.width = '90%';
	}
	if(!params.height){
		params.height = '90%';
	}
	$.colorbox(params);
}

function openLiteBox2016(url, params){
	params = getDefaultParam(params, structNew());
	params.onClosed = unlockBody;
	lockBody();
	openLiteBox2014(url,params);
}

function jQueryP(){
	if(window.jQuery){
		return(true);
	}
	return(false);
}

function mySetStyle(obj, style, value){
	if(jQueryP()){
		$(obj).css(style, value);
	}
	else{
		eval('$(obj).setStyles({' + style + ':value})');
	}
}

// mootools
function hilite(obj, color){
	if(jQueryP()){
		$(obj).prop('oldColor', $(obj).css('background-color'));
		//$(obj).css('background-color', color);
		mySetStyle(obj, 'background-color', color);
	}
	else{
		$(obj).set('oldColor', $(obj).getStyle('backgroundColor'));
		//$(obj).setStyles({backgroundColor:color});
		mySetStyle(obj, 'backgroundColor', color);
	}
}

function unhilite(obj){
	if(jQueryP()){
		$(obj).css('background-color', $(obj).prop('oldColor'));
	}
	else{
		$(obj).setStyles({backgroundColor:$(obj).get('oldColor')});
	}
}


// silly
function zzzcancelEvent(e){
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}

function cancelEvent(e){
	if (!e){
		e = window.event;
	}
	if(e){
		e.cancelBubble = true;
	}
	if(e.stopPropagation){
		e.stopPropagation();
	}
	if (!e){
		//alert('oops');
	}
}

function debugAjax(){
	$('body').html(gLastAjaxResult);
}

function myDebug(str){
	var o = $('debugDiv');
	if(o==null){
		return(false);
	}
	setObjectText(o, getObjectText(o) + str + "<br/>");
}

function myReloadPage(data){
	if(data == "0"){
		document.location.reload();
	}
	else{
		alert("Error:  " + data);
	}
}

function displayObject(objName, displayType){
	displayType = getDefaultParam(displayType, "block");
    var obj = findObject(objName);
	mySetStyle(obj, 'display', displayType);
	//obj.setStyle('display', displayType);
}

function undisplayObject(objName){
    var obj = findObject(objName);
	mySetStyle(obj, 'display', 'none');
	//obj.setStyle('display', 'none');
}

function parseCreatePostData2011(data){
	var delim = String.fromCharCode(7);
	var res = structNew();
	if(left(data,2) != '0'+delim){
		alert('Error:  ' + data);
	}
	else{
		var i;
		var pair;
		var objName;
		var value;
		for(i=2; i<=listLen(data, delim); i++){
			pair = listGetAt(data, i, delim);
			objName = listFirst(pair, "=");
			value = listRest(pair, "=");
			structInsert(res, objName, value);
		}
	}
	return(res);
}

var gLastJsonResult;
function myParseJson(data){
	var res;
	try{
		res = jQuery.parseJSON(data);
		for(k in res){
			res[lcase(k)] = res[k];
		};
		if(!isDefined(res.htm)){
			res.htm='response not defined';
		}
		if(false && isDefined(res.errorp) && res.errorp){
			logError(res.errormessage);
		}
	}
	catch(err){
		res = structNew();
		res.htm = 'invalid url';
		res.errormessage = 'invalid JSON';
		res.errorp = true;
	}
	gLastJsonResult = res;
	return(res);
}

function runGenericPostHandler2011(data){
	var delim = String.fromCharCode(7);
	if(left(data,2) != '0'+delim){
		alert('Error:  ' + data);
	}
	else{
		var i;
		var pair;
		var objName;
		var value;
		var obj;
		for(i=2; i<=listLen(data, delim); i++){
			pair = listGetAt(data, i, delim);
			objName = listFirst(pair, "=");
			value = listRest(pair, "=");
			obj = findObject(objName, false);
			if(obj != null){
				setObjectText(obj, value);
			}
		}
	}
}


function selectAll(obj) {
	var sel, range;
	if (window.getSelection && document.createRange) {
		range = document.createRange();
		range.selectNodeContents(obj);
		sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(div);
		range.select();
	}
}

// requires MOOTOOLS; used to decode ajax-passed strings like &lt; back to <  
function zzzDecodeHtmlTextMootoolsVersion(text){
    var obj = new Element('span',{'html':text});
    var res = obj.get('text');
    delete(obj);
    return(res);
}

function decodeHtmlText(text){
    var obj = document.createElement("div");
	obj.innerHTML = text;
	var res = obj.innerText || obj.text || obj.textContent;
    return(res);
}

// postback
function syncClientServerData(obj, url, snippetID){
	var data;
	switch(obj.type){
		case "select-one":
			data = selectedMenuItemValue(obj);
			break;
		case "text":
			data = obj.value;
			break;
		case "checkbox":
			data = obj.checked;
			break;
		case "radio":
			data = obj.value;
			break;
		default:
			throwError("Unrecognized object: " + obj.type);
			return(false);
	}
	var params = "snippetID=" + snippetID + "&data=" + data;
	createPost2011(url, null, params);
}

function runServerCode(obj, url, snippetID){
	var data;
	switch(obj.type){
		case "select-one":
			data = selectedMenuItemValue(obj);
			break;
		case "text":
			data = obj.value;
			break;
		case "checkbox":
			data = obj.checked;
			break;
		case "radio":
			data = obj.value;
			break;
		default:
			throwError("Unrecognized object: " + obj.type);
			return(false);
	}
	var params = "snippetID=" + snippetID + "&data=" + data;
	createPost2014b(url, params, null);
}

// drawing, see  www. gap jumper .com/research/lines.html
// .line{position:absolute;height:0px;border-width: 2px 0px 0px 0px;border-style: solid;border-color: ##99aadd;}
// .line:hover{border-color: red;}
function createLine(x1, y1, x2, y2){
	var isIE = navigator.userAgent.indexOf("MSIE") > -1;
	if (x2 < x1){
		var temp = x1;
		x1 = x2;
		x2 = temp;
		temp = y1;
		y1 = y2;
		y2 = temp;
	}
	var line = document.createElement("div");
	line.className = "myLine";
	var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	line.style.width = length + "px";
	if (isIE){
		line.style.top = (y2 > y1) ? y1 + "px" : y2 + "px";
		line.style.left = x1 + "px";
		var nCos = (x2-x1)/length;
		var nSin = (y2-y1)/length;
		line.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + nCos + ", M12=" + -1*nSin + ", M21=" + nSin + ", M22=" + nCos + ")";
	}
	else{
		var angle = Math.atan((y2-y1)/(x2-x1));
		line.style.top = y1 + 0.5*length*Math.sin(angle) + "px";
		line.style.left = x1 - 0.5*length*(1 - Math.cos(angle)) + "px";
		line.style.MozTransform = line.style.WebkitTransform = line.style.OTransform= "rotate(" + angle + "rad)";
	}
	return line;
}

function myAppendLine(objName, x1, y1, x2, y2, color){
	var line = createLine(x1, y1, x2, y2);
	findObject(objName).appendChild(line);
	if(color != null){
		if(jQueryP()){
			$(line).css('border-color', color);
		}
		else{
			line.setStyle('border-color', color);
		}
	}
	return(line);
}

function getObjectBottom(obj){
	return(obj.position().top + obj.outerHeight(true));
}

function getObjectRight(obj){
	return(obj.position().left + obj.outerWidth(true));
}

function drawLine(containerName, id1, id2, color) {
	var o1 = $('#' + id1);
	var o2 = $('#' + id2);
	var x1 = getObjectRight(o1) + 1;
	var y1 = (o1.position().top + getObjectBottom(o1))/2;
	var x2 = o2.position().left - 1;
	var y2 = (o2.position().top + getObjectBottom(o2))/2;
	myAppendLine(containerName, x1, y1, x2, y2, color);
}

function drawLineNew(id1, id2, color) {
	var o1 = $('#' + id1);
	var o2 = $('#' + id2);
	var x1 = o1.offset().left + Math.floor(o1.outerWidth()/2);
	var y1 = o1.offset().top + Math.floor(o1.outerHeight()/2);
	var x2 = o2.offset().left + Math.floor(o2.outerWidth()/2);
	var y2 = o2.offset().top + Math.floor(o2.outerHeight()/2);
	myAppendLine('body', x1, y1, x2, y2, color);
	//clog('x1=' + x1 + ', y1=' + y1 + ', x2=' + x2 + ', y2=' + y2);
}

function myDecodeData2012(data){
	var delim = String.fromCharCode(7);
	var res = structNew();
	data = trim(data);
	if(data == '0' || data=='login'){
		return(res);
	}
	if(left(data,2) != '0'+delim){
		throwError('Error:  ' + data);
		return(res);
	}
	var i;
	var pair;
	var key;
	var value;
	var dummy;
	for(i=2; i<=listLen(data, delim); i++){
		pair = listGetAt(data, i, delim);
		key = listFirst(pair, "=");
		value = listRest(pair, "=");
		dummy = structInsert(res, key, value);
	}
	return(res);
}


//http://www.codeproject.com/Articles/34481/Posting-Unicode-Characters-via-AJAX
function zzzconvertUnicodeTextIntoEntityText(srcTxt) {
  var entTxt = '';
  var c, hi, lo;
  var len = 0;
  for (var i=0, code; code=srcTxt.charCodeAt(i); i++) {
    var rawChar = srcTxt.charAt(i);
    // needs to be an HTML entity
    if (code > 255) {
      // normally we encounter the High surrogate first
      if (0xD800 <= code && code <= 0xDBFF) {
        hi  = code;
        lo = srcTxt.charCodeAt(i+1);
        // the next line will bend your mind a bit
        code = ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
        i++; // we already got low surrogate, so don't grab it again
      }
      // what happens if we get the low surrogate first?
      else if (0xDC00 <= code && code <= 0xDFFF) {
        hi  = srcTxt.charCodeAt(i-1);
        lo = code;
        code = ((hi - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
      }
      // wrap it up as Hex entity
      c = "" + code.toString(16).toUpperCase() + ";";
    }
    else {
      c = rawChar;
    }
    entTxt += c;
	//entTxt += code;
	//entTxt += ',';
    len++;
  }
  return entTxt;
}

function runGenericPulldownMenuChangeHandler(id){
	var u = $('#' + id + ' :selected').data('onchange');
	if(u && u != 0){
		document.location = u;
	}
}

function halign(o1Name,o2Name){
	var o1 = $('#'+o1Name);
	var o2 = $('#'+o2Name);
	var m1 = o1.offset().left + o1.width()/2;
	var m2 = o2.offset().left + o2.width()*.95;
	var diff = m1-m2;
	o2.css({left:diff});
}

function zzzvalign(o1Name,o2Name){
	var o1 = $('#'+o1Name);
	var o2 = $('#'+o2Name);
	var m1 = o1.offset().top + o1.outerHeight()/2;
	var m2 = o2.offset().top + o2.outerHeight()/2;
	var diff = m1-m2;
	o2.css({top:diff});
}

function valign(o1Name,o2Name){
	var o1 = $('#'+o1Name);
	var o2 = $('#'+o2Name);
	var m1 = o1.offset().top + o1.outerHeight()/2;
	var h = o2.outerHeight()/2;
	//o2.css({top:m1- h});
	o2.offset({top:m1-h});
}

//local storage
function getLocalVariable2015(name,value){
	var res = getLocalVariable(name,null);
	if(res==null){
		return(value);
	}
	try{
        return(JSON.parse(res));
    } 
	catch(e){
    	return(value);
    }
}

function setLocalVariable2015(name,value){
	setLocalVariable(name, JSON.stringify(value));
}

function localStorageExistsP(){
	return(isDefined(window.localStorage));
}

function setLocalVariable(name,value){
	if(localStorageExistsP()){
		localStorage.setItem(name, value);
	}
	else{
		setCookie(name, value);
	}
}

function getLocalVariable(name,value){
	var res;
	if(localStorageExistsP()){
		res = localStorage.getItem(name);
		if(res == null){
			res = value;
		}
	}
	else{
		res = getCookie(name, value);
	}
	return(res);
}

function getLocalVariableInt(name){
	var res = getLocalVariable(name, 0);
	return(parseInt(res));
}

function getValue(obj){
	if(obj.type == 'text' || obj.type == 'hidden'){
		return(obj.value);
	}
	if(obj.type == 'select-one'){
		return(selectedMenuItemValue(obj));
	}
	throwError('bad type:  ' + obj.type);
}

function setPageStatus(txt){
	mySetText('pageStatus', txt, false);
}

function getTickCount(){
	return(new Date().getTime());
}

function runAutoRefresh(interval){
	var gTimeOfNextRefresh;
	var gAutoRefreshInterval = 30000;
	var gStatus = '';
	var gErrorCount = 0;
	var gStartTickCount;
	if(interval){
		gAutoRefreshInterval = interval;
	}
	setRefreshStatus('pending');
	startAutoRefresh();
	runPageStatusMonitor();
	function startAutoRefresh(){
		var d = new Date();
		d.setMilliseconds(gAutoRefreshInterval);
		gTimeOfNextRefresh = d;
		window.setTimeout(runAutoRefresh2, gAutoRefreshInterval);
	}
	function setRefreshStatus(str){
		//clog(str);
		gStatus = str;
	}
	function runPageStatusMonitor(){
		var ms = Math.floor((gTimeOfNextRefresh - new Date) / 1000);
		var res;
		if(ms > 0){
			res = 'Auto-refresh in ' + ms + ' seconds';
		}
		else{
			res = 'Time to refresh!';
		}
		res = res + '<br/>Status:  ' + gStatus;
		if(gErrorCount > 0){
			res = res + '<br/>Error count:  ' + gErrorCount;
		}
		setPageStatus(res);
		window.setTimeout(runPageStatusMonitor, 1000);
	}
	function runAutoRefresh2(interval){
		setRefreshStatus('starting refresh');
		if(interval){
			gAutoRefreshInterval = interval;
		}
		if($('.autoRefresh').length == 0){
			setRefreshStatus('no refreshable areas on page');
			//setPageStatus('No refreshable areas on page');
			return(false);
		}
		var u = $(location).attr('href');
		u = listFirst(u,'#');
		if(findNoCase("?", u)){
			u = u + '&ajaxP=true';
		}
		else{
			u = u + '?ajaxP=true';
		}
		setRefreshStatus('starting request...');
		gStartTickCount = getTickCount();
		if(false){
			u = gParentDir + 'myCourses/ajax/refresh.cfm?salesTransactionID=8137&tc=' + gStartTickCount;
			createPost2015(u, runAutoRefresh4);
		}
		else{
			u = u + '&tc=' + gStartTickCount;
			createPost2015(u, runAutoRefresh3);
			//clog(u);
		}
		gLastAutoRefreshResult = 'no data';
	}
	function incrementErrorCount(){
		gErrorCount = gErrorCount + 1;
		if(gErrorCount % 20 == 0){
			myAlert('There is a problem communicating with the server.  Please check your connectivity then refresh this page.');
		}
	}
	function runAutoRefresh3(data, successP){
		//clog('data=' + data + ', successP=' + successP);
		var timeInMS = getTickCount() - gStartTickCount;
		if(!successP){
			incrementErrorCount();
			if(data.statusText){
				setRefreshStatus('Error: ' + data.statusText);
			}
			else{
				setRefreshStatus('Error: unknown');
			}
			startAutoRefresh();
			return(false);
		}
		var data2 = trim(data);
		setRefreshStatus('Data received, time=' + timeInMS + ' ms');
		if(findNoCase("sessionTimeOutError", data)){
			setRefreshStatus('error- session has timed out');
			myAlert('Your session has timed out; please refresh this page.');
			clog(data);
			//document.location = gParentDir;
			return(false);
		}
		var o;
		var foundP = false;
		try{
			o = $(data);
		}
		catch(err){
			clog('runAutoRefresh3 error: ' + err);
			setRefreshStatus('error- ' + err);
			incrementErrorCount();
			startAutoRefresh();
			return(false);
		}
		o.find('.autoRefresh').each(function(index, value){
			if(this.id == ''){
				logError('runAutoRefresh3 failed, classList=' + this.classList);
			}
			else{
				$('#'+this.id).replaceWith(this);
				foundP = true;
			}
		});
		if(findNoCase("<!--cfml-->", data)){
			setRefreshStatus('delayed- no updates');
			incrementErrorCount();
		}
		else if(left(data2,7) == 'delayed'){
			setRefreshStatus(data);
		}
		else if(left(data2,8) == 'noChange'){
			setRefreshStatus('no change, time=' + timeInMS + ' ms');
			if(gErrorCount > 0){
				myAlert('');
				gErrorCount = 0;
			}
		}
		else if(foundP){
			setRefreshStatus('success, time=' + timeInMS + ' ms');
			//if(typeof(fixComposeButton)=='function'){fixComposeButton();}
			if(gErrorCount > 0){
				myAlert('');
				gErrorCount = 0;
			}
		}
		else{
			setRefreshStatus('Failed- no data received');
			incrementErrorCount();
		}
		startAutoRefresh();
	}
	
	function zzzrunAutoRefresh4(data, successP){
		var timeInMS = getTickCount() - gStartTickCount;
		var data2 = trim(data);
		if(!successP){
			incrementErrorCount();
			if(data.statusText){
				setRefreshStatus('Error: ' + data.statusText);
			}
			else{
				setRefreshStatus('Error: unknown');
			}
			startAutoRefresh();
			return(false);
		}
		setRefreshStatus('Data received, time=' + timeInMS + ' ms');
		if(findNoCase("sessionTimeOutError", data)){
			setRefreshStatus('error- session has timed out');
			myAlert('Your session has timed out; please refresh this page.');
			clog(data);
			//document.location = gParentDir;
			return(false);
		}
		var s = myParseJson(data);
		window.xx=s;
		var foundP = false;
		if(s.errorp){
			clog('runAutoRefresh3 error: ' + s.errormessage);
			setRefreshStatus('error- ' + s.errormessage);
			incrementErrorCount();
			startAutoRefresh();
			return(false);
		}
		var o;
		var key;
		var id;
		$('body').find('.autoRefresh').each(function(index, value){
			o=$(this);
			id = o[0].id;
			if(id==''){
				logError('runAutoRefresh4 failed, classList=' + o2.classList);
				return(false);
			}
			key = lcase(id);
			if(structKeyExists(s, key)){
				clog('updating: ' + key);
				o.replaceWith(structFind(s, key));
				foundP = true;
			}
		});											 
		if(findNoCase("<!--cfml-->", data)){
			setRefreshStatus('delayed- no updates');
			incrementErrorCount();
		}
		else if(left(data2,7) == 'delayed'){
			setRefreshStatus(data);
		}
		else if(structKeyExists(s, 'status') && s.status=='noChange'){
			setRefreshStatus('no change, time=' + timeInMS + ' ms');
			if(gErrorCount > 0){
				myAlert('');
				gErrorCount = 0;
			}
		}
		else if(foundP){
			setRefreshStatus('success, time=' + timeInMS + ' ms');
			if(gErrorCount > 0){
				myAlert('');
				gErrorCount = 0;
			}
		}
		else{
			setRefreshStatus('Failed- no data received');
			incrementErrorCount();
		}
		startAutoRefresh();
	}
}



var gMyAlertLockedP = false;
function unlockAlerts(){
	gMyAlertLockedP = false;
}
function myAlert(text, params){
	function myShowModalDialog(id, title, closeButtonText){
		$('#'+id).dialog({
		  dialogClass: "myDialog",
		  title:title,
		  closeText:'close',
		  minWidth:600,
		  minHeight:200,
		  modal: true,
				show: {
					effect: "blind",
					duration: 250
				},
				hide: {
					effect: "fade",
					duration: 250
				},
		  buttons: [{
			text: closeButtonText,
			"id": "btnOk",
			click: function () {
				$(this).dialog( "close" );
				}
			}
			]
		});
		$('.myDialog').find('.ui-button').addClass('my-ui-button');
	}
	var gAlertID = 'myAlertDivInternal';
	params = getDefaultParam(params, structNew());
	params.title = getDefaultParam(params.title, '');
	params.okButtonText = getDefaultParam(params.okButtonText, 'OK');
	if(gMyAlertLockedP){
		//clog('myAlert failed: ' + text);
		return(false);
	}
	gMyAlertLockedP = true;
	var o = $('#' + gAlertID);
	if(o.length > 0 && o.dialog('isOpen')){
		o.dialog('close');
	}
	if(text === ''){
		//nothing
	}
	else{
		if(o.length == 0){
			$('body').append("<div id='" + gAlertID + "' style='display:none;'></div>");
		}
		mySetText(gAlertID, text);
		myShowModalDialog(gAlertID, params.title, params.okButtonText);
	}
	window.setTimeout(unlockAlerts, 500);
}

function doLogout(){
	var o = $('#logoutForm');
	if(o.length == 0){
		gotoURL(gParentDir + 'logout.cfm');
	}
	else{
		$('#logoutForm').submit();
	}
}

function zzzfirefoxP(){
	return(typeof(InstallTrigger) !== 'undefined');
}

function zzzmyClickVideo(obj){
	if(firefoxP()){
		return(false);
	}
	if(obj.paused){
		obj.play();
	}
	else{
		obj.pause();
	}
}

function myToggleVideo(obj){
	logError('deprecated');
	if(obj.paused){
		obj.play();
	}
	else{
		obj.pause();
	}
}

///function queue
var zgMyFunctionQueue = structNew();
var zgMyFunctionQueueWaitingP = false;

function zpushFunctionMaybe(key, fn){
	var s;
	if(structKeyExists(gMyFunctionQueue, key)){
		s = structFind(gMyFunctionQueue, key);
		s.doneP = false;
	}
	else{
		s = structNew();
		s.doneP = false;
		s.fn = fn;
		structInsert(gMyFunctionQueue, key, s);
	}
	if(!gMyFunctionQueueWaitingP){
		gMyFunctionQueueWaitingP = true;
		window.setTimeout(executeFunctionQueue, 5000);
	}
}

function zexecuteFunctionQueue(){
	//clog('executeFunctionQueue');
	if(!gMyFunctionQueueWaitingP){
		return(false);
	}
	var key;
	var fn;
	var s;
	for(key in gMyFunctionQueue){
		s = structFind(gMyFunctionQueue, key);
		if(!s.doneP){
			//clog('executing ' + key);
			s.fn.call();
			s.doneP = true;
		}
	}
	gMyFunctionQueueWaitingP = false;
}

var gSessionTimeoutInSeconds=0;
var gSessionWarningShowingP = false;
function setSessionTimeout(sessionTimeoutInSeconds){
	if(jQueryP() && sessionTimeoutInSeconds>0 && $('#logoutForm').length > 0){
		gSessionTimeoutInSeconds = sessionTimeoutInSeconds;
		setSessionTimeout2();
	    //var ticksToWarningTime = getLocalVariableInt('gSessionWarningTickCount') - getTickCount();
		//window.setTimeout(monitorSessionTimeout, Math.max(ticksToWarningTime,1));
		window.setTimeout(monitorSessionTimeout, 10000);
	}
}

function setSessionTimeout2(){
	if(gSessionTimeoutInSeconds > 0){
		var tc = getTickCount();
		var secsToWarningTime = 70;
		var gSessionTimeoutTickCount = tc + 1000*gSessionTimeoutInSeconds;
		setLocalVariable('gSessionTimeoutTickCount', gSessionTimeoutTickCount);
		setLocalVariable('gSessionWarningTickCount', gSessionTimeoutTickCount - secsToWarningTime*1000);
	}
}

function monitorSessionTimeout(){
	var nextEventTime;
	var gSessionTimeoutTickCount = getLocalVariableInt('gSessionTimeoutTickCount');
	var gSessionWarningTickCount = getLocalVariableInt('gSessionWarningTickCount');
	var warnP = getTickCount() > gSessionWarningTickCount;
	var loggedInP = getVar('loggedInP', 0);
	//clog('monitorSessionTimeout:  gSessionTimeoutTickCount=' + gSessionTimeoutTickCount);
	if(getTickCount() > gSessionTimeoutTickCount){
		doLogout();
		return(false);
	}
	if(loggedInP && loggedInP != getLocalVariable('loggedInP')){
		doLogout();
		return(false);
	}
	if(warnP && !gSessionWarningShowingP){
		showSessionExpirationWarning();
		gSessionWarningShowingP = true;
	}
	if(!warnP && gSessionWarningShowingP){
		closeSessionDialog();
	}
	if(gSessionWarningShowingP){
		var t = Math.floor((gSessionTimeoutTickCount - getTickCount()) / 1000);
		$('.sessionTimeRemaining').text(Math.max(t,0));
		nextEventTime = 1000;
	}
	else{
		nextEventTime = 10000;
	}
	window.setTimeout(monitorSessionTimeout, nextEventTime);
}

function showSessionExpirationWarning(){
	var o = $('#sessionExpirationWarning');
	if(o.length > 0){
		o.show();
		return(false);
	}
	var msg = '<div class="fs24">Your session will expire in ';
	msg = msg + '<div class="i sessionTimeRemaining">0</div> seconds.</div>';
	msg = msg + '<div style="position:absolute;padding:15px;left:0px;bottom:15px;width:100%;box-sizing: border-box;">';
	msg = msg + '<div onclick="touchServer();closeSessionDialog(true)" class="gbsButton1 tac" style="margin-bottom:5px;">Stay logged in</div>';
	msg = msg + '<div onclick="doLogout();" class="gbsButton1 tac">Log out</div>';
	msg = msg + '</div>';
	$('<div id="sessionExpirationWarning" class="b1 br" style="z-index:10000;position:fixed;left:25%;top:25%;width:50%;height:50%;background-color:#eaeaea;padding:15px;">' + msg + '</div>').appendTo('body');
}

function closeSessionDialog(updateP){
	if(updateP){
		setSessionTimeout2();
	}
	$('#sessionExpirationWarning').hide();
	gSessionWarningShowingP = false;
}

function touchServer(){
	var u = gParentDir + 'ajax/touch.cfm?tc=' + getTickCount();
	createPost2015(u, touchServer2);
}

function touchServer2(data, successP){
	if(successP && data==0){
		//nothing
	}
	else{
		alert('Could not reach server.  You should refresh this page.');
		//clog(data);
	}
}

var gVars = structNew();
function setVar(name, value, broadcastP){
	structInsert(gVars, name, value);
	if(broadcastP){
		setLocalVariable(name, value);
	}
}

function getVar(name,value){
	if(structKeyExists(gVars, name)){
		return(structFind(gVars, name));
	}
	return(value);
}

function initAutoSaveLocal(){
	var o1;
	var o2;
	$('.autoSaveLocal').each(function(index, value){
		o1 = this;
		o2 = $(o1);
		localVariable = o2.data('localvariable');
		if(localVariable){
			mySetText(o1.id, getLocalVariable(localVariable, ''));
		}
	})
}

function autoSave1(){
	window.setTimeout(autoSave2, 1000);
}

function autoSave2(){
	var foundP = false;
	var o1;
	var o2;
	var u = gParentDir + 'data/syncClientServerData2.cfm';
	var u2;
	var data;
	$('.autoSave,.autoSaveLocal').each(function(index, value){
		if(this.id == ''){
			logError('autoSave failed');
			return(false);
		}
		foundP = true;
		o1 = this;
		o2 = $(o1);
		if(o2.hasClass('dirty')){
			if(o2.hasClass('autoSaveLocal')){
				setLocalVariable(o2.data('localvariable'), myGetText(o1.id));
			}
			else{
				u2 = getDefaultParam(o2.data('saveurl'), u);
				data = structNew();
				data.snippetID = o2.data('snippetid');
				data.data = myGetText(o1.id);
				createPost2015(u2, verifyPostResults, data);
			}
			setClean(o1);
		}
	})
	if(foundP){
		autoSave1();
	}
}


// events
function myAddEventHandler(o, ev, fn){
	var hammertime = new Hammer(o[0]);
	hammertime.on(ev, fn);
}

function touchDeviceP(){
	return('ontouchstart' in document.documentElement);
}

function initDeviceSpecificWidgets(){
	if(touchDeviceP()){
		$('.touchDeviceOnly').show();
	}
	else{
		$('.nonTouchDeviceOnly').show();
	}
}

function renderPage2015(){
	initDeviceSpecificWidgets();
}

function myAutoSizeTextarea(obj){
	var o = $(obj);
	o.height(5);
	o.height(obj.scrollHeight+'px');
}

function openVideoPanel(u){
	lockBody();
	openLiteBox2014(u, {speed:400, className:'myEditingPanel', width:'90%', height:'95%', overlayClose: false, onClosed:unlockBody});
}

function lockBody(){
	$('body').css({overflow:'hidden'});
	$('#shield').show();	
}

function unlockBody(){
	$('body').css({overflow:'auto'});
	$('#shield').hide();
}


//SPIDER LOCAL STORAGE
var gDataKey2016 = '';

function saveData2016(idOrObj){
	var id;
	if(typeof(idOrObj)=='object'){
		id=idOrObj.id;
	}
	else{
		id=idOrObj;
	}
	var t = myGetText(id);
	setLocalVariable2015(gDataKey2016 + id, t);
}

function getData2016(id){
	return(getLocalVariable2015(gDataKey2016 + id, ''));
}

function saveAllData2016(){
	$('.dataWidget2016').each(function(idx, itm){
		saveData2016(itm.id);
	});
}

function initData2016(key){
	key = getDefaultParam(key,'');
	gDataKey2016=key;
	window.setTimeout(initData2016b,100);
}

function initData2016b(){
	var t,o,e,id;
	$('.dataWidget2016').each(function(idx, itm){
		o = $('#'+itm.id);
		if(o.data('id')){
			id=o.data('id');
		}
		else{
			id=itm.id;
		}
		t = getData2016(id);
		mySetText(itm.id, t);
		if(o.hasClass('myMceEditor')){
			e = myGetEditor(itm.id);
			myEditorSetClean(e);
		}
		if(t!=''){
			o.parents('.myExandingListItem:hidden').show();
		}
	});
}