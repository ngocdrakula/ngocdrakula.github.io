import {newMessage, saveMessage, changeActiveCon} from "../models/message.js";
import {addUser, updateActiveCon} from "../models/conversation.js";
const chatController = {
    sendMessage: function (content) {
        const message = newMessage(content);
        saveMessage(message);
    },
    addUser: function(email){
        addUser(email);
    },
    changeActiveCon: function(nextConId){
        console.log(nextConId);
        updateActiveCon(nextConId);
        changeActiveCon();
    }
}
export default chatController;
