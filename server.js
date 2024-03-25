require('./dbConfig/dbConfig')
const express = require('express');
require('dotenv').config();

const patientRouter = require('./router/healthRouter')

const app = express();
app.use(express.json());
app.use('/api/v1/', patientRouter);

const port = process.env.port;

app.get('/api/v1/', (req, res) => {
  res.send('Welcome to the Health Management System');
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
