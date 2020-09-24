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
const getUnseenMsgs = require('./functions/getUnseenMessages');
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
    res.locals.totalPrice = req.session.cart.totalPrice;
  } else {
    res.locals.totalQty = 0;
    res.locals.totalPrice = 0;
  }
  if (req.user) res.locals.userSessionID = req.user._id.toString();
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
  socket.on('msgNotification', (data) => {
    let appendDotNoti = true;
    if (io.sockets.adapter.rooms[chatRoom])
      if (io.sockets.adapter.rooms[chatRoom].length === 2)
        appendDotNoti = false;

    io.to(data.to).emit('noti', {
      from: data.from,
      msg: data.msg,
      appendDotNoti: appendDotNoti,
    });
  });
  socket.on('leaveRoom', () => {
    console.log('LeaveRoom');
  });
});
