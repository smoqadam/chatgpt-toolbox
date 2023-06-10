import popup from './popup.html';
import Popup from './popup';


var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.runtime.getURL('/src/css/popup.css');
(document.head || document.documentElement).appendChild(style);


var doc = new DOMParser().parseFromString(popup, "text/xml");
document.querySelector('body').appendChild(doc.firstChild);


let popupObj = new Popup();
popupObj.hide();

chrome.runtime.onMessage.addListener(function (req) {
    console.log({ req });
    if (req.msg == 'clicked') {
        popupObj.setPrompt(req.data.prompt);
        popupObj.show();
        popupObj.loading(true);
    } else if (req.msg == 'missing_api_key') {
        popupObj.setPrompt(req.data.prompt);
        popupObj.setResponse('<div style="padding: 5px; border:1px solid #ff8686; color: #ff8686;">'+req.data.response+'</div>')
        popupObj.show();
        popupObj.loading(false);    
    } else if (req.msg == 'response') {
        console.log(req.data);
        popupObj.setResponse(req.data.response);
        popupObj.loading(false);     
    }
});
