var canvas= document.getElementById("screen");
var c = canvas.getContext("2d");
var body = document.getElementById("body");

var mapLine = 16;                    // Số ô của Map (Map bao gồm 16^2 ô)
var mapWeight = 30;                  // Kích thước của mỗi ô;
var fps = 100;                       // Thời gian mỗi lần di chuyển (bao gồm PACMAN và Ghost)
var xPac, yPac, directionPac;        // Vị trí và chiều di chuyển của PACMAN
var statusPac;                       // Trạng thái đóng mở của PACMAN (là 0 hoặc 1)
var presentPlus, maxPlus, highPlus;  // Điểm hiện tại của người chơi, điểm hiện tại của vòng, điểm cao nhất
highPlus = 0;                        // Điểm cao nhất sẽ phải lấy trên firebase.
var colorPac ="#FFD700";             // Màu sắc của PAC
var dataMap = 0;                     // Thông tin vòng chơi hiện tại
var dataMaps = new Array(4);         // Là mảng chứa 4 chuỗi kí tự lưu data của 4 Map, được tạo ra bằng file createmap.html
{
    dataMaps[0] = "0000000000000000022222222222222002002002000020200202202200202020020200222222222002020222002002000222020200202220020202022220020002020202222002000222020200202220020202220020020002020022222222200202202200202020020020020000202002222222222222200000000000000000";
    dataMaps[1] = "0000000000000000022222222222222002002002000020200202202202202220022200202222220000020222202002000222020222202220020202002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002222222202222200000000000000000";
    dataMaps[2] = "0000000000000000022222222222222002002001000010200202201102102120020200102022210000020211102001000222000112202120020202001020010002020201102001000222120200202120020000220220010001020112220111000101102201101020010010000010101001111111202011100000000000000000";
    dataMaps[3] = "0000000000000000022222222222222002002002000020100202202202202020022200202222220000020222202002000222020222202220020002002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002022222202202200000000000000000";
                  // 0: tường màu đen; 1: khoảng trống màu trắng; 2: khoảng trống có điểm chấm đỏ
}
var img = document.getElementById("ghost"); // Lấy image Ghost dựa theo id
var map = new Array(mapLine);               // Khởi tạo 1 mảng lưu data của Map dựa theo số ô được tạo ở trên
for(let i=0; i<mapLine;i++){
    map[i] = new Array(mapLine);
}
var Ghost= new Array(3);                    // Xây dựng mảng 2 chiều để lưu thông tin của Ghost (bao gồm 3 Ghost)
for(let i=0;i<3;i++){
    Ghost[i] = new Array(3);                // Mỗi Ghost sẽ có 3 thông tin: Vị trí x, vị trí y và chiều di chuyển
}
body.addEventListener("keydown", function(event){  // Xây dựng hàm follow nhấn phím của người dùng (các phím di chuyển)
    let k = event.keyCode;                        // Lấy key code của phím được nhấn 
    if(k == 38|| k == 87) directionPac = 0                    // Người dùng nhấp phím Up
    if(k == 39|| k == 68) directionPac = 1                    // Người dùng nhấp phím Right
    if(k == 40|| k == 83) directionPac = 2                    // Người dùng nhấp phím Down
    if(k == 37|| k == 65) directionPac = 3                    // Người dùng nhấp phím Left
    console.log(k+" _ "+directionPac);
});
resetData(0);                                     // Reset data trước khi bắt đầu game
var runLevel = setInterval(run,fps);              // Tạo vòng lặp chạy hàm run() vô hạn và delay theo khoảng thời gian fps
function resetData(statusGame){                   // Hàm điều chỉnh data của game khi chơi lại (statusGame == 0) và qua vòng (statusGame == 1)
    statusPac = 0;
    if(statusGame==0){                            // Khi người chơi chơi lại thì cần reset điểm, fps và dataMap
        presentPlus = 0;
        fps = 100;
        dataMap = 0;
    }
    xPac = mapWeight*1.5;                // Vị trí ban đầu của PACMAN ở góc trái trên cùng
    yPac = mapWeight*1.5;                // Do vị trí lấy từ tâm PACMAN nên phải + mapWeight/2
    directionPac = 1;                    // Chiều ban đầu từ trái qua phải
    {
        Ghost[0][0] = 435;Ghost[0][1] = 45;Ghost[0][2] = Math.floor(Math.random()*4);  // Vị trí của Ghost 1 góc phải trên cùng, hướng đi random
        Ghost[1][0] = 435;Ghost[1][1] = 435;Ghost[1][2] = Math.floor(Math.random()*4); // Vị trí của Ghost 1 góc phải dưới cùng, hướng đi random
        Ghost[2][0] = 45;Ghost[2][1] = 435;Ghost[2][2] = Math.floor(Math.random()*4);  // Vị trí của Ghost 1 góc trái dưới cùng, hướng đi random
    }
    loadMap(dataMaps[dataMap], presentPlus);      // Load data Map từ chuỗi thành mảng

}
function run(){
    let xy = runReturn(1, xPac, yPac, directionPac);       // Lấy bước đi tiếp theo của PACMAN (return lại mảng 2 phần tử)
    xPac = xy[0];
    yPac = xy[1];
    for (let i=0;i<3;i++){                              // Lặp lại 3 lần cho 3 Ghost
        let gxy = runReturn(0, Ghost[i][0], Ghost[i][1], Ghost[i][2]);  // Lấy bước đi của Ghost (return lại mảng 3 phần tử)
        Ghost[i][0] = gxy[0];                                      // Tọa độ x của Ghost[i]
        Ghost[i][1] = gxy[1];                                      // Tọa độ y của Ghost[i]
        Ghost[i][2] = gxy[2];                                      // Chiều di chuyển của Ghost[i]
    }
    paintAll();                         // Vẽ toàn bộ map
    paintPac();                         // Vẽ PACMAN
    paintGhost();                       // Vẽ toàn bộ Ghost
    condition();                        // Hàm điều kiện để game tiếp tục (khi PAC chạm vào Ghost thì game end)
    inf();                              // Hàm Printf các thông số điểm
}
function endLevel(){                    // Hàm khởi chạy khi PAC va chạm với Ghost
    clearInterval(runLevel);            // Xóa vòng lặp vô hạn (đã khởi tạo bên trên)
    window.confirm("Bạn đã thua với số điểm: "+presentPlus+"!\nĐiểm cao nhất: "+highPlus+"!\nBạn có muốn chơi lại không?");   // Thông báo số điểm
    maxPlus = 0;                        // Reset lại điểm cao nhất của level (tham khảo hàm loadMap sẽ tính toán điểm cao nhất level)
    resetData(0);                       // Reset lại data trò chơi với statusGame == 0: Người chơi thua
    setTimeout(function(){
        runLevel = setInterval(run,fps);
    },1000);                            // chờ 1000 ms để người dùng chuẩn bị và game chạy lại từ đầu
}
function completeLevel(){               // Hàm khởi chạy khi điểm người chơi (presentPlus) == điểm tối đa của level (mapPlus)
    clearInterval(runLevel);
    window.confirm("Bạn đã chiến thắng\nBạn có muốn chơi vòng tiếp theo không?");                                    // Thông báo qua màn
    nextLevel();                        // Thay đổi data trò chơi cho level tiếp theo
    resetData(1);                       // Reset data trò chơi với stastusGame == 1: Người chơi qua màn
    setTimeout(function(){
        runLevel = setInterval(run,fps);
    },1000);                            // chờ 1000 ms để người dùng chuẩn bị và tiếp level sau
}
function nextLevel(){                   // Hàm khởi chạy khi người chơi qua màn (completeLevel())
    if(dataMap < 3) dataMap += 1;       // Nếu người chơi chưa chơi hết 1 lượt 4 vòng (4 map) thì tăng lên vòng tiếp theo
    else{                               // Nếu người chơi đã chơi hết 4 vòng (4 map) thì tăng tốc độ di chuyển của PACMAN và Ghost lên
        dataMap = 0;                    // Khởi tạo vòng thứ 2 với map thứ nhất  
        fps = Math.floor(fps*0.8);      // Tăng tốc độ di chuyển (giảm thời gian delay của vòng lặp hàm run())
    }
}
function paintAll(){                        // Vẽ toàn bộ map (bao gồm tường, khoảng trống và phần thưởng) dựa theo mảng 2 chiều map[][]
    for(let i = 0; i < mapLine; i++){                   // Load theo chiều dọc mỗi cột
        for(let j = 0; j < mapLine; j++){               // Load theo chiều ngang mỗi ô
            let xPixelMap = i*mapWeight+ mapWeight/2;      // Lấy tâm của từng vị trí map: (vì vẽ từ tâm ra)
            let yPixelMap = j*mapWeight + mapWeight/2;      
            let colorPixelMap = map[i][j];  // Data map: 0 or 1 or 2
            paint(xPixelMap, yPixelMap, mapWeight, colorPixelMap);      // Hàm vẽ từng ô của map 
        }
    }

}

function paintPac(){
    if (statusPac == 1){                                                   // Trạng thái khi PACMAN há miệng (hình tròn khuyết 1 miếng 90 độ (PI/2))
        c.beginPath();                                                     // Bắt đầu lấy thông số để vẽ
                                // Bởi vì không thể vẽ một hình tròn khuyết, ta vẽ 2 nửa đường tròn lệch nhau 90 độ
        c.arc(xPac,yPac,mapWeight/2,(directionPac/2+0.25)*Math.PI,(directionPac/2+1.25)*Math.PI);
                                // Vẽ nửa đường tròn 1 có tâm là tọa độ của PACMAN, bán kính == mapWeight/2, góc bắt đầu và góc cuối phụ thuộc vào hướng của PACMAN
        c.fillStyle = colorPac;                                            // Tô màu cho nửa đường tròn này
        c.fill();                                                          // Sử dụng toàn bộ thông số bên trên để vẽ

        c.beginPath();
        c.arc(xPac,yPac,mapWeight/2,(directionPac/2-0.25)*Math.PI,(directionPac/2-1.25)*Math.PI);
                                // Vẽ nửa đường tròn 2 có tâm là tọa độ của PACMAN, bán kính == mapWeight/2, góc bắt đầu và góc cuối phụ thuộc vào hướng của PACMAN
        c.fillStyle = colorPac;
        c.fill();

        statusPac = 0;                                                     // Đối lại trạng thái đóng miệng cho lần vẽ tiếp theo
    }
    else if(statusPac == 0){                                               // Trạng thái khi PACMAN đóng miệng 
        c.beginPath();
        c.arc(xPac, yPac, mapWeight/2, 0, 2*Math.PI);                                        // Ở trạng thái này ta chỉ cần vẽ một hình tròn nguyên vẹn (từ 0 đến 2*PI)
        c.fillStyle = colorPac;
        c.fill();
        statusPac = 1;
    };
}
function paintGhost(){                                                     // Hàm vẽ các Ghost
    for(let i = 0; i < 3; i++){                                            // Vẽ lần lượt cả 3 Ghost
        c.beginPath();
        c.drawImage(img, Ghost[i][0]-mapWeight/2, Ghost[i][1]-mapWeight/2,mapWeight,mapWeight);
                                // Vẽ Ghost dựa theo id của hình ảnh (đã lấy bên trên) và hàm drawImage(img, x_img, y_img, height_img, weight_img)
    }
}
function paint(xPixelMap, yPixelMap, pixelWeight, colorPixel){             // Hàm vẽ các ô của map
    var color ="black";                                     // Cài màu sắc cho ô mặc định là "black" tương ứng với colorPixel == 0 của tường
    if(colorPixel >= 1) color = "white";                    // Thay đổi màu sắc sang "white" nếu đó là khoảng trống
    c.beginPath();                                          // Để vẽ một ô ta hình dung đó là một đoạn thẳng có chiều dài bằng chiều rộng, và màu sắc theo data map
    c.moveTo(xPixelMap, yPixelMap);                         // Đánh dấu điểm đầu của đoạn thẳng
    c.lineTo(xPixelMap, yPixelMap+1);                       // Đánh dấu điểm cuối của đoạn thẳng
    c.lineWidth = pixelWeight;                              // Cài đặt độ rộng cho đoạn thẳng
    c.strokeStyle = color;                                  // Cài đặt màu sắc cho ô
    c.lineCap = "square";                                   // Cài đặt kiểu viền cho hai đầu đoạn thẳng ("square" là option như thuộc tính padding css,
                                                            // viền tại 2 đầu của đoạn thằng sẽ có padding bằng độ rộng bằng nửa độ rộng đoạn thẳng,
                                                            // vì vậy ta chỉnh cần lấy độ dài đoạn thẳng là 1 pixel ta vẫn có độ dài đọan thẳng khi vẽ ra 
                                                            //là: 1px + độ rộng đoạn thẳng)
    c.stroke();
    if(colorPixel == 2){                                    // Trường hợp có điểm trong ô, ta vẽ thêm một điểm màu
        c.beginPath();                                      // Tương tự ta có thể vẽ 1 hình tròn, hoặc một đoạn thẳng
        c.moveTo(xPixelMap, yPixelMap);
        c.lineTo(xPixelMap, yPixelMap+1);
        c.lineWidth = pixelWeight/3;
        c.strokeStyle = colorPac;
        c.lineCap = "round";                                // Cài đặt kiểu viền cho hai đầu đoạn thẳng ("round" là option như thuộc tính padding css bao gồm radius border
                                                            // sẽ tạo một đường bo tròn với bán kính bằng nửa độ rộng của đoạn thẳng)
        c.stroke();
    }
}
function loadMap(dataMapInput,maxPlusInput){                // Hàm load data map và chỉnh sửa maxPlus của level theo trạng thái thua hay qua màn của người chơi
    maxPlus = maxPlusInput;                                 // Chơi lại thì maxPlusInput == 0, qua màn thì bằng maxPlusInput == presentPlus
    for(let i = 0; i < mapLine; i++){
        for(let j = 0; j < mapLine; j++){
            map[i][j] = dataMapInput.slice(i*mapLine + j, i*mapLine + j + 1)    // Vòng lặp gán data map theo chuỗi kí tự data map
            if(map[i][j] > 0) maxPlus += 1;
        }
    }
}
function runReturn(PAC_Ghost,xInput,yInput,direction){               // Hàm trả lại vị trí tiếp theo của PACMAN (PAC_Ghost == 1) hoặc Ghost (PAC_Ghost == 0) theo tọa độ và hướng đi  
    if(PAC_Ghost == 1 && xInput%mapWeight == mapWeight/2 && yInput%mapWeight == mapWeight/2){       // Nếu là PACMAN và vị trí của nó bằng với trung tâm của ô
        if(map[xInput/mapWeight - 0.5][yInput/mapWeight - 0.5] == 2){                               // Nếu data map tại vị trí này có giá trị là 2 (tương ứng với có điểm)
            map[xInput/mapWeight - 0.5][yInput/mapWeight - 0.5] = 1;                                // Cho PACMAN nhận điểm và cài đặt data map tại vị trí này về 1 (khoảng trống)
            presentPlus += 1;                                                                       // Điểm người chơi được +=1
            if(presentPlus > highPlus){                                                             // So sánh với điểm cao nhất và gán thành điểm cao nhất nếu cao hơn
                highPlus = presentPlus;
                //saveHighscore("Ngoc Drakula", highPlus);
            }
            if(presentPlus >= maxPlus){                              // So sánh điểm người chơi với điểm để hoàn thành level
                completeLevel();                                     // Qua màn
                return([mapWeight * 1.5,mapWeight * 1.5, 1]);        // Trả lại vị trí của PACMAN về vị trí ban dầu
            }
        }
    }
    let a=PAC_Ghost;
    PAC_Ghost = 0;                                                  // Tái sử dụng biến PAC_Ghost để lưu lại sự kiện di chuyển (cho Ghost)
    // Từ đây sẽ áp dụng cho cả PACMAN và Ghost
    if(direction == 0||direction == 2){                             // Nếu hướng hiện tại là Up hoặc Down, ta tính toán dựa trên chiều y
        if(check(xInput - mapWeight/3, yInput + (direction - 1)*2*mapWeight/3) >=1 && check(xInput + mapWeight/3, yInput + (direction - 1)*2*mapWeight/3) >= 1){
                yInput += (direction-1)*mapWeight/3;                // Nếu kiểm tra phía trước không phải tường thì ta thực hiện một bước ( mapWeight/3)
                                                                    // Vì direction - 1 = (-1||1) do đó ta tận dụng hiện số này để tiến lùi theo y
                PAC_Ghost += 1;                                     // Nếu có thể bước ta ghi nhớ lại sự kiện này bằng biến PAC_Ghost
            }
        }
    if(direction == 1||direction == 3){                             // Tương tự nếu hướng hiện tại là Left hoặc Right, ta tính toán theo chiều x
        if(check(xInput - (direction - 2)*2*mapWeight/3,yInput - mapWeight/3) >= 1 && check(xInput - (direction - 2)*2*mapWeight/3, yInput + mapWeight/3) >= 1){
                xInput += (2 - direction)*mapWeight/3;              // Vì 2 - direction = (-1||1) do đó ta tận dụng hiện số này để tiến lùi theo x
                PAC_Ghost += 1;                                     // Đồng thời ghi nhớ sự kiện này
        }
    }
    if(PAC_Ghost == 0) PAC_Ghost = Math.floor(Math.random()*4);     // Nếu chưa có sự kiện chưa di chuyển (PAC_Ghost +=1) thì ta random lại hướng đi
    else PAC_Ghost = direction;                                     // Nếu đã có sự kiện di chuyển, ta cho hướng đi như hướng ban đầu
    return([xInput, yInput, PAC_Ghost])                             // Trả về vị trí sau khi bước của PACMAN hoặc Ghost (với PACMAN ta không sử dụng đến PAC_Ghost nên có thể return)
}
function condition(){                                               // Hàm đánh giá vị trí của PACMAN và Ghost, nếu khoảng cách giữa PACMAN và Ghost bất kì < mapWeight*2/3 thì end game
    for(let i=0;i<3;i++){
        if(Math.abs(xPac - Ghost[i][0]) < mapWeight*2/3 && Math.abs(yPac - Ghost[i][1]) < mapWeight*2/3)
        endLevel();
    }
}
function check(xInput, yInput){                                     // Hàm trả về vị trí của một điểm bất kì theo tọa độ của nó trong map ( tham khảo trong file createmap.js) 
    xInput = Math.floor(xInput / mapWeight);
    yInput = Math.floor(yInput / mapWeight);
    return map[xInput][yInput];
}
function inf(){                                                     // In điểm người chơi
document.getElementById("info").innerHTML="Điểm của bạn: "+presentPlus+ "/"+maxPlus+"(Điểm cao nhất: "+highPlus+")";
}
//firebase function
function saveHighscore(no, name, high_score){
    db.collection("high_scores")
    .doc().set({
        no: no,
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
