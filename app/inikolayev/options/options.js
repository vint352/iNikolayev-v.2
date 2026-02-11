((() => {
  self = {
    init() {
      document.title = chrome.i18n.getMessage('optionsHeader');
      const langs = ['optionsPageActivate', 'optionsPageContextLink'];
      for (let i = 0; i < langs.length; i++) {
        const message = chrome.i18n.getMessage(langs[i]);
        document.getElementById(langs[i]).textContent = message;
      }
      document.addEventListener('DOMContentLoaded', self.restoreOptions);
      document.getElementById('chkActivate').addEventListener('change', self.saveOptions);
      document.getElementById('chkUseContextMenu').addEventListener('change', self.saveOptions);
    },
    saveOptions() {
      const activate = document.getElementById('chkActivate').checked;
      const contextmenu = document.getElementById('chkUseContextMenu').checked;
      const items = {
        activate,
        contextmenu,
      };
      chrome.storage.sync.set(items, () => {
        self.setStatus(activate);
        setTimeout(() => {}, 750);
      });
      chrome.runtime.sendMessage({
        type: 'options',
        items,
      }, (response) => {});
    },
    restoreOptions() {
      chrome.storage.sync.get({
        activate: true,
        contextmenu: true,
      }, (items) => {
        document.getElementById('chkActivate').checked = items.activate;
        document.getElementById('chkUseContextMenu').checked = items.contextmenu;
        self.setStatus(items.activate);
      });
    },
    setStatus(active) {
      let url;
      if (active) {
        url = chrome.runtime.getURL('inikolayev/options/on.jpg');
      } else {
        url = chrome.runtime.getURL('inikolayev/options/off.jpg');
      }
      document.querySelector('.options__image').src = url;
    },
  };
  self.init();
}))();