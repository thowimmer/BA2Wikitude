/* Disable all sensors in "IR-only" Worlds to save performance. 
   If the property is set to true, any geo-related components (such as GeoObjects and ActionRanges) are active. 
   If the property is set to false, any geo-related components will not be visible on the screen, and triggers will not fire.
 */
AR.context.services.sensors = false;

/*
 * Initialize Tracker. 
 * MyTargetCollection contains both, the TargetFH and the TargetAndroid
 */
var tracker = new AR.Tracker("assets/MyTargetCollection.wtc", {});

// Create video drawable with the height of an half SDU
var overlayVideo = new AR.VideoDrawable("assets/Resources/HagenbergRulez.mp4",
		0.5);

// Flag to check if video have already been paused
var videoHaveBeenPaused = false;

// If the TargetFH is scanned the overlayVideo gets added to the camera
var trackableFH = new AR.Trackable2DObject(this.tracker, "TargetFH", {
	drawables : {
		cam : overlayVideo
	},
	onEnterFieldOfVision : function() {
		// If video have not been paused, play the video in a invinite loop, otherwise resume the video
		if (videoHaveBeenPaused) {
			overlayVideo.resume();
		} else {
			overlayVideo.play(-1);
		}
		document.getElementById("ScanOverlay").style.visibility = "hidden";
	},
	onExitFieldOfVision : function() {
		videoHaveBeenPaused = true;
		overlayVideo.pause();
		document.getElementById("ScanOverlay").style.visibility = "visible";
	}
});