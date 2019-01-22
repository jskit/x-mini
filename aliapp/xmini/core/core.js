// const globalConfig = {};

function copy(v = '') {
  return JSON.parse(JSON.stringify(v));
}

class Core {
  constructor(config = {}, isGlobal) {
    this.config = config;
    // if (isGlobal) {
    //   this.setGlobalConfig(config);
    //   this.setConfig = this.setGlobalConfig;
    //   this.getConfig = this.getGlobalConfig;
    // }
  }

  getConfig(key) {
    return copy(key ? this.config[key] : this.config);
  }

  setConfig(newConfig = {}) {
    return Object.assign(this.config, newConfig);
  }

  // getGlobalConfig() {
  //   console.warn('get global config:');
  //   return { ...globalConfig };
  // }

  // setGlobalConfig(newConfig = {}) {
  //   console.warn('set global config:');
  //   return Object.assign(globalConfig, newConfig);
  // }

  // installPlugin(pluginId, plugin) {
  //   uninstallPlugin(pluginId);
  //   this.pluginList[pluginId] = plugin;
  //   plugin.install();
  // }

  // uninstallPlugin(pluginId) {
  //   const temp = this.pluginList[pluginId];
  //   if (this.pluginList[pluginId]) {
  //     temp.uninstall();
  //   }
  // }

  // invokeMethod(method, params) {
  //   let list = [];
  //   for (const core in this.pluginList) {
  //     const result = core.invokeMethod(method, params);
  //     if (result.handled) {
  //       result.pluginId = core;
  //       console.log('==========');
  //       list.push(result);
  //       break;
  //     }
  //   }
  //   return list;
  // }

  // invoke(id, method, params) {
  //   const plugin = this.pluginList[id];
  //   if (!plugin) {
  //     return {
  //       handled: false,
  //     };
  //   }
  //   return plugin.invokeMethod(method, params);
  // }

  // install() {}
  // uninstall() {}
}

// const core = new Core();

export default Core;
