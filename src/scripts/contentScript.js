import popup from './popup.html';
import { prompts } from './prompts';
import Popup from './popup';


var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.runtime.getURL('src/css/popup.css');
(document.head || document.documentElement).appendChild(style);



var doc = new DOMParser().parseFromString(popup, "text/xml");
document.querySelector('body').appendChild(doc.firstChild);


let p = new Popup();
// p.hide();

chrome.runtime.onMessage.addListener(function (req) {
    p.show();
    console.log({ req });
    if (req.msg == 'response') {
        console.log(req.data);
        document.querySelector('#chatgpt-toolbox__prompt').textContent = req.data.prompt;
        // var doc = new DOMParser().parseFromString(popup, "text/xml");

        document.querySelector('#chatgpt-toolbox__response').textContent = req.data.response;
    }
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