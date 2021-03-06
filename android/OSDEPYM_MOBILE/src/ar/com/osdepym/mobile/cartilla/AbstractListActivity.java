package ar.com.osdepym.mobile.cartilla;

import java.util.List;

import android.app.ListActivity;
import android.app.ProgressDialog;
import ar.com.osdepym.mobile.cartilla.adaptadores.AdaptadorEspecialista;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;

public class AbstractListActivity extends ListActivity {

	private ProgressDialog dialog;

	public void setProgressDialog(ProgressDialog dialog) {

		this.dialog = dialog;
	}

	public void dismissProgressDialog() {

		this.dialog.dismiss();
	}

	public void recibirResultado(final List<PrestadorDTO> result) {

		runOnUiThread(new Runnable() {
		
			@Override
			public void run() {
				
				AdaptadorEspecialista adaptador = new AdaptadorEspecialista(AbstractListActivity.this, result);
				AbstractListActivity.this.setListAdapter(adaptador);
			}
	
		});

	}

}
