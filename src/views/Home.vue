<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <button @click="addSeatsData(myDB.db, 'seats')">add data</button>
    <button @click="readSeatsData(myDB.db, 'seats')">read data</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import dataParams from "./data";
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  data() {
    return {
      // 座位
      seatData: dataParams.seatData,
      // 本地数据库
      myDB: {
        name: "seat-system",
        version: 1,
        db: null,
      },
    };
  },
  mounted() {
    this.openDB(this.myDB.name, this.myDB.version);
  },
  methods: {
    openDB(name, version) {
      var version = version || 1;
      var request = window.indexedDB.open(name, version);
      request.onerror = function(e) {
        console.log(e.currentTarget.error.message);
      };
      request.onsuccess = (e) => {
        this.myDB.db = e.target.result;
      };
      request.onupgradeneeded = (e) => {
        var db = e.target.result;
        if (!db.objectStoreNames.contains("seats")) {
          var store = db.createObjectStore("seats", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("nameIndex", "name", { unique: false });
          store.createIndex("areaIndex", "area", { unique: false });
          store.createIndex("occupyIndex", "occupy", { unique: false });
        }
        if (!db.objectStoreNames.contains("students")) {
          var store = db.createObjectStore("students", {
            autoIncrement: true,
          });
          // store.createIndex("serialIndex", "serial", { unique: true });
          store.createIndex("nameIndex", "name", { unique: false });
          store.createIndex("roomIndex", "room", { unique: false });
        }
        console.log("DB version changed to " + version);
      };
    },
    addSeatsData(db, storeName) {
      // var trans = db.transaction([storeName], "readwrite");
      // var store = trans.objectStore(storeName);
      // for (var i = 0; i < this.seatData.length; i++) {
      //   store.add(this.seatData[i]);
      // }
      var request = db
        .transaction([storeName], "readwrite")
        .objectStore(storeName)
        .add({ name: "张三", age: 24, email: "zhangsan@example.com" });

      request.onsuccess = function(event) {
        console.log("数据写入成功");
      };

      request.onerror = function(event) {
        console.log("数据写入失败");
      };
    },
    readSeatsData(db, storeName) {
      var transaction = db.transaction([storeName]);
      var objectStore = transaction.objectStore(storeName);
      var index = objectStore.index("nameIndex");
      var request = index.get("张三");

      request.onerror = function(event) {
        console.log("失败");
      };

      request.onsuccess = function(event) {
        if (request.result) {
          console.log(request);
          console.log("Name: " + request.result.name);
        } else {
          console.log("未获得数据记录");
        }
      };
    },
  },
};
</script>
