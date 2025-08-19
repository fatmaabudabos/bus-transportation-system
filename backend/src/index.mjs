import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Configure CORS to allow requests from your frontend origin
const corsOptions = {
    origin: 'http://localhost:5173', // Specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow sending cookies and HTTP authentication credentials
    optionsSuccessStatus: 204 // For preflight requests
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

app.get('/bus/routes', (req, res) => {
    const busRoutesMockData = [
        {
            from: 'Beirut',
            to: 'Jounieh',
            timeOfDeparture: '19:00h',
        },
        {
            from: 'Saida',
            to: 'Jounieh',
            timeOfDeparture: '19:00h',
        },
        {
            from: 'Beirut',
            to: 'Jounieh',
            timeOfDeparture: '19:00h',
        },
        {
            from: 'Beirut',
            to: 'Jounieh',
            timeOfDeparture: '19:00h',
        }
    ]
    res.json({
        busRoutes: busRoutesMockData,
    })
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else 
        console.log("Error occurred, server can't start", error);
}); 
