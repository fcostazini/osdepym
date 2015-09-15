package ar.com.osdepym.mobile.cartilla.dto;

import java.io.Serializable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TelefonoDTO implements Serializable {

	private static final long serialVersionUID = -7628825402320115447L;

	private static final String PATRON_TELEFONO = "(?:\\(\\s*54\\))?(?:\\(\\s*(\\d+)\\))?\\s*(\\d+)";
	private String numero;
	private String descripcion;

	public TelefonoDTO(String descripcion) {
		this.descripcion = descripcion;
		Pattern p = Pattern.compile(PATRON_TELEFONO);
		Matcher m = p.matcher(descripcion);
		if (m.find()) {
			if (m.group(1) != null) {
				this.numero = m.group(1).concat(m.group(2));
			} else {
				this.numero = m.group(2);
			}
		}
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	@Override
	public String toString() {
		return this.descripcion;
	}

}
