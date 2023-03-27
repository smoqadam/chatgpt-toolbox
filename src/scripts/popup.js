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
        document.querySelector('#chatgpt-toolbox__option').addEventListener('click', (e) => {
            console.log('option CLICKED');
            chrome.runtime.sendMessage({type: "openOption"});
        })
    }

    setPrompt(prompt) {
        document.querySelector('#chatgpt-toolbox__prompt').textContent = prompt;
    }

    setResponse(res) {
        document.querySelector('#chatgpt-toolbox__response').textContent = res;
    }

    loading(b) {
        if (b) {
            document.querySelector('#chatgpt-toolbox__response').textContent = "ChatGPT: Please wait...";
        }
    }
}