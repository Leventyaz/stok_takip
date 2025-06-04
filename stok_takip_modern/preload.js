const { contextBridge, ipcRenderer } = require('electron');

// API'yi güvenli bir şekilde pencereye dışarı aktar
contextBridge.exposeInMainWorld('electronAPI', {
  // Ana işlem ile iletişim için metodlar buraya eklenecek
  // Örnek: Uygulama sürümünü almak
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Daha fazla metod burada tanımlanabilir
}); 