import { prompts } from './prompts';

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

browser.runtime.onMessage.addListener((req) => {
    if (req.type == "openOption") {
        let url = browser.runtime.getURL('/src/options.html');
        browser.tabs.create({ 'url': url });
    }
});

browser.contextMenus.onClicked.addListener(async function (info, tab) {
    let promptObj = getPrompt(info.menuItemId);
    let prompt = null;
    if (info.menuItemId === "summarize") {
        prompt = promptObj.prompt.replace("{{TEXT}}", tab.url)
    } else {
        prompt = promptObj.prompt.replace("{{TEXT}}", info.selectionText)
    }

    let result = await browser.storage.local.get("api_key");
    // if (result.api_key == undefined) {
    //     await browser.tabs.sendMessage(tab.id, { msg: 'missing_api_key', data: { prompt: prompt } });
    //     return;
    // }

    await browser.tabs.sendMessage(tab.id, { msg: 'clicked', data: { prompt: prompt } });

    OpenaiFetchAPI(prompt, result.api_key).then((response) => {

        console.log({ response });
        browser.tabs.sendMessage(tab.id, {
            msg: 'response',
            data: {
                prompt: prompt,
                response: response.choices[0].text
            }
        });
    }).catch((e) => {
        console.log({ e });
        let url = browser.runtime.getURL('/src/options.html');

        browser.tabs.sendMessage(tab.id, {
            msg: 'missing_api_key',
            data: {
                prompt: prompt,
                response: 'Yout API key is missing. Please open the settings and enter your OpenAI\'s API key.',
            }
        });
    });

});


const getPrompt = (id) => {
    let prompt = null;
    prompts.forEach((v) => {
        if (v.id == id) {
            prompt = v;
            return;
        }
    });

    return prompt;
}


function OpenaiFetchAPI(prompt, token) {
    var url = "https://api.openai.com/v1/completions";
    var bearer = 'Bearer ' + token
    return fetch(url, {
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
    }).then(response => {
        return response.json()
    })
}
