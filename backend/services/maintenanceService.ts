import { MaintenanceRepository, MaintenanceLog } from '../repositories/maintenanceRepository';
import { EquipmentRepository } from '../repositories/equipmentRepository';

export class MaintenanceService {
  static create(data: Omit<MaintenanceLog, 'id'>) {
    // Business Rule: When a maintenance record is added:
    // 1. Equipment status must automatically change to Active
    // 2. Last Cleaned Date must update to the Maintenance Date
    
    const logId = MaintenanceRepository.create(data);
    
    EquipmentRepository.update(data.equipment_id, {
      status: 'Active',
      last_cleaned_date: data.maintenance_date
    });

    return logId;
  }

  static getByEquipmentId(equipmentId: number) {
    return MaintenanceRepository.getByEquipmentId(equipmentId);
  }
}
