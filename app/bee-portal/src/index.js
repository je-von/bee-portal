const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

let mainWindow = null
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './page/index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // mainWindow.setResizable(false)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
    mainWindow = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

let trayIcon = null
app.on('ready', () => {
  // if (trayIcon) return mainWindow.hide()
  trayIcon = new Tray(path.join('', './src/logo/bee.png'))

  const template = [
    {
      label: 'bee-portal by JV',
      enabled: false,
    },

    {
      label: 'Open',
      click: function () {
        // mainWindow.show()
        if (mainWindow) mainWindow.show()
        else {
          createWindow()
        }
      },
    },
    {
      label: 'Exit',
      click: function () {
        app.quit()
      },
    },
  ]

  let trayMenu = Menu.buildFromTemplate(template)
  trayIcon.setContextMenu(trayMenu)
  trayIcon.setToolTip('bee-portal')

  // mainWindow.hide()
  mainWindow.on('closed', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      // mainWindow.hide()
    }

    return false
  })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
