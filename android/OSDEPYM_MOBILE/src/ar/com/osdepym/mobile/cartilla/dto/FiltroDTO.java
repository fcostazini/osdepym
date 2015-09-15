package ar.com.osdepym.mobile.cartilla.dto;

import java.io.Serializable;

public class FiltroDTO implements Serializable {

	private static final long serialVersionUID = 3928034860935655374L;

	private String dni = "";
	private String sexo = "";
	private String nombreEspecialista = "";
	private String codEspecialidad = "";
	private String codProvincia = "";
	private String codLocalidad = "";
	private String latitud = "";
	private String longitud = "";
	private String radioDeBusqueda = "";

	private String especialidad;
	private String provincia;
	private String localidad;

	public String getNombreEspecialista() {
		return nombreEspecialista;
	}

	public void setNombreEspecialista(String nombreEspecialista) {
		this.nombreEspecialista = nombreEspecialista;
	}

	public String getCodEspecialidad() {
		return codEspecialidad;
	}

	public void setCodEspecialidad(String codEspecialidad) {
		this.codEspecialidad = codEspecialidad;
	}

	public String getCodProvincia() {
		return codProvincia;
	}

	public void setCodProvincia(String codProvincia) {
		this.codProvincia = codProvincia;
	}

	public String getCodLocalidad() {
		return codLocalidad;
	}

	public void setCodLocalidad(String codLocalidad) {
		this.codLocalidad = codLocalidad;
	}

	public String getDni() {
		return dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public String getSexo() {
		return sexo;
	}

	public void setSexo(String sexo) {
		this.sexo = sexo;
	}

	public String getLatitud() {
		return latitud;
	}

	public void setLatitud(String latitud) {
		this.latitud = latitud;
	}

	public String getLongitud() {
		return longitud;
	}

	public void setLongitud(String longitud) {
		this.longitud = longitud;
	}

	public String getRadioDeBusqueda() {
		return radioDeBusqueda;
	}

	public void setRadioDeBusqueda(String radioDeBusqueda) {
		this.radioDeBusqueda = radioDeBusqueda;
	}

	public String getEspecialidad() {
		return especialidad;
	}
	
	public void setEspecialidad(String especialidad) {
		this.especialidad = especialidad;
	}

	public String getProvincia() {
		return provincia;
	}

	public void setProvincia(String provincia) {
		this.provincia = provincia;
	}

	public String getLocalidad() {
		return localidad;
	}

	public void setLocalidad(String localidad) {
		this.localidad = localidad;
	}
	
}
