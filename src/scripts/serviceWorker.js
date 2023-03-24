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
chrome.runtime.onMessage.addListener((req) => {
    console.log({req});
    if (req.type == "openOption") {
        chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    }
})
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    let promptObj = getPrompt(info.menuItemId);
    let prompt = promptObj.prompt.replace("{{TEXT}}", info.selectionText)


    let api_key = await chrome.storage.local.get("api_key");
    let response = await OpenaiFetchAPI(prompt, api_key.api_key);

    console.log({response});

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function (tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    msg: 'response',
                    data: {
                        prompt: prompt,
                        response: response.choices[0].text
                    }
                });
                console.log(
                    "message sent"
                );
            });
        }
    );
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
    console.log("Calling GPT3")
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
