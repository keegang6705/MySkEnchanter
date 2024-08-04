console.log("MySkEnchanter/scripts/background.js:LOADED");
const url_list = [
  { path: "classes", parameter: "" },
  { path: "search/students/results", parameter: "" },
];
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" &&tab.url.startsWith("https://www.mysk.school")) {
    for (let i = 0; i < url_list.length; i++) {
      const current_url = url_list[i].path;
      const current_parameter = url_list[i].parameter;
      const fill = tab.url.includes("?") ? "&" : "?";
      if (tab.url.startsWith(`https://www.mysk.school/${current_url}`) || tab.url.startsWith(`https://www.mysk.school/en-US/${current_url}`)) {
        if (tab.url.includes("ske=true")) {
          break;
        } else {
            chrome.tabs.update(tabId, { url: `${tab.url}${fill}ske=true${current_parameter}` });
        }
      }
    }
  }
});
