const puppeteer = require('puppeteer')
const fs = require('fs')

const BASE_URL = 'https://analytica.jp'

const signIn = async (page, groupName, email, password) => {
  // Sign in
  await page.goto('https://analytica.jp/account/login')
  await page.type('input[name="group_name"]', groupName)
  await page.type('input[name="email"]', email)
  await page.type('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitFor(2000)

  // Signed in successfully?
  const location = await page.evaluate(() => {
    return location.href || ''
  })

  if (location.indexOf('dashboard') < 0) {
    console.error('Sign in failed! Check groupName, email and password.')
    process.exit(1)
  }
}

exports.getQueries = async (groupName, email, password) => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 10
  })
  const page = await browser.newPage()

  // Sign-In
  await signIn(page, groupName, email, password)

  // Open query list
  await page.goto('https://analytica.jp/query/list')
  await page.waitFor(2000)

  // Fetch query URLs
  const items = await page.evaluate(() => {
    const dataList = []
    const nodeList = document.querySelectorAll('#main-content .panel-body')
    nodeList.forEach(async node => {
      const href = node.querySelector('a[href^="/query"]').getAttribute('href')

      dataList.push({
        title: node.innerText,
        href: href
      })
    })
    return dataList
  })

  const total = items.length
  let idx = 1
  for (const item of items) {
    console.log(`Progress: ${idx++}/${total}`)
    const subpage = await browser.newPage()
    await subpage.goto(BASE_URL + item.href)
    await subpage.waitFor(2000)
    // Wait until loading is finished
    try {
      await subpage.waitForSelector('.loader', { hidden: true, timeout: 10000 })
    } catch (err) {
      // Ignore error
    }

    // Extract SQL
    const sql = await subpage.evaluate(() => {
      const textarea = document.querySelector('.ReactCodeMirror > textarea')
      return textarea && textarea.textContent
    })
    item.sql = sql
    await subpage.close()
  }

  await browser.close()
  return items
}

exports.getTransforms = async (groupName, email, password) => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 10
  })
  const page = await browser.newPage()

  // Sign-In
  await signIn(page, groupName, email, password)

  // Open transform list
  await page.goto('https://analytica.jp/transform/list')
  await page.waitFor(2000)

  // Fetch transform URLs
  const items = await page.evaluate(() => {
    const dataList = []
    const nodeList = document.querySelectorAll('#main-content .panel-body')
    nodeList.forEach(async node => {
      const href = node.querySelector('a[href^="/transform"]').getAttribute('href')

      dataList.push({
        title: node.innerText,
        href: href
      })
    })
    return dataList
  })
  await browser.close()
  return items
}

exports.exportToJson = (path, obj) => {
  fs.writeFileSync(path, JSON.stringify(obj), { encoding: 'utf8' })
}
