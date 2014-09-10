AR.context.services.sensors = true;

var initiallyCreatedGeoObjects = false;

createRadar();

var locations = [];
var distanceLabels = [];

// The maximum distance at which objects are visible in the scene, in meters. If
// an object's distance to the user is further than the culling distance, the
// object will not be visible in the scene.
AR.context.scene.cullingDistance = 700000;

// If the user is further than maxScalingDistance, the object will not appear
// any smaller than the size it took on at maxScalingDistance
AR.context.scene.maxScalingDistance = 300000;
// If the user is closer than minScalingDistance, the object will not appear any
// bigger than the size it took on at minScalingDistance. Must be a positive
// whole number.
AR.context.scene.minScalingDistance = 5000;
//The scalingFactor controls the size the object takes on at maxScalingDistance, in percentage of the size it took on at minScalingDistance.
AR.context.scene.scalingFactor = 0.2;

// JSON object which holds the coordinates of the austrian capitals.
var jsonCapitals = {
	"Bregenz" : {
		"longitude" : 9.7451841,
		"latitude" : 47.502947,
		"altitude" : 405,
		"armorial" : "assets/Resources/vorarlberg.png"
	},
	"Eisenstadt" : {
		"longitude" : 16.5247223,
		"latitude" : 47.8452778,
		"altitude" : 182,
		"armorial" : "assets/Resources/burgenland.png"
	},
	"Graz" : {
		"longitude" : 15.4203249,
		"latitude" : 47.0796751,
		"altitude" : 350,
		"armorial" : "assets/Resources/steiermark.png"
	},
	"Innsbruck" : {
		"longitude" : 11.3927685,
		"latitude" : 47.2654296,
		"altitude" : 592,
		"armorial" : "assets/Resources/tirol.png"
	},
	"Klagenfurt" : {
		"longitude" : 14.31,
		"latitude" : 46.63,
		"altitude" : 444,
		"armorial" : "assets/Resources/kaernten.png"
	},
	"Linz" : {
		"longitude" : 14.2865628,
		"latitude" : 48.3058789,
		"altitude" : 258,
		"armorial" : "assets/Resources/oberoesterreich.png"
	},
	"Salzburg" : {
		"longitude" : 13.05,
		"latitude" : 47.7666667,
		"altitude" : 451,
		"armorial" : "assets/Resources/salzburg.png"
	},
	"Sankt Poelten" : {
		"longitude" : 15.5860448,
		"latitude" : 48.1749279,
		"altitude" : 307,
		"armorial" : "assets/Resources/niederoesterreich.png"
	},
	"Wien" : {
		"longitude" : 16.37,
		"latitude" : 48.209,
		"altitude" : 180,
		"armorial" : "assets/Resources/wien.png"
	}
};

AR.context.onLocationChanged = function(latitude, longitude, altitude, accuracy) {

	AR.logger.info('user location update: Latitude:' + latitude
			+ ' | Longitude:' + longitude + ' | Altitude:' + altitude
			+ ' |Accuracy:' + accuracy);
	if (!initiallyCreatedGeoObjects) {
		createMinion();
		createGeoObjects();
		initiallyCreatedGeoObjects = true;
	} else {
		updateLabelsOfGeoObjects();
	}	
}

function createGeoObjects() {
	for ( var capital in jsonCapitals) {
		var title = capital;
		var longitude = jsonCapitals[capital].longitude;
		var latitude = jsonCapitals[capital].latitude;
		var altitude = jsonCapitals[capital].altitude;
		var image = jsonCapitals[capital].armorial;
		var url = jsonCapitals[capital].gmapsUrl;

		var singlePoi = {
			"latitude" : latitude,
			"longitude" : longitude,
			"altitude" : altitude,
			"title" : title,
			"image" : image,
			"url" : url
		};
		createMarkerForPOI(singlePoi);
	}
}

function createMarkerForPOI(poiData) {
	
	var markerHeight = 1500;
	var labelHeight = markerHeight / 5;
	
	// Create a new GeoLocation for the marker
	var markerLocation = new AR.GeoLocation(poiData.latitude,
			poiData.longitude, poiData.altitude);

	// Save the location
	locations.push(markerLocation);

	var titleLabel = new AR.Label(poiData.title, labelHeight, {
		zOrder : 1,
		offsetY : markerHeight/2 + labelHeight,
		style : {
			textColor : '#FFFFFF',
			fontStyle : AR.CONST.FONT_STYLE.BOLD
		}
	});

	var distanceToUserInKm = markerLocation.distanceToUser() / 1000;
	var distanceLabel = new AR.Label(distanceToUserInKm.toFixed(1) + " km", labelHeight,
			{
				zOrder : 1,
				offsetY : - (markerHeight/2 + labelHeight),
				style : {
					textColor : '#FFFFFF',
					fontStyle : AR.CONST.FONT_STYLE.BOLD
				}
			});

	// Save the distance label
	distanceLabels.push(distanceLabel);

	// Load the marker image from the resources
	var markerImageResource = new AR.ImageResource(poiData.image);

	// Create image drawable with the markerImageResource
	var markerImageDrawable = new AR.ImageDrawable(markerImageResource, markerHeight, {
		zOrder : 0,
		opacity : 1.0,
		onClick : function(){
			AR.context.openInBrowser('http://maps.google.com/maps?z=12&t=m&q=loc:'+poiData.latitude+'+'+poiData.longitude);
		}
	});

	var radarCircle = new AR.Circle(0.03, {
		horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.CENTER,
		opacity : 0.8,
		style : {
			fillColor : "#ffffff"
		}
	});

	// create GeoObject
	var markerObject = new AR.GeoObject(markerLocation, {
		drawables : {
			cam : [ markerImageDrawable, titleLabel, distanceLabel ],
			radar : radarCircle
		}
	});
}

function updateLabelsOfGeoObjects() {
	for ( var i = 0; i < locations.length; i++) {
		var distanceToUserInKm = locations[i].distanceToUser() / 1000;
		distanceLabels[i].text = distanceToUserInKm.toFixed(1)+" km";
	}
}

function createMinion(){
	var relativeLocationMinion = new AR.RelativeLocation(null, 0, 0, -2);
	
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
	
	// create GeoObject at the relative location
	var minionGeoObject = new AR.GeoObject(relativeLocationMinion, {
		drawables : {
			cam : [minionModel],
		}
	});
}

function createRadar() {
	AR.radar.background = new AR.ImageResource("assets/Resources/radar.png");

	AR.radar.positionX = 0.1;
	AR.radar.positionY = 0.1;
	AR.radar.width = 0.4;

	AR.radar.centerX = 0.5;
	AR.radar.centerY = 0.5;
	AR.radar.radius = 0.4;

	AR.radar.northIndicator.image = new AR.ImageResource(
			"assets/Resources/north_arrow.png");

	AR.radar.northIndicator.radius = 0.4;

	AR.radar.enabled = true;

	AR.radar.maxDistance = 700000;
}