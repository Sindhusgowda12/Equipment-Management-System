import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  maintenance_date: z.string().min(1, 'Please select a date'),
  notes: z.string().min(1, 'Please add some notes'),
  performed_by: z.string().min(1, 'Please specify who performed it'),
});

interface MaintenanceFormProps {
  equipmentId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MaintenanceForm({ equipmentId, onSuccess, onCancel }: MaintenanceFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintenance_date: new Date().toISOString().split('T')[0],
      notes: '',
      performed_by: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          equipment_id: equipmentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to log maintenance');
      }

      toast.success('Maintenance logged successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="maintenance_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Maintenance details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="performed_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performed By</FormLabel>
              <FormControl>
                <Input placeholder="Name of technician" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging...' : 'Log Maintenance'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
