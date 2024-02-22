var sb_var = true;

function openSidebar() {
    document.getElementById("leftPanel1").style.width = "17%";
    document.getElementById("rightPanel1").style.width = "82%";
    const sb = document.querySelector(".left-panel");
    sb.style.display = "block";
    const icons = document.querySelector("#leftPanel2");
    icons.style.display="none";
    rotateImage();
}

let rotateImage = () => {
    let handle_icon = document.querySelector('.handle-icon');
    if (sb_var)
        handle_icon.style.rotate = '180deg';
    else
        handle_icon.style.rotate = '0deg';
}

function closeSidebar() {
    const sb = document.querySelector(".left-panel");
    document.getElementById("leftPanel1").style.width = "0%";
    sb.style.display = "none";
    const icons = document.querySelector("#leftPanel2");
    document.getElementById("leftPanel2").style.width = "4%";
    icons.style.display = "block";
    document.getElementById("rightPanel1").style.width = "96%";
    rotateImage();
}

function SideBar() {
    if (sb_var == false) {
        openSidebar()
    } else {
        closeSidebar()
    }
    sb_var = !sb_var
}


function dismiss()
{
    var dismissBtn = document.getElementById('update');
    dismissBtn.style.display="none";
}