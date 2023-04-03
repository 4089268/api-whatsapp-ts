import { Lead } from "./lead";
import { MensajeModel } from "./mensajeModel";

/**
 * Esta la interfaz que debe de cumplir el repositorio de infraestructura
 * mysql o mongo o etc
 */
export default interface LeadRepository {
  save( id: string | undefined,  mensajeInfo : MensajeModel ): Promise<Lead | undefined | null>;
  getDetail(id:string):Promise<Lead | null | undefined>
}
