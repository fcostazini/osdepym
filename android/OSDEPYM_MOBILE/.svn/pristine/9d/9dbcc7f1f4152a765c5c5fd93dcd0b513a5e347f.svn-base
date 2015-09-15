package ar.com.osdepym.mobile.cartilla;

import java.util.List;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import ar.com.osdepym.mobile.cartilla.dto.AfiliadoDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorHorario;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorTelefono;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class AbstractActivity extends Activity {

	private String PREFERENCIA_OSDEPYM = "OSDEPYM";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		requestWindowFeature(Window.FEATURE_NO_TITLE);
	}

	/*
	 * Utils
	 */

	protected void loadSpiner(Spinner spinner, List<String> lista) {

		ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, lista);

		dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

		spinner.setAdapter(dataAdapter);
	}
	
	protected void guardarPreferencia(Preferencia filtro, Integer posicion) {

		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		SharedPreferences.Editor editorPreferencias = preferencias.edit();
		editorPreferencias.putInt(filtro.getNombre(), posicion);
		editorPreferencias.commit();
	}
	
	protected void guardarPreferencia(Preferencia filtro, String nombre) {

		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		SharedPreferences.Editor editorPreferencias = preferencias.edit();
		editorPreferencias.putString(filtro.getNombre(), nombre);
		editorPreferencias.commit();
	}
	
	protected int getPreferenciaPosicion(Preferencia filtro) {

		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		Integer posicion = preferencias.getInt(filtro.getNombre(), 0);

		return posicion;
	}
	
	protected String getPreferenciaString(Preferencia preferencia) {

		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		String nombre = preferencias.getString(preferencia.getNombre(), "");

		return nombre;
	}
	
	public void borrarPreferencias(){
		
		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		SharedPreferences.Editor editorPreferencias = preferencias.edit();
		editorPreferencias.clear();
		editorPreferencias.commit();
		Log.i("OSDEPYM", "Se han borrado todas las preferencias.");
	}
	
	public void borrarBusquedasAnteriores() {
		
		SharedPreferences preferencias = getSharedPreferences(PREFERENCIA_OSDEPYM, MODE_PRIVATE);
		SharedPreferences.Editor editorPreferencias = preferencias.edit();
		
		editorPreferencias.remove(Preferencia.BUSQUEDA_CERCANIA.getNombre());
		editorPreferencias.remove(Preferencia.BUSQUEDA_ESPECIALIDAD.getNombre());
		editorPreferencias.remove(Preferencia.BUSQUEDA_LOCALIDAD.getNombre());
		editorPreferencias.remove(Preferencia.BUSQUEDA_NOMBRE.getNombre());
		editorPreferencias.remove(Preferencia.BUSQUEDA_PROVINCIA.getNombre());
		
		editorPreferencias.commit();
		
		Log.i("OSDEPYM", "Se han borrado todas las preferencias de búsquedas anteriores.");
	}
	
	protected boolean checkInternet() {

		ConnectivityManager connMgr = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

		NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
		if (networkInfo != null && networkInfo.isConnected()) {

			return true;

		}
		mostrarAlertDialog(this, "Sin conexión", "Por favor active una conexión a Internet");
		return false;
	}

	public void mostrarAlertDialog(Context context, String title, String message) {
		AlertDialog alertDialog = new AlertDialog.Builder(context).create();

		// Setting Dialog Title
		alertDialog.setTitle(title);

		// Setting Dialog Message
		alertDialog.setMessage(message);

		// Setting OK Button
		alertDialog.setButton(DialogInterface.BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
			}
		});

		// Showing Alert Message
		alertDialog.show();
	}
	
	public Location getUbicacion() {

		LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

		Criteria criteria = new Criteria();
		
		Location miUbicacion = null;
		
		String proveedor = locationManager.getBestProvider(criteria, true);
		if (proveedor != null) {
			
			miUbicacion = locationManager.getLastKnownLocation(proveedor);
		}

		return miUbicacion;
	}
	
	public void limpiarBaseSiCorresponde(AfiliadoDTO afiliado) {
		
		AfiliadoDTO afiliadoEnBase = AfiliadoDTO.findById(AfiliadoDTO.class, 1l);
		
		if (afiliadoEnBase!=null && (!afiliadoEnBase.getDni().equals(afiliado.getDni()) || !afiliadoEnBase.getSexo().equals(afiliado.getSexo())) ){
			
			PrestadorDTO.deleteAll(PrestadorDTO.class);
			PrestadorTelefono.deleteAll(PrestadorTelefono.class);
			PrestadorHorario.deleteAll(PrestadorHorario.class);
			AfiliadoDTO.deleteAll(AfiliadoDTO.class);
			Log.i("Base de Datos", "Se ha borrado la cartilla de prestadores de la base y también se ha borrado el usuario anterior: " + afiliadoEnBase.getNombre() + " DNI: " + afiliadoEnBase.getDni());
		}
	}
	
	public boolean hayDatosEnLaBase(){
		
		return PrestadorDTO.count(PrestadorDTO.class)>0;
	}

}
