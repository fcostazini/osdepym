package ar.com.osdepym.mobile.cartilla;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.dto.AfiliadoDTO;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;
import ar.com.osdepym.mobile.cartilla.util.ServiceManager;

public class ConfigurarActivity extends AbstractActivity {

	ProgressDialog progressDialog;
	private EditText editTextDni;
	private EditText editTextTelefono;
	String sexoAfiliadoFiltro;
	String telefonoAfiliadoFiltro;
	AfiliadoDTO afiliado;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.configurar);

		editTextDni = (EditText) findViewById(R.id.editTextNroAfiliado);
		editTextDni.setText(super.getPreferenciaString(Preferencia.BENEFICIARIO_DNI));
		
		editTextTelefono = (EditText) findViewById(R.id.editTextCelular);
		editTextTelefono.setText(super.getPreferenciaString(Preferencia.BENEFICIARIO_TELEFONO));

		RadioGroup radioSexo = (RadioGroup) findViewById(R.id.radioSexo);
		for (int i = 0; i < radioSexo.getChildCount(); i++) {
			RadioButton radioHijo = (RadioButton) radioSexo.getChildAt(i);
			if (super.getPreferenciaString(Preferencia.BENEFICIARIO_SEXO).equals(radioHijo.getTag())) {
				radioHijo.setChecked(true);
			}
		}

		Button guardar = (Button) findViewById(R.id.buttonGuardar);

		// Action para guardar las configuraciones
		guardar.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {

				RadioGroup radioSexo = (RadioGroup) findViewById(R.id.radioSexo);
				RadioButton sexoElegido = (RadioButton) findViewById(radioSexo.getCheckedRadioButtonId());
				ConfigurarActivity.this.sexoAfiliadoFiltro = (String) sexoElegido.getTag();

				new Tarea().execute();
			}

		});
	}

	public void afiliadoCorrecto(AfiliadoDTO afiliado) {

		borrarPreferencias();
		guardarAfiliadoEnBase(afiliado);
		
		guardarPreferencia(Preferencia.BENEFICIARIO_DNI, editTextDni.getText().toString());
		guardarPreferencia(Preferencia.BENEFICIARIO_TELEFONO, editTextTelefono.getText().toString());
		
		RadioGroup radioSexo = (RadioGroup) findViewById(R.id.radioSexo);
		RadioButton sexoElegido = (RadioButton) findViewById(radioSexo.getCheckedRadioButtonId());
		
		guardarPreferencia(Preferencia.BENEFICIARIO_SEXO, (String) sexoElegido.getTag());

		Intent mainIntent = new Intent().setClass(ConfigurarActivity.this, PrincipalActivity.class);
		mainIntent.putExtra("afiliado", afiliado);
		startActivity(mainIntent);

		finish();
	}

	private void guardarAfiliadoEnBase(AfiliadoDTO afiliado) {
		
		limpiarBaseSiCorresponde(afiliado);
		afiliado.setId(1l);
		afiliado.save();
		Log.i("Base de Datos", "Se ha guardado el afiliado: " + afiliado.getNombre() + " DNI: " + afiliado.getDni());
	}

	public void afiliadoIncorrecto() {
		this.mostrarAlertDialog(this, null, "Afiliado incorrecto");
	}

	@Override
	public void onBackPressed() {
		finish();
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
				afiliado = sm.obtenerAfiliado(editTextDni.getText().toString(), ConfigurarActivity.this.sexoAfiliadoFiltro);

				runOnUiThread(new Runnable() {
					public void run() {

						if (afiliado != null) {
							
							ConfigurarActivity.this.afiliadoCorrecto(afiliado);
						} else {
							ConfigurarActivity.this.afiliadoIncorrecto();
						}

					}
				});

			} catch (Exception e) {
				runOnUiThread(new Runnable() {
					public void run() {

						ConfigurarActivity.this.afiliadoIncorrecto();

					}
				});
			}

			return null;
		}

		@Override
		protected void onPreExecute() {
			super.onPreExecute();
			ConfigurarActivity.this.progressDialog = ProgressDialog.show(ConfigurarActivity.this, "", "Buscando...", true);
		}

		@Override
		protected void onPostExecute(Void result) {
			super.onPostExecute(result);
			ConfigurarActivity.this.progressDialog.dismiss();
		}
	}

}
