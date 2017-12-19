'use strict'

require('now-env')
const Twit = require('twit')
const Task = require('data.task')
const Maybe = require('data.maybe')
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
})

// #region Helpers
const get = (url, opts = { count: 200 }) =>
  new Task((rej, res) =>
    bot.get(url, opts, (err, data, response) => (err ? rej(err) : res(data)))
  )
// const post = text =>
//   new Task((rej, res) =>
//     bot.post(
//       'direct_messages/new',
//       {
//         screen_name: 'flaviocorpa',
//         text
//       },
//       (err, data, response) => (err ? rej(err) : res(data))
//     )
//   )
// const sleep = ms => new Task((rej, res) => setTimeout(res, ms))
const diff = xs => xy => xs.filter(x => !xy.includes(x))
// #endregion

const getFollowers = get('followers/list').map(data =>
  data.users.map(user => user.screen_name)
)

Maybe.of(diff)
  .ap(getFollowers)
  // .ap(sleep(15 * 60 * 1000))
  .ap(getFollowers)
  .fork(console.error, console.log)
