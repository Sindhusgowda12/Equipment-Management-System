import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipmentService';

export class EquipmentController {
  static getAll(req: Request, res: Response) {
    try {
      const equipment = EquipmentService.getAll();
      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static getAllTypes(req: Request, res: Response) {
    try {
      const types = EquipmentService.getAllTypes();
      res.json(types);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static create(req: Request, res: Response) {
    try {
      const id = EquipmentService.create(req.body);
      res.status(201).json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      EquipmentService.update(id, req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      EquipmentService.delete(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
