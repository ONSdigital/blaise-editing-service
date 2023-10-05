import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controllerInterface';
import notFound from '../helpers/axiosHelper';
import { AllocationDetails } from '../../common/interfaces/surveyInterface';
import BlaiseApi from '../api/BlaiseApi';

export default class AllocationController implements Controller {
  blaiseApi: BlaiseApi;

  constructor(blaiseApi: BlaiseApi) {
    this.blaiseApi = blaiseApi;
    this.getAllocationDetails = this.getAllocationDetails.bind(this);
  }

  getRoutes() {
    const router = express.Router();
    return router.get('/api/questionnaires/:questionnaireName/allocation', this.getAllocationDetails);
  }

  async getAllocationDetails(request: Request<{ questionnaireName:string }>, response: Response<AllocationDetails>) {
    const { questionnaireName } = request.params;

    try {
      const allocationDetails = await this.blaiseApi.getAllocationDetails(questionnaireName);

      return response.status(200).json(allocationDetails);
    } catch (error: unknown) {
      if (notFound(error)) {
        return response.status(404).json();
      }
      return response.status(500).json();
    }
  }
}
