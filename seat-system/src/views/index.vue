<template>
  <div class="content">
    <el-card class="card users">
      <el-button @click="addNewUser" type="primary" size="mini">添加新用户</el-button>
      <div class="user-list">
        <div class="item" v-for="(item,ind) in userListData" :key="ind">
          <span>{{item.name}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="card seats">
      <el-tabs
        v-model="activeAreaTab"
        @tab-click="selectArea"
        type="card"
        editable
        @edit="addNewArea"
      >
        <el-tab-pane :key="item.name" v-for="item in areaData" :label="item.name" :name="item.name">
          <div class="seat-list">
            <div class="item" v-for="item in currentAreaSeats" :key="item.number">
              <div>{{item.number}}号</div>
              <div>{{item.occupy?'使用中':'未使用'}}</div>
              <div v-show="item.occupy">{{item.user}}</div>
              <div v-show="item.occupy">
                <span>{{new Date(item.startTime).toLocaleDateString()}}</span>
                <span>至</span>
                <span>{{new Date(item.endTime).toLocaleDateString()}}</span>
              </div>
              <el-button
                v-show="!item.occupy"
                size="mini"
                type="primary"
                @click="addUser(item)"
              >添加学员</el-button>
            </div>
            <div class="item new-seat" @click="addNewSeat">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加新座位 -->
    <cus-dialog header="添加区域" :visible.sync="showAreaDialog" width="300px">
      <el-form size="small" :model="areaParams" ref="areaParams" label-width="90px">
        <el-form-item label="区域名">
          <el-input class="mini-input" v-model="areaParams.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-foot">
        <el-button size="small" type="primary" @click="createArea('seatParams')">立即创建</el-button>
      </div>
    </cus-dialog>
    <!-- 添加新座位 -->
    <cus-dialog header="添加新座位" :visible.sync="showSeatDialog" width="300px">
      <el-form size="small" :model="seatParams" ref="seatParams" label-width="90px">
        <el-form-item label="座位编号">
          <el-input class="mini-input" v-model="seatParams.number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-foot">
        <el-button size="small" type="primary" @click="createSeat('seatParams')">立即创建</el-button>
      </div>
    </cus-dialog>
    <!-- 添加新用户 -->
    <cus-dialog header="添加新用户" :visible.sync="showUserDialog" width="400px">
      <el-form
        size="small"
        :model="userParams"
        :rules="userParamsRules"
        ref="userParams"
        label-width="90px"
      >
        <el-form-item label="用户姓名" prop="name">
          <el-input class="mini-input" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input class="normal-input" v-model="userParams.idCard"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            value-format="timestamp"
            v-model="userParams.birth"
            type="date"
            placeholder="选择生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input class="normal-input" v-model="userParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="本专业" prop="major">
          <el-input class="normal-input" v-model="userParams.major"></el-input>
        </el-form-item>
        <el-form-item label="研究专业" prop="study">
          <el-input class="normal-input" v-model="userParams.study"></el-input>
        </el-form-item>
        <el-form-item label="租金" prop="rent">
          <el-input class="mini-input" v-model="userParams.rent"></el-input>
        </el-form-item>
        <el-form-item label="押金" prop="deposit">
          <el-input class="mini-input" v-model="userParams.deposit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-foot">
        <el-button size="small" type="primary" @click="createUser('userParams')">立即创建</el-button>
      </div>
    </cus-dialog>
    <!-- 座位关联学员 -->
    <cus-dialog header="添加学员" :visible.sync="showRelateSeat">
      <el-form size="small" :model="relateSeatParams" ref="relateSeatParams" label-width="90px">
        <el-form-item label="座位使用者">
          <el-select
            value-key="id"
            @change="selectSeatUser"
            v-model="relateSeatParams.user"
            placeholder="请选择使用者"
          >
            <el-option
              v-for="(item,ind) in userListData"
              :key="ind"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用时间">
          <el-date-picker
            value-format="timestamp"
            v-model="relateSeatParams.timeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-foot">
        <el-button size="small" type="primary" @click="userRelateSeat('seatParams')">立即创建</el-button>
      </div>
    </cus-dialog>
  </div>
</template>

<script>
import params from "./params";
import cusDialog from "@/components/customDialog";
export default {
  components: {
    cusDialog
  },
  data() {
    return {
      // 本地数据库
      myDB: {
        name: "seat-system",
        version: 1,
        db: null
      },
      areaData: "", //区域数据
      activeAreaTab: "", //当前区域
      showAreaDialog: false,
      showSeatDialog: false,
      showUserDialog: false,
      showRelateSeat: false,
      areaParams: { ...params.areaParams }, //座位参数
      seatParams: { ...params.seatParams }, //座位参数
      currentAreaSeats: "", //当前区域座位
      userParams: { ...params.userParams }, //用户参数
      userParamsRules: params.userParamsRules, //用户参数规则验证
      userListData: "", //用户列表
      relateSeatParams: { ...params.relateSeatParams }, //关联座位参数
      pickerOptions: params.pickerOptions //快捷时间
    };
  },
  mounted() {
    this.openDB(this.myDB.name, this.myDB.version);
  },
  methods: {
    // 座位
    // 选择学员
    selectSeatUser(item) {
      this.relateSeatParams.user = item.name;
      this.relateSeatParams.userIdCard = item.idCard;
    },
    // 添加学员
    addUser(item) {
      this.seatParams = item;
      this.showRelateSeat = true;
    },
    userRelateSeat() {
      if (this.relateSeatParams.timeRange && this.relateSeatParams.userIdCard) {
        this.seatParams.user = this.relateSeatParams.user;
        this.seatParams.userIdCard = this.relateSeatParams.userIdCard;
        this.seatParams.startTime = this.relateSeatParams.timeRange[0];
        this.seatParams.endTime = this.relateSeatParams.timeRange[1];
        this.seatParams.occupy = true;
        let request = this.myDB.db
          .transaction(["seat"], "readwrite")
          .objectStore("seat")
          .put(this.seatParams);
        request.onsuccess = e => {
          if (request.result) {
            // 读取指定区域座位
            let item = this.areaData.find(e => {
              return e.name === this.activeAreaTab;
            });
            this.getSeatsByArea(item.id);
            this.showRelateSeat = false;
            this.showMessage("座位信息更新成功", "success");
          }
        };
        request.onerror = e => {
          this.showMessage("座位信息更新失败,请联系管理员");
        };
        // 写入用户记录
        let req = this.myDB.db
          .transaction(["user"])
          .objectStore("user")
          .index("idCardIndex")
          .get(this.relateSeatParams.userIdCard);
        req.onsuccess = e => {
          if (req.result) {
            // 读取指定区域座位
            let hisItem = `区域：${this.seatParams.area}，座位：${
              this.seatParams.number
            }，起止时间：${new Date(
              this.seatParams.startTime
            ).toLocaleDateString()}至${new Date(
              this.seatParams.endTime
            ).toLocaleDateString()}`;
            let userHistory = req.result;
            userHistory.history.push(hisItem);
            let userReq = this.myDB.db
              .transaction(["user"], "readwrite")
              .objectStore("user")
              .put(userHistory);
            userReq.onsuccess = e => {
              console.log(request);
            };
            userReq.onerror = e => {
              this.showMessage("用户记录信息关联失败,请联系管理员");
            };
          }
        };
        req.onerror = e => {
          this.showMessage("用户信息拉取失败,请联系管理员");
        };
      }
    },
    // 添加座位
    addNewSeat() {
      this.seatParams = { ...params.seatParams };
      this.showSeatDialog = true;
    },
    createSeat() {
      if (this.seatParams.number) {
        let item = this.areaData.find(e => {
          return e.name === this.activeAreaTab;
        });
        this.seatParams.area = item.id;
        let request = this.myDB.db
          .transaction(["seat"], "readwrite")
          .objectStore("seat")
          .add(this.seatParams);
        request.onsuccess = e => {
          this.showSeatDialog = false;
          this.getSeatsByArea(item.id);
          this.showMessage(
            `区域 ${this.activeAreaTab} 座位编号 ${this.seatParams.number} 添加成功`,
            "success"
          );
        };
        request.onerror = e => {
          this.showMessage("座位数据写入失败,请联系管理员");
        };
      }
    },
    // 获取指定区域座位
    getSeatsByArea(area) {
      let request = this.myDB.db
        .transaction(["seat"])
        .objectStore("seat")
        .getAll();
      request.onsuccess = e => {
        let tempData = request.result.filter(e => {
          return e.area === area;
        });
        for (let i = 0; i < tempData.length; i++) {
          if (tempData[i].occupy) {
            if (
              tempData[i].endTime < Date.parse(new Date().toLocaleDateString())
            ) {
              // 过期座位
              let params = { ...this.seatParams };
              params.number = tempData[i].number;
              params.area = tempData[i].area;
              params.id = tempData[i].id;
              let request = this.myDB.db
                .transaction(["seat"], "readwrite")
                .objectStore("seat")
                .put(params);
              request.onsuccess = e => {
                if (request.result) {
                  // 读取指定区域座位
                  let item = this.areaData.find(e => {
                    return e.name === this.activeAreaTab;
                  });
                  this.getSeatsByArea(item.id);
                }
              };
              request.onerror = e => {
                this.showMessage("座位信息更新失败,请联系管理员");
              };
            }
          }
        }
        this.currentAreaSeats = tempData;
      };
      request.onerror = e => {
        this.showMessage("座位数据获取失败,请联系管理员");
      };
    },
    // 用户
    // 添加新用户
    addNewUser() {
      this.userParams = { ...params.userParams };
      this.showUserDialog = true;
    },
    createUser(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let request = this.myDB.db
            .transaction(["user"], "readwrite")
            .objectStore("user")
            .add(this.userParams);
          request.onsuccess = e => {
            this.showUserDialog = false;
            this.getAllUsers();
            this.showMessage(
              `用户 ${this.userParams.name} 添加成功`,
              "success"
            );
          };
          request.onerror = e => {
            this.showMessage("用户数据写入失败,请联系管理员");
          };
        } else {
          return false;
        }
      });
    },
    // 获取所有
    getAllUsers() {
      let request = this.myDB.db
        .transaction(["user"])
        .objectStore("user")
        .getAll();
      request.onsuccess = e => {
        this.userListData = request.result;
      };
      request.onerror = e => {
        this.showMessage("用户信息读取失败,请联系管理员");
      };
    },
    // 座位分区
    // 获取区域
    getAreaData() {
      let request = this.myDB.db
        .transaction(["area"])
        .objectStore("area")
        .getAll();
      request.onsuccess = e => {
        this.areaData = request.result;
        if (this.areaData.length > 0) {
          this.activeAreaTab = this.areaData[0].name;
          // 读取指定区域座位
          let item = this.areaData.find(e => {
            return e.name === this.activeAreaTab;
          });
          this.getSeatsByArea(item.id);
        }
      };
      request.onerror = e => {
        this.showMessage("区域信息读取失败,请联系管理员");
      };
    },
    // 添加、删除区域
    addNewArea(targetName, action) {
      if (action === "add") {
        this.areaParams = { ...params.areaParams };
        this.showAreaDialog = true;
      } else if (action === "remove") {
        this.$confirm("此操作将永久删除该区域, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let item = this.areaData.find(e => {
              return e.name === targetName;
            });
            let request = this.myDB.db
              .transaction(["area"], "readwrite")
              .objectStore("area")
              .delete(item.id);
            request.onsuccess = e => {
              this.getAreaData();
              this.showMessage(`区域 ${item.name} 删除成功`, "success");
            };
            request.onerror = e => {
              this.showMessage("区域信息删除失败,请联系管理员");
            };
          })
          .catch(() => {
            console.log("cancel");
          });
      }
    },
    createArea() {
      if (this.areaParams.name) {
        let request = this.myDB.db
          .transaction(["area"], "readwrite")
          .objectStore("area")
          .add(this.areaParams);
        request.onsuccess = e => {
          this.showAreaDialog = false;
          this.getAreaData();
          this.showMessage(
            `新区域 ${this.areaParams.name} 添加成功`,
            "success"
          );
        };
        request.onerror = e => {
          this.showMessage("区域数据写入失败,请联系管理员");
        };
      }
    },
    // 切换区域
    selectArea(tab) {
      this.activeAreaTab = this.areaData[tab.index].name;
      let area = this.areaData[tab.index].id;
      this.getSeatsByArea(area);
    },
    // 打开数据库
    openDB(name, version) {
      var version = version || 1;
      var request = window.indexedDB.open(name, version);
      request.onerror = e => {
        console.log(e.currentTarget.error.message);
        this.$showMessage("连接数据库失败,请联系管理员");
      };
      request.onsuccess = e => {
        this.myDB.db = e.target.result;
        // 读取区域
        this.getAreaData(this.myDB.db, "area");
        // 读取用户
        this.getAllUsers();
      };
      request.onupgradeneeded = e => {
        let db = e.target.result;
        // 新建区域数据表
        if (!db.objectStoreNames.contains("area")) {
          var store = db.createObjectStore("area", {
            keyPath: "id",
            autoIncrement: true
          });
          // 区域名&编号-唯一
          store.createIndex("nameIndex", "name", { unique: true });
        }
        // 新建座位数据表
        if (!db.objectStoreNames.contains("seat")) {
          var store = db.createObjectStore("seat", {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("numberIndex", "number", { unique: true }); //座位编号
          store.createIndex("areaIndex", "area", { unique: false }); //所属区域
          store.createIndex("occupyIndex", "occupy", { unique: false }); //是否使用
          store.createIndex("userIndex", "user", { unique: false }); //使用者
          store.createIndex("userIdCardIndex", "userIdCard", { unique: true }); //座位使用者身份证
          store.createIndex("startTimeIndex", "startTime", { unique: false }); //占用开始时间
          store.createIndex("endTimeIndex", "endTime", { unique: false }); //占用结束时间
        }
        // 新建用户数据表
        if (!db.objectStoreNames.contains("user")) {
          var store = db.createObjectStore("user", {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("nameIndex", "name", { unique: false }); //姓名
          store.createIndex("idCardIndex", "idCard", { unique: true }); //身份证
          store.createIndex("birthIndex", "birth", { unique: false }); //生日
          store.createIndex("phoneIndex", "phone", { unique: false }); //电话
          store.createIndex("majorIndex", "major", { unique: false }); //本专业
          store.createIndex("studyIndex", "study", { unique: false }); //研究专业
          store.createIndex("rentIndex", "rent", { unique: false }); //租金
          store.createIndex("depositIndex", "deposit", { unique: false }); //押金
          store.createIndex("areaIndex", "area", { unique: false }); //区域
          store.createIndex("seatIndex", "seat", { unique: false }); //座位
        }
      };
    },
    showMessage(message, type = "warning") {
      return this.$message({
        type,
        message,
        showClose: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// common
.dialog-foot {
  display: flex;
  justify-content: center;
}
.mini-input {
  width: 140px;
}
.normal-input {
  width: 220px;
}
.content {
  display: flex;
  .card {
    margin: 5px;
    .seat-list {
      display: flex;
      flex-wrap: wrap;
      .item {
        box-sizing: border-box;
        width: 180px;
        height: 180px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        margin: 0 10px 10px 0;
        padding: 5px;
      }
      .new-seat {
        font-size: 36px;
        text-align: center;
        line-height: 170px;
        color: #8c939d;
      }
    }
  }
  .users {
    width: 300px;
    margin-right: 0;
    .user-list {
      .item {
        margin-top: 5px;
        padding: 5px 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #ebeef5;
      }
    }
  }
  .seats {
    flex: 1;
  }
}
</style>