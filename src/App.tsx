import React, { useEffect, useState } from 'react';
import { Equipment } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentForm } from './components/EquipmentForm';
import { MaintenanceForm } from './components/MaintenanceForm';
import { MaintenanceHistory } from './components/MaintenanceHistory';
import { Plus, Edit, Trash2, History, Wrench } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [maintenanceItem, setMaintenanceItem] = useState<Equipment | null>(null);
  const [historyItem, setHistoryItem] = useState<Equipment | null>(null);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      const response = await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Equipment deleted');
        fetchEquipment();
      } else {
        toast.error('Failed to delete equipment');
      }
    } catch (error) {
      toast.error('Error deleting equipment');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'Under Maintenance':
        return <Badge variant="destructive">Under Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Equipment Management</h1>
            <p className="text-neutral-500">Track and manage your facility equipment and maintenance logs.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
                <Plus className="mr-2 h-4 w-4" /> Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <EquipmentForm 
                onSuccess={() => { setIsAddOpen(false); fetchEquipment(); }} 
                onCancel={() => setIsAddOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Last Cleaned</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Loading equipment...</TableCell>
                </TableRow>
              ) : equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-neutral-500">No equipment found. Add some to get started.</TableCell>
                </TableRow>
              ) : (
                equipment.map((item) => (
                  <TableRow key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type_name}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{format(parseISO(item.last_cleaned_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Log Maintenance"
                          onClick={() => setMaintenanceItem(item)}
                        >
                          <Wrench className="h-4 w-4 text-neutral-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="View History"
                          onClick={() => setHistoryItem(item)}
                        >
                          <History className="h-4 w-4 text-neutral-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Edit"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4 text-neutral-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <EquipmentForm 
              equipment={editingItem}
              onSuccess={() => { setEditingItem(null); fetchEquipment(); }} 
              onCancel={() => setEditingItem(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Maintenance Log Dialog */}
      <Dialog open={!!maintenanceItem} onOpenChange={(open) => !open && setMaintenanceItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Maintenance: {maintenanceItem?.name}</DialogTitle>
          </DialogHeader>
          {maintenanceItem && (
            <MaintenanceForm 
              equipmentId={maintenanceItem.id}
              onSuccess={() => { setMaintenanceItem(null); fetchEquipment(); }} 
              onCancel={() => setMaintenanceItem(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={!!historyItem} onOpenChange={(open) => !open && setHistoryItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance History: {historyItem?.name}</DialogTitle>
          </DialogHeader>
          {historyItem && (
            <MaintenanceHistory equipmentId={historyItem.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
