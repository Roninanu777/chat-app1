const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.getElementById('users')
const socket = io();

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

roomName.textContent = room;

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message', message => {
    outputMessage(message);
    console.log(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage', msg);
    chatForm.reset();
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//output room name
function outputRoomName(room){
    roomName.textContent = room;
}

//Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}