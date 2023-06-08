import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcMain } from 'electron'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// get messages from renderer
ipcMain.on('save-file', (_event, file, fileName) => {
  console.log(file)

  // change ArrayBuffer to Buffer
  const buffer = Buffer.from(file)

  // save to file
  fs.writeFile('data/media/' + fileName, buffer, (err) => {
    if (err) throw err
    console.log('The file has been saved!')
  })
})

ipcMain.on('open-file', (_event, fileName) => {
  console.log(fileName)
  console.log(join(__dirname + '../../../data/media/') + fileName)

  shell.openPath(join(__dirname + '../../../data/media/') + fileName)
})

ipcMain.on('get-encryption-key', (event, encryptedPassword: string) => {
  // get key saved in password.txt file
  fs.readFile(join(__dirname + '../../../data/config.json') , 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)

    // get data from "encryptionKey" key
    const key: string = JSON.parse(data).password

    console.log(key)

    // check if password is correct
    if (key === encryptedPassword) {
      // send key to renderer
      event.reply('encryption-key', true)
    } else {
      event.reply('encryption-key', false)
    }
  })
})

ipcMain.on('save-pubkey', (_event, pubkey: string, friend: string) => {
  console.log(pubkey)

  // save to file
  fs.writeFile('data/pubkeys/' + friend + "_key.pub", pubkey, (err) => {
    if (err) throw err
    console.log('The public key has been saved!')
  })
})

ipcMain.on('save-privkey', (_event, privkey: string, friend: string) => {
  console.log(privkey)

  // save to file
  fs.writeFile('data/privkeys/' + friend + "_key", privkey, (err) => {
    if (err) throw err
    console.log('The private key has been saved!')
  })
})

ipcMain.on('get-pubkey', (event, friend: string) => {
  // get key saved in password.txt file
  fs.readFile(join(__dirname + '../../../data/pubkeys/') + friend + "_key.pub" , 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)

    event.reply('get-pubkey', data)
  })
})

ipcMain.on('get-privkey', (event, friend: string) => {
  // get key saved in password.txt file
  fs.readFile(join(__dirname + '../../../data/privkeys/') + friend + "_key" , 'utf8', (err, data) => {
    if (err) throw err
    console.log(data)

    event.reply('get-privkey', data)
  })
})