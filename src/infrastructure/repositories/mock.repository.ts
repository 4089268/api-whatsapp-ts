import { Lead } from "../../domain/lead";
import LeadRepository from "../../domain/lead.repository";
import settings from '../../domain/config'
import { MensajeModel } from "../../domain/mensajeModel";
import sql from 'mssql';
import { stringify } from "uuid";
import { ExecutionListInstanceOptions } from "twilio/lib/rest/studio/v1/flow/execution";

class MockRepository implements LeadRepository {

  getDetail(id: string): Promise<Lead | null | undefined> {
      throw new Error("Method not implemented.");
  }

  async save( id: string | undefined, mensajeInfo : MensajeModel ): Promise<Lead> {
    // Genear query
    var _query : string[] = [];
    _query.push("Exec [dbo].[usp_envioMensaje] ");
    if(id != undefined){
      _query.push(`@id = '${id}', `);
    }
    _query.push(`@mensaje = '${mensajeInfo.message}', @exito = ${mensajeInfo.exito?1:0}, @errorMensaje = '${mensajeInfo.errorMensaje}', @remitente = '${mensajeInfo.phoneFrom}', @destinatario = '${mensajeInfo.phone}' `);
    var query = _query.join(" ");
    console.log("Ejecutando: " + query);

    // Realizar consulta

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

      if(result.recordset != undefined){
        var idMensaje : string = result.recordset[0].ID;
        console.log(idMensaje);

      }else{
        console.log("Resultado es nul ");
      }

      await connection.close();
      
    }catch(err){
      console.dir(err);
    }

    // Preparar respuesta
    const MOCK_LEAD: Lead = {
      uuid: "00---000",
      message: "test",
      phone: "00000",
    };


    return Promise.resolve(MOCK_LEAD);
  }


}

export default MockRepository