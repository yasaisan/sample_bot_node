# tangocho_node

## 前提条件

- Local 環境に node.js がインストールされていること
- Local 環境に MongoDB がインストールされていること

## 起動手順

```
npm install -g nodemon
npm install -g vue-cli
npm install
npm run postinstall
npm run dev
```

## Heroku 環境更新手順

下記のConfig Varsを登録する

```
LINE_ACCESS_TOKEN
LINE_CHANNEL_SECRET
MONGODB_URI
SECRET
```

```
git push heroku master
```
