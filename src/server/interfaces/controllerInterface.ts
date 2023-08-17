import { Router } from 'express';

export interface Controller {
  getRoutes(): Router
}
