const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const moment = require('moment');

getLatestTextedUsers = async function (req) {
  let latestConversations = await Chat.aggregate()
    .match({
      $or: [{ from: req.user._id.toString() }, { to: req.user._id.toString() }],
    })
    .sort({
      createdAt: -1,
    })
    .group({
      _id: {
        $cond: {
          if: { $gt: ['$to', '$from'] },
          then: { $concat: ['$to', '-', '$from'] },
          else: { $concat: ['$from', '-', '$to'] },
        },
      },
      from: { $first: '$from' },
      to: { $first: '$to' },
      msg: { $first: '$msg' },
      date: { $first: '$createdAt' },
    })
    .project({
      user: {
        $cond: {
          if: { $eq: ['$from', req.user._id.toString()] },
          then: '$to',
          else: '$from',
        },
      },
      msg: 1,
      date: 1,
      _id: 0,
    })
    .lookup({
      from: User.collection.name,
      localField: '_id', //this is the _id user from tests
      foreignField: 'user', //this is the _id from users
      as: 'userDetails',
    })
    .unwind({
      path: '$userDetails',
    })
    .project({
      'userDetails.password': 0,
      'userDetails.email': 0,
      'userDetails.createdAt': 0,
    })
    .sort({
      date: -1,
    });
  latestConversations = latestConversations.filter(
    (c) => c['userDetails']['_id'].toString() === c['user']
  );
  latestConversations.forEach((c) => {
    delete c.user;
    c.date = moment(c.date).calendar();
  });
  return latestConversations;
};

module.exports = getLatestTextedUsers;
