function setScreen(screen){
    document.getElementById("app").innerHTML=screen.ui;
    screen.onLoad();
}
export default setScreen
