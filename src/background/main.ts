import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
import { prompts } from './prompts';
import browser from "webextension-polyfill";
// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

browser.contextMenus.create({
  id: "parent",
  title: "ChatGPT",
  contexts: ["page", "selection"],
});

prompts.forEach((p) => {
  if (p.id === "summarize") {
    browser.contextMenus.create({
      title: p.label,
      id: p.id,
      parentId: "parent",
      contexts: ["page"]
    });
    return;
  }
  browser.contextMenus.create({
    title: p.label,
    id: p.id,
    parentId: "parent",
    contexts: ["selection"]
  });
});

// open the options after installation
// browser.runtime.onInstalled.addListener((e) => {
//     openOptions();
// })


// browser.browserAction.onClicked.addListener(openOptions);

browser.runtime.onMessage.addListener((req) => {
  if (req.type == "openOption") {
    openOptions();
  }
});


function openOptions() {
  let url = browser.runtime.getURL('/src/options.html');
  browser.tabs.create({ 'url': url });
}

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  let promptObj = getPrompt(info.menuItemId);
  let promptTxt = null;
  if (info.menuItemId === "summarize") {
    promptTxt = promptObj.prompt.replace("{{TEXT}}", tab.url)
  } else {
    promptTxt = promptObj.prompt.replace("{{TEXT}}", info.selectionText)
  }

  let result = await browser.storage.local.get("api_key");
  // if (result.api_key == undefined) {
  //     await browser.tabs.sendMessage(tab.id, { msg: 'missing_api_key', data: { prompt: prompt } });
  //     return;
  // }

  await browser.tabs.sendMessage(tab.id, { msg: 'clicked', data: { prompt: promptTxt } });


  let response = await OpenaiFetchAPI(promptTxt, result.api_key);
  console.log({ response });

  if (response.error != undefined) {
    console.log(`ERRRRR`, tab);
    
   await browser.tabs.sendMessage(tab.id, {
      msg: 'missing_api_key',
      data: {
        prompt: promptTxt,
        response: 'Yout API key is missing. Please open the settings and enter your OpenAI\'s API key.',
      }
    });
    return;
  }


  browser.tabs.sendMessage(tab.id, {
    msg: 'response',
    data: {
      prompt: promptTxt,
      response: response.choices[0].text
    }
  });

  // OpenaiFetchAPI(promptTxt, result.api_key).then((response) => {

  //   console.log({ response });
  //   browser.tabs.sendMessage(tab.id, {
  //     msg: 'response',
  //     data: {
  //       prompt: promptTxt,
  //       response: response.choices[0].text
  //     }
  //   });
  // }).catch((e) => {
  //   console.log({ e });
  //   let url = browser.runtime.getURL('/src/options.html');

  //   browser.tabs.sendMessage(tab.id, {
  //     msg: 'missing_api_key',
  //     data: {
  //       prompt: prompt,
  //       response: 'Yout API key is missing. Please open the settings and enter your OpenAI\'s API key.',
  //     }
  //   });
  // });

});
// browser.browserAction.onClicked.addListener((e) => {
//     console.log('br')
// });

const getPrompt = (id) => {
  console.log({ id });

  let prompt = null;
  prompts.forEach((v) => {
    if (v.id == id) {
      prompt = v;
      return;
    }
  });

  return prompt;
}


async function OpenaiFetchAPI(prompt, token) {
  var url = "https://api.openai.com/v1/completions";
  var bearer = 'Bearer ' + token

  // try {
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "text-davinci-003",
      "prompt": prompt,
      "max_tokens": 3000,
      "temperature": 1,
    })
  });
  return await res.json();
  // } catch (e) {
  //   return e;
  // }
}



// let previousTabId = 0

// // communication example: send previous tab title from background page
// // see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }

//   let tab: Tabs.Tab

//   try {
//     tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }

//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })

// onMessage('get-current-tab', async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
