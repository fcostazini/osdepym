package tareas;

import java.util.Date;

import android.os.AsyncTask;
import android.util.Log;
import ar.com.osdepym.mobile.cartilla.PrincipalActivity;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.util.CartillaHelper;
import ar.com.osdepym.mobile.cartilla.util.ServiceManager;

public class TareaSincronizarCartilla extends AsyncTask<Void, Void, Void> {

	private String dni;
	private String sexo;
	private ServiceManager sm;
	private PrincipalActivity activity;
	
	public TareaSincronizarCartilla(String dni, String sexo, PrincipalActivity activity) {
		
		this.dni = dni;
		this.sexo = sexo;
		this.sm = new ServiceManager();
		this.activity = activity;
	}
	
	@Override
	protected Void doInBackground(Void... params) {

		Date inicio = new Date();
		
		try {
			
			Log.i("SINCRONIZACION", "Sincronizando datos con el servidor...");
			
			sm.obtenerCartilla(dni, sexo, activity);
			
			Log.i("SINCRONIZACION", "La lista se ha sincronizado. Cantidad de prestadores almacenados: " + PrestadorDTO.count(PrestadorDTO.class));

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Log.e("Error obteniendo cartilla", e.getMessage());
		}
		
		Date fin = new Date();
		
		long segundos = ( fin.getTime() - inicio.getTime() ) / 1000;
		Log.i("SINCRONIZACION", "Tiempo total de sincronización: " + segundos + " segundos");
		
		return null;
	
	}

	@Override
	protected void onPostExecute(Void result) {
		
		CartillaHelper.getInstance().finalizarSincronizacion();
		super.onPostExecute(result);
	}
	
}