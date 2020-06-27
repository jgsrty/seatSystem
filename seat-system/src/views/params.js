export default {
  // 区域参数
  areaParams: {
    name: '',  //区域名
  },
  // 座位参数
  seatParams: {
    number: '',  //座位编号
    area: '',  //座位所属区域
    occupy: false,  //座位是否占用
    user: '',  //座位使用者
    userIdCard: '',  //座位使用者身份证
    startTime: '',  //座位占用开始时间
    endTime: '',  //座位占用结束时间
  },
  // 用户参数
  userParams: {
    name: '',//姓名
    idCard: '',//身份证
    birth: '',//生日
    phone: '',//电话
    major: '',//本专业
    study: '',//研究专业
    rent: '',//租金
    deposit: '',//押金
    history:[],
  },
  // 关联座位参数
  relateSeatParams: {
    timeRange: '',  //时间区间
    user: '', //座位使用者
    userIdCard: '',  //座位使用者身份证
  },
  // 用户参数验证
  userParamsRules: {
    name: [
      { required: true, message: '请输入用户姓名', trigger: 'blur' },
    ],
    idCard: [
      { required: true, message: '请输入身份证号码', trigger: 'blur' },
      { pattern: /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/, message: '请输入正确身份证号码' }
    ],
    birth: [
      { type: 'date', required: true, message: '请选择生日', trigger: 'change' }
    ],
    // phone: [
    //   { required: true, message: '请输入电话', trigger: 'blur' },
    // ],
    rent: [
      { required: true, message: '请输入租金', trigger: 'blur' },
    ],
    deposit: [
      { required: true, message: '请输入押金', trigger: 'blur' },
    ],
  },
  // 时间快捷键
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now() -(8.64e7*2);
    },
    shortcuts: [{
      text: '三天',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 3);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      text: '三十天',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }]
  },
}