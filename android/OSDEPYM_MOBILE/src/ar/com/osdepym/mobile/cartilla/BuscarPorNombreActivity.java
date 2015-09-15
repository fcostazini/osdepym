package ar.com.osdepym.mobile.cartilla;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.FiltroDTO;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class BuscarPorNombreActivity extends AbstractActivity {

	private EditText nombrePrestador;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.buscar_por_nombre);
		
		nombrePrestador = (EditText) findViewById(R.id.editNombrePrestador);
		nombrePrestador.setText(getPreferenciaString(Preferencia.BUSQUEDA_NOMBRE));

		Button buscar = (Button) findViewById(R.id.buttonBuscar);
		buscar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

					FiltroDTO filtro = new FiltroDTO();

					filtro.setDni(getPreferenciaString(Preferencia.BENEFICIARIO_DNI));
					filtro.setSexo(getPreferenciaString(Preferencia.BENEFICIARIO_SEXO));

					filtro.setNombreEspecialista(nombrePrestador.getText().toString());

					Intent in = new Intent(getApplicationContext(), ListaPrestadoresActivity.class);

					in.putExtra("filtro", filtro);
					in.putExtra("titulo", R.string.resultado_por_nombre);

					guardarPreferencia(Preferencia.BUSQUEDA_NOMBRE, nombrePrestador.getText().toString());
					
					startActivity(in);

			}
		});

	}

}
