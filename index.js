import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize"
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors"


dotenv.config();
console.log(process.env.PORT);

const app = express()
const PORT = process.env.PORT

//Global rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 100, // limit each IP to 100 requests per `windoe` (here, per 15 minutes).
    message: "Too many requests from this IP please try later"
});

// security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use('/api', limiter)


//logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//body parser Middleware
app.use(express.json({limit: "10kb"}))
app.use(express.urlencoded({extended:true, limit: "10kb"}))
app.use(cookieParser())

//Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
    });
});

//cors configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Original",
        "Origin",
        "Accept",
    ],
}))

//API Routes

// it should be always at the bottom
// 404 handler

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});



app.listen(PORT, () => {
    console.log(`server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
})