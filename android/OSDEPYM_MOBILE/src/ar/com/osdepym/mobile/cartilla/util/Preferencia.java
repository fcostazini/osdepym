package ar.com.osdepym.mobile.cartilla.util;

public enum Preferencia {
	
	BUSQUEDA_ESPECIALIDAD ("busqueda_especialidad"),
	BUSQUEDA_PROVINCIA ("busqueda_provincia"),
	BUSQUEDA_LOCALIDAD ("busqueda_localidad"),
	BUSQUEDA_NOMBRE ("busqueda_nombre"),
	BUSQUEDA_CERCANIA ("busqueda_cercania"),
	BENEFICIARIO_DNI("dni"),
	BENEFICIARIO_SEXO("sexo"),
	BENEFICIARIO_TELEFONO("telefono");
	
	private String nombre;
	
	private Preferencia(String nombre) {
		
		this.nombre = nombre;
	}
	
	public String getNombre(){
		
		return this.nombre;
	}

}
