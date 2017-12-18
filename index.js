'use strict'

require('now-env')
const Twit = require('twit')
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
})

const getUsers = async () => {
  try {
    const { data: { users } } = await bot.get('followers/list', { count: 200 })
    if (users.length) {
      users.forEach((user, i) => console.log(i + 1, user.screen_name))
    }
  } catch (err) {
    console.error(err)
  }
}

getUsers()
