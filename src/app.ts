import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import notFound from './middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { tutorRoutes } from './module/tutors/tutor.route';
import { categoryRoutes } from './module/categories/category.routes';
import { currentUserRoutes } from './module/auth/currentUserRoutes';
import { bookingRoutes } from './module/bookings/booking.route';
import { availabilityRoutes } from './module/availability/availability.route';
import { reviewRoutes } from './module/review/review.route';
import { userRoutes } from './module/users/user.route';
import path from "path"




const app: Application = express();

const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL, //Frontend production url
].filter(Boolean);


app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in allowedOrigins or matches Vercel preview pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/skill-bridge-client-server*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    }),
);


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

//Availability routes
app.use('/api/availability', availabilityRoutes)

// Review routes
app.use('/api/review', reviewRoutes)

//user routes: admin only
app.use('/api/users', userRoutes)

// app.use(express.urlencoded({ extended: true }));




app.use(express.static(path.join(__dirname, "../public")));
// root route
app.get('/', (req: Request, res: Response) => {
    // res.send('Hello, World!');
    res.sendFile(path.join(__dirname, "../public", "index.html"))

});






// not found routes
app.use(notFound)



export default app;