import authedUser from "./user.js";
import {activeConversation} from "./conversation.js";
import chatScreen from "../View/chat.js";

let unsubscribe = null;
function subscribe(){
    chatScreen.clearMessages();
    unsubscribe = db.collection("messages").where("conversation","==", activeConversation)
    .orderBy("created_at")
    .onSnapshot(function(snapShot){
        const messages= snapShot.docChanges();
        for(let i=0;i< messages.length; i++){
            if(messages[i].type==="added")
            chatScreen.addMessage(messages[i].doc.data());
        }
    });
    return (unsubscribe)
}
function newMessage(content) {
    return {
        content: content,
        user: authedUser.email,
        conversation: activeConversation
    }
}
function saveMessage(message) {
    db.collection("messages").doc().set({
        ...message,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function () { console.log("Message sent!"); })
    .catch(function(err) { console.error("Failed! ", err); });
    document.getElementById('js-userInput').value ="";
}
function fetchMessage(){
    db.collection('messages').where('conversation','==', activeConversation).get()
    .then(function(snapShot){
        const messages=[];
        snapShot.forEach(function(doc){
            messages.push(doc.data());
            console.log("updated");
        });
        chatScreen.clearMessages();
        chatScreen.addBulkMessage(messages);
    }).catch(function(err){
        console.error("Faild",err);
    })
}
function changeActiveCon(nextConId){
    if(unsubscribe!==null) unsubscribe();
    subscribe();
}
export { newMessage, saveMessage, changeActiveCon}