import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controllerInterface';

export default class HealthController implements Controller {

  public getRoutes(): Router {
    const router = express.Router();
    router.get('/bes-ui/:version/health', this.healthCheck);
    return router;
  }

  private healthCheck = (req: Request, res: Response): Response => {
    return res.status(200).json({ healthy: true });
  }
}
