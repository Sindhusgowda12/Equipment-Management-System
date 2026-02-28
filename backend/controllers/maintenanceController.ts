import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenanceService';

export class MaintenanceController {
  static create(req: Request, res: Response) {
    try {
      const id = MaintenanceService.create(req.body);
      res.status(201).json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static getByEquipmentId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const logs = MaintenanceService.getByEquipmentId(id);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
