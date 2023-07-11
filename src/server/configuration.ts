import { IConfiguration } from "./interfaces/configuration.interface";

export default class Configuration implements IConfiguration {

    BlaiseApiUrl: string;
    BuildFolder: string;
    Port: number;
    //SERVER_PARK
    //VM_EXTERNAL_WEB_URL

    constructor() {
        const {
            BLAISE_API_URL,
            PORT
          } = process.env;

          if (BLAISE_API_URL === undefined){
            throw new ReferenceError('BLAISE_API_URL was not found in environment variables');
          }

          if (BLAISE_API_URL.trim() === ''){
            throw new Error('BLAISE_API_URL is an empty string');
          }

          if (PORT === undefined){
            throw new ReferenceError('PORT was not found in environment variables');
          }

          if (isNaN(+PORT) || +PORT === 0){
            throw new TypeError('PORT is not set to a valid number');
          }

          this.BlaiseApiUrl = BLAISE_API_URL;
          this.BuildFolder = '../build'
          this.Port = +PORT
    }
}