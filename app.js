const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const cors = require('./middlewares/cors');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const app = express();

const { CONNECT_DB_PATH, PORT } = require('./utils/config');

mongoose.set({ runValidators: true, autoIndex: true });

// Подключаемся к серверу MongoDB
mongoose.connect(CONNECT_DB_PATH);

app.use(cors);

app.use(helmet());

// Подключаем лимитер запросов
app.use(limiter);

// Подключаем middleware для обработки JSON в body запроса
app.use(express.json());

// Подключаем логгер запросов
app.use(requestLogger);

// Подключаем корневой роутер
app.use(routes);

// Подключаем логгер ошибок
app.use(errorLogger);

// Middleware для обработки ошибок celebrate
app.use(errors());

// Middleware для обработки ошибок
app.use(handleErrors);

app.listen(PORT, () => { console.log(`server has been started, your port ${PORT}`); });
