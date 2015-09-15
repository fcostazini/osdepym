package ar.com.osdepym.mobile.cartilla;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import tareas.TareaBusquedaPrestadoresParaMapa;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.FiltroDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.util.PrestadorInfoWindowAdapter;
import ar.com.osdepym.mobile.cartilla.util.RadiosDeBusquedaHelper;
import ar.com.osdepym.mobile.cartilla.util.ServiceManager;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class MapaCercaniaActivity extends AbstractActivity implements LocationListener, OnItemSelectedListener {

	private LatLng punto;
	private GoogleMap googleMap;
	private List<PrestadorDTO> listaDatos = new ArrayList<PrestadorDTO>();
	private HashMap<String, PrestadorDTO> markerToPrestador = new HashMap<String, PrestadorDTO>();
	private FiltroDTO filtro;
	PrestadorDTO prestadorSeleccionado;

	double latitude;
	double longitud;
	ProgressDialog progressDialog;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		filtro = (FiltroDTO) getIntent().getSerializableExtra("filtro");

		setContentView(R.layout.mapa_cercania);

		crearComboBox();
	}

	private void crearComboBox() {
		Spinner spinner = (Spinner) findViewById(R.id.kilometros_spinner);
		ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
				R.array.kilometros_array, android.R.layout.simple_spinner_item);
		adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		spinner.setAdapter(adapter);
		spinner.setOnItemSelectedListener(this);
	}

	/**
	 * Se setea en el filtro la latitud y la longitud actual
	 * 
	 * @param filtro
	 * @return
	 */
	private FiltroDTO getUbicacion(FiltroDTO filtro) {

		LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

		Criteria criteria = new Criteria();

		String provider = locationManager.getBestProvider(criteria, true);
		if (provider != null) {
			locationManager.requestLocationUpdates(provider, 400, 1, this);

			Location location = locationManager.getLastKnownLocation(provider);

			if (location != null) {
				filtro.setLatitud(Double.toString(location.getLatitude()));
				filtro.setLongitud(Double.toString(location.getLongitude()));
				punto = new LatLng(location.getLatitude(), location.getLongitude());
			}
		}

		return filtro;
	}

	/**
	 * Ubica los puntos sobre el mapa
	 * 
	 */
	private void pintarMapa() {

		// Mapa
		try {
			if (googleMap == null) {
				googleMap = ((MapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();
			}
			//Limpia los resultados de la búsqueda anterior
			googleMap.clear();
			// Marca los prestadores en el mapa
			for (PrestadorDTO prestador : listaDatos) {

				LatLng punto = new LatLng(prestador.getLatitud(), prestador.getLongitud());
				StringBuffer snippetBuffer = new StringBuffer();
				
				if ( prestador.getDireccion()!=null){
					snippetBuffer.append(prestador.getDireccion());
				}
				snippetBuffer.append("\n\n").append(getString(R.string.ver_detalle));
				
				Marker m = googleMap.addMarker(new MarkerOptions().position(punto).title(prestador.getNombre())
						.snippet(snippetBuffer.toString()));
				markerToPrestador.put(m.getId(), prestador);
			}

			googleMap.setInfoWindowAdapter(new PrestadorInfoWindowAdapter(getLayoutInflater()));
			googleMap.setOnInfoWindowClickListener(new GoogleMap.OnInfoWindowClickListener() {

				@Override
				public void onInfoWindowClick(Marker marker) {
					prestadorSeleccionado = markerToPrestador.get(marker.getId());
					if (prestadorSeleccionado != null) {
						
						Intent in = new Intent(getApplicationContext(), PrestadorActivity.class);
						in.putExtra("EspecialistaDTO", prestadorSeleccionado);
						startActivity(in);
					}
				}
			});
			googleMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);

			// Se marca el punto donde se encuentra el dispositivo
			if (punto != null) {

				MarkerOptions marker = new MarkerOptions().position(punto).title("Usted esta aquí");
				marker.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN));

				googleMap.addMarker(marker);
			}

		} catch (Exception e) {
			Log.e(e.getMessage(), e.getCause().toString());
		}

	}

	/**
	 * 
	 * @author Andres
	 * 
	 */
	private class Tarea extends AsyncTask<Void, Void, Void> {

		@Override
		protected Void doInBackground(Void... params) {

			ServiceManager sm = new ServiceManager();
			try {
				listaDatos = sm.buscar(filtro);

				runOnUiThread(new Runnable() {
					public void run() {

						pintarMapa();
					}
				});

			} catch (Exception e) {
				Log.e(e.getMessage(), e.getCause().toString());
			}

			return null;
		}

		@Override
		protected void onPreExecute() {
			super.onPreExecute();
			MapaCercaniaActivity.this.progressDialog = ProgressDialog.show(MapaCercaniaActivity.this, "", "Buscando...", true);
		}

		@Override
		protected void onPostExecute(Void result) {
			super.onPostExecute(result);
			MapaCercaniaActivity.this.progressDialog.dismiss();
		}
	}

	@Override
	public void onLocationChanged(Location location) {
		filtro.setLatitud(Double.toString(location.getLatitude()));
		filtro.setLongitud(Double.toString(location.getLongitude()));
		punto = new LatLng(location.getLatitude(), location.getLongitude());
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {

	}

	@Override
	public void onProviderEnabled(String provider) {

	}

	@Override
	public void onProviderDisabled(String provider) {
		Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		startActivity(intent);

	}

	@Override
	public void onItemSelected(AdapterView<?> parent, View view, int position,
			long id) {
		
		String radioDeBusqueda = RadiosDeBusquedaHelper.getRadioDeBusqueda(parent.getItemAtPosition(position).toString());
		Log.i("Radio de búsqueda seleccionado: ", radioDeBusqueda);
		filtro.setRadioDeBusqueda(radioDeBusqueda);
		ubicarPrestadoresEnMapa();
	}

	private void ubicarPrestadoresEnMapa() {
		
		getUbicacion(filtro);

		if (googleMap == null) {
			googleMap = ((MapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();
		}

		if (punto != null) {
			googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(punto, 15));
			
			//Si la cartilla no fue almacenada en la base todavía, utiliza en endpoint viejo hasta que haya datos.
			if ( !hayDatosEnLaBase() ){

				Log.i("ESTRATEGIA", "Buscando datos desde el servidor");
				new Tarea().execute();
			} else {
				
				Log.i("ESTRATEGIA", "Buscando datos desde la base");
				new TareaBusquedaPrestadoresParaMapa(filtro.getEspecialidad(), filtro.getCodProvincia()
								, filtro.getCodLocalidad(), filtro.getNombreEspecialista(), filtro.getLatitud(), 
								filtro.getLongitud(), filtro.getRadioDeBusqueda(), this)
				.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
			}
		} else {
			LatLng llArgentina = new LatLng(-38.4192641, -63.5989206);
			googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(llArgentina, 4));

			this.mostrarAlertDialog(this, "Ubicación Inactiva",
					"No hay fuentes de ubicación disponibles\nActive alguna fuente de ubicación y vuelva a intentar la búsqueda");

		}
	}
	
	public void setListaDatos(final List<PrestadorDTO> listaDatos) {

		runOnUiThread(new Runnable() {
			
			@Override
			public void run() {
				MapaCercaniaActivity.this.listaDatos = listaDatos;
				MapaCercaniaActivity.this.pintarMapa();
			}
		});
	}
	
	@Override
	public void onNothingSelected(AdapterView<?> parent) {
	}
	
	public void setProgressDialog(ProgressDialog dialog){
		this.progressDialog = dialog;
	}
	
	public void dismissProgressBar(){
		this.progressDialog.dismiss();
	}
	
}

