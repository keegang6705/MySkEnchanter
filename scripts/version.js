console.log("MySKEnchanter/script/version.js:LOADED");
function createOverlay(textx) {
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 999;
  `;
  const buttonUpdate = document.createElement('a');
  buttonUpdate.textContent = 'UPDATE';
  buttonUpdate.style.cssText = `
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-decoration: none;
    color: white;
    font-size: 50px;
    padding: 15px 30px;
    border-radius: 5px;
    user-select: none;
  `;
  buttonUpdate.className="btn-danger"
  buttonUpdate.addEventListener('click', () => {
      chrome.tabs.create({ url: '' });
    });
    const button = document.createElement('a');
    button.textContent = 'แจ้งปัญหา';
    button.style.cssText = `
      position: absolute;
      top: 78%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-decoration: none;
      color: white;
      font-size: 20px;
      padding: 10px 20px;
      border-radius: 5px;
      user-select: none;
    `;
    button.className="btn-danger"
    button.addEventListener('click', () => {
      chrome.tabs.create({
        url: 'https://mail.google.com/mail/u/0/?fs=1&to=darunphobwi@gmail.com&su=MySKEnchanter-BugReport&body=อธิบายปัญหาของคุณ:&tf=cm' 
       });
      });
    const text = document.createElement('p');
    text.textContent = textx
    text.style.cssText=`
    position: absolute;
    top: 20%;
    left: 0%;
    `
    overlay.appendChild(text);
  overlay.appendChild(buttonUpdate);
  overlay.appendChild(button);
  document.body.appendChild(overlay);
}

function updateButton(){
  const container = document.getElementById("container2");
  const button = document.createElement('a');
  button.textContent = 'UPDATE';
  button.style.cssText = `
    text-decoration: none;
    color: white;
    font-size: 16px;
    padding: 5px 100px;
    border-radius: 5px;
    user-select: none;
  `;
  button.className="btn-danger"
  button.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://chromewebstore.google.com/detail/myskenchanter/cblocekkcfgogiepbopohmbbejninodm' });
    });
  container.appendChild(button);
  container.appendChild(document.createElement("p"))
}

async function check(){
    try {
      const response = await fetch('/manifest.json');
      const localManifest = await response.json();
      const LocalVersion = parseInt((localManifest.version)[0]);

      const remoteResponse = await fetch('https://raw.githubusercontent.com/keegang6705/MySKEnchanter/master/manifest.json');
      const remoteManifest = await remoteResponse.json();
      const remoteVersion = parseInt((remoteManifest.version)[0]);
      if (LocalVersion<remoteVersion) {
        createOverlay("การอัพเดทที่จำเป็น โปรดอัพเดทเป็นเวอร์ชั่นล่าสุด");
      } else {
        if(parseFloat(localManifest.version)<parseFloat(remoteManifest.version)){
          updateButton();
        }
      }
      document.getElementById("container").textContent = "เวอร์ชั่นปัจจุบัน:"+localManifest.version+" เวอร์ชั่นล่าสุด:"+remoteManifest.version;
    } catch (error) {
        alert('รับข้อมูลเวอร์ชั่นผิดพลาด \nโปรดเช็คอินเทอร์เน็ตของท่าน\n'+ error);
        alert("การใช้งานโดยไม่ตรวจสอบเวอร์ชั่นอาจสร้างความผิดพลาดได้")
      }
  }
  chrome.storage.sync.get("settings", function(result) {
    let versionCheckEnabled = true;
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError);
    } else {
      const settings = result.settings || {};
      if (Object.keys(settings).length > 0) {
        versionCheckEnabled = settings["setting1-state"] ?? true;
      }
    }
    if (versionCheckEnabled) {
      check();
    }
  });
  
