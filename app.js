const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path');
const app = express();

// Routes Decleration
const indexRoutes = require('./routes/index');


// Database Excution


// Middlewares
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// View Setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');





// Routes Execution
app.use('/', indexRoutes);





// Server Running
const PORT = process.env.PORT || 2020;
app.listen(PORT, _ => console.log(`SERVER RUNNING ON ${PORT}`));
