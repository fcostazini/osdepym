package ar.com.osdepym.mobile.cartilla.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;

public class ListaDePrestadoresHelper {
	
	public static List<PrestadorDTO> filtrarPorEspecialidad(List<PrestadorDTO> prestadores, String especialidad){
		
		if (especialidad!=null && !especialidad.trim().isEmpty()){
			
			Iterator<PrestadorDTO> iterador = prestadores.iterator();
			while (iterador.hasNext()) {
				PrestadorDTO actual = iterador.next();
				String especialidades = actual.getEspecialidad();
				
				if (especialidades!=null && !especialidades.isEmpty() ){
					
					List<String> listaEspecialidades = new ArrayList<String>();
					listaEspecialidades.addAll(Arrays.asList( especialidades.split(", ") ));

					if ( !listaEspecialidades.contains(especialidad) ) {
						iterador.remove();
					}
				}
				
			}
		}
		
		return prestadores;
	}

	public static List<PrestadorDTO> filtrarUbicacionPorRadio(String miLatitud, String miLongitud, String radio, List<PrestadorDTO> prestadores){
		
		if (miLatitud != null && miLongitud != null && !prestadores.isEmpty()) {
			if (!"".equals(miLatitud) && !"".equals(miLongitud)) {

				Double variacion = Double.valueOf(radio);
				Double latitudDouble = Double.valueOf(miLatitud);
				Double longitudDouble = Double.valueOf(miLongitud);

				String latitudMenos = String.format("%.6f", latitudDouble
						- variacion);
				String latitudMas = String.format("%.6f", latitudDouble
						+ variacion);
				String longitudMenos = String.format("%.6f", longitudDouble
						- variacion);
				String longitudMas = String.format("%.6f", longitudDouble
						+ variacion);

				String latitudDesde;
				String latitudHasta;
				String longitudDesde;
				String longitudHasta;

				if (latitudMenos.compareTo(latitudMas) > 0) {
					latitudDesde = latitudMas;
					latitudHasta = latitudMenos;
				} else {
					latitudDesde = latitudMenos;
					latitudHasta = latitudMas;
				}

				if (longitudMenos.compareTo(longitudMas) > 0) {
					longitudDesde = longitudMas;
					longitudHasta = longitudMenos;
				} else {
					longitudDesde = longitudMenos;
					longitudHasta = longitudMas;
				}

				// Comas por puntos
				latitudDesde = latitudDesde.replace(",", ".");
				latitudHasta = latitudHasta.replace(",", ".");
				longitudDesde = longitudDesde.replace(",", ".");
				longitudHasta = longitudHasta.replace(",", ".");
				
				Iterator<PrestadorDTO> iterador = prestadores.iterator();

				while (iterador.hasNext()) {
					PrestadorDTO actual = iterador.next();
				    if ( tieneUbicacion(actual) && !estaEnElRadio(latitudDesde, latitudHasta, longitudDesde,longitudHasta, actual) ) {
				        iterador.remove();
				    }
				}
			}
			
		}

		return prestadores;
	}
	
	private static boolean estaEnElRadio(String latitud1, String latitud2,
			String longitud1, String longitud2, PrestadorDTO actual) {
		
		Double latitudDesde = Double.valueOf(latitud1);
		Double latitudHasta = Double.valueOf(latitud2);
		
		Double longitudDesde = Double.valueOf(longitud1);
		Double longitudHasta = Double.valueOf(longitud2);
		
		//para contemplar latitudes negativas
		if (latitudDesde > latitudHasta){
			
			Double aux = latitudDesde;
			latitudDesde = latitudHasta;
			latitudHasta = aux;
		}
		
		//para contemplar longitudes negativas
		if (longitudDesde > longitudHasta){
			
			Double aux = longitudDesde;
			longitudDesde = longitudHasta;
			longitudHasta = aux;
		}
		
		return actual.getLatitud()>= latitudDesde
				&& actual.getLatitud()<= latitudHasta
				&& actual.getLongitud()>= longitudDesde
				&& actual.getLongitud()<= longitudHasta;
	}
			
	private static boolean tieneUbicacion(PrestadorDTO prestador){
		
		return (prestador.getLatitud()!=null && prestador.getLongitud()!=null);
	}
}
