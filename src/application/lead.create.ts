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

    const responseExSave = await this.leadExternal.sendMsg({ message, phone });//TODO enviar a ws

    var mensajeInfo = new MensajeModel({
      phoneFrom: "5218341031301",
      message: message,
      phone: phone,
      exito: true,
      errorMensaje: ""
    });
    const responseDbSave = await this.leadRepository.save('', mensajeInfo);//TODO DB
    return {responseDbSave, responseExSave};
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
