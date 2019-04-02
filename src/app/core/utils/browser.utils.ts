export class Browser{

    static get isChromeApp(){
        return typeof window['chrome'] !== 'undefined' && window['chrome'].storage;

    }
    static get isElectronApp(){
        return window && window['process'] && window['process'].versions && window['process'].versions.electron;

    }
    static get isCordovaApp(){
        return  !!window['cordova'];

    }
    static get chromeApp(){
        return window['chrome'];
    }


}