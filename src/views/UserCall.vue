<template>
  <div class="layout">
    <div class="otherVideo">
      <video
        class="other-video"
        id="local"
        volume="0"
        autoplay
        muted
        :srcObject.prop="otherStream"
      ></video>
    </div>
    <div class="action">
      <div class="mic">
        <span
          v-if="optionMedia.mic"
          class="material-symbols-outlined"
          @click="changeMic"
        >
          keyboard_voice
        </span>
        <span v-else class="material-symbols-outlined" @click="changeMic">
          mic_off
        </span>
      </div>
      <div class="cam">
        <span
          v-if="optionMedia.cam"
          class="material-symbols-outlined"
          @click="changeCam"
        >
          videocam
        </span>
        <span v-else class="material-symbols-outlined" @click="changeCam">
          videocam_off
        </span>
      </div>
      <div class="share">
        <span
          v-if="optionMedia.share"
          class="material-symbols-outlined"
          @click="stopSharingScreen"
        >
          stop_screen_share
        </span>
        <span v-else class="material-symbols-outlined" @click="shareScreen">
          screen_share
        </span>
      </div>
      <div class="call">
        <span class="material-symbols-outlined" @click="onClose">
          call_end
        </span>
      </div>
    </div>
    <div class="myVideo">
      <video
        class="local-video"
        id="local"
        volume="0"
        autoplay
        muted
        v-if="myStream"
        :srcObject.prop="myStream"
      ></video>
    </div>
  </div>
</template>
<script>
import { Peer } from "peerjs";
import rtcHelper from "../helper/rtc";
import { io } from "socket.io-client";
export default {
  name: "VideoLocal",
  data() {
    return {
      peer: new Peer(),
      peerId: "",
      roomId: "",
      myStream: "",
      otherStream: "",
      screen: "",
      listVideo: [],
      optionMedia: {
        cam: true, //{ width: 720, height: 480 },
        mic: true,
        share: false,
      },
    };
  },
  mounted() {
    this.roomId = this.$route.params.id;
    this.socket = io("http://94.237.79.161:2000");

    rtcHelper
      .getUserFullMedia(this.optionMedia)
      .then((stream) => {
        this.myStream = stream;
        this.peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userStream) => {
            console.log(userStream);
            this.otherStream = userStream;
          });
          call.on("error", (err) => {
            alert(err);
          });
          call.on("close", () => {
            this.myStream.close();
            console.log("close");
          });
        });
      })
      .catch((err) => {
        alert(err.message);
      });

    this.peer.on("open", (id) => {
      this.peerId = id;
      this.socket.emit("newUser", id, this.roomId);
    });
    this.peer.on("error", (err) => {
      alert(err.type);
    });
    this.socket.on("userJoined", (id) => {
      console.log("new user joined");
      const call = this.peer.call(id, this.myStream);
      call.on("error", (err) => {
        alert(err);
      });
      call.on("stream", (userStream) => {
        this.otherStream = userStream;
      });
      call.on("close", () => {
        this.otherStream.close();
        console.log("user disconect");
      });
    });
  },
  methods: {
    changeMic() {
      this.optionMedia.mic = !this.optionMedia.mic;
      this.myStream.getAudioTracks()[0].enabled = this.optionMedia.mic;
    },
    changeCam() {
      this.optionMedia.cam = !this.optionMedia.cam;
      this.myStream.getVideoTracks()[0].enabled = this.optionMedia.cam;
    },
    shareScreen() {
      rtcHelper.getScreenMedia().then((streamScreen) => {
        this.optionMedia.share = !this.optionMedia.share;
        this.screen = streamScreen;
        this.myStream = streamScreen;

        const screenTrack = streamScreen.getVideoTracks()[0];
        console.log("screenTrack", screenTrack);
        const call = this.peer.call(this.peerId, this.myStream);
        const senders = call.peerConnection.getSenders();
        console.log("senders", senders);
        const videoSender = senders.find(
          (sender) => sender.track.kind === "video"
        );
        console.log(videoSender);
        videoSender.replaceTrack(screenTrack);
        streamScreen.getVideoTracks()[0].onended = () => {
          //listen when click stop share on browser
          this.stopSharingScreen();
        };
      });
    },
    stopSharingScreen() {
      const getTracks = this.screen.getTracks();
      //close video track
      getTracks.length ? getTracks.forEach(async (track) => track.stop()) : "";
      this.optionMedia.share = !this.optionMedia.share;
    },
    onClose() {
      this.myStream.close();
    },
  },
};
</script>

<style scoped>
.layout {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: black;
}
.otherVideo {
  width: 100%;
  height: 100%;
}
.other-video {
  width: 100%;
  height: 100%;
}

.myVideo {
  z-index: 1;
  position: absolute;
  bottom: 8vh;
  right: 10px;
  width: 176px;
  height: auto;
  max-height: 250px;
}
.myVideo:hover {
  width: 320px;
  transition: all ease-in-out 0.15s;
}
.local-video {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: bisque;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
}
.action {
  position: absolute;
  bottom: 0;
  height: 8vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(225, 225, 225, 0.1);
}
.mic,
.cam,
.share,
.call {
  margin: 0 20px;
  border-radius: 15px;
  cursor: pointer;
}

.mic,
.share,
.cam {
  background-color: rgb(220, 220, 220);
}
.call {
  color: white;
  background: rgb(255, 31, 31);
}
.material-symbols-outlined {
  padding: 15px;
  font-size: 25px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
