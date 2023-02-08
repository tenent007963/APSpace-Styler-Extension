//Background script of extension to listen to focused tab and obtain info

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("apspace.apu.edu.my")) {
    const queryParameters = tab.url.split("/")[3];
    
    //Maybe can use for injecting settings within APSpace?
    if (queryParameters.include("settings")) {
      chrome.tabs.sendMessage(tabId, {
        type: "settings",
        message: "true"
      });
    };

    //Also do an auto injection of stylingFix + applyTheme read from storage 
  }
});
