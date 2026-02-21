const ratios = ["16:9", "4:3", "3:2", "1:1", "9:16", "21:9", "Free"];

const sideHitArea = document.getElementById("side-hit-area");
const menu = document.getElementById("menu");

function closeMenu() {
  menu.classList.add("hidden");
}

function openMenu(x, y) {
  menu.innerHTML = "";

  for (const ratio of ratios) {
    const button = document.createElement("button");
    button.className = "menu-item";
    button.type = "button";
    button.role = "menuitem";
    button.textContent = ratio;
    button.addEventListener("click", async () => {
      if (ratio === "Free") {
        await window.ratioApi.clearWindowRatio();
      } else {
        await window.ratioApi.setWindowRatio(ratio);
      }
      closeMenu();
    });
    menu.appendChild(button);
  }

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.classList.remove("hidden");
}

sideHitArea.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  openMenu(event.clientX + 2, event.clientY + 2);
});

window.addEventListener("click", (event) => {
  if (!menu.contains(event.target) && event.target !== sideHitArea) {
    closeMenu();
  }
});

window.addEventListener("blur", closeMenu);
