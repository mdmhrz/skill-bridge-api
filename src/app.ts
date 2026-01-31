import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import notFound from './middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { tutorRoutes } from './module/tutors/tutor.route';



const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true

}))

// this route is for better auth
app.all("/api/auth/*splat", toNodeHandler(auth));


// Totor Routes
app.use('/api/tutor', tutorRoutes)


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));





// root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');

});






// not found routes
app.use(notFound)



export default app;