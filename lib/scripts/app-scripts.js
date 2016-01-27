/* app scripts

Greg Saunders
Copyright 2016

Change log:
  01/27/2016 - gms - created
*/

function displayURL(u){
	data = structNew();
	data.iphoneAjaxCode = 1118;
	createPost2015(u, displayURL2, data);
}

function displayURL2(data){
	var d = JSON.parse(data);
	mySetText('data', d.htm);
}