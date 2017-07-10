const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const console = require('console')


function isDev() {
  return process.env.NODE_ENV == 'DEVELOPMENT'
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, show: false})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (isDev()) {
    var client = require('electron-connect').client
    client.create(win);
  }

  win.openDevTools()

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('did-finish-load', () => {
    win.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.