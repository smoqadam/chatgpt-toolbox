import { prompts } from './prompts';

console.log("hi from service worker");


chrome.contextMenus.create({
    id: "parent",
    title: "ChatGPT",
    contexts: ["selection"],  // ContextType
});

prompts.forEach((p) => {
    chrome.contextMenus.create({
      title: p.label,
      id: p.id,
      parentId: "parent",
      contexts: ["selection"]
    });
  })

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log({ info });
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function (tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    msg: info.menuItemId,
                    data: {
                        text: info.selectionText
                    }
                });
                console.log(
                    "message sent"
                );
            });
        }
    );
});

