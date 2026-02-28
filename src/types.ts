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

export interface MaintenanceLog {
  id: number;
  equipment_id: number;
  maintenance_date: string;
  notes: string;
  performed_by: string;
}
