export default interface LeadExternal {
    sendMsg({message, phone}:{message:string, phone:string}):Promise<any>
    sendUrlMedia({url, phone}:{url:string, phone:string}):Promise<any>
}