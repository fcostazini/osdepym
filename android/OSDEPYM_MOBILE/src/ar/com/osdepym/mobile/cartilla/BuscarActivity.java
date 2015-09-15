package ar.com.osdepym.mobile.cartilla;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import ar.com.osdepym.mobile.cartilla.R;

public class BuscarActivity extends AbstractActivity {

	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.buscar);

        
        Button busqueda1=(Button) findViewById(R.id.buttonBuscarPorEspecialidad);
        busqueda1.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				
                Intent in = new Intent(getApplicationContext(), BuscarPorEspecialidadActivity.class);
                startActivity(in);
			}
		});
        
        
        Button busqueda2=(Button) findViewById(R.id.buttonBuscarPorNombre);
        busqueda2.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				
                Intent in = new Intent(getApplicationContext(), BuscarPorNombreActivity.class);
                startActivity(in);
			}
		});
        
        
        
        Button busqueda3=(Button) findViewById(R.id.buttonBuscarPorCercania);
        busqueda3.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				
                Intent in = new Intent(getApplicationContext(), BuscarPorCercaniaActivity.class);
                startActivity(in);
			}
		});
    }	
	
	
}
