console.log("MySkEnchanter/scripts/content.js:LOADED");
const api_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXFlcGJvZHFqaGl3ZmpjdnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA3ODQ3NDQsImV4cCI6MTk2NjM2MDc0NH0.AuMiPwZfjapD_EW8ZyEWq9y6z3JqLC_rO3V4Bw7K300";
headers = {
  Authorization: `Bearer ${api_key}`,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0",
};
async function loadJson() {
  const response = await fetch(
    "https://raw.githubusercontent.com/keegang6705/MySkEnchanter/master/source/id.json"
  );
  const response_json = await response.json();
  return response_json;
}

async function getClassroomInfo(classroom_id, extension = null) {
  const url = extension
    ? `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=${extension}&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`
    : `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=number,classroom_students(class_no)&classroom_students.order=class_no.asc&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`;
  const response = await fetch(url);
  if (response) {
    data = await response.json();
    console.log(`MySkEnchanter/scripts/content.js:FETCH ${url}`);
    return (await data) ? data[0] : "ERR";
  } else {
    console.error(
      `MySkEnchanter/scripts/content.js:ERROR retrieving data for ${classroom_id}`
    );
    return "ERR";
  }
}
async function listener() {
  const targetElement = document.querySelector("main");
  if (targetElement) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation["addedNodes"][0]) {
          displayInfo(targetElement);
        }
      });
    });
    console.log("MySkEnchanter/scripts/content.js: INFO Obeserving main");
    observer.observe(targetElement, { childList: true, attributes: true });
  } else {
    console.log("Target element not found!");
  }
}

window.addEventListener(
  "load",
  function load(e) {
    window.removeEventListener("load", load, false);

    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;  
  justify-content: center;  
  align-items: center;       
`;

    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.cssText = `
  width: 60%;
  height: 12.5px;
  background-color: #000;
  border-radius: 5px;
  border-color: #fff;
  overflow: hidden;
`;

    const progressBar = document.createElement("div");
    progressBar.id = "progress-bar";
    progressBar.style.cssText = `
  width: 0%;  
  height: 100%;
  background: linear-gradient(to right, purple,cyan); /* background: linear-gradient(to right, purple,cyan,blue,lime,yellow,orange,red) */;
  transition: width 1s ease;  
`;

    const text = document.createElement("p");
    text.id = "text-overlay";
    text.innerHTML =
      "Downloading data please wait  กำลังโหลดข้อมูลโปรดรอซักครู่";
    text.style.cssText = `
  color: white;
  margin-top: 10px;  
`;

    progressBarContainer.appendChild(progressBar);
    overlay.appendChild(progressBarContainer);
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    function simulateProgress() {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        if (progress === 100) {
          clearInterval(intervalId);
          fadeOutOverlay();
        }
      }, 100);
    }

    function fadeOutOverlay() {
      setTimeout(() => {
        overlay.style.opacity = 0;
        overlay.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 500);
        listener();
      }, 1000);
    }
    simulateProgress();
  },
  false
);

async function getRoomNumber() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const roomNumberElement = document.querySelector("h2");
      if (roomNumberElement) {
        const roomNumberText = roomNumberElement.textContent;
        resolve(roomNumberText.slice(2, 5));
      } else {
        reject(new Error("<h2> element not found"));
      }
    }, 500);
  });
  return await promise;
}

async function isMyRoom() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const Element = document.querySelector("div.space-y-2");
      if (Element) {
        resolve("yes");
      } else {
        resolve("not my room");
      }
    }, 500);
  });
  return await promise;
}
async function displayInfo(display_element) {
  const class_id = await loadJson();
  const room_number = await getRoomNumber();
  const class_info = await getClassroomInfo(
    class_id[room_number],
    "id%2Cnumber%2Cmain_room%2Cclassroom_advisors%21inner%28teachers%21inner%28id%2Csubject_groups%28id%2Cname_en%2Cname_th%29%2Cpeople%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cprofile%29%29%29%2Cclassroom_students%28class_no%2Cstudents%21inner%28id%2Cpeople%21inner%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cnickname_en%2Cnickname_th%2Cprofile%29%29%29%2Cclassroom_contacts%28contacts%21inner%28*%29%29%2Cyear&classroom_students.order=class_no.asc"
  );
  console.log(class_info);
  if ((await isMyRoom()) == "yes") {
  } else {
    /////////////////////////////////////////////////////////////////////////////////////////////
    const card_body = document.querySelector("section.flex-col-reverse");
// student
      
      const new_student = document.createElement("section");
      new_student.className = "flex flex-col gap-2";
      const newElement = document.createElement("div");
      newElement.classList.add(
        "flex",
        "flex-row",
        "items-center",
        "rounded-md",
        "bg-surface",
        "px-3",
        "py-2"
      );

      const studentSpan = document.createElement("span");
      studentSpan.classList.add("skc-text", "skc-text--title-medium", "grow");
      studentSpan.textContent = "นักเรียน";

      const button = document.createElement("button");
      button.type = "button";
      button.classList.add(
        "skc-interactive",
        "skc-button",
        "skc-button--text",
        "!-m-2"
      );
      button.setAttribute("aria-disabled", "false");

      const buttonIconDiv = document.createElement("div");
      buttonIconDiv.classList.add("skc-button__icon");

      const icon = document.createElement("i");
      icon.classList.add("skc-icon");
      icon.setAttribute("translate", "no");
      icon.textContent = "download";

      const buttonLabel = document.createElement("span");
      buttonLabel.classList.add("skc-button__label");
      buttonLabel.textContent = "บันทึกทั้งหมด";

      const ripple = document.createElement("span");
      ripple.classList.add("skc-interactive__ripple");
      ripple.style.cssText =
        "top: 0px; left: 0px; width: 130px; height: 130px; opacity: 0.36; transform: scale(0) translateZ(0px);";

      buttonIconDiv.appendChild(icon);
      button.appendChild(buttonIconDiv);
      button.appendChild(buttonLabel);
      newElement.appendChild(studentSpan);
      newElement.appendChild(button);
      newElement.appendChild(ripple);
      new_student.appendChild(newElement);
// contact
      
      const new_contact = document.createElement("div");
      new_contact.className = "space-y-2";
      const headingElement = document.createElement("h3");
      headingElement.setAttribute(
        "class",
        "skc-text skc-text--title-medium rounded-md bg-surface px-3 py-2"
      );
      headingElement.textContent = "ช่องทางการติดต่อ";
      new_contact.appendChild(headingElement);

      const list = document.createElement('ul');
list.classList.add('space-y-1'); // Assuming this class is for spacing between list items

const listItem = document.createElement('li');
listItem.classList.add('space-y-1'); // Assuming this class is for spacing within the list item

const link = document.createElement('a');
link.type = 'button';
link.href = `https://line.me/ti/g/`;
link.classList.add(
  'skc-interactive',
  'skc-card',
  'skc-card--outlined',
  'skc-card--row',
  'items-center',
  '!border-0',
  'hover:m-[-1px]',
  'hover:!border-1',
  'focus:m-[-1px]',
  'focus:!border-1'
);
link.target = '_blank';
link.rel = 'noreferrer';

// Content of the link (already defined in the previous response)
const contentDiv = document.createElement('div');
contentDiv.classList.add('skc-card-header', '&[_h3>a]:link', '!grid', 'grow', 'grid-cols-[2.5rem,minmax(0,1fr)]', '&>:nth-child(2)>*', '!truncate', '&>:nth-child(2)>span', ':block');

const avatarDiv = document.createElement('div');
avatarDiv.classList.add('skc-card-header__avatar');

const avatarImg = document.createElement('img');
avatarImg.setAttribute('alt', '');
avatarImg.setAttribute('loading', 'lazy');
avatarImg.setAttribute('width', '320');
avatarImg.setAttribute('height', '320');
avatarImg.setAttribute('decoding', 'async');
avatarImg.setAttribute('data-nimg', '1'); // Assuming data-nimg is necessary
avatarImg.setAttribute('src', '/_next/static/media/line.080aa3ad.svg');
avatarImg.style.color = 'transparent';

avatarDiv.appendChild(avatarImg);

const contentSubDiv = document.createElement('div');
contentSubDiv.classList.add('skc-card-header__content');

const titleH3 = document.createElement('h3');
titleH3.classList.add('skc-card-header__title');

const titleIcon = document.createElement('i');
titleIcon.classList.add(
  'skc-icon',
  '-mb-1.5',
  'mr-1',
  '!inline-block',
  '!text-outline'
);
titleIcon.setAttribute('translate', 'no');
titleIcon.style.cssText = 'font-size: 1.25rem; font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;';
titleIcon.textContent = 'link';  // Assuming the icon uses text

titleH3.appendChild(titleIcon);
titleH3.textContent += ' line.me';  // Append the actual title text

const subtitleSpan = document.createElement('span');
subtitleSpan.classList.add('skc-card-header__subtitle');
subtitleSpan.textContent = 'ไลน์ห้อง408 (ครู+นักเรียน) • LINE';  // Text content for subtitle

contentSubDiv.appendChild(titleH3);
contentSubDiv.appendChild(subtitleSpan);

contentDiv.appendChild(avatarDiv);
contentDiv.appendChild(contentSubDiv);

const rippleSpan = document.createElement('span');
rippleSpan.classList.add('skc-interactive__ripple');
rippleSpan.style.cssText = 'top: 0px; left: 0px; width: 160px; height: 160px; opacity: 0.36; transform: scale(0) translateZ(0px);';

link.appendChild(contentDiv);
      link.appendChild(rippleSpan);
      
      listItem.appendChild(link);
    new_contact.appendChild(listItem)


    card_body.appendChild(new_student);
    card_body.appendChild(new_contact);
    /////////////////////////////////////////////////////////////////////////////////////////////
  }
}
