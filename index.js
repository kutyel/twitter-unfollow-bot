'use strict'

require('now-env')
const Twit = require('twit')
const Task = require('data.task')
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
})

const get = (url, opts = { count: 200 }) =>
  new Task((rej, res) =>
    bot
      .get(url, opts)
      .then(data => res(data))
      .catch(err => rej(err))
  )

const main = res => res.data.users.map((user, i) => `${i} ${user.screen_name}`)

get('followers/list')
  .map(main)
  .fork(console.error, console.log)
