package tareas;

import java.util.ArrayList;
import java.util.List;

import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.util.Log;
import ar.com.osdepym.mobile.cartilla.AbstractListActivity;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.util.ListaDePrestadoresHelper;

public class TareaBusquedaPrestadores extends AsyncTask<Void, Void, List<PrestadorDTO> > {

	
	private String especialidad;
	private String provincia;
	private String localidad;
	private String nombrePrestador;
	private AbstractListActivity activity;
	private final String PRESTADOR_BUSCA_POR_PRESTADOR__ORDER_BY = " order by nombre, calle, " + "especialidad, zona, localidad";

	public TareaBusquedaPrestadores( String especialidad, String provincia,
			String localidad, String nombrePrestador, AbstractListActivity activity ) {
				
				this.especialidad = especialidad;
				this.provincia = provincia;
				this.localidad = localidad;
				this.nombrePrestador = nombrePrestador;
				this.activity = activity;
	}
	
	@Override
	protected void onPreExecute() {
		// TODO Auto-generated method stub
		super.onPreExecute();
		activity.setProgressDialog( ProgressDialog.show(activity, "", "Buscando...", true) );
	}
	
	@Override
	protected List<PrestadorDTO> doInBackground(Void... params) {

		List<PrestadorDTO> resultado = new ArrayList<PrestadorDTO>();
		
		try {
			
			String queryWhere = construirQuery();
			
			resultado = PrestadorDTO.find(PrestadorDTO.class, queryWhere);
			
		} catch (Exception e) {

			e.printStackTrace();
			Log.e("Error obteniendo prestadores de la base", e.getMessage());
		}
		
		return resultado;
	}

	private String construirQuery() {

		String sql = " 1=1 ";

		if (especialidad != null && !especialidad.isEmpty() ) {
			sql = sql
					+ " and upper(especialidad) like '%"
					+ especialidad + "%'";
		}

		if (provincia != null && !"".equals(provincia)  && !"CUALQUIERA".equals(provincia)) {
			sql = sql + " and upper(zona) = '"
					+ provincia + "'";
		}

		if (localidad != null && !"".equals(localidad) && !"- TODAS -".equals(localidad) && !"CUALQUIERA".equals(provincia)) {
			sql = sql
					+ " and upper(localidad) = '"
					+ localidad + "'";
		}

		if (nombrePrestador != null && !"".equals(nombrePrestador)) {
			sql = sql
					+ " and upper(nombre) like '%"
					+ nombrePrestador.toUpperCase() + "%'";
		}

		sql = sql + PRESTADOR_BUSCA_POR_PRESTADOR__ORDER_BY;

		return sql;
	}
	
	@Override
	protected void onPostExecute(List<PrestadorDTO> result) {
		
		if (especialidad!=null){
			
			result = ListaDePrestadoresHelper.filtrarPorEspecialidad(result, especialidad);
		}
		
		super.onPostExecute(result);
		activity.dismissProgressDialog();
		
		activity.recibirResultado(result);
	}
	
}