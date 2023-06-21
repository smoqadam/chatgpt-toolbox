import { getApiKey, getPrompts, getPrompt, openOptions, OpenaiFetchAPI, sendMessage } from '~/logic/common-setup';
import { defaultPrompts } from '~/logic/prompts';
browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
  openOptions();
})




browser.contextMenus.create({
  id: "parent",
  title: "ChatGPT-Toolbox",
  contexts: ["selection"],
});


getPrompts().then((prompts) => {
  console.log({ prompts });
  initContextMenu(prompts);
}).catch(e => {
  console.log('defaultPrompts', defaultPrompts);
  browser.storage.local.set({
    "api_key": "",
    "prompts": JSON.stringify(defaultPrompts)
  });
  initContextMenu(defaultPrompts);
  console.error(e);
});

function initContextMenu(prompts: Array<Prompt>) {
  prompts.forEach((p: any, i: number) => {
    console.log(p, i);

    browser.contextMenus.create({
      title: p.label,
      id: p.id,
      parentId: "parent",
      contexts: ["selection"]
    });
  });
}

browser.browserAction.onClicked.addListener(openOptions);

browser.runtime.onMessage.addListener((req) => {
  if (req.type == "openOption") {
    openOptions();
  }
});



browser.contextMenus.onClicked.addListener(async (info, tab) => {

  let promptObj = await getPrompt(info.menuItemId);
  let promptTxt: string = "";

  promptTxt = promptObj.prompt.replace("{{TEXT}}", info.selectionText)

  console.log('context menu clicked', promptTxt);

  getApiKey().then(async (api_key) => {

    console.log('get api key', api_key);

    sendMessage(tab, {
      msg: 'clicked',
      data: {
        prompt: promptTxt,
        response: ""
      }
    });
    
    OpenaiFetchAPI(promptTxt, api_key).then((response) => {

      sendMessage(tab, {
        msg: 'response',
        data: {
          prompt: promptTxt,
          response: response.choices[0].text
        }
      });

    }).catch(e => {
      console.log(e);


      sendMessage(tab, {
        msg: 'missing_api_key', data: {
          prompt: promptTxt,
          response: 'Yout API key is missing. Please open the settings and enter your OpenAI\'s API key.'
        }
      }
      );
    })
  }).catch(async (e) => {
    console.log({ e });
    sendMessage(tab, {
      msg: 'missing_api_key', data: {
        prompt: promptTxt,
        response: 'Yout API key is missing. Please open the settings and enter your OpenAI\'s API key.'
      }
    }
    );
  })
});
