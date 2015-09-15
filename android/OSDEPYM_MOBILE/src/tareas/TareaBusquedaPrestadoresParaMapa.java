package tareas;

import java.util.List;

import android.app.ProgressDialog;
import ar.com.osdepym.mobile.cartilla.MapaCercaniaActivity;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.util.ListaDePrestadoresHelper;

public class TareaBusquedaPrestadoresParaMapa extends TareaBusquedaPrestadores{

	private MapaCercaniaActivity mapaCercaniaActivity;
	private String latitud;
	private String longitud;
	private String radio;

	public TareaBusquedaPrestadoresParaMapa(String idEspecialidad,
			String idProvincia, String idLocalidadBarrio,
			String nombrePrestador, String latitud, String longitud,
			String radio, MapaCercaniaActivity activity) {
	
		super(idEspecialidad, idProvincia, idLocalidadBarrio, nombrePrestador, null);
		
		this.longitud = longitud;
		this.latitud = latitud;
		this.radio = radio;
		
		this.mapaCercaniaActivity = activity;
	}
	
	@Override
	protected void onPreExecute() {
		mapaCercaniaActivity.setProgressDialog(ProgressDialog.show(mapaCercaniaActivity, "", "Buscando...", true));
	}
	
	@Override
	protected void onPostExecute(List<PrestadorDTO> result) {
		
		mapaCercaniaActivity.setListaDatos(ListaDePrestadoresHelper.filtrarUbicacionPorRadio(this.latitud, this.longitud, this.radio, result));
		mapaCercaniaActivity.dismissProgressBar();
	}
	

}
