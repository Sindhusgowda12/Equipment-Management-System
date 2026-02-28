import db from '../../db/database';

export interface EquipmentType {
  id: number;
  name: string;
}

export interface Equipment {
  id: number;
  name: string;
  type_id: number;
  type_name?: string;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  last_cleaned_date: string;
}

export class EquipmentRepository {
  static getAll() {
    return db.prepare(`
      SELECT e.*, t.name as type_name 
      FROM equipment e
      JOIN equipment_types t ON e.type_id = t.id
    `).all() as Equipment[];
  }

  static getById(id: number) {
    return db.prepare(`
      SELECT e.*, t.name as type_name 
      FROM equipment e
      JOIN equipment_types t ON e.type_id = t.id
      WHERE e.id = ?
    `).get(id) as Equipment | undefined;
  }

  static create(data: Omit<Equipment, 'id'>) {
    const info = db.prepare(`
      INSERT INTO equipment (name, type_id, status, last_cleaned_date)
      VALUES (?, ?, ?, ?)
    `).run(data.name, data.type_id, data.status, data.last_cleaned_date);
    return info.lastInsertRowid as number;
  }

  static update(id: number, data: Partial<Omit<Equipment, 'id'>>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    return db.prepare(`UPDATE equipment SET ${fields} WHERE id = ?`).run(...values, id);
  }

  static delete(id: number) {
    return db.prepare('DELETE FROM equipment WHERE id = ?').run(id);
  }

  static getAllTypes() {
    return db.prepare('SELECT * FROM equipment_types').all() as EquipmentType[];
  }
}
