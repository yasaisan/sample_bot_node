const router = require('express').Router();
const line = require('@line/bot-sdk');

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  if (event.replyToken === '00000000000000000000000000000000') {
    return;
  }

  // console.log('handleEvent', );
  console.error('replyMessage = ', event.message.text);
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  });
}

router.post('/', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
