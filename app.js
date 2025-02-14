require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const mongoStore = require('connect-mongo')(session);
const path = require('path');
const db = require('./config/db');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
const getLatestTextedUsers = require('./functions/getLatestUserTexted');
const { formatValue, currencySymbol } = require('./config/currency');
const getUnseenMsgs = require('./functions/getUnseenMessages');
const {
  sendErrorDevelopment,
  sendErrorProduction,
  AppError,
} = require('./Error');
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
  filterTags,
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
app.use(cookieParser());

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
      filterTags,
    },
  })
);
app.set('view engine', '.hbs');

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

//create Global Variable
app.use(async (req, res, next) => {
  if (req.user) {
    res.locals.isLogin = true;
    if (req.user.position === 'buyer') res.locals.isBuyer = true;
    res.locals.latestTextedUsers = await getLatestTextedUsers(req);
    res.locals.unseenMsgs = await getUnseenMsgs(req);
  }
  if (req.session.cart) {
    res.locals.totalQty = req.session.cart.totalQty;
    res.locals.totalPrice = await formatValue(
      req.cookies._currency,
      req.session.cart.totalPrice
    );
  } else {
    res.locals.totalQty = 0;
    res.locals.totalPrice = 0;
  }
  res.locals.dictionary = require('./config/lang')(req.cookies._local);
  res.locals.currencySymbol = currencySymbol[req.cookies._currency] || '$';

  next();
});

// Routes Execution
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin-panel', adminRoutes);

// Server Running
const PORT = process.env.PORT || 2020;
const server = app.listen(PORT, (_) =>
  console.log(`SERVER RUNNING ON ${PORT}`)
);

const socket = require('socket.io');
const { log } = require('console');
const io = socket(server);

io.on('connection', (socket) => {
  let chatRoom;
  let notiRoom;
  socket.on('joinChatPage', ({ userId }) => {
    notiRoom = userId;
    socket.join(notiRoom);
  });
  socket.on('joinChat', (info) => {
    if (info.from < info.to) chatRoom = info.from + info.to;
    else chatRoom = info.to + info.from;
    socket.join(chatRoom);
    if (io.sockets.adapter.rooms[chatRoom])
      if (io.sockets.adapter.rooms[chatRoom].length === 2) {
        socket.to(chatRoom).emit('chatOpen');
      }
  });
  socket.on('chatMsg', async (chat) => {
    chat.msg = chat.msg.trim();
    if (chat.msg != '') {
      const newChat = new Chat({
        msg: chat.msg,
        from: chat.from,
        to: chat.to,
      });
      const image = await User.findById(chat.from).select({
        image: 1,
        _id: 0,
      });
      // Check Two In chat
      if (chatRoom)
        if (io.sockets.adapter.rooms[chatRoom].length === 2) {
          newChat.read = true;
        }
      await newChat.save();
      socket.to(chatRoom).emit('chatMsg', {
        msg: newChat.msg,
        date: newChat.date,
        image: image['image'],
      });
    }
  });
  socket.on('read', () => {
    if (io.sockets.adapter.rooms[chatRoom])
      if (io.sockets.adapter.rooms[chatRoom].length === 2)
        return socket.emit('read', true);

    return socket.emit('read', false);
  });
  socket.on('typing', () => {
    socket.to(chatRoom).emit('typing');
  });
  socket.on('stopTyping', () => {
    socket.to(chatRoom).emit('stopTyping');
  });
  socket.on('msgNotification', async (data) => {
    let appendDotNoti = true;
    if (io.sockets.adapter.rooms[chatRoom])
      if (io.sockets.adapter.rooms[chatRoom].length === 2)
        appendDotNoti = false;

    const user = await User.findById(data.from);
    io.to(data.to).emit('noti', {
      from: data.from,
      msg: data.msg,
      fullName: user.fullName,
      image: user.image,
      appendDotNoti: appendDotNoti,
    });
  });
  socket.on('leaveRoom', () => {
    socket.leave(chatRoom);
    console.log('LeaveRoom');
  });
});

// app.use((req, res, next) => {
//   throw new AppError('Page Not Found', 404);
// });

// Error handle
app.use(function (err, req, res, next) {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, res);
  }
});
