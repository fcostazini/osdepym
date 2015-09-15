package ar.com.osdepym.mobile.cartilla.util;

import tareas.TareaSincronizarCartilla;
import android.os.AsyncTask;
import ar.com.osdepym.mobile.cartilla.PrincipalActivity;
import ar.com.osdepym.mobile.cartilla.dto.AfiliadoDTO;

public class CartillaHelper {

	private static CartillaHelper instancia = null;
	private boolean estaSincronizandoCartilla = false;
	private PrincipalActivity activity;

	protected CartillaHelper() {}

	public static CartillaHelper getInstance() {
		
		if (instancia == null) {
			instancia = new CartillaHelper();
		}
		return instancia;
	}
	
	public void sincronizarCartillaPrestadores(AfiliadoDTO afiliado, PrincipalActivity activity){
		
		if ( !estaSincronizandoCartilla ){

			estaSincronizandoCartilla = true;
			this.activity = activity;
			//Borra las búsquedas anteriores ya que pueden no ser consistentes con la nueva lista
			//de prestadores a descargar.
			this.activity.borrarBusquedasAnteriores();

			new TareaSincronizarCartilla(afiliado.getDni(), afiliado.getSexo(), activity)
			.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
		}
	}
	
	public void finalizarSincronizacion(){
		
		estaSincronizandoCartilla = false;
		activity.sincronizacionCallback();
	}
}
