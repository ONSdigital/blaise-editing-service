import { Router } from 'express';

export interface IControllerInterface {
  getRoutes(): Router
}
