import { db, auth } from './firebase.js';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { ui } from './i18n.js';

export function initChat() {
  const chatContainer = document.getElementById('contact-chat');
  if (!chatContainer) return;

  const userMsgInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chat-messages');
  const statusText = document.getElementById('chat-status');

  let currentUser = null;

  // ── Auth ──
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      statusText.textContent = ui('chat_status_online');
      userMsgInput.placeholder = ui('chat_placeholder');
      userMsgInput.disabled = false;
      sendBtn.disabled = false;
      listenForMessages(user.uid);
    } else {
      signInAnonymously(auth).catch(err => {
        statusText.textContent = 'Auth Error';
        console.error(err);
      });
    }
  });

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessageUI(text, sender, timestamp) {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender === 'user' ? 'msg-user' : 'msg-admin'}`;
    
    const timeStr = formatTime(timestamp);
    div.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <span class="msg-time">${timeStr}</span>
    `;
    
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function listenForMessages(uid) {
    const q = query(
      collection(db, 'chats', uid, 'messages'),
      orderBy('timestamp', 'asc')
    );

    onSnapshot(q, (snapshot) => {
      messagesContainer.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        addMessageUI(data.text, data.sender, data.timestamp);
      });
    });
  }

  async function sendMessage() {
    const text = userMsgInput.value.trim();
    if (!text || !currentUser) return;

    userMsgInput.value = '';
    const uid = currentUser.uid;

    try {
      await setDoc(doc(db, 'chats', uid), {
        lastMessage: text,
        lastTimestamp: serverTimestamp(),
        unread: true,
        userId: uid
      }, { merge: true });

      await addDoc(collection(db, 'chats', uid, 'messages'), {
        text: text,
        sender: 'user',
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Chat error:', err);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  userMsgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
