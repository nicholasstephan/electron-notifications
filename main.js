const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

let win;
let notifications = [];

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'bridge.js')
    },
  });
  win.loadFile('renderer.html');
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit()
});


ipcMain.handle('notify', () => {
  let notification = new Notification({
    title: 'Basic Notification',
    body: 'Notification from the Main process',
  })

  notifications.push(notification);
  
  notification.on('click', () => {
    win.webContents.send('click');
  });

  notification.show();

});
