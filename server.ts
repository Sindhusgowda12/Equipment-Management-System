import express from 'express';
import { createServer as createViteServer } from 'vite';
import { EquipmentController } from './backend/controllers/equipmentController';
import { MaintenanceController } from './backend/controllers/maintenanceController';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Equipment Routes
  app.get('/api/equipment', EquipmentController.getAll);
  app.get('/api/equipment/types', EquipmentController.getAllTypes);
  app.post('/api/equipment', EquipmentController.create);
  app.put('/api/equipment/:id', EquipmentController.update);
  app.delete('/api/equipment/:id', EquipmentController.delete);

  // Maintenance Routes
  app.post('/api/maintenance', MaintenanceController.create);
  app.get('/api/equipment/:id/maintenance', MaintenanceController.getByEquipmentId);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
