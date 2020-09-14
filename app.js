require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const mongoStore = require('connect-mongo')(session);
const path = require('path');
const db = require('./config/db');
const app = express();

// Routes Decleration
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes/indexRoutes');

// Helper
const {
  isEqual,
  discount,
  getRatingWidth,
  rateProgress,
} = require('./config/helpers');

// Database Excution
db();

// Passport config
require('./config/passport');

// Middlewares
//app.use(logger('dev'));
app.use(
  session({
    secret: 'sdasdada',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      url: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View Setting
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      isEqual,
      discount,
      getRatingWidth,
      rateProgress,
    },
  })
);
app.set('view engine', '.hbs');

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

//create Global Variable
app.use((req, res, next) => {
  if (req.session.cart) {
    res.locals.totalQty = req.session.cart.totalQty;
    res.locals.totalPrice = req.session.cart.totalPrice;
  } else {
    res.locals.totalQty = 0;
    res.locals.totalPrice = 0;
  }
  next();
});

// Routes Execution
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin-panel', adminRoutes);

// Error handle
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

// Server Running
const PORT = process.env.PORT || 2020;
app.listen(PORT, (_) => console.log(`SERVER RUNNING ON ${PORT}`));
