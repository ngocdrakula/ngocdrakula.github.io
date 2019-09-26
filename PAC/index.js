var canvas= document.getElementById("screen");
var c = canvas.getContext("2d");
var body = document.getElementById("body");

var m = 16;
var h = 30;
var fps = 1000;
var stt,plus,x,y,clock,maxplus;
var hplus = 0;
var pacColor ="#FFD700";
var dataMap = 0;
var dataMaps = new Array(4);
{
    dataMaps[0] = "0000000000000000022222222222222002002002000020200202202200202020020200222222222002020222002002000222020200202220020202022220020002020202222002000222020200202220020202220020020002020022222222200202202200202020020020020000202002222222222222200000000000000000";
    dataMaps[1] = "0000000000000000022222222222222002002002000020200202202202202220022200202222220000020222202002000222020222202220020202002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002222222202222200000000000000000";
    dataMaps[2] = "0000000000000000022222222222222002002001000010200202201102102120020200102022210000020211102001000222000112202120020202001020010002020201102001000222120200202120020000220220010001020112220111000101102201101020010010000010101001111111202011100000000000000000";
    dataMaps[3] = "0000000000000000022222222222222002002002000020100202202202202020022200202222220000020222202002000222020222202220020002002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002022222202202200000000000000000";
}
var img = document.getElementById("ghost");
var map = new Array(m);
for(let i=0; i<m;i++){
    map[i] = new Array(m);
}
var Ghost= new Array(3);
for(let i=0;i<3;i++){
    Ghost[i] = new Array(3);
}
body.addEventListener("keydown",function(event){
    let k = event.keyCode;
    if(k==38||k==39||k==40) clock=k-38;
    if(k==37) clock=3;
    if(k==48) endLevel();
});
resetData(0);
paintAll();
var runLevel = setInterval(run,fps);
function resetData(p){
    stt = 0;
    if(p==0){
        plus = 0;
        fps = 100;
        dataMap = 0;
    }
    x = h*1.5; 
    y = h*1.5;
    clock = 1;
    {
        Ghost[0][0]=435;Ghost[0][1]=45;Ghost[0][2]=Math.floor(Math.random()*4);
        Ghost[1][0]=435;Ghost[1][1]=435;Ghost[1][2]=Math.floor(Math.random()*4);
        Ghost[2][0]=45;Ghost[2][1]=435;Ghost[2][2]=Math.floor(Math.random()*4);
    }
    loadMap(dataMaps[dataMap],plus);

}
function run(){
    let xy = runReturn(1,x,y,clock);
    x = xy[0];
    y = xy[1];
    for (let i=0;i<3;i++){
        let gxy=runReturn(0,Ghost[i][0],Ghost[i][1],Ghost[i][2]);
        Ghost[i][0] = gxy[0];
        Ghost[i][1] = gxy[1];
        Ghost[i][2] = gxy[2];
    }
    paintAll();
    paintPac();
    paintGhost();
    condition();
    inf();
}
function endLevel(){
    clearInterval(runLevel);
    window.confirm("Bạn đã thua với số điểm: "+plus+"!\nĐiểm cao nhất: "+hplus+"!\nBạn có muốn chơi lại không?");
    maxplus=0;
    resetData(0);
    setTimeout(function(){
        runLevel = setInterval(run,fps);
    },1000);
}
function completeLevel(){
    clearInterval(runLevel);
    window.confirm("Bạn đã chiến thắng\nBạn có muốn chơi vòng tiếp theo không?");
    nextLevel();
    resetData(1);
    runLevel = setInterval(run,fps);
}
function nextLevel(){
    if(dataMap<3) dataMap +=1;
    else{
        dataMap=0;
        fps = Math.floor(fps*0.8);
        console.log("Tốc độ não của bạn: "+Math.floor(1000/fps)+"*10^6 phép toán/s");
    }
}
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

function paintPac(){
    if (stt == 1){
        c.beginPath();
        c.arc(x,y,h/2,(clock/2+0.25)*Math.PI,(clock/2+1.25)*Math.PI);
        c.fillStyle=pacColor;
        c.fill()
        c.beginPath();
        c.arc(x,y,h/2,(clock/2-0.25)*Math.PI,(clock/2-1.25)*Math.PI);
        c.fillStyle=pacColor;
        c.fill();
        stt=0;
    }
    else if(stt==0){
        c.beginPath();
        c.arc(x,y,h/2,0,2*Math.PI);
        c.fillStyle=pacColor;
        c.fill();
        stt=1;
    };
}
function paintGhost(){
    for(let i=0;i<3;i++){
        c.beginPath();
        c.drawImage(img, Ghost[i][0]-h/2, Ghost[i][1]-h/2,h,h);

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
        c.strokeStyle = pacColor;
        c.lineCap="round";
        c.stroke();
    }
}
function loadMap(data,mp){
    maxplus=mp;
    for(let i=0;i<m;i++){
        for(let j=0;j<m;j++){
            map[i][j]=data.slice(i*m+j,i*m+j+1)
            if(map[i][j]>0) maxplus+=1;
        }
    }
}
function runReturn(pac,xm,ym,cl){
    if(pac==1&&xm%30==15&&ym%30==15){
        if(map[xm/30-0.5][ym/30-0.5]==2){
            map[xm/30-0.5][ym/30-0.5]=1;
            plus+=1;
            if(plus>hplus){
                hplus=plus;
                saveHighscore("Ngoc Drakula",hplus);
            }
            if(plus>=maxplus){
                completeLevel();
                return([h*1.5,h*1.5,1]);
            }
        }
    }
    pac=0;
    if(cl==0||cl==2){
        if(check(xm-h/3,ym+(cl-1)*2*h/3)>=1&&check(xm+h/3,ym+(cl-1)*2*h/3)>=1){
                ym+=(cl-1)*10;
                pac+=1;
            }
        }
    if(cl==1||cl==3){
        if(check(xm-(cl-2)*2*h/3,ym-h/3)>=1&&check(xm-(cl-2)*2*h/3,ym+h/3)>=1){
                xm+=(2-cl)*h/3;
                pac+=1;
        }
    }
    if(pac==0) pac = Math.floor(Math.random()*4);
    else pac = cl;
    return([xm,ym,pac])
}
function condition(){
    for(let i=0;i<3;i++){
        if(Math.abs(x-Ghost[i][0])<h&&Math.abs(y-Ghost[i][1])<h)
        endLevel();
    }
}
function check(xc,yc){
    let xtemp = Math.floor(xc/h);
    let ytemp = Math.floor(yc/h);
    return map[xtemp][ytemp];
}
function inf(){
document.getElementById("info").innerHTML="Điểm của bạn: "+plus+ "/"+maxplus+"(Điểm cao nhất: "+hplus+")";
}
//firebase function
function saveHighscore(stt,name,high_score){
    db.collection("high_scores")
    .doc().set({
        stt: stt,
        name: name,
        high_score: high_score
    })
    .then(function () { console.log("High score sent!"); })
    .catch(function(err) { console.error("Failed! ", err); });

}
function readHighscore(){
    
    // //db.collection("high_scores")
    // .doc().set({
    //     name: name,
    //     high_score: high_score
    // })
    // .then(function () { console.log("High score sent!"); })
    // .catch(function(err) { console.error("Failed! ", err); });
}