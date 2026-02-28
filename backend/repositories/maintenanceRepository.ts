import db from '../../db/database';

export interface MaintenanceLog {
  id: number;
  equipment_id: number;
  maintenance_date: string;
  notes: string;
  performed_by: string;
}

export class MaintenanceRepository {
  static create(data: Omit<MaintenanceLog, 'id'>) {
    const info = db.prepare(`
      INSERT INTO maintenance_logs (equipment_id, maintenance_date, notes, performed_by)
      VALUES (?, ?, ?, ?)
    `).run(data.equipment_id, data.maintenance_date, data.notes, data.performed_by);
    return info.lastInsertRowid as number;
  }

  static getByEquipmentId(equipmentId: number) {
    return db.prepare(`
      SELECT * FROM maintenance_logs 
      WHERE equipment_id = ? 
      ORDER BY maintenance_date DESC
    `).all(equipmentId) as MaintenanceLog[];
  }
}
