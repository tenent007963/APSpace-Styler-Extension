//Script only for popup UI of extension

//Retrieve current/last tab
import { getCurrentTab } from "./utils.js";
const activeTab = await getCurrentTab();

//defining DOM elements
const form = document.getElementById("controls");
const container = document.getElementsByClassName("container")[0];  // For popup UI content
const queryParameters = activeTab.url.split("/")[3];  // splitting by "/" makes the directory at pos 3
const isLogin = queryParameters.includes("login");  // used only for homepage before login

//pre-define variables
var a, b, c1, c2, d1, d2, c, d;

let applyTheme = async (e) => {
  a = form.elements['ion-background-color'].value;
  b = form.elements['ion-text-color'].value;
  c1 = form.elements['menu-item-bg'].value;
  c2 = form.elements['menu-item-bg-opacity'].value;
  d1 = form.elements['navbar-bg-color'].value;
  d2 = form.elements['navbar-bg-color-opacity'].value;

  //Data check and process for each element
  if (a.includes('i.imgur.com') && (a.split('/')[1] || a.split('/')[3])) {
    a = 'url("' + a + '")';
  } else if(a.includes('#') || a.includes('rgb')) {
    a = a;  //must fix expression, very ugly
  } else {
    alert("background src unsupported input, setting default value");
    a = '#000000'
  }

  if (b.includes('#') || b.includes('rgb')) {
    b = b;  //must fix expression, very ugly
  } else {
    alert('text color unsupported input, setting default value');
    b = '#ffffff';
  }

  if ((c1 & c2) !== undefined) {
    c = 'rgba(' + c1 + ',' + c2 + ')';
  } else {
    alert('menu item bg missing value, using default');
    c = '#191919';
  }

  if ((d1 & d2) !== undefined) {
    d = 'rgba(' + d1 + ',' + d2 + ')';
  } else {
    alert('nav bar bg missing value, using default');
    d = '#191919';
  }

  const data = {
    "ion_background_color": a,
    "ion_text_color": b,
    "ion_item_background": c,
    "ion_tab_bar_background": d
  }

  chrome.tabs.sendMessage(activeTab.id, {
    type: "applyOnly",
    value: JSON.stringify(data)
  });
}


//Document listener section since extension cannot execute inline script
document.getElementById("apply").addEventListener("click", applyTheme);

document.addEventListener("DOMContentLoaded", async () => {
  if (activeTab.url.includes("apspace.apu.edu.my") && !isLogin) {
    chrome.storage.sync.get(["custom-settings"], (data) => {
      //load settings from chrome storage and send to html form value
      data = data["custom-settings"] ? JSON.parse(data["custom-settings"]) : [];
      data

    });
  } else if (activeTab.url.includes("apspace.apu.edu.my") && isLogin) {
    // Login prompt
    container.innerHTML = '<div class="title">Please login APSpace to use this extension.</div>';
  } else {
    // Only for APSpace msg
    container.innerHTML = '<div class="title">This extension is only for APSpace Web App.</div>';
  }
});

