const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const notifications = require('@nodert-win10-au/windows.ui.notifications');
const path = require('path');

let win;
let cache = [];

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
  console.log("Notify");
  console.log("Platform", process.platform);

  if(process.platform == 'win32') {

    let appId = global.appUserModelId; 
    let notifier = notifications.ToastNotificationManager.createToastNotifier(appId);

    let xmlDocument = `
      <toast launch='conversationId=9813'>
        <visual>
            <binding template='ToastGeneric'>
                <text>Some text</text>
            </binding>
        </visual>
      </toast>
    `;
    let notification = new notifications.ToastNotification(xmlDocument);

    cache.push(notification);

    notification.on('activated', () => {
      win.webContents.send('click');
    });

    notifier.show(notification);

  }
  else {

    let notification = new Notification({
      title: 'Basic Notification',
      body: 'Notification from the Main process',
    })

    cache.push(notification);
    
    notification.on('click', () => {
      win.webContents.send('click');
    });

    notification.show();

  }

});
