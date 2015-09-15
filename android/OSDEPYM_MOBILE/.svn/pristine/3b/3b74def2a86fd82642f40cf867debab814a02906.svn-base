package ar.com.osdepym.mobile.cartilla.util;


public class RadiosDeBusquedaHelper {

	public static String getRadioDeBusqueda(String radioEnKilometros) {

		//Valor por defecto
		String radio = "0.02";
		
		String radioFormateado = radioEnKilometros.replaceAll("[^\\d]", "");
		String latitud = RadiosDeBusqueda.getGradosLatitudSegunKilometros(radioFormateado);
		
		if (!latitud.isEmpty()){

			radio = latitud;
		}
		
		return radio;
	}
	
	public enum RadiosDeBusqueda {

		UN_KILOMETRO("1", "0.01"),
		CINCO_KILOMETROS("5", "0.05"),
		DIEZ_KILOMETROS("10", "0.11"),
		CIEN_KILOMETROS("100", "1.10");
		
		private String radioEnKm;
		private String minutos;
		
		private RadiosDeBusqueda(String radioEnKm, String minutos){
			
			this.radioEnKm = radioEnKm;
			this.minutos = minutos;
		}
		
		/**
		 * @param String numero de kilometros
		 * @return representacion de los kilometros pasados por parametro en grados latitud de Buenos Aires
		 */
		public static String getGradosLatitudSegunKilometros(String cantidadDeKm){
			
			String minutos = "";
			for (RadiosDeBusqueda actual : RadiosDeBusqueda.values()){
				
				if (actual.getRadioEnKm().equals(cantidadDeKm)){
					minutos = actual.getMinutos();
				}
			}
			return minutos;
		}

		public String getRadioEnKm() {
			return radioEnKm;
		}

		public void setRadioEnKm(String radioEnKm) {
			this.radioEnKm = radioEnKm;
		}

		public String getMinutos() {
			return minutos;
		}

		public void setMinutos(String minutos) {
			this.minutos = minutos;
		}
		
	}

}
