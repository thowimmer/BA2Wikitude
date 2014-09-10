//**********************HELPER FUNCTIONS**********************
function disableAnimationsButtons(){
	document.getElementById("btnScale").className = "disabledButton";
	document.getElementById("btnRotate").className = "disabledButton";
}

function enableAnimationButtons(){
	document.getElementById("btnScale").className = "button";
	document.getElementById("btnRotate").className = "button";
}

function hideAnimationButtons(){
	document.getElementById("btnScale").style.visibility = "hidden";
	document.getElementById("btnRotate").style.visibility = "hidden";
}

function showAnimationButtons(){
	document.getElementById("btnScale").style.visibility = "visible";
	document.getElementById("btnRotate").style.visibility = "visible";
}

function startScaleAnimation(){
	scaleDownAnimationGroup.start();
}

function startRotateAnimation(){
	rotateAnimationGroup.start();
}

$( document ).ready(function() {
	hideAnimationButtons();
});


/* Disable all sensors in "IR-only" Worlds to save performance. 
   If the property is set to true, any geo-related components (such as GeoObjects and ActionRanges) are active. 
   If the property is set to false, any geo-related components will not be visible on the screen, and triggers will not fire.
 */
AR.context.services.sensors = false;

/*
 * Initialize Tracker. MyTargetCollection contains both, the TargetFH and the
 * TargetAndroid
 */
var tracker = new AR.Tracker("assets/MyTargetCollection.wtc", {});

var minionModel = new AR.Model("assets/Resources/minion.wt3", {
    scale: {
        x: 0.03,
        y: 0.03,
        z: 0.03
    },
    translate: {
        x: 0.0,
        y: 0.0,
        z: 0.0
    }
});

// **********************SCALE UP-DOWN ANIMATION**********************
var scaleDownX = new AR.PropertyAnimation(minionModel, "scale.x", 0.03, 0, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});
var scaleDownY = new AR.PropertyAnimation(minionModel, "scale.y", 0.03, 0, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});
var scaleDownZ = new AR.PropertyAnimation(minionModel, "scale.z", 0.03, 0, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});

var scaleUpX = new AR.PropertyAnimation(minionModel, "scale.x", 0.0, 0.03, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});
var scaleUpY = new AR.PropertyAnimation(minionModel, "scale.y", 0, 0.03, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});
var scaleUpZ = new AR.PropertyAnimation(minionModel, "scale.z", 0, 0.03, 1500, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});

//This animation will run parallel the upper 3 property animations
var scaleDownAnimationGroup = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [scaleDownX, scaleDownY, scaleDownZ], {
	onStart:function(){
		disableAnimationsButtons();
	},
	onFinish: function(){
		scaleUpAnimationGroup.start();
	}
});
var scaleUpAnimationGroup = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [scaleUpX, scaleUpY, scaleUpZ], {
	onFinish: function(){
		enableAnimationButtons();
	}
});

//**********************ROTATE-Z-X ANIMATION**********************
var rotateZ = new AR.PropertyAnimation(minionModel, "rotate.roll", 0, 360, 2000, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});

var rotateX = new AR.PropertyAnimation(minionModel, "rotate.tilt", 0, 360, 2000, {
    type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_QUAD
});

var rotateAnimationGroup = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.SEQUENTIAL, [rotateZ, rotateX], {
	onStart:function(){
		disableAnimationsButtons();
	},
	onFinish: function(){
		enableAnimationButtons();
	}
});

// If the TargetFH is scanned the minionModel gets added to the camera
var trackableFH = new AR.Trackable2DObject(this.tracker, "TargetFH", {
	drawables : {
		cam : minionModel
	},
	onEnterFieldOfVision: function(){
		showAnimationButtons();
		document.getElementById("ScanOverlay").style.visibility = "hidden";
	},
	onExitFieldOfVision: function(){
		hideAnimationButtons();
		document.getElementById("ScanOverlay").style.visibility = "visible";
	}
});

