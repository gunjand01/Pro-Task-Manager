const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./error-handler/globalErrorHandler');
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');
const userRouter = require('./routes/user');
const morgan = require('morgan');

const bodyParser = require("body-parser")

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.status(200).send('Welcome to kanban server');
});

app.get('/api/v1/', (req, res) => {
  return res.status(200).send('Explore version 1 of kanban server.');
});              

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route does not exist',
  });
});    

app.use(globalErrorHandler);

module.exports = app;