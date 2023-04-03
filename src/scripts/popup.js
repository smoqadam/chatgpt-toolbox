import { marked } from 'marked';


export default class Popup {
    constructor() {
        this.el = document.querySelector('#chatgpt-toolbox__container');
        this.registerCloseEvent();
        this.registerOptionEvent();
    }

    show(){
        this.el.id = 'chatgpt-toolbox__container';
    }
    
    hide(){
        this.el.id = 'chatgpt-toolbox-hidden';
    }

    registerCloseEvent() {
        document.querySelector('#chatgpt-toolbox__close').addEventListener('click', (e) => {
            console.log('CLOSE CLICKED');
            this.hide();
        })
    }

    registerOptionEvent() {
        document.querySelector('#chatgpt-toolbox__option-settings').addEventListener('click', (e) => {
            console.log('option CLICKED');
            chrome.runtime.sendMessage({type: "openOption"});
        })
    }

    setPrompt(prompt) {
        document.querySelector('#chatgpt-toolbox__prompt-content').textContent = prompt;
    }

    setResponse(res) {
        // const regex = /<code>(.*?)<\/code>/gm;
        // var result = regex.exec(res);
        // res = res.replace(/<code>/g, )
        // let html = marked.parse(res);
        // let html = c.makeHtml(res);
        // const codeContent = document.getElementById("code-content").textContent;
        // const highlightedCode = Prism.highlight(html);
    
        // document.getElementById("code-content").innerHTML = highlightedCode;
        // document.querySelector('#chatgpt-toolbox__response-content').replaceChild(doc.firstChild);
        document.querySelector('#chatgpt-toolbox__response-content').innerHTML = res;
    }

    loading(b) {
        if (b) {
            document.querySelector('#chatgpt-toolbox__response-content').textContent = "Please wait...";
        }
    }
}