console.log("MySkEnchanter/scripts/background.js:LOADED");
const url_list = [
  { path: "classes", parameter: "" },
  { path: "search/students/results", parameter: "" },
];

const processedTabs = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "loading" &&
    tab.url.startsWith("https://www.mysk.school")
  ) {
    for (let i = 0; i < url_list.length; i++) {
      const current_url = url_list[i].path;
      const current_parameter = url_list[i].parameter;
      const fill = tab.url.includes("?") ? "&" : "?";

      if (
        tab.url.startsWith(`https://www.mysk.school/${current_url}`) ||
        tab.url.startsWith(`https://www.mysk.school/en-US/${current_url}`)
      ) {
        if (tab.url.includes("ske=true")) {
          const url = new URL(tab.url);
          const decodedSearchParams = new URLSearchParams(url.searchParams);
          const tabIndex = decodedSearchParams.get("ske_tab_index");
          moveToFirstPosition(tabId, parseInt(tabIndex));
          break;
        } else {
          if (!processedTabs.has(tabId)) {
            processedTabs.add(tabId);
            chrome.tabs.remove(tabId);
            chrome.tabs.create({
              url: `${tab.url}${fill}ske=true&ske_tab_index=${tab.index}${current_parameter}`,
            });
          }
        }
      }
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  processedTabs.delete(tabId);
});

async function moveToFirstPosition(tabId, index) {
  try {
    await chrome.tabs.move(tabId, { index: index });
  } catch (error) {
    if (
      error ==
      "Error: Tabs cannot be edited right now (user may be dragging a tab)."
    ) {
      setTimeout(() => moveToFirstPosition(tabId), 50);
    } else {
      console.error(error);
    }
  }
}
