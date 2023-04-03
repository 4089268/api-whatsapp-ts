export class MensajeModel {

    readonly phoneFrom: string;
    readonly message: string;
    readonly phone: string;
    readonly exito: boolean;
    readonly errorMensaje: string;
  
    constructor({ message, phone, phoneFrom, exito, errorMensaje = "" }: { message: string; phone: string, phoneFrom:string, exito:boolean, errorMensaje:string }) {
      this.phoneFrom = phoneFrom;
      this.message = message;
      this.phone = phone;
      this.exito = exito;
      this.errorMensaje = errorMensaje;
    }
  }
  