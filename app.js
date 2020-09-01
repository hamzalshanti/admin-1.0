require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path');
const db = require('./config/db');
const app = express();

// Routes Decleration
const indexRoutes = require('./routes/index');


// Database Excution
db();

// Middlewares
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// View Setting
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');





// Routes Execution
app.use('/', indexRoutes);


// Error handle
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('404');
});


// Server Running
const PORT = process.env.PORT || 2020;
app.listen(PORT, _ => console.log(`SERVER RUNNING ON ${PORT}`));
