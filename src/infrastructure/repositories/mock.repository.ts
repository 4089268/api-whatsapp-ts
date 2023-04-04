import { Lead } from "../../domain/lead";
import LeadRepository from "../../domain/lead.repository";
import settings from '../../domain/config'
import { MensajeModel } from "../../domain/mensajeModel";
import sql from 'mssql';
import { stringify } from "uuid";


class MockRepository implements LeadRepository {

  getDetail(id: string): Promise<Lead | null | undefined> {
      throw new Error("Method not implemented.");
  }

  async save( id: string | undefined, mensajeInfo : MensajeModel ): Promise<{id:string, mensaje:MensajeModel} | string> {
    
    // Genear query
    var _queryStringBuilder : string[] = [];
    _queryStringBuilder.push("Exec [dbo].[usp_envioMensaje] ");
    if(id != undefined){
      _queryStringBuilder.push(`@id = '${id}', `);
    }
    _queryStringBuilder.push(`@mensaje = '${mensajeInfo.message}', @exito = ${mensajeInfo.exito?1:0}, @errorMensaje = '${mensajeInfo.errorMensaje}', @remitente = '${mensajeInfo.phoneFrom}', @destinatario = '${mensajeInfo.phone}' `);
    var query = _queryStringBuilder.join(" ");

    
    // Realizar consulta
    var errorMensaje : string = "";
    var idMensajeAlmacenado : string = "";
    try{
      const connection = await sql.connect({
        user: settings.mssql_user,
        password: settings.mssql_pass,
        database: settings.mssql_db,
        server: settings.mssql_server,
        port: settings.mssql_port,
        options: {
          encrypt: true,
          trustServerCertificate: true 
        },
      });
      const result = await connection.request().query(query);

      //Procesar respuesta
      if(result.recordset != undefined){
        idMensajeAlmacenado = result.recordset[0].ID;
      }else{
        errorMensaje = "Error, respuesta no esperado del servidor."
      }

      // Cerrar conexion
      await connection.close();
      
    }catch(err){
      errorMensaje = "Error no controlado al realizar la consulta: \n" + err;
    }


    // Preparar respuesta
    if(errorMensaje.length > 0){
      return Promise.resolve(errorMensaje);
    }else{

      return Promise.resolve({
        id: idMensajeAlmacenado,
        mensaje:mensajeInfo
      });
    }
    
  }


}

export default MockRepository