import PluginBase from '../../core/plugin-base';
import xmini from '../../core/xmini';
import { emitter } from '../../utils/index';

function workspaceInit() {}

/**
 * 负责实现数据收集
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'stat';
  events = {
    preAppOnError: 'preAppOnError',
    preAppOnLaunch: 'preAppOnLaunch',
    preAppOnShow: 'preAppOnShow',
    preAppOnHide: 'preAppOnHide',
    preAppOnUnlaunch: 'preAppOnUnlaunch',
    prePageOnLoad: 'prePageOnLoad',
    prePageOnReady: 'prePageOnReady',
    prePageOnShow: 'prePageOnShow',
    prePageOnHide: 'prePageOnHide',
    prePageOnUnload: 'prePageOnUnload',
  };
  methods = {
    // getStatData: 'getData',
  };
  _data = {};
  constructor(config) {
    super(config);
  }
  setData(options = {}) {
    emitter.emit('stat_update', { ...options }, this);
    Object.assign(this._data, options);
  }
  getData(key) {
    return key ? this._data[key] : { ...this._data };
  }
  log(type, action, value) {
    // 数据类型，app page component event
    // 每触发一次抛出一次数据，数据可以被其他插件接收（通过特定的形式）
    // 不同的触发，产生的数据也不同，需要按类别进行过滤处理
    // 参考百度统计，输出规范化的数据
    // _hmt.push(['_trackPageview', pageURL]);
    // _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    // _hmt.push(['_setCustomVar', index, name, value, opt_scope]);
    // _hmt.push(['_setAccount', siteId);
    // _hmt.push(['_setAutoPageview', false]);

    // _trackPageview, pageURL
    // _trackEvent, category, action, value
    // _setCustomVar, index, name, value
    let temp = this.getData();
    // 触发 更新 事件 以及 log
    switch(type) {
      case 'event':
      case 'app':
      case 'page':
        emitter.emit('log', {
          type,
          action,
          value,
        }, this);
        break;
      default:
        emitter.emit('log', {
          type,
          action,
          value,
        }, this);
        // do nothing...
    }
  }
  preAppOnError(err) {
    let count = this.getData('mini_error_count') || 0;
    this.setData({
      mini_error_count: count + 1,
    });
    this.log('app', 'error', JSON.stringify(err));
    // emitter.emit('stat', ['_trackEvent', 'error_message', JSON.stringify(err)], this);
  }
  preAppOnLaunch(options) {
    workspaceInit();
    const that = this;

    // 初始化
    this.setData({
      mini_uuid: xmini.me.$getUUID(),
      mini_timestamp: Date.now(),
      mini_showtime: Date.now(),
      mini_duration: 0,
      mini_error_count: 0,
      mini_page_count: 1,
      mini_first_page: 0,
      mini_showoption: options,
      // launchTimes++ ?
    });

    // 异步获取网络以及定位相关信息
    xmini.me.getNetworkType({
      success(res) {
        that.setData({
          mini_network_type: res.networkType || 'no_name',
        });
      },
      fail(err) {
        that.setData({
          mini_network_type: 'fail',
        });
      },
    });
    xmini.me.$getLocation(res => {
      this.setData({
        mini_lat: res.latitude || 0,
        mini_lng: res.longitude || 0,
        mini_speed: res.speed || 0,
      });
    });
    // 同步获取系统信息
    const systemInfo = xmini.me.$getSystemInfo();
    this.setData({
      // mini_platform: systemInfo['platform'], // 平台、终端
      mini_os: systemInfo['platform'], // 客户端平台 Android iOS
      mini_os_version: systemInfo['system'], // 操作系统版本
      mini_host: systemInfo['app'] || 'wechat', // 当前运行的客户端 alipay wechat
      mini_host_version: systemInfo['version'], // 宿主版本号
      mini_sdk_version: systemInfo['SDKVersion'] || '1.0.0', // 客户端基础库版本
      mini_language: systemInfo['language'], // 设置的语言
      mini_phone_brand: systemInfo['brand'], // 手机品牌
      mini_phone_model: systemInfo['model'], // 手机型号
      mini_pixel_ratio: systemInfo['pixelRatio'], // 设备像素比
      mini_screen_width: systemInfo['screenWidth'], // 屏幕宽高
      mini_screen_height: systemInfo['screenHeight'],
      mini_window_width: systemInfo['windowWidth'], // 可使用窗口宽高
      mini_window_height: systemInfo['windowHeight'],
    });
    // 用户信息，需要业务设定，登录后有
    // getUserInfo();

    this.log('app', 'launch');
  }
  preAppOnShow(options = {}) {
    this.setData({
      mini_showtime: Date.now(),
      mini_showoption: options,
      // showTimes++ ？
    });
    if (options['shareTicket']) {

    }
    // 上报启动时长(注意保活)
    // this.log('event', '启动时长', Date.now() - )
    // log('app', 'show');
  }
  preAppOnHide() {
    this.setData({
      mini_duration: Date.now() - this.getData('mini_showtime'),
    });
    // if (this.mini_is_first_open) this.mini_is_first_open = false;
    this.log('app', 'hide');
  }
  preAppOnUnlaunch() {
    this.setData({
      mini_duration: Date.now() - this.getData('mini_showtime'),
    });
    this.log('app', 'unLaunch');
  }

  prePageOnLoad(query = {}) {
    this.setData({
      mini_page_query: query,
    });
    this.log('page', 'load');
  }
  prePageOnReady() {
    this.log('page', 'ready');
  }
  prePageOnShow(opts = {}, ctx) {
    this.setData({
      mini_page_count: this.getData('mini_page_count') + 1,
      mini_start_time: 0,
      mini_last_page: ctx.route,
    });
    this.log('page', 'show');
  }
  prePageOnHide() {
    this.log('page', 'hide');
  }
  prePageOnUnload() {
    this.log('page', 'unload');
  }
}

export default Plugin;
