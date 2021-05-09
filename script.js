document.getElementById('switch').onclick = function () {
    if (document.getElementById('theme').href.includes("dark.css")) {
        document.getElementById('theme').href = "light.css";
    } else {
        document.getElementById('theme').href = "dark.css";
    }
};