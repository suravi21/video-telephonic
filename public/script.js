const socket = io("/");
const videoGrid = document.getElementById("video-grid");


var myPeer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443"
});

var conn= myPeer.connect('userId');
conn.on('open',function(){
conn.send(userId);
});

myPeer.on('connection', function(conn) {
    conn.on('data', function(data){
      console.log(data);
    });
  });

let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true
    })
    .then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        myPeer.on('call', function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
              call.answer(stream); // Answer the call with an A/V stream.
              call.on('stream', function(userVideoStream) {
                addVideoStream(video, userVideoStream);
                
              });
            }, function(err) {
              console.log('Failed to get local stream' ,err);
            });
          });
        // myPeer.on("call", call => {
        //     call.answer(stream);
        //     const video = document.createElement("video");
        //     call.on("stream", (userVideoStream) => {
        //         addVideoStream(video, userVideoStream);
        //     });
        // });

        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });

        //input value
        let text = $("input");

        //when press enter send message
        $("html").keydown((e) => {
            if (e.which == 13 && text.val().length !== 0) {
                socket.emit("message", text.val());
                text.val("");
            }
        });

        socket.on('createMessage', message => {
            $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
            scrollToBottom();
        });
    });

myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, id);
});

// const connectToNewUser = (userId, stream) => {
//     const call = myPeer.call(userId, stream);
//     const video = document.createElement("video");
//     call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//     });
var getUserMedia = navigator.getUserMedia;
getUserMedia({
    video: true,
    audio: true
}, function (stream) {
    const call = myPeer.call(userId, stream);
    call.on("stream", function (userVideoStream) {
        addVideoStream(video, userVideoStream);
    });
}, function (err) {
    console.log('Failed to get local stream', err);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.append(video);
}

const scrollToBottom = () => {
    var d = $(".main-chat-window");
    d.scrollTop(d.prop("scrollHeight"));
};
//mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
    document.querySelector(".main-mute-button").innerHTML = html;
};

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
    document.querySelector(".main-mute-button").innerHTML = html;
};

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
    document.querySelector(".main-video-button").innerHTML = html;
};

const setPlayVideo = () => {
    const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
    document.querySelector(".main-video-button").innerHTML = html;
};

