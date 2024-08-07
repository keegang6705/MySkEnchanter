console.log("MySKEnchanter/scripts/content.js:LOADED");
function logo() {
  const url = new URL(window.location.href);
  const decodedSearchParams = new URLSearchParams(url.searchParams);
  const ske_status = decodedSearchParams.get("ske") === "true";
  const triangle_container = document.createElement("button");
  triangle_container.id = "triangle-container";

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
  if (ske_status) {
    polygon.setAttribute("fill", "indigo");
  } else {
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
  ske_icon_container.src =
    "https://raw.githubusercontent.com/keegang6705/MySKEnchanter/master/image/Favicon/favicon-310x310.png";
  if (!ske_status) {
    ske_icon_container.style.filter = "grayscale(100%)";
  }
  triangle_container.appendChild(ske_icon_container);

  document.body.appendChild(triangle_container);
  const triangle_container_ = document.getElementById("triangle_container");
  triangle_container.addEventListener("click", () => {
    if (ske_status) {
      decodedSearchParams.set("ske", "false");
    } else {
      decodedSearchParams.set("ske", "true");
    }
    window.location.href = `${url.origin}${
      url.pathname
    }?${decodedSearchParams.toString()}`;
  });
}
logo();

window.navigation.addEventListener("navigate", (event) => {
  console.log("MySKEnchanter/scripts/content.js: DETECT url change");
  setTimeout(() => {
    document.body.removeChild(document.getElementById("triangle-container"));
    logo();
  }, 250);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateUrl") {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.append("ske", request.skeState.toString());
    if (request.includeParameter) {
      const params = request.parameter;
      params.forEach((e) => newUrl.searchParams.append(e["name"], e["value"]));
    }
    if (request.skeState) {
      window.location.href = newUrl.toString();
    } else {
      history.pushState(null, "", newUrl.toString());
    }
    sendResponse({ status: "success" });
  }
});
