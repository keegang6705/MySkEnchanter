console.log("MySkEnchanter/scripts/content.js:LOADED")
const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcXFlcGJvZHFqaGl3ZmpjdnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA3ODQ3NDQsImV4cCI6MTk2NjM2MDc0NH0.AuMiPwZfjapD_EW8ZyEWq9y6z3JqLC_rO3V4Bw7K300";
headers = {
  'Authorization': `Bearer ${api_key}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'X-Client-Info': '@supabase/auth-helpers-nextjs@0.10.0'
};
async function loadJson(){
    chrome.storage.local.get("classroom_id", (data) => {
        console.log("MySkEnchanter/scripts/background.js:PULL classroom_id");
        return data
      });  
};

async function getClassroomInfo(classroom_id,extension=null){
    const url = extension? `https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=${extension}&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`:`https://ykqqepbodqjhiwfjcvxe.supabase.co/rest/v1/classrooms?select=number,classroom_students(class_no)&classroom_students.order=class_no.asc&id=${classroom_id}&limit=1&order=id.asc&apikey=${api_key}`;
    const response = await fetch(url);
  if (response){
    data = response.json();
    return data? data[0]["number"]:null;
  } else {
    console.log(`Error retrieving data for ${classroom_id} : ${response.status_code}`);
    return None;
  }
}
async function main(){
    const class_id = await loadJson();
    alert(JSON.stringify(class_id))
};
main()

