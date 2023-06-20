import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
// import { prompts } from '../logic/prompts';
// import { prompts } from '~/logic/storage';
import { getApiKey, getPrompts, getPrompt, openOptions, OpenaiFetchAPI } from '~/logic/common-setup';
import browser from "webextension-polyfill";
import { openaiApiKey } from '~/logic/storage'


// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
  openOptions();
})




browser.contextMenus.create({
  id: "parent",
  title: "ChatGPT",
  contexts: ["page", "selection"],
});


getPrompts().then((prompts) => {
  console.log({prompts});
  
  prompts.forEach((p: any, i: number) => {
    console.log(p, i);
    
    // if (p.id === "summarize") {
    //   browser.contextMenus.create({
    //     title: p.label,
    //     id: p.id,
    //     parentId: "parent",
    //     contexts: ["page"]
    //   });
    //   return;
    // }

    browser.contextMenus.create({
      title: p.label,
      id: p.id,
      parentId: "parent",
      contexts: ["selection"]
    });
  });
}).catch(e => {
  console.error(e);
});

browser.browserAction.onClicked.addListener(openOptions);

browser.runtime.onMessage.addListener((req) => {
  if (req.type == "openOption") {
    openOptions();
  }
});



browser.contextMenus.onClicked.addListener(async (info, tab) => {
  let promptObj = await getPrompt(info.menuItemId);
  let promptTxt = null;
  if (info.menuItemId === "summarize") {
    promptTxt = promptObj.prompt.replace("{{TEXT}}", tab.url)
  } else {
    promptTxt = promptObj.prompt.replace("{{TEXT}}", info.selectionText)
  }

  let api_key = await getApiKey();
  if (api_key == undefined) {
      await browser.tabs.sendMessage(tab.id, { msg: 'missing_api_key', data: { prompt: promptTxt } });
      return;
  }

  await browser.tabs.sendMessage(tab.id, { msg: 'clicked', data: { prompt: promptTxt } });


  let response = await OpenaiFetchAPI(promptTxt, api_key);
  console.log({ response });

  if (response.error != undefined) {    
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
});
