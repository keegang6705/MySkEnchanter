console.log("MySkEnchanter/scripts/content.js:LOADED");
const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXFlcGJvZHFqaGl3ZmpjdnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA3ODQ3NDQsImV4cCI6MTk2NjM2MDc0NH0.AuMiPwZfjapD_EW8ZyEWq9y6z3JqLC_rO3V4Bw7K300";
headers = {
  'Authorization': `Bearer ${api_key}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'X-Client-Info': '@supabase/auth-helpers-nextjs@0.10.0'
};
async function loadJson(){
    const response = await fetch('https://raw.githubusercontent.com/keegang6705/MySkEnchanter/master/source/id.json');
    const response_json = await response.json();
    return  response_json;
};

async function getClassroomInfo(classroom_id,extension=null){
    const url = extension? `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=${extension}&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`:`https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=number,classroom_students(class_no)&classroom_students.order=class_no.asc&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`;
    const response = await fetch(url);
  if (response){
    data = await response.json();
    console.log(`MySkEnchanter/scripts/content.js:FETCH ${url}`);
    return await data? data[0]:"ERR";
  } else {
    console.error(`MySkEnchanter/scripts/content.js:ERROR retrieving data for ${classroom_id}`);
    return "ERR";
  }
}
async function main(){
    const class_id = await loadJson();
    const class_info = await getClassroomInfo( class_id["408"],"id%2Cnumber%2Cmain_room%2Cclassroom_advisors%21inner%28teachers%21inner%28id%2Csubject_groups%28id%2Cname_en%2Cname_th%29%2Cpeople%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cprofile%29%29%29%2Cclassroom_students%28class_no%2Cstudents%21inner%28id%2Cpeople%21inner%28first_name_en%2Cfirst_name_th%2Cmiddle_name_en%2Cmiddle_name_th%2Clast_name_en%2Clast_name_th%2Cnickname_en%2Cnickname_th%2Cprofile%29%29%29%2Cclassroom_contacts%28contacts%21inner%28*%29%29%2Cyear&classroom_students.order=class_no.asc");
};
main()




    

  async function listener () {
    const targetElement = document.querySelector('main');
    if (targetElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if(mutation["addedNodes"][0]){
            let class_number = mutation["addedNodes"][0]
            console.log(class_number);
          };
        });
      });
      console.log("MySkEnchanter/scripts/content.js: INFO Obeserving main")
      observer.observe(targetElement, { childList: true,attributes: true });
    } else {
      console.log('Target element not found!');
    }
  }
  
  window.addEventListener('load', function load(e) {
    window.removeEventListener('load', load, false);
  
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
  
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.style.cssText = `
      width: 100px;
      height: 100px;
      border: 10px solid #fff;
      border-radius: 50%;
      border-top: 10px solid #7ff777;
      animation: spin 2s linear infinite;
    `;
  
    const animationKeyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  
    overlay.appendChild(loadingIndicator);
    document.body.appendChild(overlay);
  
    setTimeout(() => {
      overlay.style.display = 'none';
      listener()
    }, 2000);
    const styleElement = document.createElement('style');
    styleElement.textContent = animationKeyframes;
    document.head.appendChild(styleElement);
  }, false);

  