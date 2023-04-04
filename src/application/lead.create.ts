import { Lead } from "../domain/lead";
import LeadExternal from "../domain/lead-external.repository";
import LeadRepository from "../domain/lead.repository";
import { MensajeModel } from "../domain/mensajeModel";

export class LeadCreate {
  private leadRepository: LeadRepository;
  private leadExternal: LeadExternal;
  constructor(respositories: [LeadRepository, LeadExternal]) {
    const [leadRepository, leadExternal] = respositories;
    this.leadRepository = leadRepository;
    this.leadExternal = leadExternal;
  }

  public async sendMessageAndSave({ message, phone }: { message: string; phone: string;}) {

    // Enviar notificacion
    const responseExSave : {id:string, from:string, error: string } = await this.leadExternal.sendMsg({ message, phone });

    if(responseExSave.error != undefined){
      console.dir("Error: " +  responseExSave.error);
    }else{
      console.dir("Id notificado: " + responseExSave.id);
    }

    // Almacenar resultado en base de datos
    var mensajeInfo = new MensajeModel({
      phoneFrom: responseExSave.from,
      message: message,
      phone: phone,
      exito: responseExSave.error == undefined,
      errorMensaje: responseExSave.error
    });
    const response = await this.leadRepository.save('', mensajeInfo);

    return {response};
  }

  public async sendUrlAndSave({ url, phone }: { url: string; phone: string; }) {

    const responseExSave = await this.leadExternal.sendUrlMedia({ url, phone });//TODO enviar a ws

    var mensajeInfo = new MensajeModel({
      phoneFrom: "5218341031301",
      message: url,
      phone: phone,
      exito: true,
      errorMensaje: ""
    });


    const responseDbSave = await this.leadRepository.save('', mensajeInfo);//TODO DB
    
    return {responseDbSave, responseExSave};
  }


}
