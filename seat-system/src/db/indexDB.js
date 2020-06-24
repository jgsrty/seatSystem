// export default {
//   indexDB: window.indexedDB,
//   openDB: (dbname, version, db, newStore, callback) => {
//     let version = version || 1;
//     let request = this.indexedDB.open(dbname, version);
//     request.onerror = function(event) {
//       console.log("IndexedDB数据库打开错误");
//     };
//     request.onsuccess = function(event) {
//       db = event.target.result;
//       console.log(event);
//       if (callback && typeof callback === "function") {
//         callback(db);
//       }
//     };
//   },
// };

// let myDB = {
//   name: "cs_seat_system",
//   version: 1,
//   db: null,
//   objStore: {
//     name: "seat",
//     keypath: "id",
//   },
// };

// let indexDB = {
//   indexedDB: window.indexedDB || window.webkitindexedDB,
//   IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange, //键范围

//   openDB: (myDB, callback) => {
//     let version = myDB.version || 1;
//     console.log(this)
//     let request = this.indexedDB.open(myDB.name, version);
//     request.onerror = (e) => {
//       console.log(e);
//     };
//     request.onsuccess = (e) => {
//       console.log(e);
//       myDB.db = e.target.result;
//       callback();
//     };
//   },
// };

// export default {
//   install: (Vue) => {
//     Vue.prototype.myDB = myDB;
//     Vue.prototype.indexDB = indexDB;
//   },
// };
