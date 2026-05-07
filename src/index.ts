import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';
import securityMiddleware from './middleware/secuirty';
const app = express();
const PORT = 8000;
if(!process.env.FrontEND_URL) throw new Error("FRONTEND_URL is not defined in environment variables");
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json());
app.use(securityMiddleware)

app.use('/api/subjects', subjectsRouter);

app.get('/',(req,res)=>{
    res.send("Hello from the Cars API!");
})
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})