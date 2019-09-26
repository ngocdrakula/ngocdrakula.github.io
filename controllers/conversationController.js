import {saveConversation} from '../models/conversation.js';
const conversationController ={
    createConversation: function(name,email){
saveConversation(name,email);
    }
}
export default conversationController;