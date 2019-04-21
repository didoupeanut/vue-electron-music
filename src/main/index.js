'use strict'

import { app, BrowserWindow } from 'electron'
import { command } from './command'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('./util/request').default
const cache = require('apicache').middleware

function createWindow() {
  const app = express()

  // CORS
  app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.includes('.')) {
      res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    next()
  })

  // cookie parser
  app.use((req, res, next) => {
    req.cookies = {}, (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
      let crack = pair.indexOf('=')
      if (crack < 1 || crack == pair.length - 1) return
      req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(pair.slice(crack + 1)).trim()
    })
    next()
  })

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // cache
  app.use(cache('2 minutes', ((req, res) => res.statusCode === 200)))

  // static
  app.use(express.static(path.join(__dirname, 'public')))

  // router
  const special = {
    'daily_signin.js': '/daily_signin',
    'fm_trash.js': '/fm_trash',
    'personal_fm.js': '/personal_fm'
  }
  // 自动注册路由
  fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach(file => {
    if (!(/\.js$/i.test(file))) return
    let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
    let question = require('./module/'+ file.replace(/\.js$/i, '')).default
    app.use(route, (req, res) => {
      let query = Object.assign({}, req.query, req.body, { cookie: req.cookies })
      question(query, request)
        .then(answer => {
          console.log('[OK]', decodeURIComponent(req.originalUrl))
          res.append('Set-Cookie', answer.cookie)
          res.status(answer.status).send(answer.body)
        })
        .catch(answer => {
          console.log('[ERR]', decodeURIComponent(req.originalUrl))
          if (answer.body.code == '301') answer.body.msg = '需要登录'
          res.append('Set-Cookie', answer.cookie)
          res.status(answer.status).send(answer.body)
        })
    })
  })

  const port = process.env.PORT || 3000

  app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`)
  })

  /**
   * Initial window options
   */
  const win = new BrowserWindow({
    height: 670,
    minHieght: 670,
    width: 1000,
    minWidth: 1000,
    useContentSize: true,
    transparent: false,
    frame: false,
    darkTheme: true,
    backgroundColor: '#FFFFFFFF'
  })

  win.loadURL(winURL)

  win.on('closed', () => {
    mainWindow = null
  })

  return win
}

app.on('ready', () => {
  mainWindow = createWindow()
  command(mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
