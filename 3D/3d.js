var canvas = document.getElementById("3d");
var context = canvas.getContext("2d");
var a = 500;
var b = 00;
var x = new Array(9);
var y = new Array(9);
var z = new Array(9);
var data = "";
x[0] = y[0] = z[0] = 1000;

x[1] = x[4] = x[5] = x[8] = 0;
y[1] = y[2] = y[5] = y[6] = 0;
z[1] = z[2] = z[3] = z[4] = 0;

x[2] = x[3] = x[6] = x[7] = 200;
y[3] = y[4] = y[7] = y[8] = 200;
z[5] = z[6] = z[7] = z[8] = 200;

function show(x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
function showall() {
    for (let i = 1; i <= 9; i++) {
        if (i != 4 && i != 8)
            show(x[i], y[i], x[i + 1], y[i + 1]);
        else
            show(x[i], y[i], x[i - 3], y[i - 3]);
        if (i <= 4)
            show(x[i], y[i], x[i + 4], y[i + 4]);

    }
}
function timy(x0, x01, y01, x02, y02) {
    return (((y01 - y02) * x0 + y02 * x01 - y01 * x02) / (x01 - x02));
}

function timx(y0, x01, y01, x02, y02) {
    return ((y0 - (y02 * x01 - y01 * x02) / (x01 - x02)) / ((y01 - y02) / (x01 - x02)));
}
for (let i = 1; i <= 4; i++) {
    //show(x[1],y[0],timx(500,x[0],y[0],x[i],y[i]),500);

    data = data + timx(500, x[0], y[0], x[i], y[i]) + " , ";
}

showall();
document.getElementById("dats").innerHTML = data;
