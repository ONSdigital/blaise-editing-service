import { IConfiguration } from "./interfaces/configuration.interface";

export default class Configuration implements IConfiguration {

    BlaiseApiUrl: string;

    constructor() {
        const {
            BLAISE_API_URL,
          } = process.env;

          if (BLAISE_API_URL === undefined){
            throw new Error("message");
          }

          this.BlaiseApiUrl = BLAISE_API_URL;
    }
}

/* export class TestConfiguration implements IConfiguration {

    BlaiseApiUrl: string;

    constructor(blaiseApiUrl: string) {
        this.BlaiseApiUrl = blaiseApiUrl;
    }
} */