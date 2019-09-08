const router = require('express').Router();
const line = require('@line/bot-sdk');

//翻訳
const request = require('request');

const imageSearch = require('image-search-google');
const clientImage = new imageSearch('016901115011056515106:6pjbegaiuga', 'AIzaSyCqe72UGyiLECERkWVTvOLXdFJxYvVspTI');
// 
// const GoogleImages = require('google-images');
// const clientImage = new GoogleImages('016901115011056515106:6pjbegaiuga', 'AIzaSyCqe72UGyiLECERkWVTvOLXdFJxYvVspTI');

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
  // console.error('input' = ', event.message.text);
  console.log('inputTxt = ', event.message.text);

  /**
   * 翻訳について
   */
  // 入力文字取得

  // 文字チェック

  // 翻訳するためのトークンを取得します。有効期限は取得後10分間です

  // 翻訳するための文字列を生成します

  // var api_key = 'AIzaSyCqe72UGyiLECERkWVTvOLXdFJxYvVspTI'
  // var cse_id = '016901115011056515106:6pjbegaiuga'
  const options = {page:1};
  clientImage.search(event.message.text, options)
	.then(
    // console.log('url == ', images) 
    images => {
    // console.log('images111 == ', images);
    replayarry = [];
    images.forEach(function(value){
      console.log('images111 == ', value.url);
      //replayarry = [];
      replayarry.push(
        {
          "type": "image",
          "originalContentUrl": value.url,
          "previewImageUrl": value.thumbnail
        });
    });
    return client.replyMessage(event.replyToken, replayarry);
    // [{
    //   'url': item.link,
    //   'thumbnail':item.image.thumbnailLink,
    //   'snippet':item.title,
    //   'context': item.image.contextLink
    // }]
  }
  // client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: translateText,
  // });
    )
	.catch(
    error => console.log(error)
    );
 
  //console.log('image == ', clientImage.search('you', {size: 'large'}));

  // clientImage.search(event.message.text);

  // // 実行
  // translateText = '';
  // return getAccessToken(function (err, token) {
  //   if (!err) {
  //     // console.log(token);
  //     translate(token, event.message.text, (err, translated) => {
  //       if (!err) {
  //         console.log('TransLate == ', event.message.text, '->', translated);
  //         translateText = translated;
  //         client.replyMessage(event.replyToken, {
  //           type: 'text',
  //           text: translateText,
  //         });
  //       }
  //     });
  //   }
  // });


  // console.log('Text == ', translateText);







  // return client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: event.message.text,
  // });
}

router.post('/', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

/**
 * 翻訳周り関連
 */

// アクセストークン取得
function getAccessToken(callback) {
  key = '351118560b1a45929f0d91492722b4af';
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/jwt',
    'Ocp-Apim-Subscription-Key': key
  };
  let options = {
    url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
    method: 'POST',
    headers: headers,
    json: true
  };

  request(options, function (err, res) {
    if (err) {
      console.log('getToken error = ', err);
      callback(err, null);
    } else {
      callback(null, res.body);
    }
  });
}

// 翻訳 (日本語 -> 英語)
function translate(token, text, callback) {
  let base_url = 'https://api.microsofttranslator.com/v2/http.svc/Translate',
      appid = 'Bearer ' + token,
      // from = 'ja',
      from = 'en',
      to = 'ja';
      // to = 'en';

  let url = base_url + '?appid=' + appid + '&text=' + text + '&from=' + from + '&to=' + to;
  let headers = {
    'Accept': 'application/xml'
  };
  console.log('url = ', url);
  let options = {
    url: encodeURI(url),
    method: 'get',
    headers: headers,
    json: true
  };

  request(options, function (err, res) {
    if (err) {
      console.log('translate error = ', err);
      callback(err, null);
    } else {
      // console.log('res = ', res);
      callback(null, res.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ''));
    }
  });
}

// // 実行
// getAccessToken(function (err, token) {
//   if (!err) {
//       // console.log(token);
//       translate(token, process.argv[2], (err, translated) => {
//           if (!err)
//               console.log(process.argv[2], '->', translated);
//       });
//   }
// });
