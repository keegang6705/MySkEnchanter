console.log("MySkEnchanter/scripts/background.js:LOADED")
const url_list = [{"path":"classes","parameter":""},{"path":"results","parameter":""}]
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status == "loading" && tab.url.startsWith("https://www.mysk.school") ){
        for(let i = 0; i < url_list.length; i++){
          const current_url = url_list[i]["path"]
          const current_parameter = url_list[i]["parameter"]
          if (tab.url === `https://www.mysk.school/${current_url}` || tab.url === `https://www.mysk.school/en-US/${current_url}`) {
            chrome.tabs.remove(tabId);
            if (tab.url === `https://www.mysk.school/${current_url}`){
              chrome.tabs.create({ url: `https://www.mysk.school/${current_url}?ske=true&ske_tab_index=${tab.index}${current_parameter}` });
            } else if (tab.url === `https://www.mysk.school/en-US/${current_url}`){
              chrome.tabs.create({ url: `https://www.mysk.school/en-US/${current_url}?ske=true&ske_tab_index=${tab.index}${current_parameter}` });
            }
            
          } else if (tab.url.includes("ske=true")) {
            const url = new URL(tab.url);
            const decodedSearchParams = new URLSearchParams(url.searchParams);
            const tabIndex = decodedSearchParams.get("ske_tab_index");
            moveToFirstPosition(tabId,parseInt(tabIndex))
            break
          }}
    }
  });
  

  async function moveToFirstPosition(tabId,index) {
    try {
      await chrome.tabs.move(tabId, {index: index});
    } catch (error) {
      if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
        setTimeout(() => moveToFirstPosition(tabId), 50);
      } else {
        console.error(error);
      }
    }
  }