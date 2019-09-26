import setScreen from './index.js';
import registerScreen from "./register.js";
import authController from "../controllers/authController.js";
import chatScreen from "./chat.js";
import {responseCode} from "../controllers/response.js";

const loginScreen=`
<div id="register-screen" class="width-100 height-100">
<form id="js-loginForm">
    <lable>Email: </lable>
    <div class="input"><input type="email" id="email" value="ngocdrakula@gmail.com"> </div>
    <lable>Password: </lable>
    <div class="input"><input type="password" id="password" value="12345678"> </div>
    <div class="btnLog"> <button type="submit" id="submit"> Login</button>  </div>
    <div class="btnMove"> <button id="js-btnMoveToRegister">Move to register page</button> </div>
</form>
</div>`;
function onLoad(){
    const formLogin = document.getElementById("js-loginForm");
    formLogin.addEventListener("submit",async function(event){
        event.preventDefault();
        const request= {
            email: formLogin.email.value,
            password: formLogin.password.value
        };
        const response = await authController.login(request);
        switch(response.code){
            case responseCode.auth.email_not_verified:
                alert ("Account is not active!");
                return;
            case responseCode.auth.login_success:
                setScreen(chatScreen);
                return;
        }
    })
    const btnMoveToRegister = document.getElementById("js-btnMoveToRegister");
    btnMoveToRegister.addEventListener("click",function(){
        setScreen(registerScreen)
    })
}
export default {
    ui: loginScreen,
    onLoad: onLoad
} 
;