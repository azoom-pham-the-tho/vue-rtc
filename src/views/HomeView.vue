<template>
  <div class="home-page">
    <div class="content">
      <div class="sidebar">
        <div class="user">
          <div
            :class="['item', getClassNameWithStatus(item.status)]"
            v-for="(item, index) in listUser"
            :key="index"
            @click="call(item._id, item.status, item.name)"
          >
            {{ item.name }}
            <span v-if="item._id == currentUser.id">(me)</span>
          </div>
        </div>
        <div class="chat">
          <div class="item">chat mot</div>
        </div>
      </div>
      <div class="message"></div>
    </div>

    <v-dialog class="dialog" v-model="dialog" width="500">
      <h4>
        <b class="name"> {{ contentDialog }}</b>
      </h4>
      <div class="action">
        <v-btn
          v-if="userCall.id"
          class="btn"
          color="primary"
          @click="acceptJoin"
        >
          <span class="material-symbols-outlined"> phone_in_talk </span>
        </v-btn>
        <v-btn class="btn" color="pink" @click="rejectJoin">
          <span class="material-symbols-outlined"> phone_disabled </span>
        </v-btn>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      dialog: false,
      contentDialog: "",
      userCall: {
        // nhận khi có người gọi đến
        id: "",
        name: "",
        roomId: "",
      },
      callToUser: "",
      currentUser: {},
      listUser: [],
      socket: null,
    };
  },

  mounted() {
    const uri = "http://localhost:8001";
    const token = sessionStorage.getItem("auth");
    this.currentUser = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.currentUser);
    if (!token) return this.$router.push("login");
    this.socket = io(uri, {
      path: "/call",
      extraHeaders: {
        authorization: `Beaer ${token}`,
      },
    });
    this.socket.on("connect", () => {
      this.socket.emit("get-all-user");
      this.socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
    this.socket.on("get-all-user", (listUser) => {
      this.listUser = listUser;
    });
    this.socket.on("user-call", (userCall, roomId) => {
      this.userCall.name = userCall.name;
      this.userCall.id = userCall.id;
      this.userCall.roomId = roomId;
      this.contentDialog = this.userCall.name + " đang gọi cho bạn";
      this.dialog = true;
    });
    this.socket.on("accept-join", (roomId) => {
      console.log("accept-join");
      this.$router.push(`/call/${roomId}`);
    });
    this.socket.on("reject-join", () => {
      this.dialog = false;
    });
  },
  methods: {
    call(userId, status, name) {
      console.log(userId, status);
      if (status == 2) {
        this.dialog = true;
        this.contentDialog = "bạn  đang gọi cho " + name;
        this.callToUser = userId;
        this.socket.emit("user-call", userId);
      } else {
        alert("user offline");
      }
    },
    acceptJoin() {
      this.$router.push(`/call/${this.userCall.roomId}`);
      this.socket.emit("accept-join", {
        userHost: this.userCall.id,
        roomId: this.userCall.roomId,
      });
    },
    rejectJoin() {
      this.dialog = false;
      this.socket.emit("reject-join", this.callToUser);
    },
    getClassNameWithStatus(status) {
      switch (status) {
        case 1:
          return "-offline";
        case 2:
          return "-online";
        case 3:
          return "-call";
        default:
          return "";
      }
    },
  },
};
</script>
<style scoped>
.home-page > .content {
  display: flex;
  width: 100%;
  padding: 50px 50px;
}
.home-page > .content > .sidebar {
  width: 25%;
  display: flex;
  flex-direction: column;
}
.home-page > .content > .message {
  width: 75%;
  background-color: aquamarine;
}
.home-page > .content > .sidebar > .user {
  border-bottom: 2px solid;
  border-top: 2px solid;
  max-height: 200px;
  overflow-y: scroll;
}
.home-page > .content > .sidebar > .user > .item {
  padding: 5px 5px;
  cursor: pointer;
}
.-online {
  background-color: rgba(96, 255, 91, 0.2);
}
.-offline {
  background-color: rgba(255, 91, 91, 0.2);
}
.-call {
  background-color: rgba(250, 255, 91, 0.2);
}
</style>
