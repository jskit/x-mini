const {
  setStorage,
  // setStorageSync,
  // getStorage,
  getStorageSync,
  removeStorage,
  // removeStorageSync,
  clearStorage,
  // clearStorageSync,
  getStorageInfo,
  // getStorageInfoSync,
} = typeof my !== 'undefined' ? my : wx;

// const noop = () => {};
// let inited;
// 数据都存在这里
let storageData = {};
// let me = {};

// wxapp 本地数据存储的大小限制为 10MB
// 把业务数据和系统数据分离

let i = 1;
export class Storage {
  constructor(store = 'x-mini', time = 600) {
    this.store = store || `store-${i++}`;
    this._time = (Number.isInteger(time) && time > 0) ? time : 600;

    let data = {};
    if (typeof my !== 'undefined') {
      // aliapp
      data = getStorageSync({ key: this.store }).data || {};
    } else if (typeof my !== 'undefined') {
      // wxapp
      data = getStorageSync(this.store) || {};
    }
    storageData[this.store] = data;
  }
  set(key, value, time = 0) {
    // 单位秒，默认 10 分钟，-1表示一年
    if (time) time = this._time;
    const timeout = Date.now() - 1 + time * 1000;
    console.log(timeout);
    const data = {
      value,
      timeout,
    };
    Object.assign(storageData[this.store], {
      [`${key}`]: data,
    });
    // console.log(JSON.stringify(storageData[this.store]));
    setStorage({
      key: this.store,
      data: storageData[this.store],
      success(res) {
        console.log('数据缓存成功');
        console.log(res);
      },
    });
  }
  get(key) {
    if (!key) return;
    const temp = storageData[this.store][key] || {};
    // 缓存不存在
    if (!temp.timeout || !temp.value) return null;
    const now = Date.now();
    if (temp.timeout && temp.timeout < now) {
      // 缓存过期
      this.remove(key);
      return '';
    }
    return temp.value;
  }
  remove(key) {
    if (!key) return;
    delete storageData[this.store][key];
    setStorage({
      key: this.store,
      data: storageData[this.store],
      success(res) {},
    });
    // removeStorage({
    //   key,
    // });
  }
  clear(bool) {
    if (!(bool === true)) {
      storageData[this.store] = {};
      return removeStorage({
        key: this.store,
      });
    } else {
      storageData = {};
      clearStorage();
    }
  }
  getStorageInfo() {
    return getStorageInfo();
  }
}

export const storage = new Storage();

// 系统相关
export const storageSystem = new Storage('system', 31536000);

// 统计数据
export const storageStat = new Storage('stat', 31536000);
