import { Request, Response } from "express";
import { LeadCreate } from "../../application/lead.create";

class LeadCtrl {
  constructor(private readonly leadCreator: LeadCreate) {}

  public sendCtrl = async ({ body }: Request, res: Response) => {
    const { message, phone } = body;
    const response = await this.leadCreator.sendMessageAndSave({ message, phone })
    res.send(response);
  };

  public sendUrlCtrl = async ({ body }: Request, res: Response) => {
    const { url, phone } = body;
    const response = await this.leadCreator.sendUrlAndSave({url, phone })
    res.send(response);
  };

  public getQR = ( { body }: Request, res: Response) => {
    const pathQr = `${process.cwd()}/tmp/qr.svg`;
    res.sendFile( pathQr );
  }

}

export default LeadCtrl;
