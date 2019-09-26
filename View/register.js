import setScreen from "./index.js";
import loginScreen from "./login.js";
import authController from "../controllers/authController.js";
import {responseCode} from "../controllers/response.js"

const form=`
<div id="login-screen" class="width-100 height-100">
<form id="js-formRegister">
    <div class="input"><lable>Name: </lable><input type="text" id="name"> <br></div>
    <div class="input"><lable>Email: </lable><input type="email" id="email"> <br></div>
    <div class="input"><lable>Password: </lable><input type="password" id="password"> <br></div>
    <div class="input"><lable>Confirm Password: </lable><input type="password" id="retypePassword"> <br></div>
    <div class="btnReg"><button type="submit" >Register</button> <br></div>
    <div class="btnMove"><button id="js-btnMoveToLogin"> Back to Login</button><br></div>
</form>
</div>`;
function onLoad(){
    const btnMoveToRegister = document.getElementById("js-btnMoveToLogin");
    const formRegister = document.getElementById("js-formRegister");
    formRegister.addEventListener("submit", async function(event){
        event.preventDefault();
        const request= {
            name : formRegister.name.value,
            email : formRegister.email.value,
            password : formRegister.password.value,
            retypePassword : formRegister.retypePassword.value
        };
        const response = await authController.register(request);
        switch(response.code){
            case responseCode.auth.register_success: alert("Registered successFully! Login enjoy!");
            return;
        }
    });
    btnMoveToRegister.addEventListener("click",function(){
        setScreen(loginScreen)
    });
}
export default {
    ui: form,
    onLoad: onLoad
}