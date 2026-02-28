import { EquipmentRepository, Equipment } from '../repositories/equipmentRepository';
import { differenceInDays, parseISO } from 'date-fns';

export class EquipmentService {
  static getAll() {
    return EquipmentRepository.getAll();
  }

  static getAllTypes() {
    return EquipmentRepository.getAllTypes();
  }

  static create(data: Omit<Equipment, 'id'>) {
    this.validateStatusConstraint(data.status, data.last_cleaned_date);
    return EquipmentRepository.create(data);
  }

  static update(id: number, data: Partial<Omit<Equipment, 'id'>>) {
    const current = EquipmentRepository.getById(id);
    if (!current) throw new Error('Equipment not found');

    const updatedStatus = data.status || current.status;
    const updatedDate = data.last_cleaned_date || current.last_cleaned_date;

    this.validateStatusConstraint(updatedStatus, updatedDate);
    return EquipmentRepository.update(id, data);
  }

  static delete(id: number) {
    return EquipmentRepository.delete(id);
  }

  private static validateStatusConstraint(status: string, lastCleanedDate: string) {
    if (status === 'Active') {
      const daysSinceCleaned = differenceInDays(new Date(), parseISO(lastCleanedDate));
      if (daysSinceCleaned > 30) {
        throw new Error('Equipment cannot be marked as "Active" if the Last Cleaned Date is older than 30 days.');
      }
    }
  }
}
