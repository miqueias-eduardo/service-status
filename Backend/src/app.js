import express from 'express';
import monitorRoutes from './modules/monitor/monitor.routes.js';

const app = express();

app.use(express.json());

app.get('/health',(req,res)=>{
 res.json({ status: 'ok' });
})

app.use('/monitors', monitorRoutes)
export default app;
