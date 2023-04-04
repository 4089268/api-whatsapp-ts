import { Lead } from "./lead";
import { MensajeModel } from "./mensajeModel";

/**
 * Esta la interfaz que debe de cumplir el repositorio de infraestructura
 * mysql o mongo o etc
 */
export default interface LeadRepository {

  /**
   * Almacena el mensaje en la base de datos
   * @param id Id del registro de mensaje del tipo UUID
   * @param mensajeInfo Datos de la notificacion a almacenar
   * @returns Si se almacena con exito regresara una etructura del tipo Lead con los datos almacenados
   * en caso contrario regresar un mensaje con el error o un valor nulo.
   */
  save( id: string | undefined,  mensajeInfo : MensajeModel ): Promise< {id:string, mensaje:MensajeModel} | string | null>;
  getDetail(id:string):Promise<Lead | null | undefined>
}
