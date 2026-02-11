// iNikolayev background script (Manifest V3 compatible)

(() => {
  const self = {
    init() {
      chrome.storage.sync.get(
        {
          activate: true,
          contextmenu: true,
        },
        (items) => {
          self.updateContextMenu(items);
        }
      );

      chrome.runtime.onInstalled.addListener(self.onInstalled);
      chrome.runtime.onMessage.addListener(self.onMessageReceived);

      // Listener для клика по контекстному меню
      chrome.contextMenus.onClicked.addListener((info) => {
        if (info.menuItemId === "iNikolayevInactivate") {
          self.openOptions();
        }
      });
    },

    onInstalled(details) {
      if (details.reason === "install") {
        self.openOptions();
      }
    },

    onMessageReceived(message, sender, sendResponse) {
      if (message.type === "options") {
        self.updateContextMenu(message.items);
      }
    },

    updateContextMenu(items) {
      chrome.contextMenus.removeAll(() => {
        if (items.contextmenu && items.activate) {
          chrome.contextMenus.create({
            id: "iNikolayevInactivate",
            title: chrome.i18n.getMessage("contextMenuInactivate"),
            contexts: ["page"],
          });
        }
      });
    },

    openOptions() {
      const optionsUrl = chrome.runtime.getURL(
        "inikolayev/options/options.html"
      );

      chrome.tabs.query({ url: optionsUrl }, (tabs) => {
        if (tabs.length) {
          chrome.tabs.update(tabs[0].id, { active: true });
          chrome.windows.update(tabs[0].windowId, { focused: true });
        } else {
          chrome.tabs.create({ url: optionsUrl });
        }
      });
    },
  };

  self.init();
})();
