const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = [
    { id: 1, email: 'admin@bus.com', password: 'admin123', role: 'admin', name: 'Admin User', quota: 1000, aubId: '123456', favoriteRoutes: [] },
    { id: 2, email: 'user@bus.com', password: 'user123', role: 'user', name: 'John Doe', quota: 100, aubId: '234567', favoriteRoutes: [] }
];

let trips = [
    { id: 1, from: 'Beirut', to: 'Jounieh', departure: '08:00', price: 15, seats: 40, totalSeats: 40, occupiedSeats: [] },
    { id: 2, from: 'Beirut', to: 'Tripoli', departure: '10:00', price: 25, seats: 35, totalSeats: 35, occupiedSeats: [] },
    { id: 3, from: 'Saida', to: 'Beirut', departure: '14:00', price: 20, seats: 30, totalSeats: 30, occupiedSeats: [] },
    { id: 4, from: 'Jounieh', to: 'Beirut', departure: '18:00', price: 15, seats: 45, totalSeats: 45, occupiedSeats: [] },
    { id: 5, from: 'Tripoli', to: 'Beirut', departure: '16:00', price: 25, seats: 38, totalSeats: 38, occupiedSeats: [] },
    { id: 6, from: 'Beirut', to: 'Saida', departure: '12:00', price: 20, seats: 40, totalSeats: 40, occupiedSeats: [] },
    { id: 7, from: 'Jounieh', to: 'Tripoli', departure: '09:00', price: 35, seats: 30, totalSeats: 30, occupiedSeats: [] },
    { id: 8, from: 'Saida', to: 'Jounieh', departure: '15:00', price: 30, seats: 25, totalSeats: 25, occupiedSeats: [] }
];

let bookings = [
    { id: 1, userId: 2, tripId: 1, seats: 2, selectedSeats: [1, 2], bookingDate: '2024-09-01', travelDate: '2024-09-15', status: 'confirmed', totalPrice: 30 }
];

let currentUser = null;

const findRoutes = (start, destination) => {
    const direct = trips.filter(t => 
        t.from.toLowerCase() === start.toLowerCase() && 
        t.to.toLowerCase() === destination.toLowerCase()
    );
    
    const connecting = [];
    const intermediate = trips.filter(t => t.from.toLowerCase() === start.toLowerCase());
    
    intermediate.forEach(firstLeg => {
        const secondLegs = trips.filter(t => 
            t.from.toLowerCase() === firstLeg.to.toLowerCase() && 
            t.to.toLowerCase() === destination.toLowerCase()
        );
        
        secondLegs.forEach(secondLeg => {
            connecting.push({
                type: 'connecting',
                legs: [firstLeg, secondLeg],
                totalPrice: firstLeg.price + secondLeg.price,
                totalTime: `${firstLeg.departure} - ${secondLeg.departure}`,
                via: firstLeg.to
            });
        });
    });
    
    return { direct, connecting };
};

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name, quota: user.quota, aubId: user.aubId, favoriteRoutes: user.favoriteRoutes } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/auth/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const aubId = `AUB${Date.now()}`;
    const newUser = { id: users.length + 1, email, password, role: 'user', name, quota: 50, aubId, favoriteRoutes: [] };
    users.push(newUser);
    currentUser = newUser;
    res.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, quota: newUser.quota, aubId: newUser.aubId, favoriteRoutes: newUser.favoriteRoutes } });
});

app.put('/user/profile', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (email !== currentUser.email && users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    users[userIndex] = { ...users[userIndex], name, email };
    currentUser = users[userIndex];
    
    res.json({ success: true, user: { id: currentUser.id, email: currentUser.email, role: currentUser.role, name: currentUser.name, quota: currentUser.quota, aubId: currentUser.aubId } });
});

app.delete('/user/bookings/:id', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const bookingId = parseInt(req.params.id);
    const booking = bookings.find(b => b.id === bookingId && b.userId === currentUser.id);
    
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (booking.status !== 'confirmed') {
        return res.status(400).json({ success: false, message: 'Only confirmed bookings can be cancelled' });
    }
    
    // Refund quota
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex].quota += booking.totalPrice;
    currentUser.quota += booking.totalPrice;
    
    // Add seats back to trip
    const trip = trips.find(t => t.id === booking.tripId);
    if (trip) {
        trip.seats += booking.seats;
    }
    
    // Remove booking
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    bookings.splice(bookingIndex, 1);
    
    res.json({ success: true, refundedAmount: booking.totalPrice, newQuota: currentUser.quota });
});

app.post('/user/recharge', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { aubId, amount } = req.body;
    
    if (!/^\d{6}$/.test(aubId)) {
        return res.status(400).json({ success: false, message: 'AUB ID must be exactly 6 digits' });
    }
    
    const rechargeAmount = Number(amount);
    
    if (isNaN(rechargeAmount) || rechargeAmount <= 0 || rechargeAmount > 500) {
        return res.status(400).json({ success: false, message: 'Amount must be a valid number between $1 and $500' });
    }
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    const currentQuota = Number(users[userIndex].quota) || 0;
    const newQuota = currentQuota + rechargeAmount;
    
    users[userIndex].quota = newQuota;
    currentUser.quota = newQuota;
    
    res.json({ 
        success: true, 
        newQuota: newQuota, 
        message: `Added $${rechargeAmount} to your account ($${currentQuota} + $${rechargeAmount} = $${newQuota})` 
    });
});

app.get('/routes/plan', (req, res) => {
    const { start, destination } = req.query;
    
    if (!start || !destination) {
        return res.status(400).json({ success: false, message: 'Start and destination are required' });
    }
    
    const routes = findRoutes(start, destination);
    
    res.json({
        success: true,
        start,
        destination,
        directRoutes: routes.direct,
        connectingRoutes: routes.connecting.slice(0, 3),
        suggestions: {
            availableCities: [...new Set(trips.flatMap(t => [t.from, t.to]))],
            popularRoutes: [
                { from: 'Beirut', to: 'Jounieh', frequency: 'High' },
                { from: 'Beirut', to: 'Tripoli', frequency: 'Medium' },
                { from: 'Saida', to: 'Beirut', frequency: 'High' }
            ]
        }
    });
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
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { tripId, seats, selectedSeats, travelDate } = req.body;
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.seats < seats) {
        return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }
    
    // Check if selected seats are available
    if (selectedSeats && selectedSeats.some(seat => trip.occupiedSeats.includes(seat))) {
        return res.status(400).json({ success: false, message: 'Some selected seats are already taken' });
    }
    
    const totalPrice = trip.price * seats;
    if (currentUser.quota < totalPrice) {
        return res.status(400).json({ success: false, message: `Insufficient quota. You have $${currentUser.quota} but need $${totalPrice}` });
    }
    
    const booking = { 
        id: bookings.length + 1, 
        userId: currentUser.id, 
        tripId, 
        seats, 
        selectedSeats: selectedSeats || [],
        bookingDate: new Date().toISOString().split('T')[0],
        travelDate: travelDate || new Date().toISOString().split('T')[0],
        status: 'confirmed',
        totalPrice
    };
    
    bookings.push(booking);
    trip.seats -= seats;
    if (selectedSeats) {
        trip.occupiedSeats.push(...selectedSeats);
    }
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex].quota -= totalPrice;
    currentUser.quota -= totalPrice;
    
    res.json({ success: true, booking, remainingQuota: currentUser.quota });
});

app.get('/user/bookings', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
r.id)
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

app.get('/trips/:id/seats', (req, res) => {
    const tripId = parseInt(req.params.id);
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    
    res.json({ 
        success: true, 
        totalSeats: trip.totalSeats, 
        occupiedSeats: trip.occupiedSeats,
        availableSeats: trip.seats
    });
});

app.post('/user/favorites', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { from, to } = req.body;
    const route = { from, to };
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    const existingRoute = users[userIndex].favoriteRoutes.find(r => r.from === from && r.to === to);
    
    if (existingRoute) {
        return res.status(400).json({ success: false, message: 'Route already in favorites' });
    }
    
    users[userIndex].favoriteRoutes.push(route);
    currentUser.favoriteRoutes.push(route);
    
    res.json({ success: true, favoriteRoutes: currentUser.favoriteRoutes });
});

app.delete('/user/favorites', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const { from, to } = req.body;
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex].favoriteRoutes = users[userIndex].favoriteRoutes.filter(r => !(r.from === from && r.to === to));
    currentUser.favoriteRoutes = currentUser.favoriteRoutes.filter(r => !(r.from === from && r.to === to));
    
    res.json({ success: true, favoriteRoutes: currentUser.favoriteRoutes });
});

app.get('/user/favorites', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    res.json({ success: true, favoriteRoutes: currentUser.favoriteRoutes });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Frontend should be on http://localhost:5173 or http://localhost:5174`);
});r.id)
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
        completedTrips: userBookings.filter(b => b.status === 'completed').length,
        quota: currentUser.quota
    };
    
    res.json(stats);
});

// Admin endpoints
app.post('/admin/trips', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { from, to, departure, price, seats } = req.body;
    const newTrip = { id: trips.length + 1, from, to, departure, price: parseFloat(price), seats: parseInt(seats) };
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
    const { from, to, departure, price, seats } = req.body;
    trips[tripIndex] = { ...trips[tripIndex], from, to, departure, price: parseFloat(price), seats: parseInt(seats) };
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

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
