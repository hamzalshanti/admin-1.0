const Chat = require('../models/chatModel');
const unseenMsgs = async function (req) {
  const msgs = await Chat.aggregate()
    .match({
      $and: [
        {
          to: req.user._id.toString(),
        },
        {
          read: false,
        },
      ],
    })
    .sort({
      createdAt: -1,
    })
    .group({
      _id: '$from',
      msg: { $first: '$msg' },
      createdAt: { $first: '$createdAt' },
      createdAt: { $first: '$createdAt' },
      count: { $sum: 1 },
    });
  return msgs;
};
module.exports = unseenMsgs;
