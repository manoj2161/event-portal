const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/proposals',    require('./routes/proposalRoutes'));
app.use('/api/events',       require('./routes/eventRoutes'));
app.use('/api/registrations',require('./routes/registrationRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));

app.get('/', (req, res) => res.json({ message: 'Event Portal API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
