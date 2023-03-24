export default class Popup {
    constructor() {
        this.el = document.querySelector('#chatgpt-toolbox__container');
        this.el.querySelector('#chatgpt-toolbox__close').addEventListener('click', (e) => {
            console.log('CLOSE CLICKED');
            this.hide();
        });

        this.el.querySelector('#chatgpt-toolbox__option').addEventListener('click', (e) => {
            console.log('option CLICKED');
            chrome.runtime.sendMessage({type: "openOption"});
        })
    }

    show(){
        this.el.id = 'chatgpt-toolbox__container';
    }
    
    hide(){
        this.el.id = 'chatgpt-toolbox-hidden';
    }

    close() {
        document.querySelector('#chatgpt-toolbox__close').addEventListener('click', (e) => {
            console.log('CLOSE CLICKED');
            this.hide();
        })
    }
}