import { Client, LocalAuth, MessageMedia, MediaFromURLOptions } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";
import { idText } from "typescript";

/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends Client implements LeadExternal {
  private status = false;
  private usuario : string | undefined = undefined;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    console.log("Iniciando....");

    this.initialize();

    this.on("ready", async () => {
      this.status = true;
      this.usuario = this.info.wid.user;
      console.log("LOGIN_SUCCESS");
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      console.log('Escanea el codigo QR que esta en la carepta tmp')
      this.generateImage(qr)
    });
  }

  async sendUrlMedia({ url, phone }: { url: string; phone: string; }): Promise<any> {
    try {
      const media = await MessageMedia.fromUrl(url, {unsafeMime:true});
      const response = await this.sendMessage(`${phone}@c.us`, media );
      return { id: response.id.id };
    }catch(e:any){
      return Promise.resolve({error:e.message});
    }
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
  async sendMsg(lead: { message: string; phone: string }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const { message, phone } = lead;
      
      const response = await this.sendMessage(`${phone}@c.us`, message);
      console.log("id:" + response.id.id);
      return { id: response.id.id, from: this.usuario };
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  getUserPhone() : string|undefined {
    return this.usuario;
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  };
}

export default WsTransporter;
