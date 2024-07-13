console.log("MySkEnchanter/popup/popup.js:LOADED")
const send_email_btn = document.getElementById("btn-send-email");
const donate_btn = document.getElementById("btn-donate");
const settings_btn = document.getElementById("btn-settings");
const settings_container = document.getElementById("settings-container");
var settingCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="-state"]');
send_email_btn.addEventListener("click", function () {
    chrome.tabs.create({
       url: 'https://mail.google.com/mail/u/0/?fs=1&to=darunphobwi@gmail.com&su=BemisEditor-BugReport&body=อธิบายปัญหาของคุณ:&tf=cm' 
      });
});
donate_btn.addEventListener("click", function () {
chrome.tabs.create({
   url: 'https://keegang.000.pe/menu/donate' 
  });
});
loadSettings();
saveSettings();
function loadSettings() {
  var settingCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="-state"]');


  chrome.storage.sync.get(null, function(result) {
    if (chrome.runtime.lastError) {
      alert('Error loading setting:', settings, chrome.runtime.lastError);
      return;
    }

    var settingValue = result
    if (JSON.stringify(settingValue) === "{}"){
      return;
    }
    for (var i = 0; i < settingCheckboxes.length; i++) {
      var checkbox = settingCheckboxes[i];
      checkbox.checked= settingValue[checkbox.id]
    }
  });
  }


function saveSettings() {
  var settingCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="-state"]');
  var settings = {};
  for (var i = 0; i < settingCheckboxes.length; i++) {
    var checkbox = settingCheckboxes[i];
    settings[checkbox.id] = checkbox.checked;
    
  }

  chrome.storage.sync.set(settings, function() {
    console.log("BemisEditor/popup/popup.js:SETTING SAVED");
  });


}
for (var i = 0; i < settingCheckboxes.length; i++) {
  var checkbox = settingCheckboxes[i];
  checkbox.addEventListener('change', function() {
    console.log("BemisEditor/popup/popup.js:SETTING CHANGED")
    saveSettings();
  });
}

settings_btn.addEventListener("click", function() {
  if (settings_container.style.display === "none") {
    settings_container.style.display = "block";
  } else {
    settings_container.style.display = "none";
  }
});
