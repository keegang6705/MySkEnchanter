console.log("MySkEnchanter/scripts/classes.js:LOADED");

async function getKey() {
  const res = await fetch(
    "https://www.mysk.school/_next/static/chunks/pages/_app-cbd22d5fc12a8ae7.js"
  );
  const text = await res.text();
  const key = text.slice(927, 1135);
  return key;
}

async function loadJson() {
  const response = await fetch(
    "https://raw.githubusercontent.com/keegang6705/MySkEnchanter/master/source/id.json"
  );
  const response_json = await response.json();
  return response_json;
}

async function getClassroomInfo(classroom_id, extension = null) {
  const url = extension
    ? `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=${extension}&id=${classroom_id}&limit=1&order=id.asc&apikey=${await getKey()}`
    : `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=number,classroom_students(class_no)&classroom_students.order=class_no.asc&id=${classroom_id}&limit=1&order=id.asc&apikey=${await getKey()}`;
  const response = await fetch(url);
  if (response) {
    data = await response.json();
    console.log(`MySkEnchanter/scripts/classes.js:FETCH ${url}`);
    return (await data) ? data[0] : "ERR";
  } else {
    console.error(
      `MySkEnchanter/scripts/classes.js:ERROR retrieving data for ${classroom_id}`
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
          displayInfo();
        }
      });
    });
    console.log("MySkEnchanter/scripts/classes.js: INFO Obeserving main");
    observer.observe(targetElement, { childList: true, attributes: true });
  } else {
    console.log("Target element not found!");
  }
}

async function constructAndOpenUrl(firstName, lastName, lang) {
  const search_url = `https://www.mysk.school/${lang}search/students/results?full_name=${encodeURIComponent(
    firstName
  )}%20${encodeURIComponent(lastName)}`;
  window.open(search_url);
}

function simulateProgress(root, step, interval, after) {
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  overlay.style.cssText = `
position: absolute;
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
  text.innerHTML = "Downloading data please wait  กำลังโหลดข้อมูลโปรดรอซักครู่";
  text.style.cssText = `
color: white;
margin-top: 10px;  
`;

  progressBarContainer.appendChild(progressBar);
  overlay.appendChild(progressBarContainer);
  overlay.appendChild(text);
  root.appendChild(overlay);
  let progress = 0;
  progressBar.style.width = `0%`;
  const intervalId = setInterval(() => {
    progress += step;
    progressBar.style.width = `${progress}%`;
    if (progress === 100) {
      clearInterval(intervalId);
      setTimeout(() => {
        overlay.style.opacity = 0;
        overlay.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
          root.removeChild(overlay);
        }, 500);
        after();
      }, 1000);
    }
  }, interval);
}

window.addEventListener(
  "load",
  function load(e) {
    window.removeEventListener("load", load, false);
    simulateProgress(document.body, 10, 100, () => {
      listener();
    });
  },
  false
);

async function getRoomNumber() {
  const promise = new Promise((resolve, reject) => {
    const targetDiv = document.querySelector(".relative");
    if (targetDiv) {
      const observer = new MutationObserver((mutations) => {
        const hasChildren = mutations[0].addedNodes.length > 0;
        if (hasChildren) {
          const roomNumberElement = targetDiv.querySelector("h2");
          if (roomNumberElement) {
            const roomNumberText = roomNumberElement.textContent;
            resolve(roomNumberText.slice(2, 5));
            observer.disconnect();
          } else {
            reject(new Error("<h2> element not found inside target div"));
          }
        }
      });

      observer.observe(targetDiv, { childList: true });
    } else {
      reject(new Error("Target div element not found"));
    }
  });

  return await promise;
}

async function isMyRoom() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const Element = document.querySelector("div.space-y-2");
      if (Element) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
  return await promise;
}
async function displayInfo() {
  const class_id = await loadJson();
  const room_number = await getRoomNumber();
  const class_info = await getClassroomInfo(
    class_id[room_number],
    "id%2Cnumber%2Cmain_room%2Cclassroom_advisors%21inner%28teachers%21inner%28id%2Csubject_groups%28id%2Cname_en%2Cname_th%29%2Cpeople%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cprofile%29%29%29%2Cclassroom_students%28class_no%2Cstudents%21inner%28id%2Cpeople%21inner%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cnickname_en%2Cnickname_th%2Cprofile%29%29%29%2Cclassroom_contacts%28contacts%21inner%28*%29%29%2Cyear&classroom_students.order=class_no.asc"
  );
  console.log(class_info);
  if (await isMyRoom()) {
  } else {
    const card_parent = document.querySelector(".flex.grow.flex-col.gap-5");
    simulateProgress(card_parent, 100, 1, () => {});
    setTimeout(() => {
      const card_body = document.querySelector("section.flex-col-reverse");
      // student
      const new_student = document.createElement("section");
      new_student.className = "flex flex-col gap-2";
      const studentHeader = document.createElement("div");
      studentHeader.classList.add(
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
      if (document.documentElement.lang == "th") {
        studentSpan.textContent = "นักเรียน";
      } else {
        studentSpan.textContent = "Students";
      }

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

      const studentDownloadIcon = document.createElement("i");
      studentDownloadIcon.classList.add("skc-icon");
      studentDownloadIcon.setAttribute("translate", "no");
      studentDownloadIcon.textContent = "download";

      const buttonLabel = document.createElement("span");
      buttonLabel.classList.add("skc-button__label");
      if (document.documentElement.lang == "th") {
        buttonLabel.textContent = "บันทึกทั้งหมด";
      } else {
        buttonLabel.textContent = "Save all";
      }
      buttonLabel.addEventListener("click", function () {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(class_info));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "class_info.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });

      const ripple = document.createElement("span");
      ripple.classList.add("skc-interactive__ripple");
      ripple.style.cssText =
        "top: 0px; left: 0px; width: 130px; height: 130px; opacity: 0.36; transform: scale(0) translateZ(0px);";
      buttonIconDiv.appendChild(studentDownloadIcon);
      button.appendChild(buttonIconDiv);
      button.appendChild(buttonLabel);
      studentHeader.appendChild(studentSpan);
      studentHeader.appendChild(button);
      studentHeader.appendChild(ripple);
      //list student
      const studentListContainer = document.createElement("div");
      studentListContainer.setAttribute(
        "class",
        "mb-0 grow rounded-t-md md:h-0 md:overflow-y-auto md:overflow-x-hidden"
      );
      const studentList = document.createElement("ul");
      studentList.setAttribute("class", "grid gap-1 p-[1px] md:pb-4");
      studentListContainer.appendChild(studentList);
      const classroom_students = class_info["classroom_students"];
      for (let i = 0; i < classroom_students.length; i++) {
        let studentLi = document.createElement("li");
        studentLi.setAttribute(
          "class",
          "skc-interactive skc-card skc-card--outlined skc-card--column cursor-pointer !border-0 hover:m-[-1px] hover:!border-1 focus:m-[-1px] focus:!border-1"
        );
        studentLi.setAttribute("type", "button");
        studentLi.addEventListener("click", function () {
          if (document.documentElement.lang == "th") {
            const student_first_name =
              classroom_students[i].students.people.first_name_th;
            const student_last_name =
              classroom_students[i].students.people.last_name_th;
            constructAndOpenUrl(student_first_name, student_last_name, "");
          } else {
            const student_first_name =
              classroom_students[i].students.people.first_name_en;
            const student_last_name =
              classroom_students[i].students.people.last_name_en;
            constructAndOpenUrl(
              student_first_name,
              student_last_name,
              "en-US/"
            );
          }
        });
        const skcCardHeader = document.createElement("div");
        skcCardHeader.setAttribute(
          "class",
          "skc-card-header [&_h3]:!leading-none [&_h3]:my-1"
        );
        studentLi.appendChild(skcCardHeader);
        const skcCardHeaderAvatar = document.createElement("div");
        skcCardHeaderAvatar.setAttribute("class", "skc-card-header__avatar");
        skcCardHeader.appendChild(skcCardHeaderAvatar);
        const skcCardHeaderAvatarInner = document.createElement("div");
        skcCardHeaderAvatarInner.setAttribute(
          "class",
          "skc-interactive skc-interactive--no-state-layer skc-interactive--no-ripple contents"
        );
        skcCardHeaderAvatar.appendChild(skcCardHeaderAvatarInner);
        const skcCardHeaderAvatarImageContainer = document.createElement("div");
        skcCardHeaderAvatarImageContainer.setAttribute(
          "class",
          "skc-avatar relative  aspect-square"
        );
        skcCardHeaderAvatarInner.appendChild(skcCardHeaderAvatarImageContainer);
        const studentImageUrl = classroom_students[i].students.people.profile;
        if (studentImageUrl) {
          const skcCardHeaderAvatarImage = document.createElement("img");
          skcCardHeaderAvatarImage.src = `https://www.mysk.school/_next/image?url=${studentImageUrl}&w=96&q=75`;
          skcCardHeaderAvatarImage.srcset = `https://www.mysk.school/_next/image?url=${studentImageUrl}&w=48&q=75 1x, /_next/image?url=${studentImageUrl}&w=96&q=75 2x`;
          skcCardHeaderAvatarImage.alt = "";
          skcCardHeaderAvatarImage.loading = "lazy";
          skcCardHeaderAvatarImage.width = 48;
          skcCardHeaderAvatarImage.height = 48;
          skcCardHeaderAvatarImage.decoding = "async";
          skcCardHeaderAvatarImage.dataset.nimg = "1";
          skcCardHeaderAvatarImage.style.cssText = "color: transparent;";
          skcCardHeaderAvatarImageContainer.appendChild(
            skcCardHeaderAvatarImage
          );
        } else {
          const skcCardHeaderAvatarReserved = document.createElement("div");
          skcCardHeaderAvatarReserved.setAttribute(
            "class",
            "skc-avatar relative  aspect-square"
          );
          skcCardHeaderAvatarImageContainer.appendChild(
            skcCardHeaderAvatarReserved
          );
          const skcCardHeaderAvatarReservedInner =
            document.createElement("span");
          skcCardHeaderAvatarReservedInner.setAttribute(
            "class",
            "skc-avatar__initials"
          );
          if (document.documentElement.lang == "th") {
            skcCardHeaderAvatarReservedInner.textContent = classroom_students[
              i
            ].students.people.first_name_th.slice(0, 1);
          } else {
            skcCardHeaderAvatarReservedInner.textContent =
              classroom_students[i].students.people.first_name_en.slice(0, 1) +
              classroom_students[i].students.people.last_name_en.slice(0, 1);
          }
          skcCardHeaderAvatarReserved.appendChild(
            skcCardHeaderAvatarReservedInner
          );
        }
        const skcCardHeaderContent = document.createElement("div");
        skcCardHeaderContent.setAttribute("class", "skc-card-header__content");
        skcCardHeader.appendChild(skcCardHeaderContent);
        const skcCardHeaderTitle = document.createElement("h3");
        skcCardHeaderTitle.setAttribute("class", "skc-card-header__title");
        if (document.documentElement.lang == "th") {
          skcCardHeaderTitle.textContent =
            classroom_students[i].students.people.first_name_th +
            " " +
            classroom_students[i].students.people.last_name_th;
        } else {
          skcCardHeaderTitle.textContent =
            classroom_students[i].students.people.first_name_en +
            " " +
            classroom_students[i].students.people.last_name_en;
        }
        skcCardHeaderContent.appendChild(skcCardHeaderTitle);
        const skcCardHeaderSubTitle = document.createElement("span");
        if (document.documentElement.lang == "th") {
          skcCardHeaderSubTitle.textContent =
            "เลขที่ " +
            classroom_students[i].class_no +
            " • " +
            classroom_students[i].students.people.nickname_th;
        } else {
          skcCardHeaderSubTitle.textContent =
            "No. " +
            classroom_students[i].class_no +
            " • " +
            classroom_students[i].students.people.nickname_en;
        }
        skcCardHeaderSubTitle.setAttribute(
          "class",
          "skc-card-header__subtitle"
        );
        skcCardHeaderContent.appendChild(skcCardHeaderSubTitle);
        studentList.appendChild(studentLi);
      }

      new_student.appendChild(studentHeader);
      new_student.appendChild(studentListContainer);
      // contact
      const new_contact = document.createElement("div");
      new_contact.className = "space-y-2";
      const headingElement = document.createElement("h3");
      headingElement.setAttribute(
        "class",
        "skc-text skc-text--title-medium rounded-md bg-surface px-3 py-2"
      );
      if (document.documentElement.lang == "th") {
        headingElement.textContent = "ช่องทางการติดต่อ";
      } else {
        headingElement.textContent = "Contacts";
      }

      const warningElement = document.createElement("div");
      warningElement.setAttribute(
        "class",
        "mx-4 overflow-hidden rounded-xl border-1 border-outline-variant bg-surface-container sm:mx-0 grid grid-cols-[1.25rem,1fr] items-center gap-2 px-2.5 py-2 text-on-surface *:first:text-on-surface-variant !border-0 !bg-error-container *:!text-on-error-container"
      );
      warningElement.style.cssText = "border-radius: 28px; opacity: 1";
      const warningElementIcon = document.createElement("i");
      warningElementIcon.setAttribute("aria-hidden", "true");
      warningElementIcon.setAttribute("class", "skc-icon");
      warningElementIcon.setAttribute("translate", "no");
      warningElementIcon.style.cssText =
        "font-size: 1.25rem;font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;";
      warningElementIcon.textContent = "warning";
      warningElement.appendChild(warningElementIcon);
      const warningElementText = document.createElement("span");
      warningElementText.setAttribute(
        "class",
        "skc-text skc-text--body-medium"
      );
      if (document.documentElement.lang == "th") {
        warningElementText.textContent = "ถูกปิดใช้งานเนื่องจากความเป็นส่วนตัว";
      } else {
        warningElementText.textContent = "disabled due to privacy";
      }

      warningElement.appendChild(warningElementText);

      new_contact.appendChild(headingElement);
      new_contact.appendChild(warningElement);
      //pack
      card_body.appendChild(new_student);
      card_body.appendChild(new_contact);
    }, 1000);
  }
}
