package ar.com.osdepym.mobile.cartilla.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.location.Location;
import android.util.Log;
import ar.com.osdepym.mobile.cartilla.dto.AfiliadoDTO;
import ar.com.osdepym.mobile.cartilla.dto.FiltroDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorDTO;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorHorario;
import ar.com.osdepym.mobile.cartilla.dto.PrestadorTelefono;
import ar.com.osdepym.mobile.cartilla.dto.TelefonoDTO;

import com.orm.SugarDb;

public class ServiceManager {

	private static String urlRestMobile = "http://www.osdepym.com.ar/OSDEPYM_CartillaWeb/rest/mobile/";

	public ServiceManager() {

	}

	public List<PrestadorDTO> buscar(FiltroDTO filtro) throws ClientProtocolException, IOException, ParseException, JSONException {

		HttpClient httpClient = new DefaultHttpClient();

		HttpGet get = new HttpGet(urlRestMobile + "busquedaPrestadores?dni=" + filtro.getDni() + "&sexo=" + filtro.getSexo()
				+ "&idEspecialidad=" + filtro.getCodEspecialidad() + "&idProvincia=" + filtro.getCodProvincia() + "&idLocalidadBarrio="
				+ filtro.getCodLocalidad() + "&nombrePrestador=" + URLEncoder.encode(filtro.getNombreEspecialista(), "utf-8") + "&latitud="
				+ filtro.getLatitud() + "&longitud=" + filtro.getLongitud() + "&radio=" + filtro.getRadioDeBusqueda());

		get.setHeader("content-type", "application/json");

		HttpResponse resp = httpClient.execute(get);

		return this.parsear(resp, "prestadorTO");

	}

	public AfiliadoDTO obtenerAfiliado(String dniAfiliado, String sexoAfiliado) throws ClientProtocolException, IOException,
			ParseException, JSONException {

		HttpClient httpClient = new DefaultHttpClient();

		HttpGet get = new HttpGet(urlRestMobile + "getAfiliado?dni=" + dniAfiliado + "&sexo=" + sexoAfiliado);

		get.setHeader("content-type", "application/json");

		HttpResponse resp = httpClient.execute(get);

		return this.parsearAfiliado(resp);

	}
	
	public void obtenerCartilla(String dni, String sexo, Context context) throws ClientProtocolException, IOException,
																			  ParseException, JSONException {

		
		HttpClient httpClient = new DefaultHttpClient();

		HttpGet get = new HttpGet(urlRestMobile + "cartilla?dni=" + dni + "&sexo=" + sexo);
		get.setHeader("content-type", "application/json");
		HttpResponse resp = httpClient.execute(get);

		//borro los prestadores de la base para reemplazarlos por los del servidor
		PrestadorDTO.deleteAll(PrestadorDTO.class);
		PrestadorTelefono.deleteAll(PrestadorTelefono.class);
		PrestadorHorario.deleteAll(PrestadorHorario.class);
		
		this.persistirPrestadores(resp, "prestadorTO", context);
	}

	private List<PrestadorDTO> parsear(HttpResponse resp, String claseAParsear) throws ParseException, IOException, JSONException {

		List<PrestadorDTO> especialistas = new ArrayList<PrestadorDTO>();

		String respStr = EntityUtils.toString(resp.getEntity(), "utf-8");

		JSONArray responseJSON = new JSONArray(respStr);

		for (int i = 0; i < responseJSON.length(); i++) {

			JSONObject jsonObject = responseJSON.getJSONObject(i);

			PrestadorDTO prestadorDto = new PrestadorDTO();

			try {
				JSONObject prestadorJSON = jsonObject.getJSONObject(claseAParsear);
				prestadorDto.setNombre(prestadorJSON.optString("nombre"));
				prestadorDto.setCalle(prestadorJSON.optString("calle"));
				prestadorDto.setEspecialidad(prestadorJSON.optString("especialidad"));
				prestadorDto.setCodigoPostal(prestadorJSON.optString("codigoPostal"));
				prestadorDto.setLatitud(prestadorJSON.optDouble("latitud"));
				prestadorDto.setLongitud(prestadorJSON.optDouble("longitud"));
				prestadorDto.setNumeroCalle(prestadorJSON.optString("numeroCalle"));
				prestadorDto.setPiso(prestadorJSON.optString("piso"));
				prestadorDto.setDepartamento(prestadorJSON.optString("departamento"));
				prestadorDto.setLocalidad(prestadorJSON.optString("localidad"));
				prestadorDto.setZona(prestadorJSON.optString("zona"));

				List<TelefonoDTO> telefonos = new ArrayList<TelefonoDTO>();
				JSONArray telefonosJSON = prestadorJSON.optJSONArray("telefonos");
				if (telefonosJSON != null) {
					for (int j = 0; j < telefonosJSON.length(); j++) {
						TelefonoDTO telefono = new TelefonoDTO(telefonosJSON.optString(j));
						telefonos.add(telefono);
					}
				} else {
					// Si existe un único teléfono, el rest genera dicho
					// teléfono como item único en lugar de como array
					String telefonosString = prestadorJSON.optString("telefonos");
					if (!"".equals(telefonosString)) {
						TelefonoDTO telefono = new TelefonoDTO(telefonosString);
						telefonos.add(telefono);
					}
				}
				prestadorDto.setTelefonos(telefonos);

				List<String> horarios = new ArrayList<String>();
				JSONArray horariosJSON = prestadorJSON.optJSONArray("horarios");
				if (horariosJSON != null) {
					for (int j = 0; j < horariosJSON.length(); j++) {
						horarios.add(horariosJSON.optString(j));
					}
				} else {
					// Si existe un único horario, el rest genera dicho
					// horario como item único en lugar de como array
					String horariosString = prestadorJSON.optString("horarios");
					if (!"".equals(horariosString)) {
						horarios.add(horariosString);
					}
				}
				prestadorDto.setHorarios(horarios);

			} catch (Exception e) {
				Log.e("Error al parsear JSON ", e.getCause().toString());
			}

			especialistas.add(prestadorDto);
		}

		return especialistas;

	}
	
	
	private void persistirPrestadores(HttpResponse resp, String claseAParsear, Context context) throws ParseException, IOException, JSONException {

		String respStr = EntityUtils.toString(resp.getEntity(), "utf-8");
		JSONArray responseJSON = new JSONArray(respStr);

		SugarDb sugarDb = new SugarDb(context);
		SQLiteDatabase db = sugarDb.getWritableDatabase();
		db.beginTransaction();

		for (int i = 0; i < responseJSON.length(); i++) {

			JSONObject jsonObject = responseJSON.getJSONObject(i);

			try {
				
				JSONObject prestadorJSON = jsonObject.getJSONObject(claseAParsear);

				ContentValues content = new ContentValues();
				content.put("id_base", prestadorJSON.optString("idBaseDeDatos"));
				content.put("nombre", prestadorJSON.optString("nombre"));
				content.put("calle", prestadorJSON.optString("calle"));
				content.put("especialidad", prestadorJSON.optString("especialidad"));
				content.put("codigo_postal", prestadorJSON.optString("codigoPostal"));
				content.put("latitud", prestadorJSON.optString("latitud"));
				content.put("longitud", prestadorJSON.optString("longitud"));
				content.put("numero_calle", prestadorJSON.optString("numeroCalle"));
				content.put("piso", prestadorJSON.optString("piso"));
				content.put("departamento", prestadorJSON.optString("departamento"));
				content.put("localidad", prestadorJSON.optString("localidad"));
				content.put("zona", prestadorJSON.optString("zona"));
				
				db.insert("PRESTADOR_DTO", null, content);

				persistirTelefonos(db, prestadorJSON);
				persistirHorarios(db, prestadorJSON);
				
			} catch (Exception e) {
				Log.e("Error al parsear JSON ", e.getCause().toString());
			}

		}

		db.setTransactionSuccessful();
		db.endTransaction();
		db.close();

	}

	private void persistirTelefonos(SQLiteDatabase db, JSONObject prestadorJSON) {
		ContentValues telefonosContent = new ContentValues();
		telefonosContent.put("id_prestador", prestadorJSON.optString("idBaseDeDatos"));
		
		JSONArray telefonosJSON = prestadorJSON.optJSONArray("telefonos");
		if (telefonosJSON != null) {
			for (int j = 0; j < telefonosJSON.length(); j++) {
				TelefonoDTO telefono = new TelefonoDTO(telefonosJSON.optString(j));
				telefonosContent.put("telefono", telefono.getNumero());
				telefonosContent.put("descripcion_telefono", telefono.getDescripcion());
				db.insert("PRESTADOR_TELEFONO", null, telefonosContent);
			}
		} else {
			// Si existe un único teléfono, el rest genera dicho
			// teléfono como item único en lugar de como array
			String telefonosString = prestadorJSON.optString("telefonos");
			if (!"".equals(telefonosString)) {
				TelefonoDTO telefono = new TelefonoDTO(telefonosString);
				telefonosContent.put("telefono", telefono.getNumero());
				telefonosContent.put("descripcion_telefono", telefono.getDescripcion());
				db.insert("PRESTADOR_TELEFONO", null, telefonosContent);
			}
		}
	}
	
	private void persistirHorarios(SQLiteDatabase db, JSONObject prestadorJSON) {
		
		ContentValues horariosContent = new ContentValues();
		horariosContent.put("id_prestador", prestadorJSON.optString("idBaseDeDatos"));
		
		JSONArray horariosJSON = prestadorJSON.optJSONArray("horarios");
		if (horariosJSON != null) {
			for (int j = 0; j < horariosJSON.length(); j++) {
				horariosContent.put("horario", horariosJSON.optString(j));
				db.insert("PRESTADOR_HORARIO", null, horariosContent);
			}
		} else {
			// Si existe un único horario, el rest genera dicho
			// horario como item único en lugar de como array
			String horariosString = prestadorJSON.optString("horarios");
			if (!"".equals(horariosString)) {
				horariosContent.put("horario", horariosString);
				db.insert("PRESTADOR_HORARIO", null, horariosContent);
			}
		}
	}

	private AfiliadoDTO parsearAfiliado(HttpResponse resp) throws ParseException, IOException, JSONException {

		AfiliadoDTO afiliado = new AfiliadoDTO();

		String respStr = EntityUtils.toString(resp.getEntity(), "utf-8");

		JSONObject responseJSON = new JSONObject(respStr);
		JSONObject afiliadoJSON = responseJSON.getJSONObject("afiliadoTO");
		afiliado.setNombre(afiliadoJSON.optString("nombre"));
		afiliado.setSexo(afiliadoJSON.optString("sexo"));
		afiliado.setDni(afiliadoJSON.optString("dni"));
		afiliado.setCuil(afiliadoJSON.optString("cuil"));
		afiliado.setPlan(afiliadoJSON.optString("plan"));

		return afiliado;

	}

	public boolean registrarLlamado(AfiliadoDTO afiliado, Location ubicacion, String telefono) throws ParseException, IOException {
		
		HttpPost httpPost = new HttpPost(urlRestMobile + "registrarLlamado");
		httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");

		StringBuilder args = new StringBuilder();
		HttpClient httpClient = new DefaultHttpClient();

		args.append("dni=").append(afiliado.getDni());
		args.append("&nombre=").append(afiliado.getNombre());
		args.append("&cuil=").append(afiliado.getCuil());
		args.append("&sexo=").append(afiliado.getSexo());
		args.append("&plan=").append(afiliado.getPlan());
		
		if (telefono!=null && !telefono.isEmpty()){
			args.append("&telefono=").append(telefono);
		}

		if (ubicacion != null) {

			args.append("&latitud=").append(ubicacion.getLatitude());
			args.append("&longitud=").append(ubicacion.getLongitude());
		}

		StringEntity input = null;
		input = new StringEntity(args.toString());

		httpPost.setEntity(input);

		String response = "";

		HttpResponse httpResponse = httpClient.execute(httpPost);

		int responseStatus = httpResponse.getStatusLine().getStatusCode();
		response = EntityUtils.toString(httpResponse.getEntity());

		boolean success = (responseStatus / 200 == 1);

		if (success) {

			Log.i("Service Manager", "Llamado registrado");
		} else {

			Log.e("Service Manager", "Error registrando llamado a emergencias con el servidor. Response " 
					+ response + " Status: " + responseStatus);
		}

		return success;
	}

}
