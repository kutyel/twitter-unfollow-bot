'use strict'

require('now-env')
const Twit = require('twit')
const bot = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
})

const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

const diff = (old, news) => news.filter(n => !old.includes(n))

const getUsers = async (all = [], cursor = -1) => {
  try {
    const { data: { users = [], next_cursor_str: nextCursor } } = await bot.get('followers/list', {
      count: 200,
      cursor
    })
    all = [...all, ...users.map(x => x.screen_name)]
    return nextCursor && nextCursor === '0' ? all : getUsers(all, nextCursor)
  } catch (err) {
    console.error(err)
    return []
  }
}

const main = async () => {
  const oldFollowers = await getUsers()
  console.log('oldFollowers', oldFollowers)
  await sleep(15 * 60 * 1000)
  const currentFollowers = await getUsers()
  console.log('currentFollowers', currentFollowers)
  const unfollows = diff(oldFollowers, currentFollowers)
  unfollows.forEach(user => console.log(`User @${user} stopped following you!`))
}

main()
