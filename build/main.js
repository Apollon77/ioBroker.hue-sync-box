"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_object_definition = require("./lib/object_definition");
class HueSyncBox extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "hue-sync-box"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.rooms = [];
  }
  async onReady() {
    this.setState("info.connection", false, true);
    await this.createStates();
  }
  async createStates() {
    try {
      this.writeLog(`initializing Object creation`, false, "debug");
      const devices = this.config.devices;
      for (const device of devices) {
        this.writeLog(`creating device with Name  bax_${device.room}`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}`, {
          type: "device",
          common: {
            name: device.room
          },
          native: {}
        });
        this.writeLog(`creating channel and states for device`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}.device`, {
          type: "channel",
          common: {
            name: "device"
          },
          native: {}
        });
        for (const key in import_object_definition.deviceChannelObj) {
          if (import_object_definition.deviceChannelObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.device.${key}`, import_object_definition.deviceChannelObj[key]);
          }
        }
        for (const key in import_object_definition.deviceStateObj) {
          if (import_object_definition.deviceStateObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.device.${key}`, import_object_definition.deviceStateObj[key]);
          }
        }
        for (const key in import_object_definition.networkObj) {
          if (import_object_definition.networkObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.device.wifi.${key}`, import_object_definition.networkObj[key]);
          }
        }
        for (const key in import_object_definition.updateObj) {
          if (import_object_definition.updateObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.device.update.${key}`, import_object_definition.updateObj[key]);
          }
        }
        for (const key in import_object_definition.capabilitiesObj) {
          if (import_object_definition.capabilitiesObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(
              `box_${device.room}.device.capabilities.${key}`,
              import_object_definition.capabilitiesObj[key]
            );
          }
        }
        this.writeLog(`creating channel and states for hue`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}.hue`, {
          type: "channel",
          common: {
            name: "hue"
          },
          native: {}
        });
        for (const key in import_object_definition.hueChannelObj) {
          if (import_object_definition.hueChannelObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.hue.${key}`, import_object_definition.hueChannelObj[key]);
          }
        }
        for (const key in import_object_definition.hueObj) {
          if (import_object_definition.hueObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.hue.${key}`, import_object_definition.hueObj[key]);
          }
        }
        for (const key in import_object_definition.groupsObj) {
          if (import_object_definition.groupsObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.hue.groups.${key}`, import_object_definition.groupsObj[key]);
          }
        }
        this.writeLog(`creating channel and states for execution`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}.execution`, {
          type: "channel",
          common: {
            name: "execution"
          },
          native: {}
        });
        for (const key in import_object_definition.executionChannelObj) {
          if (import_object_definition.executionChannelObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(
              `box_${device.room}.execution.${key}`,
              import_object_definition.executionChannelObj[key]
            );
          }
        }
        for (const key in import_object_definition.executionObj) {
          if (import_object_definition.executionObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.execution.${key}`, import_object_definition.executionObj[key]);
          }
        }
        const array = ["game", "music", "video"];
        for (const key in import_object_definition.video_game_musicObj) {
          for (const arrayKey in array) {
            if (import_object_definition.video_game_musicObj.hasOwnProperty(key)) {
              await this.setObjectNotExistsAsync(
                `box_${device.room}.execution.${array[arrayKey]}.${key}`,
                import_object_definition.video_game_musicObj[key]
              );
            }
          }
        }
        this.writeLog(`creating channel and states for hdmi`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}.hdmi`, {
          type: "channel",
          common: {
            name: "hdmi"
          },
          native: {}
        });
        for (const key in import_object_definition.hdmiChannelObj) {
          if (import_object_definition.hdmiChannelObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.${key}`, import_object_definition.hdmiChannelObj[key]);
          }
        }
        for (const key in import_object_definition.hdmiObj) {
          if (import_object_definition.hdmiObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.${key}`, import_object_definition.hdmiObj[key]);
          }
        }
        for (const key in import_object_definition.hdmiInputObj) {
          if (import_object_definition.hdmiInputObj.hasOwnProperty(key)) {
            for (let i = 1; i < 5; i++) {
              await this.setObjectNotExistsAsync(
                `box_${device.room}.hdmi.input${i}.${key}`,
                import_object_definition.hdmiInputObj[key]
              );
            }
          }
          await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.output.${key}`, import_object_definition.hdmiInputObj[key]);
        }
        this.writeLog(`creating channel and states for behavior`, false, "debug");
        await this.setObjectNotExistsAsync(`box_${device.room}.behavior`, {
          type: "channel",
          common: {
            name: "behavior"
          },
          native: {}
        });
        for (const key in import_object_definition.behaviorChannelObj) {
          if (import_object_definition.behaviorChannelObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(
              `box_${device.room}.behavior.${key}`,
              import_object_definition.behaviorChannelObj[key]
            );
          }
        }
        for (const key in import_object_definition.behaviorObj) {
          if (import_object_definition.behaviorObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${device.room}.behavior.${key}`, import_object_definition.behaviorObj[key]);
          }
        }
        for (const key in import_object_definition.behaviorInputObj) {
          if (import_object_definition.behaviorInputObj.hasOwnProperty(key)) {
            for (let i = 1; i < 5; i++) {
              await this.setObjectNotExistsAsync(
                `box_${device.room}.behavior.input${i}.${key}`,
                import_object_definition.behaviorInputObj[key]
              );
            }
          }
        }
      }
      this.writeLog(`all device / channel and states were created`, false, "debug");
    } catch (error) {
      this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, false, "error");
    }
  }
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      callback();
    }
  }
  writeLog(logtext, consoleLog, logtype) {
    try {
      if (logtype === "silly")
        this.log.silly(logtext);
      if (logtype === "info")
        this.log.info(logtext);
      if (logtype === "debug")
        this.log.debug(logtext);
      if (logtype === "warn")
        this.log.warn(logtext);
      if (logtype === "error")
        this.log.error(logtext);
      if (consoleLog)
        console.log(logtext);
    } catch (error) {
      this.log.error(`writeLog error: ${error} , stack: ${error.stack}`);
    }
  }
  async onStateChange(id, state) {
    if (state) {
      console.log("state: ", state.val);
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      if (id === this.namespace + ".testVariable") {
        await this.createStates();
        console.log("testVariable changed");
      }
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new HueSyncBox(options);
} else {
  (() => new HueSyncBox())();
}
//# sourceMappingURL=main.js.map
