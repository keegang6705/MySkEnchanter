console.log("MySkEnchanter/scripts/background.js:LOADED")
async function loadJson(){
    const response = await fetch('/id.json');
    const response_json = await response.json();
    chrome.storage.local.set({"classroom_id":response_json}, () => {
        console.log("MySkEnchanter/scripts/background.js:PUSH /id.json AS classroom_id");
      });  
};
loadJson()