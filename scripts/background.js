console.log("MySKEnchanter/scripts/background.js:LOADED");

const url_list = [
  { path: "classes", parameter: "" },
  { path: "search/students/results", parameter: "" },
  { path: "learn", parameter: "" },
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.sync.get("settings", function(result) {
    var ske_enable = true;
    if (chrome.runtime.lastError) {
      console.log('Error loading setting:', settings, chrome.runtime.lastError);
      ske_enable = true;
    }
  
    var settingValue = result.settings
    if (JSON.stringify(settingValue) === "{}"){
      ske_enable = true;
    }
    try{
    ske_enable = settingValue["setting2-state"];
    } catch {
      ske_enable = true
    }
  if (ske_enable && changeInfo.status === "loading" && tab.url.startsWith("https://www.mysk.school")) {
    let foundMatch = false;
    const fill = tab.url.includes("?") ? "&" : "?";
    for (let i = 0; i < url_list.length; i++) {
      const current_url = url_list[i].path;
      const current_parameter = url_list[i].parameter;
      
      if (tab.url.startsWith(`https://www.mysk.school/${current_url}`) || tab.url.startsWith(`https://www.mysk.school/en-US/${current_url}`)) {
        foundMatch = true;
        
        if (tab.url.includes("ske=true") || tab.url.includes("ske=false")) {
          break;
        } else {
          chrome.tabs.update(tabId, { url: `${tab.url}${fill}ske=true${current_parameter}` });
        }
        break;
      }
    }
    
    if (!foundMatch) {
      if (!tab.url.includes("ske=")) {
        chrome.tabs.sendMessage(tabId, { action: "updateUrl", fill: fill });
      }
    }
  }
});
});
