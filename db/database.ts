import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('db/equipment.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS equipment_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date TEXT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES equipment_types(id)
  );

  CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    maintenance_date TEXT NOT NULL,
    notes TEXT,
    performed_by TEXT NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
  );
`);

// Seed initial equipment types if empty
const typesCount = db.prepare('SELECT COUNT(*) as count FROM equipment_types').get() as { count: number };
if (typesCount.count === 0) {
  const insertType = db.prepare('INSERT INTO equipment_types (name) VALUES (?)');
  ['Medical', 'Laboratory', 'Imaging', 'Diagnostic', 'Surgical'].forEach(type => {
    insertType.run(type);
  });
}

export default db;
