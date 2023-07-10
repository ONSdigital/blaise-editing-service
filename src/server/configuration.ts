import { IConfiguration } from "./interfaces/configuration.interface";

export default class Configuration implements IConfiguration {

    BlaiseApiUrl: string;

    constructor() {
        const {
            BLAISE_API_URL,
          } = process.env;

          this.BlaiseApiUrl = BLAISE_API_URL ? BLAISE_API_URL : "";
    }
}

/* export class TestConfiguration implements IConfiguration {

    BlaiseApiUrl: string;

    constructor(blaiseApiUrl: string) {
        this.BlaiseApiUrl = blaiseApiUrl;
    }
} */