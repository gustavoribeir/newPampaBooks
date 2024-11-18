// Criando variaveis
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const app = express();
const port = process.env.APP_PORT;
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Conectando ao banco de dados
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('App conectado ao banco de dados.');
}).catch(err=>{
  console.error('Erro ao se conectar ao banco de dados.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout','layout');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

// Definição dos routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Configuração dos routers
app.get('/index',(req,res)=>{
  res.render('index',{title: 'Home'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Iniciando o app principal
app.listen(port,()=>{
  console.log(`App principal rodando em http://localhost:${port}`);
});

module.exports = app;
