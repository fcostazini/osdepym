package ar.com.osdepym.mobile.cartilla;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Button;
import android.widget.Spinner;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.FiltroDTO;
import ar.com.osdepym.mobile.cartilla.util.AdministradorDeSpinners;
import ar.com.osdepym.mobile.cartilla.util.ListHelper;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class BuscarPorEspecialidadActivity extends AbstractActivity {

	private ListHelper listHelper = ListHelper.instance;
	private Spinner provincias;
	private Spinner localidades;
	private Spinner especialidades;
	
	// variables auxiliares para restaurar la ultima busqueda
	boolean seRestauroElUltimoValorBuscadoDeProvincia = false;
	boolean seRestauroElUltimoValorBuscadoDeLocalidad = false;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		listHelper.setContext(this);
		listHelper.load();

		setContentView(R.layout.buscar_por_especialidad);
		
		especialidades = (Spinner) findViewById(R.id.spinnerEspecialidad);
		
		especialidades.setOnItemSelectedListener(new OnItemSelectedListener() {

			@Override
			public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

				loadSpinnerProvincias(parent.getItemAtPosition(position).toString());
				
				if (!seRestauroElUltimoValorBuscadoDeProvincia) {
					seRestauroElUltimoValorBuscadoDeProvincia = true;
					
					BuscarPorEspecialidadActivity.this.provincias.setSelection(getPreferenciaPosicion(Preferencia.BUSQUEDA_PROVINCIA));
				}
				
			}

			@Override
			public void onNothingSelected(AdapterView<?> parent) {
				// TODO Auto-generated method stub
			}
			
		});

		loadSpinnerEspecialidades(especialidades);
		
		this.especialidades.setSelection(getPreferenciaPosicion(Preferencia.BUSQUEDA_ESPECIALIDAD));
		
		provincias = (Spinner) findViewById(R.id.spinnerProvincias);

		provincias.setOnItemSelectedListener(new OnItemSelectedListener() {

			@Override
			public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

				loadSpinnerLocalidades(parent.getItemAtPosition(position).toString());
				
				if (!seRestauroElUltimoValorBuscadoDeLocalidad) {
					seRestauroElUltimoValorBuscadoDeLocalidad = true;
					
					localidades.setSelection(getPreferenciaPosicion(Preferencia.BUSQUEDA_LOCALIDAD));
				}
			}

			@Override
			public void onNothingSelected(AdapterView<?> parent) {

			}
		});

		localidades = (Spinner) findViewById(R.id.spinnerLocalidad);

		Button buscar = (Button) findViewById(R.id.buttonBuscar);
		buscar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

					FiltroDTO filtro = new FiltroDTO();

					filtro.setDni(getPreferenciaString(Preferencia.BENEFICIARIO_DNI));
					filtro.setSexo(getPreferenciaString(Preferencia.BENEFICIARIO_SEXO));

					filtro.setCodEspecialidad(ListHelper.instance.getEspecialidades().get(especialidades.getSelectedItem().toString()));
					filtro.setEspecialidad(especialidades.getSelectedItem().toString());

					String provinciaElegida = provincias.getSelectedItem().toString();
					
					HashMap<String, String> localidades;
					
					if (!provinciaElegida.equals("CUALQUIERA")){
						
						filtro.setCodProvincia(ListHelper.instance.getProvincias().get(provinciaElegida));
						filtro.setProvincia(provincias.getSelectedItem().toString());
						localidades = ListHelper.instance.getLocalidades().get(filtro.getCodProvincia());
					} else {
						
						localidades = ListHelper.instance.getTodasLasLocalidades();
					}
					
					// Busca la localidad
					String localidadElegida = BuscarPorEspecialidadActivity.this.localidades.getSelectedItem().toString();
					
					if (!localidadElegida.equals("CUALQUIERA")){
						
						filtro.setCodLocalidad(localidades.get(localidadElegida));
						filtro.setLocalidad(BuscarPorEspecialidadActivity.this.localidades.getSelectedItem().toString());
					}
					
					Intent in = new Intent(getApplicationContext(), ListaPrestadoresActivity.class);

					in.putExtra("filtro", filtro);
					in.putExtra("titulo", R.string.resultado_por_especialidad);
					
					//La busqueda debe guardarse solo si fue en base a los datos obtenidos de la base y no
					//Los datos del combo por defecto, para evitar inconsistencias.
					if (hayDatosEnLaBase()){
						
						guardarPreferencia(Preferencia.BUSQUEDA_ESPECIALIDAD, especialidades.getSelectedItemPosition());
						guardarPreferencia(Preferencia.BUSQUEDA_PROVINCIA, provincias.getSelectedItemPosition());
						guardarPreferencia(Preferencia.BUSQUEDA_LOCALIDAD, BuscarPorEspecialidadActivity.this.localidades.getSelectedItemPosition());
					}


					startActivity(in);
			}
		});

	}

	/*
	 * Utils
	 */
	
	private void loadSpinnerEspecialidades(Spinner especialidades) {

		List<String> list;
		if ( hayDatosEnLaBase() ){
			
			list = new ArrayList<String>(AdministradorDeSpinners.obtenerEspecialidadesConPrestadores(this));
		} else {
			
			list = new ArrayList<String>(listHelper.getEspecialidades().keySet());
		}
		Collections.sort(list);

		super.loadSpiner(especialidades, list);
	}

	private void loadSpinnerProvincias(String especialidad) {

		List<String> list;
		list = new ArrayList<String>();

		if ( hayDatosEnLaBase() ){
			
			list.addAll(AdministradorDeSpinners.obtenerProvinciasSegunEspecialidad(this, especialidad));
		} else {
			
			list.addAll(listHelper.getProvincias().keySet());
		}
		
		Collections.sort(list);
		list.add(0,"CUALQUIERA");
		super.loadSpiner(provincias, list);
	}

	private void loadSpinnerLocalidades(String provincia) {

		String codProv = listHelper.getProvincias().get(provincia);
		
		
		HashMap<String, String> loc;
		
		//Opcion Cualquiera
		if (codProv==null){
			
			loc = listHelper.getTodasLasLocalidades();
		} else {
			
			loc = listHelper.getLocalidades().get(codProv);
		}
		List<String> list;
		
		if ( hayDatosEnLaBase() ){
			
			List<String> listaDeLocalidadesDeEsaProvincia = new ArrayList<String>(loc.keySet());
			list = new ArrayList<String>(AdministradorDeSpinners.obtenerLocalidadesSegunEspecialidadyProvincia(provincia , listaDeLocalidadesDeEsaProvincia));
		} else {
			
			list = new ArrayList<String>(loc.keySet());
		}
		
		Collections.sort(list);
		list.add(0,"CUALQUIERA");
		super.loadSpiner(localidades, list);
	}

}