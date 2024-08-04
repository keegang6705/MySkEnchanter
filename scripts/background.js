console.log("MySkEnchanter/scripts/background.js:LOADED");

const url_list = [
  { path: "classes", parameter: "" },
  { path: "search/students/results", parameter: "" },
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.url.startsWith("https://www.mysk.school")) {
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
        chrome.tabs.update(tabId, { url: `${tab.url}${fill}ske=false` });
      }
    }
  }
});
