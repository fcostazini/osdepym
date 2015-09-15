package ar.com.osdepym.mobile.cartilla;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Spinner;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.FiltroDTO;
import ar.com.osdepym.mobile.cartilla.util.AdministradorDeSpinners;
import ar.com.osdepym.mobile.cartilla.util.ListHelper;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class BuscarPorCercaniaActivity extends AbstractActivity {

	private ListHelper listHelper = ListHelper.instance;
	private Spinner especialidad;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		listHelper.setContext(this);
		listHelper.load();

		setContentView(R.layout.buscar_por_cercania);

		especialidad = (Spinner) findViewById(R.id.spinnerEspecialidad);
		loadSpinnerEspecialidades(especialidad);

		Button buscar = (Button) findViewById(R.id.buttonBuscar);
		buscar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				if (checkInternet()) {

					FiltroDTO filtro = new FiltroDTO();

					filtro.setDni(getPreferenciaString(Preferencia.BENEFICIARIO_DNI));
					filtro.setSexo(getPreferenciaString(Preferencia.BENEFICIARIO_SEXO));

					filtro.setCodEspecialidad(ListHelper.instance.getEspecialidades().get(especialidad.getSelectedItem().toString()));
					filtro.setEspecialidad(especialidad.getSelectedItem().toString());

					Intent in = new Intent(getApplicationContext(), MapaCercaniaActivity.class);

					in.putExtra("filtro", filtro);
					in.putExtra("titulo", R.string.resultado_por_cercania);

					//La busqueda debe guardarse solo si fue en base a los datos obtenidos de la base y no
					//Los datos del combo por defecto, para evitar inconsistencias.
					if (hayDatosEnLaBase()){
						
						guardarPreferencia(Preferencia.BUSQUEDA_CERCANIA, especialidad.getSelectedItemPosition());
					}
					
					startActivity(in);

				}
			}
		});

	}

	/*
	 * Utils
	 */

	private void loadSpinnerEspecialidades(Spinner especialidades) {

		List<String> list;
		if ( hayDatosEnLaBase() ){
			
			list = new ArrayList<String>(AdministradorDeSpinners.obtenerEspecialidadesConPrestadoresYLocacion(this));
		} else {
			
			list = new ArrayList<String>(listHelper.getEspecialidades().keySet());
		}
		Collections.sort(list);

		super.loadSpiner(especialidades, list);
		especialidades.setSelection(getPreferenciaPosicion(Preferencia.BUSQUEDA_CERCANIA));
	}

}
