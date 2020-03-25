const textUtils = require('./textUtils')
const config = require('../config')
const sendLog = require('./sendLog')
const storage = require('./storage')

async function classNews (classStudent, telegram) {
  const data = storage.getData('news')
  const newsList = await classStudent.getNews() // this lists all news
  if (!data[classStudent.id]) data[classStudent.id] = []

  const newNews = newsList.filter(news => {
    return data[classStudent.id].indexOf(news.id) === -1
  })

  for (const news of newNews) { // for each news
    try {
      const msg = `${textUtils.getPrettyClassName(classStudent.title)}\n` +
        `${news.title}\n` +
        `${await news.getContent()}\n` +
        `Enviado em ${textUtils.createDateString(await news.getDate(), { inWords: true })}`
      for (const chatID of config.notifications.chatIDs) {
        await telegram.sendMessage(chatID, msg)
      }
      data[classStudent.id].push(news.id)
      storage.saveData('news', data)
    } catch (err) {
      sendLog.error(err)
    }
  }
}

module.exports = classNews
