const router = require('express').Router();
const line = require('@line/bot-sdk');

// 翻訳
const request = require('request');
// image検索
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

  console.log('inputTxt = ', event.message.text);

  /**
   * 翻訳について
   */
  // 入力文字取得

  // 文字チェック

  // 翻訳するためのトークンを取得します。有効期限は取得後10分間です

  // 翻訳するための文字列を生成します

  const options = {
    page:1
  };

  clientImage.search(event.message.text, options)
	.then(
    // console.log('url == ', images) 
    images => {
      // console.log('images111 == ', images);
      replaimageyarry = [];
      cnt = 0;
      images.some(function(value){
        if( value.url.match( /^https:\/\// ) && value.thumbnail.match( /^https:\/\// ) ){
            //  && value.url.match( /^https:\/\// )){
          console.log('url == ', value.url);
          console.log('thumbnail == ', value.thumbnail);
          replaimageyarry.push(
            {
              imageUrl: value.url,
              action: {
                type: 'message',
                label: event.message.text,
                text: event.message.text
              }
            }
          );
          cnt++;
        }
        if (cnt == 3) return true; 
      });
      console.log('replaimageyarry == ', replaimageyarry);
      arry = {
        type: 'template',
        altText: 'this is a image carousel template',
        template: {
          type: 'image_carousel',
          columns: replaimageyarry
        }
      };
      // console.log('replayarry == ', arry);
      //return client.replyMessage(event.replyToken, arry);
      translateText = '';
      replyMessageArray = [];
      replyMessageArray.push(arry);

      return getAccessToken(function (err, token) {
        if (!err) {
          // console.log(token);
          translate(token, event.message.text, (err, translated) => {
            if (!err) {
              console.log('TransLate == ', event.message.text, '->', translated);
              translateText = translated;
              replyMessageArray.unshift({
                type: 'text',
                text: translateText,
              });
              replyMessageArray.push({
                type: 'template',
                altText: '登録しますか？',
                template: {
                  type: 'confirm',
                  text: '登録しますか？',
                  actions: [
                    { label: 'Yes', type: 'message', text: 'Yes!' },
                    { label: 'No', type: 'message', text: 'No!' },
                  ],
                }
              });

              client.replyMessage(event.replyToken, replyMessageArray);
            }
          });
        }
      });

      // [{
      //   'url': item.link,
      //   'thumbnail':item.image.thumbnailLink,
      //   'snippet':item.title,
      //   'context': item.image.contextLink
      // }]
    }
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
