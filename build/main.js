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
var https = __toESM(require("https"));
var import_axios = __toESM(require("axios"));
var import_replaceFunktion = require("./lib/replaceFunktion");
class HueSyncBox extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "hue-sync-box"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.timer = null;
  }
  async onReady() {
    this.setState("info.connection", false, true);
    await this.request();
  }
  async request() {
    try {
      for (const devicesKey in this.config.devices) {
        if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
          const device = this.config.devices[devicesKey];
          const result = await this.apiCall(`http://${device.ip}/api/v1`, device.token, "GET");
          if (result) {
            await this.createStates(device, result);
            await this.writeState(result, Number(devicesKey));
          }
        }
      }
      if (this.timer)
        clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.request();
      }, 15e3);
    } catch (error) {
      this.writeLog(
        `request error: ${error} , stack: ${error.stack}`,
        "error",
        true,
        `request error: ${error} , stack: ${error.stack}`
      );
    }
  }
  async writeState(result, key) {
    try {
      for (const [resultKey, resultValue] of Object.entries(result)) {
        if (typeof resultValue === "object") {
          for (const [valueKey, value] of Object.entries(resultValue)) {
            if (typeof value !== "object") {
              if (resultKey !== "ir" && resultKey !== "registrations" && resultKey !== "presets") {
                await this.setStateAsync(
                  `box_${await (0, import_replaceFunktion.replaceFunktion)(
                    this.config.devices[key].room
                  )}.${resultKey}.${valueKey}`,
                  {
                    val: value,
                    ack: true
                  }
                );
              }
            } else {
              if (resultKey !== "ir" && resultKey !== "registrations" && resultKey !== "presets") {
                for (const value1Key in value) {
                  const valueObjKey = value1Key;
                  if (Object.prototype.hasOwnProperty.call(value, valueObjKey)) {
                    if (resultKey === "hue") {
                      for (const [hueGroupKey, hueGroupValue] of Object.entries(
                        value[valueObjKey]
                      )) {
                        await this.setStateAsync(
                          `box_${await (0, import_replaceFunktion.replaceFunktion)(
                            this.config.devices[key].room
                          )}.${resultKey}.${valueKey}.${valueObjKey}.${hueGroupKey}`,
                          {
                            val: hueGroupValue,
                            ack: true
                          }
                        );
                      }
                    } else {
                      await this.setStateAsync(
                        `box_${await (0, import_replaceFunktion.replaceFunktion)(
                          this.config.devices[key].room
                        )}.${resultKey}.${valueKey}.${valueObjKey}`,
                        {
                          val: value[valueObjKey],
                          ack: true
                        }
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      this.writeLog(
        `writeState error: ${error} , stack: ${error.stack}`,
        "error",
        true,
        `writeState error: ${error} , stack: ${error.stack}`
      );
    }
  }
  async apiCall(url, token, method, data) {
    try {
      const config = {
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        data
      };
      const response = await (0, import_axios.default)(config);
      this.writeLog(`response: ${JSON.stringify(response.data)}`, "debug", false, response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.writeLog(
            `error: ${error.response.status} ${error.response.message} - Authentication failed`,
            "error",
            true,
            `error: ${error.response.status} ${error.response.message} - Authentication failed`
          );
          return;
        } else if (error.response.status === 404) {
          this.writeLog(
            `error: ${error.response.status} ${error.response.message} - Invalid URL Path`,
            "error",
            true,
            `error: ${error.response.status} ${error.response.message} - Invalid URL Path`
          );
          return;
        } else if (error.response.status === 500) {
          this.writeLog(
            `error: ${error.response.status} ${error.response.message} - internal server error`,
            "error",
            true,
            `error: ${error.response.status} ${error.response.message} - internal server error`
          );
          return;
        } else {
          this.writeLog(`error: ${error}`, "error", true, `error: ${error}`);
          return;
        }
      } else {
        this.writeLog(
          `error Type ${error.name} error: ${error.code} Message: ${error.message}`,
          "error",
          true,
          error
        );
      }
    }
  }
  async createStates(device, result) {
    try {
      this.writeLog(`initializing Object creation`, "debug", false);
      if (!device)
        return this.writeLog(`No devices configured`, "warn", false);
      const room = await (0, import_replaceFunktion.replaceFunktion)(device.room);
      this.writeLog(`creating device with Name  bax_${await (0, import_replaceFunktion.replaceFunktion)(room)}`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${await (0, import_replaceFunktion.replaceFunktion)(room)}`, {
        type: "device",
        common: {
          name: room
        },
        native: {}
      });
      this.writeLog(`creating channel and states for device`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${await (0, import_replaceFunktion.replaceFunktion)(room)}.device`, {
        type: "channel",
        common: {
          name: "device"
        },
        native: {}
      });
      for (const key in import_object_definition.deviceChannelObj) {
        if (import_object_definition.deviceChannelObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.${key}`, import_object_definition.deviceChannelObj[key]);
        }
      }
      for (const key in import_object_definition.deviceStateObj) {
        if (import_object_definition.deviceStateObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.${key}`, import_object_definition.deviceStateObj[key]);
        }
      }
      for (const key in import_object_definition.networkObj) {
        if (import_object_definition.networkObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.wifi.${key}`, import_object_definition.networkObj[key]);
        }
      }
      for (const key in import_object_definition.updateObj) {
        if (import_object_definition.updateObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.update.${key}`, import_object_definition.updateObj[key]);
        }
      }
      for (const key in import_object_definition.capabilitiesObj) {
        if (import_object_definition.capabilitiesObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.capabilities.${key}`, import_object_definition.capabilitiesObj[key]);
        }
      }
      this.writeLog(`creating channel and states for hue`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${room}.hue`, {
        type: "channel",
        common: {
          name: "hue"
        },
        native: {}
      });
      for (const key in import_object_definition.hueChannelObj) {
        if (import_object_definition.hueChannelObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.hue.${key}`, import_object_definition.hueChannelObj[key]);
        }
      }
      for (const key in import_object_definition.hueObj) {
        if (import_object_definition.hueObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.hue.${key}`, import_object_definition.hueObj[key]);
        }
      }
      for (const groupKey in result.hue.groups) {
        for (const key in import_object_definition.groupsObj) {
          if (import_object_definition.groupsObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${room}.hue.groups.${groupKey}.${key}`, import_object_definition.groupsObj[key]);
          }
        }
      }
      this.writeLog(`creating channel and states for execution`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${room}.execution`, {
        type: "channel",
        common: {
          name: "execution"
        },
        native: {}
      });
      for (const key in import_object_definition.executionChannelObj) {
        if (import_object_definition.executionChannelObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.execution.${key}`, import_object_definition.executionChannelObj[key]);
        }
      }
      for (const key in import_object_definition.executionObj) {
        if (import_object_definition.executionObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.execution.${key}`, import_object_definition.executionObj[key]);
        }
      }
      const array = ["game", "music", "video"];
      for (const arrayKey in array) {
        if (array.hasOwnProperty(arrayKey)) {
          if (array[arrayKey] !== "music") {
            for (const key in import_object_definition.video_gameObj) {
              if (import_object_definition.video_gameObj.hasOwnProperty(key)) {
                await this.setObjectNotExistsAsync(
                  `box_${room}.execution.${array[arrayKey]}.${key}`,
                  import_object_definition.video_gameObj[key]
                );
              }
            }
          } else {
            for (const key in import_object_definition.musicObj) {
              if (import_object_definition.musicObj.hasOwnProperty(key)) {
                await this.setObjectNotExistsAsync(
                  `box_${room}.execution.${array[arrayKey]}.${key}`,
                  import_object_definition.musicObj[key]
                );
              }
            }
          }
        }
      }
      this.writeLog(`creating channel and states for hdmi`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${room}.hdmi`, {
        type: "channel",
        common: {
          name: "hdmi"
        },
        native: {}
      });
      for (const key in import_object_definition.hdmiChannelObj) {
        if (import_object_definition.hdmiChannelObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.hdmi.${key}`, import_object_definition.hdmiChannelObj[key]);
        }
      }
      for (const key in import_object_definition.hdmiObj) {
        if (import_object_definition.hdmiObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.hdmi.${key}`, import_object_definition.hdmiObj[key]);
        }
      }
      for (const key in import_object_definition.hdmiInputObj) {
        if (import_object_definition.hdmiInputObj.hasOwnProperty(key)) {
          for (let i = 1; i < 5; i++) {
            await this.setObjectNotExistsAsync(`box_${room}.hdmi.input${i}.${key}`, import_object_definition.hdmiInputObj[key]);
          }
        }
        await this.setObjectNotExistsAsync(`box_${room}.hdmi.output.${key}`, import_object_definition.hdmiInputObj[key]);
      }
      this.writeLog(`creating channel and states for behavior`, "debug", false);
      await this.setObjectNotExistsAsync(`box_${room}.behavior`, {
        type: "channel",
        common: {
          name: "behavior"
        },
        native: {}
      });
      for (const key in import_object_definition.behaviorChannelObj) {
        if (import_object_definition.behaviorChannelObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.behavior.${key}`, import_object_definition.behaviorChannelObj[key]);
        }
      }
      for (const key in import_object_definition.behaviorObj) {
        if (import_object_definition.behaviorObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.behavior.${key}`, import_object_definition.behaviorObj[key]);
        }
      }
      for (const key in import_object_definition.behaviorInputObj) {
        if (import_object_definition.behaviorInputObj.hasOwnProperty(key)) {
          for (let i = 1; i < 5; i++) {
            await this.setObjectNotExistsAsync(
              `box_${room}.behavior.input${i}.${key}`,
              import_object_definition.behaviorInputObj[key]
            );
          }
        }
      }
      this.subscribeForeignStates("0_userdata.0.example_state");
      this.writeLog(`all device / channel and states were created`, "debug", false);
    } catch (error) {
      this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, "error", false);
    }
  }
  onUnload(callback) {
    try {
      if (this.timer)
        clearTimeout(this.timer);
      callback();
    } catch (e) {
      callback();
    }
  }
  writeLog(logtext, logtype, consoleLog, consoleLogMessage) {
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
        console.log(consoleLogMessage);
    } catch (error) {
      this.log.error(`writeLog error: ${error} , stack: ${error.stack}`);
    }
  }
  async onStateChange(id, state) {
    if (state) {
      console.log("state: ", state.val);
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      if (id === "0_userdata.0.example_state") {
        console.log("testVariable changed");
        for (const devicesKey in this.config.devices) {
          if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
            const device = this.config.devices[devicesKey];
            await this.apiCall(`http://${device.ip}/api/v1`, device.token, "GET");
          }
        }
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
