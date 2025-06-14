require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const db = require('./models');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/loans', require('./routes/loan.routes'));
app.use('/api/repayments', require('./routes/repayment.routes'));

// Root health check
app.get('/', (req, res) => {
  res.send('💸 Micro Finance API is Live!');
});

// Sync DB and Start Server
const PORT = process.env.PORT || 5000;

db.sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connection established');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('🗂️  DB synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect or sync DB:', err.message);
  });
