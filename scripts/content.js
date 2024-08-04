console.log("MySkEnchanter/scripts/content.js:LOADED");
function logo() {
  const url = new URL(window.location.href);
  const decodedSearchParams = new URLSearchParams(url.searchParams);
  const ske_status = decodedSearchParams.get("ske") === "true"; 
  const triangle_container = document.createElement("button");
  triangle_container.id = "triangle-container"

  triangle_container.style.position = "absolute";
  triangle_container.style.top = "0";
  triangle_container.style.right = "0";
  triangle_container.style.width = "68px";
  triangle_container.style.height = "68px";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "68px");
  svg.setAttribute("height", "68px");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.right = "0";
  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", "0,0 68,0 68,68");
  if (ske_status){
    polygon.setAttribute("fill", "indigo");
  } else{
    polygon.setAttribute("fill", "grey");
  }

  svg.appendChild(polygon);
  triangle_container.appendChild(svg);

  const ske_icon_container = document.createElement("img");
  ske_icon_container.style.position = "absolute";
  ske_icon_container.style.top = "5px";
  ske_icon_container.style.right = "5px";
  ske_icon_container.style.width = "32px";
  ske_icon_container.style.height = "32px";
  ske_icon_container.src = "https://raw.githubusercontent.com/keegang6705/MySkEnchanter/master/image/Favicon/favicon-310x310.png"
  if (!ske_status){
    ske_icon_container.style.filter = "grayscale(100%)";
  }
  triangle_container.appendChild(ske_icon_container)
  
  document.body.appendChild(triangle_container);
  triangle_container.addEventListener("click", ()=>{
    if(ske_status){
      window.location.href = url.replace("ske=true","ske=false")
    }else{
      window.location.href = url.replace("ske=false","ske=true")
    }
  });
}
logo();

window.navigation.addEventListener("navigate", (event) => {
  console.log("MySkEnchanter/scripts/content.js: DETECT: url change")
  setTimeout(() => {
    document.body.removeChild(document.getElementById("triangle-container"));
    logo();
  }, 250);
})