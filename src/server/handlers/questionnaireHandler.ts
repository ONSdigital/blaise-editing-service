import BlaiseApiClient, { Questionnaire } from "blaise-api-node-client";
import express, { Request, Response, Router } from "express";

export default function questionnaireRouter(blaiseApiClient: BlaiseApiClient): Router {
    const router = express.Router();

    router.get("/api/questionnaires", getQuestionnaires);
    return router;
}

export class questionnaireHandler {
    blaiseApiClient: BlaiseApiClient;
    constructor(blaiseApiClient: BlaiseApiClient){
        this.blaiseApiClient = blaiseApiClient;
        this.getQuestionnaires = this.getQuestionnaires.bind(this);
    }

    async function getQuestionnaires(_request: Request, response: Response<Questionnaire[]>): Promise<Response> {
        const questionnaires = await this.blaiseApiClient.getQuestionnaires('gusty');
    return response.status(200).json(questionnaires);
    }
}