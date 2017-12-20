'use strict'

require('now-env')
const Twit = require('twit')
const Task = require('data.task')
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
})

const diff = xs => xy => xs.filter(x => !xy.includes(x))

const sleep = ms => new Task((rej, res) => setTimeout(res, ms))

const get = (url, opts = { count: 200 }) =>
  new Task((rej, res) =>
    bot.get(url, opts, (err, data, response) => (err ? rej(err) : res(data)))
  )

const notify = users =>
  users.map(user =>
    bot.post('direct_messages/new', {
      screen_name: process.env.TWITTER_HANDLER,
      text: `User @${user} stopped following you!`
    })
  )

const getFollowers = (all = [], cursor = 0) =>
  get('followers/list', { count: 200, cursor }).chain(
    ({ users, next_cursor_str: nextCursor }) =>
      nextCursor && nextCursor === '0'
        ? Task.of(all.concat(users).map(user => user.screen_name))
        : getFollowers(all.concat(users), nextCursor)
  )

module.exports = () =>
  Task.of(diff)
    .ap(getFollowers())
    .ap(sleep(15 * 60 * 1000).chain(getFollowers))
    .fork(console.error, notify)
