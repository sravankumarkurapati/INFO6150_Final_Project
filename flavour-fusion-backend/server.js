const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerSetup = require('./utils/swagger');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, '/uploads')));


// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/commissions', require('./routes/commissionRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.get('/api/health', (req, res) => {
  res.send('OK');
});

swaggerSetup(app);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // ✅ Now the server start is inside the .then() block
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nGracefully shutting down...');
      await mongoose.connection.close();
      server.close(() => {
        console.log('HTTP server closed. MongoDB disconnected.');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // ✅ Self-ping every 4.5 minutes to keep Render backend awake
    setInterval(() => {
      axios.get('https://info6150-final-project.onrender.com/api/health')
        .then(() => console.log(`[Self-Ping] OK @ ${new Date().toLocaleTimeString()}`))
        .catch(err => console.error(`[Self-Ping] Failed:`, err.message));
    }, 4.5 * 60 * 1000); // every 4.5 minutes

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nGracefully shutting down...');
      await mongoose.connection.close();
      server.close(() => {
        console.log('HTTP server closed. MongoDB disconnected.');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });