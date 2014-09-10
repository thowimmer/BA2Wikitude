package at.fhooe.mc.ba2.wimmer.wikitude;

import java.io.IOException;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.content.res.Configuration;
import android.location.Location;
import android.os.Bundle;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.wikitude.architect.ArchitectView;
import com.wikitude.architect.ArchitectView.ArchitectConfig;

public class WikitudeMainActivity extends Activity implements
		GooglePlayServicesClient.ConnectionCallbacks,
		GooglePlayServicesClient.OnConnectionFailedListener, LocationListener {
	/*
	 * Define a request code to send to Google Play services This code is
	 * returned in Activity.onActivityResult
	 */
	private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;

	// Milliseconds per second
	private static final int MILLISECONDS_PER_SECOND = 1000;

	// Update frequency in seconds
	public static final int UPDATE_INTERVAL_IN_SECONDS = 5;

	// Update frequency in milliseconds
	private static final long UPDATE_INTERVAL = MILLISECONDS_PER_SECOND
			* UPDATE_INTERVAL_IN_SECONDS;

	// The fastest update frequency, in seconds
	private static final int FASTEST_INTERVAL_IN_SECONDS = 1;

	// A fast frequency ceiling in milliseconds
	private static final long FASTEST_INTERVAL = MILLISECONDS_PER_SECOND
			* FASTEST_INTERVAL_IN_SECONDS;

	private LocationRequest mLocationRequest;
	private LocationClient mLocationClient;
	private boolean mLocationUpdatesShouldBeReceived = false;

	// Members for layout
	private DrawerLayout mDrawerLayout;
	private ActionBarDrawerToggle mDrawerToggle;
	private ListView mDrawerList;
	private CharSequence mTitle;
	private CharSequence mDrawerTitle;
	private String[] mTitles;

	// Members for Wikitude
	private ArchitectView mArchitectView;
	private static final String LICENSE_KEY = "your-wikitude-licencse-key";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		initBA2Layout();

		mArchitectView = (ArchitectView) this.findViewById(R.id.architectView);
		final ArchitectConfig config = new ArchitectConfig(LICENSE_KEY);
		mArchitectView.onCreate(config);

		// Check if Google Play services are available
		int resultCode = GooglePlayServicesUtil
				.isGooglePlayServicesAvailable(this);

		if (ConnectionResult.SUCCESS == resultCode) {
			Log.d("Location Updates", "Google Play services are available.");
		} else {
			Log.d("Location Updates",
					"Google Play services are NOT available: ERROR CODE = "
							+ resultCode);
			Toast.makeText(this, "Google Play services are not available.",
					Toast.LENGTH_LONG).show();
			return;
		}

		mLocationClient = new LocationClient(this, this, this);
		mLocationRequest = LocationRequest.create();
		mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
		mLocationRequest.setInterval(UPDATE_INTERVAL);
		mLocationRequest.setFastestInterval(FASTEST_INTERVAL);
	}

	/**
	 * Initializes the activities layout.
	 */
	private void initBA2Layout() {
		mTitles = getResources().getStringArray(R.array.drawer_items_array);
		mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
		mDrawerList = (ListView) findViewById(R.id.left_drawer);
		NavigationDrawerAdapter adapter = new NavigationDrawerAdapter(this,
				R.layout.drawer_item, mTitles);
		mDrawerList.setAdapter(adapter);

		mDrawerList.setOnItemClickListener(new DrawerItemClickListener());

		mTitle = mDrawerTitle = getTitle();
		mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
		mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout,
				R.drawable.ic_drawer, R.string.drawer_open,
				R.string.drawer_close) {
			public void onDrawerClosed(View view) {
				super.onDrawerClosed(view);
				getActionBar().setTitle(mTitle);
			}

			public void onDrawerOpened(View drawerView) {
				super.onDrawerOpened(drawerView);
				getActionBar().setTitle(mDrawerTitle);
			}
		};
		mDrawerLayout.setDrawerListener(mDrawerToggle);

		getActionBar().setDisplayHomeAsUpEnabled(true);
		getActionBar().setHomeButtonEnabled(true);
	}

	private class DrawerItemClickListener implements
			ListView.OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> parent, View view, int position,
				long id) {
			mArchitectView.destroyObjects();

			mLocationUpdatesShouldBeReceived = false;

			try {
				switch (position) {
				case 0:
					mArchitectView.load("imagerecognition.html");
					break;
				case 1:
					mArchitectView.load("video.html");
					break;
				case 2:
					mArchitectView.load("3d.html");
					break;
				case 3:
					mArchitectView.load("poi.html");
					mLocationUpdatesShouldBeReceived = true;
					break;
				default:
					break;
				}
			} catch (IOException e) {
				e.printStackTrace();
			}

			if (mLocationUpdatesShouldBeReceived) {
				mLocationClient.requestLocationUpdates(mLocationRequest,
						WikitudeMainActivity.this);
			} else {
				if (mLocationClient.isConnected()) {
					mLocationClient
							.removeLocationUpdates(WikitudeMainActivity.this);
				}
			}

			mDrawerList.setItemChecked(position, true);
			setTitle(mTitles[position]);
			mDrawerLayout.closeDrawer(mDrawerList);
		}
	}

	@Override
	public void setTitle(CharSequence title) {
		mTitle = title;
		getActionBar().setTitle(mTitle);
	}

	@Override
	public boolean onPrepareOptionsMenu(Menu menu) {
		return super.onPrepareOptionsMenu(menu);
	}

	@Override
	protected void onPostCreate(Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);
		mArchitectView.onPostCreate();
		mDrawerToggle.syncState();
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		mDrawerToggle.onConfigurationChanged(newConfig);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.main, menu);
		return super.onCreateOptionsMenu(menu);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		if (mDrawerToggle.onOptionsItemSelected(item)) {
			return true;
		}
		switch (item.getItemId()) {
		case R.id.action_about:
			startActivity(new Intent(this, AboutActivity.class));
			return true;
		}

		return super.onOptionsItemSelected(item);
	}

	@Override
	protected void onPause() {
		super.onPause();
		mArchitectView.onPause();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		mArchitectView.onDestroy();
	}

	@Override
	protected void onResume() {
		super.onResume();
		mArchitectView.onResume();
	}

	@Override
	public void onLocationChanged(Location location) {
		// Set the new location for the ArchitectWorld
		setArchitectLocation(location);
	}

	@Override
	protected void onStart() {
		super.onStart();
		mLocationClient.connect();
	}

	@Override
	protected void onStop() {
		if (mLocationClient.isConnected()) {
			mLocationClient.removeLocationUpdates(this);
		}
		mLocationClient.disconnect();
		super.onStop();
	}

	@Override
	public void onConnected(Bundle connectionHint) {
		if (mLocationUpdatesShouldBeReceived) {
			mLocationClient.requestLocationUpdates(mLocationRequest, this);
		}
		setArchitectLocation(mLocationClient.getLastLocation());
	}

	@Override
	public void onDisconnected() {
		Log.d("Location Updates", "Connection to the location client dropped.");
	}

	@Override
	public void onConnectionFailed(ConnectionResult connectionResult) {
		/*
		 * Google Play services can resolve some errors it detects. If the error
		 * has a resolution, try sending an Intent to start a Google Play
		 * services activity that can resolve error.
		 */
		if (connectionResult.hasResolution()) {
			try {
				// Start an Activity that tries to resolve the error
				connectionResult.startResolutionForResult(this,
						CONNECTION_FAILURE_RESOLUTION_REQUEST);
			} catch (IntentSender.SendIntentException e) {
				e.printStackTrace();
			}
		} else {
			// No resolution available
			Toast.makeText(
					this,
					"No resolution is available: "
							+ connectionResult.getErrorCode(),
					Toast.LENGTH_SHORT).show();
		}
	}

	/*
	 * Handle results returned to the FragmentActivity by Google Play services
	 */
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		switch (requestCode) {
		case CONNECTION_FAILURE_RESOLUTION_REQUEST: {
			// If the result code is Activity.RESULT_OK, try to connect again
			switch (resultCode) {
			case Activity.RESULT_OK: {
				Log.d("Location Updates",
						"RESULT_OK; Connection is tried again");
				mLocationClient.connect();
				break;
			}
			default: {
				Log.d("Location Updates", "Resultcode: " + resultCode);
			}
			}
		}
		default: {
			Log.d("Location Updates", "Requestcode: " + requestCode);
		}
		}
	}

	/**
	 * Sets the new location of the ArchitectWorld if the given parameter is not
	 * null.
	 * 
	 * @param location
	 *            the new location of the client.
	 */
	private void setArchitectLocation(Location location) {
		if (location != null) {
			// check if location has altitude at certain accuracy level &
			// call architect method (the one with altitude information)
			if (location.hasAltitude() && location.hasAccuracy()
					&& location.getAccuracy() < 7) {
				mArchitectView.setLocation(location.getLatitude(),
						location.getLongitude(), location.getAltitude(),
						location.getAccuracy());
			} else {
				mArchitectView.setLocation(location.getLatitude(), location
						.getLongitude(),
						location.hasAccuracy() ? location.getAccuracy() : 1000);
			}
		}
	}
}
