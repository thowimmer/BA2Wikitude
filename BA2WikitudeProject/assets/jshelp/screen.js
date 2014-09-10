/**
 * @file Manages the responsive design for the screen.
 */

$( document ).ready(function() {
	var width = $( window ).width();
	var height = $( window ).height();
	
	var container = $("#Container");
	
	if(width / 1.5 <= height) {
		container.css("width", width);
		container.css("height", width/1.5);
	} else {
		container.css("width", height*1.5);
		container.css("height", height);
	}
	
	var marginLeft = (width - container.width()) / 2;
	var marginTop = (height - container.height()) / 2;
	container.css("margin-left", marginLeft);
	container.css("margin-top", marginTop);
});