import chatScreen from '../View/chat.js';
import user from './user.js';
import {authedUser} from './user.js';
let activeConversation =null;

const addConversations= [];
function listenConversation(){
    db.collection("conversations").where("list_user","array-contains",user.authedUser.email).onSnapshot(function(snapShot){
        const conversations= snapShot.docChanges();
        for(let i=0;i< conversations.length; i++){
            const con = conversations[i].doc.data();
            if (conversations[i].type==="added"||(conversations[i].type=="modified"&&conversations.indexOf(conversations[i].doc.id<0))){
                con.id=conversations[i].doc.id;
                addConversations.push(con.id);
                console.log(con)
                chatScreen.addCon(con);
            };
            if(conversations[i].type==="modified"&&conversations[i].doc.id===activeConversation){
                chatScreen.listUser(con.list_user);
            }
        }
    });
}
function addUser(email){
    db.collection('conversations').doc(activeConversation).update({
        list_user: firebase.firestore.FieldValue.arrayUnion(email)}
        )
};
function saveConversation(name,email){
    db.collection("conversations")
    .doc().set({
        name: name,
        list_user: [user.authedUser.email]
    })
    .then(function () { console.log("Conversation sent!"); })
    .catch(function(err) { console.error("Failed! ", err); });

}
function updateActiveCon(nextConId){
    const oldCon = activeConversation;
    activeConversation = nextConId;
    chatScreen.updateActiveCon(oldCon);
    updateListUser(activeConversation);
}
function updateListUser(conId){
    db.collection('conversations')
    .doc(conId)
    .get()
    .then(function(snapShot){
            chatScreen.listUser(snapShot.data().list_user);
    })
    .catch(function(err){
        console.log("Faild"+err);
    })
}
export {addUser, saveConversation, updateActiveCon, activeConversation, listenConversation};