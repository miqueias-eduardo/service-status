import express from 'express';
import monitorRoutes from './modules/monitor/monitor.routes.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173'
  ]
}));

app.use(express.json());

app.use(express.json());

app.get('/health',(req,res)=>{
 res.json({ status: 'ok' });
})

app.use('/monitors', monitorRoutes)
export default app;
