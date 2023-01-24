const socket = io('/');


const videoGrid = document.getElementById('video-grid');

let MyVideoStream;
const myvideo = document.createElement('video');
myvideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    MyVideoStream = stream;
    AddVideoStream(myvideo, stream);
})
socket.emit ('join-room',ROOM_ID);

socket.on('user-connected', () => {
    connectToNewUser();
})


const connectToNewUser = () => {
    console.log('New User Connected');
}
const AddVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}