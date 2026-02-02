import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import notFound from './middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { tutorRoutes } from './module/tutors/tutor.route';
import { categoryRoutes } from './module/categories/category.routes';
import { currentUserRoutes } from './module/auth/currentUserRoutes';
import { bookingRoutes } from './module/bookings/booking.route';




const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true

}))

// this route is for better auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// get current user
app.use('/api/user/current-user', currentUserRoutes);

// Totor Routes
app.use('/api/tutor', tutorRoutes);

// Category routes
app.use('/api/categories', categoryRoutes)

// booking routes
app.use('/api/booking', bookingRoutes)


// app.use(express.urlencoded({ extended: true }));





// root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');

});






// not found routes
app.use(notFound)



export default app;