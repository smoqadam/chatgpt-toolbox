import f from './file.html';
import { prompts } from './prompts';


chrome.runtime.onMessage.addListener(function (req) {
    console.log({ req });
    let promptId = req.msg;
    let promptObj = getPrompt(promptId);
    let prompt = promptObj.prompt.replace("{{TEXT}}", req.data.text)
    console.log(prompt);
    
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