//module file for popup UI to perform tab related tasks
export async function getCurrentTab() {
    let queryOptions = { lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

