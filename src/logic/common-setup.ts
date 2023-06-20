import type { App } from 'vue'

export function setupApp(app: App) {
  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = {
    context: '',
  }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Here you can install additional plugins for all contexts: popup, options page and content-script.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
}


export async function getPrompts(): Promise<Prompt[]> {

  return new Promise<Prompt[]>((resolve, reject) => {
    browser.storage.local.get("prompts").then((result) => {
      if (result.prompts !== undefined) {
        console.log({result});
        
        let json = JSON.parse(result.prompts);
        resolve(<Prompt[]>json);
      } else {
        let err = new Error('There is no prompts in local db')
        reject(err);
      }
    })
  });
}


export const getPrompt = async (id: string|number): Promise<Prompt> => {
  return new Promise<Prompt>(async (resolve, reject) => {
    let prompts = await getPrompts();
    prompts.forEach((v: Prompt) => {
      if (v.id == id) {
        resolve(v);
      }
    });
  });
}

export async function getApiKey(): Promise<string> {

  return new Promise<string>((resolve, reject) => {
    browser.storage.local.get("api_key").then(result => {
      if (result.api_key !== undefined) {
        resolve(<string>result.api_key);
      } else {
        let err = new Error('API key must be set')
        reject(err)
      }
    });
  });
}


export function openOptions() {
  let url = browser.runtime.getURL('./dist/options/index.html');
  browser.tabs.create({ 'url': url });
}
 

export async function OpenaiFetchAPI(prompt: string, token: string) {
  console.log({token});
  
  var url = "https://api.openai.com/v1/completions";
  var bearer = 'Bearer ' + token

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

}


