package ar.com.osdepym.mobile.cartilla;

import java.util.Timer;
import java.util.TimerTask;

import android.content.Intent;
import android.os.Bundle;
import ar.com.osdepym.mobile.cartilla.R;
import ar.com.osdepym.mobile.cartilla.util.Preferencia;

public class SplashActivity extends AbstractActivity {

	private long splashDelay = 5000; // 5 segundos

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		final String numeroAfiliado = super.getPreferenciaString(Preferencia.BENEFICIARIO_DNI);

		setContentView(R.layout.splash_screen);

		// Levanto desde las preferencias el n� afiliado

		// Timer para el Splash
		TimerTask task = new TimerTask() {

			@Override
			public void run() {

				if (!"".equals(numeroAfiliado)) {

					Intent mainIntent = new Intent().setClass(SplashActivity.this, PrincipalActivity.class);
					startActivity(mainIntent);
					finish();

				} else {

					Intent mainIntent = new Intent().setClass(SplashActivity.this, ConfigurarActivity.class);
					startActivity(mainIntent);
					finish();

				}
			}
		};

		Timer timer = new Timer();
		timer.schedule(task, splashDelay);
	}

}
