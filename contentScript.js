//The main script that is directly interacting with the web content, listen to chrome.tabs messages and perform tasks
(() => {
  const styleTag = document.createElement('style');

  const saveAndApply = async (obj) => {
    res1 = await throwIntoStorage(obj);   //save into storage
    res2 = await injectElements(obj);     //apply settings
    return new Promise((resolve) => {
      //save and apply
      if (res1 && res2) {
        resolve('okay');
      }
    });
  };

  const throwIntoStorage = async (obj) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({
        ["custom-settings"]: JSON.stringify(obj)
      }).then((result) => {
        resolve(result.key);
      });
    })
    
  };

  const injectElements = async (obj) => {
    //--ion-background-color: For inserting picture url or custom color
    //--ion-text-color: For changing item color in nav bar and some items in subcontents
    //--ion-item-background: For setting color and opacity of all menu and items
    //--ion-tab-bar-background: For changing nav bar style by color or opacity for image bg
    //https://stackoverflow.com/questions/15505225/inject-css-stylesheet-as-string-using-javascript
    const data = JSON.parse(obj)
    console.log(data);
    const header = ':root .dark .md,:root .dark .ios {';
    const a = '--ion-background-color:' + data.ion_background_color;
    const b = '--ion-text-color:' + data.ion_text_color;
    const c = '--ion-item-background:' + data.ion_item_background;
    const d = '--ion-tab-bar-background:' + data.ion_tab_bar_background;
    const footer = '}';

    const styleBody = [a,b,c,d].join(';\n')      //join all the data and use ';\n' delimiter
    const styleText = [header,styleBody,footer].join('\n');
    document.head.append(styleTag); //.addClass("custom-style") not supported, need another way
    styleTag.textContent = styleText;
    return stylingFix();
  };

  const stylingFix = async () => {
    //a crazy approach
    console.log('calling styleFix');
    const ionCon = document.querySelector('ion-content');
    let sheet = new CSSStyleSheet;
    sheet.insertRule( `#background-content{
      background: 100%;}`);
    ionCon.shadowRoot.adoptedStyleSheets = [sheet] ;
    return 1
  };


  const forceReset = () => {
    //reset all attributes
    bgContent.style.cssText = '';
    //to delete style from footer
  }

  const injectSettings = () => {
    //custom settings that wanted to add into APSpace
  }

  //Event listener to listen fired messages from background.js & popup.js
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value } = obj;

    switch (type) {
      case "settings":
        injectSettings();
        break;
      case "applySave":
        response(saveAndApply(value));
        break;
      case "applyOnly":
        response(injectElements(value));
        break;
      case "saveOnly":
        response(throwIntoStorage(value));
        break;  
      case "reset":
        response(forceReset());
        break;
      default:
        alert('Msg received, no further action.')
        break;
    }
  });

})();
