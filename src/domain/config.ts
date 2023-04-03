import "dotenv/config"

export default class Configuracion {
  static readonly port_express: string = process.env.PORT_EXPRESS || "33456";
  static readonly mssql_server: string = process.env.MSSQL_SERVER || "localhost" ;
  static readonly mssql_port : number = parseInt(process.env.MSSQL_PORT||"1433");
  static readonly mssql_db: string = process.env.MSSQL_DB || "db";
  static readonly mssql_user: string = process.env.MSSQL_USER || "user";
  static readonly mssql_pass: string = process.env.MSSQL_PASS || "pass";
}
