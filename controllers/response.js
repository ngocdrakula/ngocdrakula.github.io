const responseType={
    SUCCESS: "success",
    FAILURE: "failure"
};
const responseCode={
    auth:{
        register_success: "auth/register_success",
        email_not_verified: "auth/email_not_verified",
        login_success: "auth/login_success"
    }
};
function makeResponse(type,code,data){
    return {
        type: type,
        code: code,
        data: data
    }
}
export {responseType,responseCode,makeResponse};