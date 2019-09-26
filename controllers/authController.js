import validator from "../util/validator.js";
import {makeResponse, responseCode,responseType} from "../controllers/response.js";
import user from "../models/user.js";
const authController = {
    register: async function(request){
        const result = validator.validate({
            name: {name: "notEmpty"},
            password: {name: "minLength", value: 8},
            email: {name: "isEmail"},
            retypePassword: {name: "matched", value: request.password} 
        }, request)
        await firebase.auth().createUserWithEmailAndPassword(request.email,request.password);
        firebase.auth().currentUser.updateProfile({
            displayName:request.name
        })
        firebase.auth().currentUser.sendEmailVerification();
        return makeResponse (
            responseType.SUCCESS,
            responseCode.auth.register_success,
        firebase.auth().currentUser
        )
    },
    login: async function (request){
        const loginResult = await firebase.auth().signInWithEmailAndPassword(request.email, request.password);
        if(!loginResult.user.emailVerified){
            return makeResponse(
                responseType.FAILURE,
                responseCode.auth.email_not_verified
            )
        }
        else{
            user.authedUser= {
                email: loginResult.user.email,
                displayName: loginResult.user.displayName
            };
        console.log(loginResult.user);
            return makeResponse(
                responseCode.SUCCESS,
                responseCode.auth.login_success,
                firebase.user
                )
        }

    }
};
export default authController