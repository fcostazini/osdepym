package ar.com.osdepym.mobile.cartilla;

import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.AfiliadoDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.util.CartillaHelper;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class PrincipalActivity extends AbstractActivity implements LocationListener {

	private String nroEmergencias = "08002888000";
	private String nroAsesorComercial = "08002888432";
	private String nroAtencionAlBeneficiario = "08002887963";
	private LocationManager locationManager;
	private Location miUbicacion;
	private AfiliadoDTO afiliado;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_principal);
		
		getAfiliado();
		
		actualizarCartillaSiCorresponde(afiliado);
		
		locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		
		if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
			locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 10, this);
			
		} else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)){
			locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 10, this);
		}
		
		Button b1 = (Button) findViewById(R.id.buttonCartilla);
		b1.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				Intent in = new Intent(getApplicationContext(), BuscarActivity.class);
				startActivity(in);
			}
		});

		Button llamar1 = (Button) findViewById(R.id.buttonLLamadaUrgencias);
		llamar1.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				Location ubicacion = miUbicacion;
				
				if ( miUbicacion == null ){
					
					ubicacion = getUbicacion();
				}
				
				new TareaRegistrarLlamado(afiliado, ubicacion, getPreferenciaString(Preferencia.BENEFICIARIO_TELEFONO)).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
				
				Intent callIntent = new Intent(Intent.ACTION_CALL);
				callIntent.setData(Uri.parse("tel:" + nroEmergencias));
				startActivity(callIntent);

			}
		});

		Button llamar2 = (Button) findViewById(R.id.buttonSolicitarAsesor);
		llamar2.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				Intent callIntent = new Intent(Intent.ACTION_CALL);
				callIntent.setData(Uri.parse("tel:" + nroAsesorComercial));
				startActivity(callIntent);

			}
		});

		Button llamar3 = (Button) findViewById(R.id.buttonAtencionBeneficiario);
		llamar3.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				Intent callIntent = new Intent(Intent.ACTION_CALL);
				callIntent.setData(Uri.parse("tel:" + nroAtencionAlBeneficiario));
				startActivity(callIntent);

			}
		});

	}
	
	private void actualizarCartillaSiCorresponde(AfiliadoDTO afiliado){
		
		//Actualiza la cartilla si no se ha descargado nunca
		if ( PrestadorDTO.count(PrestadorDTO.class)<=0 ){
			actualizarCartilla(afiliado);
		}
	}

	private void actualizarCartilla(AfiliadoDTO afiliado) {

		findViewById(R.id.mensaje_sincronizando).setVisibility(View.VISIBLE);
		CartillaHelper.getInstance().sincronizarCartillaPrestadores(afiliado, this);
	}
	
	private void getAfiliado() {
		
		if ( getIntent().getSerializableExtra("afiliado") != null ){
			
			afiliado = (AfiliadoDTO) getIntent().getSerializableExtra("afiliado");
		}else {
			
			AfiliadoDTO afiliadoEnBase = AfiliadoDTO.findById(AfiliadoDTO.class, 1l);

			if ( afiliadoEnBase!=null ){
				afiliado = afiliadoEnBase;
			}else {
				
				Intent intent = new Intent(this, ConfigurarActivity.class);
				startActivity(intent);
				finish();
			}
		}
		Log.i("afiliado", afiliado.getNombre());
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.principal, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		
		switch (item.getItemId()) {
		case R.id.configurar:
			Intent configurarIntent = new Intent().setClass(this, ConfigurarActivity.class);
			startActivity(configurarIntent);
			return true;
		case R.id.actualizarCartilla:
			actualizarCartilla(afiliado);
		default:
			return false;
		}
	}
	
	@Override
	public void onLocationChanged(Location ubicacion) {
		
		miUbicacion = ubicacion;
		Log.i("location service", "Nuevo location: Latitud: " + ubicacion.getLatitude() + " Longitud: " + ubicacion.getLongitude());
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {}

	@Override
	public void onProviderEnabled(String provider) {}

	@Override
	public void onProviderDisabled(String provider) {
		
		Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		startActivity(intent);
	}
	
	public void sincronizacionCallback(){
		
		findViewById(R.id.mensaje_sincronizando).setVisibility(View.GONE);
	}

}
