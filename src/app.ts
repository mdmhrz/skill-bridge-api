import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import notFound from './middleware/notFound';



const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true

}))



app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');

});






// not found routes
app.use(notFound)



export default app;