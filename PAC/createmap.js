var canvas= document.getElementById("screen");
var c = canvas.getContext("2d");

var m = 16;
var h = 30;
var stt = 0;
var x = 300;
var y = 300;
var clock = 1;
var dataMap="0000000000000000022222222222222002002002000020200202202200202020020200222222222002020222002002000222020200202220020202022220020002020202222002000222020200202220020202220020020002020022222222200202202200202020020020020000202002222222222222200000000000000000";
var map = new Array(m);
for(let i=0; i<m;i++){
    map[i] = new Array(m);
    for(let j=0;j<m;j++){
        map[i][j]=0;
    }
}
loadMap(dataMap);
paintAll();
canvas.addEventListener("click",function(event){
    if(event.clientX>m*h||event.clientY>m*h) return;
    let xm = Math.floor((event.clientX-10)/h);
    let ym = Math.floor((event.clientY-10)/h);
    if(map[xm][ym]==0)
        map[xm][ym]=1;
    else if(map[xm][ym]==1)
        map[xm][ym]=2;
    else if(map[xm][ym]==2)
        map[xm][ym]=0;
    paintAll();
    let str="";
    for(let i=0;i<m;i++){
        for(let j=0;j<m;j++){
            str=map[i][j]==null ? str+0: str+map[i][j];
        }
    }
    document.getElementById("info").innerHTML=xm+"_"+ym+": "+map[xm][ym]+"<br><textarea style='width:500px; height:100px;'>"+str+"</textarea>";
});
function paintAll(){
    for(let i=0;i<m;i++){
        for(let j=0;j<m;j++){
            let n = i*h + h/2;
            let k = j*h + h/2;
            let co = 0;
            co = map[i][j];
            paint(n,k,n,k+1,h,co);
        }
    }

}
function paint(x1,y1,x2,y2,w,color){
    c.beginPath();
    let colornumber=color;
    if(w==null) w=h;
    if(color==null||color==0) color="black";
    else if(color>=1) color="white";
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineWidth =w;
    c.strokeStyle = color;
    c.lineCap="square";
    c.stroke();
    if(colornumber==2){
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.lineWidth =w/3;
        c.strokeStyle = "red";
        c.lineCap="round";
        c.stroke();
    }
}
function loadMap(data){
    for(let i=0;i<m;i++){
        for(let j=0;j<m;j++){
            map[i][j]=data.slice(i*m+j,i*m+j+1)
        }
    }
}