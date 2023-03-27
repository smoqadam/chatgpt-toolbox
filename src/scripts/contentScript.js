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


let popupObj = new Popup();
popupObj.hide();

chrome.runtime.onMessage.addListener(function (req) {
    console.log({ req });
    if (req.msg == 'clicked') {
        popupObj.setPrompt("Prompt: "+req.data.prompt);
        popupObj.show();
        popupObj.loading(true);
    } else if (req.msg == 'response') {
        console.log(req.data);
        popupObj.setResponse("ChatGPT: "+req.data.response);
        popupObj.loading(false);     
    }
});
