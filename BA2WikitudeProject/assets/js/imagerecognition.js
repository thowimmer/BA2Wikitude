/* Disable all sensors in "IR-only" Worlds to save performance. 
   If the property is set to true, any geo-related components (such as GeoObjects and ActionRanges) are active. 
   If the property is set to false, any geo-related components will not be visible on the screen, and triggers will not fire.
 */
AR.context.services.sensors = false;

/*
 * Initialize Tracker. MyTargetCollection contains both, the TargetFH and the
 * TargetAndroid
 */
var tracker = new AR.Tracker("assets/MyTargetCollection.wtc", null);

// Get the image from the resources.
var imgResourceFH = new AR.ImageResource("assets/Resources/fhhagenberg.jpg");

// Create image drawable with the picture of the FH Hagenberg.
var overlayFH = new AR.ImageDrawable(imgResourceFH, 0.5, {
	opacity : 0.8,
	rotation : -45,
	onClick : function() {
		// FH Hagenberg website gets opened when this overlay gets clicked
		AR.context.openInBrowser("http://www.fh-ooe.at/campus-hagenberg/");
	}
});

// Create HTML drawable with a link to a dancing android
var overlayHTMLDancingAndroid = new AR.HtmlDrawable({
	uri : "http://www.nack.co.in/img/animation/android-1.gif"
}, 1, {
	offsetY : -0.15,
	onClick : function() {
		// Android website gets opened when this overlay gets clicked
		AR.context.openInBrowser("http://www.android.com/");
	}
});

// If the TargetFH is scanned the overlayFH gets added to the camera
var trackableFH = new AR.Trackable2DObject(this.tracker, "TargetFH", {
	drawables : {
		cam : overlayFH
	},
	onEnterFieldOfVision : function() {
		document.getElementById("ScanOverlay").style.visibility = "hidden";
	},
	onExitFieldOfVision : function() {
		document.getElementById("ScanOverlay").style.visibility = "visible";
	}
});

// If the TargetAndroid is scanned the overlayHTMLDancingAndroid gets added to
// the camera
var trackableAndroid = new AR.Trackable2DObject(this.tracker,"TargetAndroid",{
	drawables : {
		cam : overlayHTMLDancingAndroid
	},
	onEnterFieldOfVision : function() {
		document.getElementById("ScanOverlay").style.visibility = "hidden";
	},
	onExitFieldOfVision : function() {
		document.getElementById("ScanOverlay").style.visibility = "visible";
	}
});