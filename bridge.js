const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  notify: () => {
    ipcRenderer.invoke('notify');
  },
  onClick: callback => ipcRenderer.on('click', callback),
});