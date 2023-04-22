<template>
  <div class="">
    <div class="localVideo">
      <p>video local</p>
      <video
        class="local-video"
        id="local"
        volume="0"
        autoplay
        muted
        width="720px"
        height="480px"
        v-if="myStreamSrc"
        :srcObject.prop="myStreamSrc"
      ></video>
      <button @click="ChangeVideo">change video</button>
    </div>
    <h1>video Other</h1>
    <div class="otherVideo">
      <video
        v-for="(item, index) in listVideo"
        class="other-video"
        id="local"
        volume="0"
        autoplay
        muted
        width="480px"
        height="320px"
        :key="index"
        :srcObject.prop="item"
      ></video>
    </div>
  </div>
</template>
<script>
import helper from "@/helper/socket";
import { io } from "socket.io-client";
export default {
  name: "VideoLocal",
  data() {
    return {
      myStreamSrc: "",
      roomId: "",
      socketId: "",
      myStream: "",
      recordedStream: "",
      mediaRecorder: "",
      pc: [],
      socketClient: "",
      listVideo: [],
    };
  },
  mounted() {
    this.roomId = this.$route.params.id;
    helper
      .getUserFullMedia()
      .then((stream) => {
        //save my stream
        console.log(stream);
        this.myStream = stream;
        this.myStreamSrc = stream;
        // this.otherStreamSrc = stream;
      })
      .catch((e) => {
        console.error(`stream error: ${e}`);
      });
    this.socketClient = io("http://localhost:4001/stream");
    this.socketClient.on("connect", () => {
      //set socketId
      this.socketId = this.socketClient.io.engine.id;
      this.socketClient.emit("subscribe", {
        room: this.roomId,
        socketId: this.socketId,
      });
      this.socketClient.on("new user", (data) => {
        this.socketClient.emit("newUserStart", {
          to: data.socketId,
          sender: this.socketId,
        });
        this.pc.push(data.socketId);
        this.init(true, data.socketId);
        console.log("pc new user", this.pc);
      });
      this.socketClient.on("newUserStart", (data) => {
        this.pc.push(data.sender);
        console.log("newUserStart sender", data.sender);
        this.init(false, data.sender);
      });
      this.socketClient.on("ice candidates", async (data) => {
        data.candidate
          ? await this.pc[data.sender].addIceCandidate(
              new RTCIceCandidate(data.candidate)
            )
          : "";
      });

      this.socketClient.on("sdp", async (data) => {
        console.log(data);
        console.log(this.pc);
        if (data.description.type === "offer") {
          console.log(data.description);

          data.description
            ? await this.pc[data.sender].setRemoteDescription(
                new RTCSessionDescription(data.description)
              )
            : "";

          helper
            .getUserFullMedia()
            .then(async (stream) => {
              if (!document.getElementById("local").srcObject) {
                this.myStreamSrc = stream;
              }

              //save my stream
              this.myStream = stream;

              stream.getTracks().forEach((track) => {
                this.pc[data.sender].addTrack(track, stream);
              });

              let answer = await this.pc[data.sender].createAnswer();

              await this.pc[data.sender].setLocalDescription(answer);

              console.log("pc sdp ", this.pc);

              this.socketClient.emit("sdp", {
                description: this.pc[data.sender].localDescription,
                to: data.sender,
                sender: this.socketId,
              });
            })
            .catch((e) => {
              console.error(e);
            });
        } else if (data.description.type === "answer") {
          await this.pc[data.sender].setRemoteDescription(
            new RTCSessionDescription(data.description)
          );
        }
      });
    });
  },
  methods: {
    init(createOffer, partnerName) {
      this.pc[partnerName] = new RTCPeerConnection(helper.getIceServer());

      if (this.screen && this.screen.getTracks().length) {
        this.screen.getTracks().forEach((track) => {
          this.pc[partnerName].addTrack(track, screen);
        });
      } else if (this.myStream) {
        this.myStream.getTracks().forEach((track) => {
          this.pc[partnerName].addTrack(track, this.myStream);
        });
      } else {
        helper
          .getUserFullMedia()
          .then((stream) => {
            //save my stream
            this.myStream = stream;

            stream.getTracks().forEach((track) => {
              this.pc[partnerName].addTrack(track, stream);
            });

            this.myStreamSrc = stream;
          })
          .catch((e) => {
            console.error(`stream error: ${e}`);
          });
      }

      //create offer
      if (createOffer) {
        this.pc[partnerName].onnegotiationneeded = async () => {
          let offer = await this.pc[partnerName].createOffer();

          await this.pc[partnerName].setLocalDescription(offer);

          this.socketClient.emit("sdp", {
            description: this.pc[partnerName].localDescription,
            to: partnerName,
            sender: this.socketId,
          });
        };
      }

      //send ice candidate to partnerNames
      this.pc[partnerName].onicecandidate = ({ candidate }) => {
        this.socketClient.emit("ice candidates", {
          candidate: candidate,
          to: partnerName,
          sender: this.socketId,
        });
      };
      console.log("pc init", this.pc);
      this.pc[partnerName].ontrack = (e) => {
        let str = e.streams[0];
        this.listVideo.push(str);
        console.log("list video has join", this.listVideo);
      };

      this.pc[partnerName].onconnectionstatechange = () => {
        switch (this.pc[partnerName].iceConnectionState) {
          case "disconnected":
          case "failed":
            // helper.closeVideo(partnerName);
            console.log(this.pc[partnerName]);
            break;

          case "closed":
            console.log(this.pc[partnerName]);
            // helper.closeVideo(partnerName);
            break;
        }
      };

      this.pc[partnerName].onsignalingstatechange = () => {
        switch (this.pc[partnerName].signalingState) {
          case "closed":
            console.log("Signalling state is 'closed'");
            // helper.closeVideo(partnerName);

            break;
        }
      };
    },
    ChangeVideo() {
      console.log(this.myStream);
      if (this.myStream.getVideoTracks()[0].enabled) {
        this.myStream.getVideoTracks()[0].enabled = false;
      } else {
        this.myStream.getVideoTracks()[0].enabled = true;
      }
      let track = this.myStream.getVideoTracks()[0];
      console.log(track);
      for (let p in this.pc) {
        let pName = this.pc[p];
        if (typeof this.pc[pName] == "object") {
          let sender = pName.getSenders
            ? pName
                .getSenders()
                .find((s) => s.track && s.track.kind === track.kind)
            : false;
          sender ? sender.replaceTrack(track) : "";
        }
      }
    },
  },
};
</script>

<style scoped>
.localVideo {
  background-color: black;
}
.localVideo p {
  color: white;
  font-size: 24px;
}
.otherVideo p {
  color: black;
  font-size: 24px;
}
.otherVideo {
  display: flex;
  justify-content: center;
}
</style>
