import React, { useEffect, useState } from 'react';
import { MaintenanceLog } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';

interface MaintenanceHistoryProps {
  equipmentId: number;
}

export function MaintenanceHistory({ equipmentId }: MaintenanceHistoryProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/equipment/${equipmentId}/maintenance`)
      .then((res) => res.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [equipmentId]);

  if (loading) return <div className="py-4 text-center">Loading history...</div>;
  if (logs.length === 0) return <div className="py-4 text-center text-muted-foreground">No maintenance history found.</div>;

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {format(parseISO(log.maintenance_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{log.performed_by}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={log.notes}>
                {log.notes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
