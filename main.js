const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let notifications = [];

// Request the single instance lock
const isPrimary = app.requestSingleInstanceLock();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'bridge.js')
    }
  });
  mainWindow.loadFile('renderer.html');
}

app.whenReady().then(() => {
  // check if this is the only instance
  if (isPrimary) {
    app.setAsDefaultProtocolClient("myapp");
    createWindow();
  } else {
    // We are currently running in a second instance; quit the process.
    app.quit();
  }
});

app.on('window-all-closed', () => {
  app.quit()
});


ipcMain.handle('notify', () => {
  const notifId = notifications.length;

  let notification = new Notification({
    toastXml: `
      <toast activationType="protocol" launch="myapp://test?notif_id=${notifId}">
        <visual>
          <binding template="ToastGeneric">
            <image placement="appLogoOverride" hint-crop="circle" src="C:\\Windows\\IdentityCRL\\WLive48x48.png"/>
            <text>Notification ${notifId} title</text>
            <text>This is notification # ${notifId}</text>
          </binding>
        </visual>
      </toast>`
  });

  notifications.push(notification);

  notification.on('activated', () => console.log('Activated!'));
  notification.show();
});


app.on('second-instance', (_event, argv) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  // Last  argument is the link which activated the app.
  const link = argv[argv.length - 1];
  console.log("link", link);
  
  if (link) {
    const notifId = link.split("=")[1];
    mainWindow.webContents.send('click', notifId);
  }
});
