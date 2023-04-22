<template>
  <div class="abo-booking-details">
    <div class="content">
      <h1 class="title">{{ title }}</h1>
      <div class="time">
        <span> 利用日時 {{ startDatetime }} </span>
        <span> 印刷日時 {{ endDatetime }} </span>
      </div>
      <table class="table">
        <tr>
          <th class="col -room">部屋</th>
          <th class="col -time">時間</th>
          <th class="col -count">人数</th>
          <th class="col -layout">レイアウト／図面</th>
          <th class="col -customer">会社名／会合名</th>
          <th class="col -memo">注意項目</th>
          <th class="col -service">備品</th>
        </tr>
        <tbody v-for="(booking, index) in bookingDetails" :key="index">
          <tr>
            <td class="cell" rowspan="2">{{ booking.roomName }}</td>
            <td class="cell" rowspan="2">
              <span>{{ booking.startDatetime }}</span>
              <span>{{ booking.endDatetime }}</span>
            </td>
            <td class="cell" rowspan="2">{{ booking.guestCount }}</td>
            <td class="cell">{{ booking.layoutType }}</td>
            <td class="cell">{{ booking.customerName }}</td>
            <td class="cell" rowspan="2">{{ booking.memo }}</td>
            <td class="cell" rowspan="2">{{ booking.serviceName }}</td>
          </tr>
          <tr>
            <td class="cell">{{ booking.layoutLocation }}</td>
            <td class="cell">{{ booking.title }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: "TestCopment",
  fontUrl: "https://fonts.googleapis.com/css?family=Noto+Sans+JP",
  data() {
    return {
      title: "業務連絡書",
    };
  },
  computed: {
    startDatetime() {
      return this.params?.startDatetime || "2023-03-13T03:22:28";
    },
    endDatetime() {
      return this.params?.endDatetime || "2023-03-13T03:22:28";
    },
    bookingDetails() {
      return (
        this.params?.bookingDetails || [
          {
            id: 1,
            customerName: "Cristiano",
            serviceName: "サンドイッチ",
            title: "Title 1",
            startDatetime: "2023-03-13T03:22:28.085Z",
            endDatetime: "2023-03-15T03:22:28.084Z",
            guestCount: 1,
            layoutType: null,
            layoutLocation: null,
            memo: null,
          },
          {
            id: 2,
            customerName: "Cristiano",
            title: "Title 2",
            startDatetime: "2023-03-17T03:22:28.086Z",
            endDatetime: "2023-03-18T03:22:28.084Z",
            guestCount: null,
            layoutType: null,
            layoutLocation: null,
            memo: null,
          },
        ]
      );
    },
  },
};
</script>

<style scoped>
.abo-booking-details {
  width: 100vw;
  font-family: "Inter";
  font-style: normal;
  margin: 0;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
}
.content {
  width: 595px;
  background-color: white;
  padding: 50px 30px;
  font-size: 10px;
}
.title {
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  margin-bottom: 14px;
  text-align: center;
  letter-spacing: 1.01em;
  min-height: 40px;
}
.time {
  display: flex;
  justify-content: space-between;
}
.table,
.col,
.cell {
  border: 1px solid black;
  border-collapse: collapse;
}
.col {
  font-size: 11px;
  font-weight: 700;
  line-height: 10px;
  text-align: center;
}

.-room {
  width: 33px;
}
.-time {
  width: 75px;
}
.-count {
  width: 33px;
}
.-layout {
  width: 46px;
}
.-customer {
  width: 100px;
}
.-memo {
  width: 120px;
}
.-service {
  width: 120px;
}
</style>
