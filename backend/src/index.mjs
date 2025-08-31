import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ 
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true 
}));
app.use(express.json());

let users = [
    { id: 1, email: 'admin@bus.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'user@bus.com', password: 'user123', role: 'user', name: 'John Doe' }
];

let trips = [
    { id: 1, from: 'Beirut', to: 'Jounieh', departure: '08:00', price: 15, seats: 40 },
    { id: 2, from: 'Beirut', to: 'Tripoli', departure: '10:00', price: 25, seats: 35 },
    { id: 3, from: 'Saida', to: 'Beirut', departure: '14:00', price: 20, seats: 30 }
];

let bookings = [
    { id: 1, userId: 2, tripId: 1, seats: 2, bookingDate: '2024-09-01', travelDate: '2024-09-15', status: 'confirmed', totalPrice: 30 }
];

let currentUser = null;

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/auth/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const newUser = { id: users.length + 1, email, password, role: 'user', name };
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name } });
});

app.get('/trips/search', (req, res) => {
    const { from, to } = req.query;
    let results = trips;
    if (from) results = results.filter(t => t.from.toLowerCase().includes(from.toLowerCase()));
    if (to) results = results.filter(t => t.to.toLowerCase().includes(to.toLowerCase()));
    res.json(results);
});

app.get('/trips', (req, res) => {
    res.json(trips);
});

app.post('/bookings', (req, res) => {
    const { tripId, seats, travelDate } = req.body;
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.seats < seats) {
        return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }
    
    const booking = { 
        id: bookings.length + 1, 
        userId: currentUser?.id, 
        tripId, 
        seats, 
        bookingDate: new Date().toISOString().split('T')[0],
        travelDate: travelDate || new Date().toISOString().split('T')[0],
        status: 'confirmed',
        totalPrice: trip.price * seats
    };
    
    bookings.push(booking);
    trip.seats -= seats;
    res.json({ success: true, booking });
});

app.get('/user/bookings', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const userBookings = bookings
        .filter(b => b.userId === currentUser.id)
        .map(booking => {
            const trip = trips.find(t => t.id === booking.tripId);
            return {
                ...booking,
                from: trip?.from,
                to: trip?.to,
                departure: trip?.departure
            };
        });
    
    res.json(userBookings);
});

app.get('/user/stats', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const userBookings = bookings.filter(b => b.userId === currentUser.id);
    const stats = {
        totalTrips: userBookings.length,
        totalSpent: userBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        upcomingTrips: userBookings.filter(b => b.status === 'confirmed').length,
        completedTrips: userBookings.filter(b => b.status === 'completed').length
    };
    
    res.json(stats);
});

app.post('/admin/trips', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { from, to, departure, price, seats } = req.body;
    const newTrip = { id: trips.length + 1, from, to, departure, price, seats };
    trips.push(newTrip);
    res.json({ success: true, trip: newTrip });
});

app.put('/admin/trips/:id', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const tripId = parseInt(req.params.id);
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    trips[tripIndex] = { ...trips[tripIndex], ...req.body };
    res.json({ success: true, trip: trips[tripIndex] });
});

app.delete('/admin/trips/:id', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const tripId = parseInt(req.params.id);
    trips = trips.filter(t => t.id !== tripId);
    res.json({ success: true });
});

app.post('/user/recharge', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { amount } = req.body;
    
    if (!amount || amount <= 0 || amount > 500) {
        return res.status(400).json({ success: false, message: 'Invalid amount. Must be between $1 and $500.' });
    }
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (!users[userIndex].quota) {
        users[userIndex].quota = 0;
    }
    
    users[userIndex].quota += amount;
    currentUser.quota = users[userIndex].quota;
    
    res.json({ 
        success: true, 
        message: `Successfully recharged $${amount}`,
        newQuota: users[userIndex].quota
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend should be on http://localhost:5173 or http://localhost:5174`);
});
