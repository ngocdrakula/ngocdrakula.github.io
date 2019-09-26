//variable declaration
var x=1;
const y=2; //inmutable (không thể thay đổi)
let z=3;

x="hello";
if(x===y){
    console.log("equala");
}
else{
    console.log("not equal");
}
const arr=[1,2,3,4,5];
for(let i=0;i<arr.length;i++){
    console.log(arr[i]);
}
const obj= {
    name: "Ngoc",
    age: 24,
    sayHell: function(){
        console.log("Hello World")
    }
}
console.log(obj.name);
console.log(obj.age);
obj.sayHell();

obj.address ={
    district: "Xuan Dinh",
    city: "Ha Noi"
}

