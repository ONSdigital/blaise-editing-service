import BlaiseApiClient from "blaise-api-node-client";
import express, { Router } from "express";
import { QuestionnaireHandler } from "../handlers/QuestionnaireHandler";

export default function questionnaireRouter(blaiseApiClient: BlaiseApiClient): Router {
    const router = express.Router();
    const questionnaireHandler = new QuestionnaireHandler(blaiseApiClient);

    router.get("/api/questionnaires", questionnaireHandler.getQuestionnaires);
    return router;
}