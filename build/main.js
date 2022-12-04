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
    this.requestTimer = null;
    this.subscribedStates = [];
    this.createdData = false;
  }
  async onReady() {
    this.setState("info.connection", false, true);
    this.createdData = false;
    await this.request();
  }
  async request() {
    try {
      for (const devicesKey in this.config.devices) {
        if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
          const device = this.config.devices[devicesKey];
          const result = await this.apiCall(`https://${device.ip}/api/v1`, device.token, "GET");
          if (result.status === 200) {
            this.writeLog("create data", "debug");
            await this.createStates(device, result);
            this.createdData = true;
            this.setState("info.connection", true, true);
            await this.writeState(result, Number(devicesKey));
          }
        }
      }
      if (this.requestTimer)
        clearTimeout(this.requestTimer);
      this.requestTimer = setTimeout(async () => {
        await this.request();
      }, 15e3);
    } catch (error) {
      this.writeLog(`request error: ${error} , stack: ${error.stack}`, "error");
    }
  }
  async writeState(result, key) {
    try {
      const data = result.data;
      if (data === void 0) {
        this.writeLog("no data received", "error");
        return;
      }
      this.writeLog(`prepare to write the data for ${this.config.devices[key].room}`, "debug");
      for (const [resultKey, resultValue] of Object.entries(data)) {
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
      this.writeLog(`all data for ${this.config.devices[key].room} written`, "debug");
    } catch (error) {
      this.writeLog(`writeState error: ${error} , stack: ${error.stack}`, "error");
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
      this.writeLog(`response: ${JSON.stringify(response.data)}`, "debug");
      return response;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.writeLog(`error: ${error.response.status} ${error.message} - Authentication failed`, "error");
          return error.response;
        } else if (error.response.status === 404) {
          this.writeLog(`error: ${error.response.status} ${error.message} - Invalid URL Path`, "error");
          return error.response;
        } else if (error.response.status === 500) {
          this.writeLog(`error: ${error.response.status} ${error.message} - internal server error`, "error");
          return;
        } else {
          this.writeLog(`error: ${error}`, "error");
          return error.response;
        }
      } else {
        this.writeLog(`error Type ${error.name} error: ${error.code} Message: ${error.message}`, "error");
      }
    }
  }
  async sendCommand(id, state) {
    try {
      this.writeLog(`prepare to send the command for ${id}`, "debug");
      const room = id.split(".")[0].replace("box_", "");
      const channel = id.split(".")[1];
      const channel2 = id.split(".")[2];
      const channel3 = id.split(".")[3];
      const commandWord = id.split(".").pop();
      const boxConfig = this.config.devices.find(
        async (boxConfig2) => await (0, import_replaceFunktion.replaceFunktion)(boxConfig2.room) === room
      );
      this.writeLog(`get the boxConfig: ${JSON.stringify(boxConfig)}`, "debug");
      if (!boxConfig) {
        this.writeLog(`no boxConfig found for ${room}`, "error");
        return;
      }
      let url;
      if (channel3 !== void 0) {
        if (commandWord === channel3) {
          url = `https://${boxConfig == null ? void 0 : boxConfig.ip}/api/v1/${channel}/${channel2}`;
        } else {
          url = `https://${boxConfig == null ? void 0 : boxConfig.ip}/api/v1/${channel}/${channel2}/${channel3}`;
        }
      } else {
        if (commandWord === channel2) {
          url = `https://${boxConfig == null ? void 0 : boxConfig.ip}/api/v1/${channel}`;
        } else {
          url = `https://${boxConfig == null ? void 0 : boxConfig.ip}/api/v1/${channel}/${channel2}`;
        }
      }
      this.writeLog(`assemble the url ${url}`, "debug");
      this.writeLog(`send the request to ${url}`, "debug");
      const response = await this.apiCall(url, boxConfig.token, "put", { [commandWord]: state.val });
      if (response.status === 200) {
        this.writeLog(`${id} was changed to ${state.val}`, "debug");
        await this.setStateAsync(id, state.val, true);
      }
    } catch (error) {
      this.writeLog(`[sendCommand] ${error.message} Stack: ${error.stack}`, "error");
    }
  }
  async createStates(device, result) {
    try {
      const data = result.data;
      if (data === void 0) {
        this.writeLog("no data received", "error");
        return;
      }
      this.writeLog(`initializing Object creation`, "debug");
      if (!device)
        return this.writeLog(`No devices configured`, "warn");
      const room = await (0, import_replaceFunktion.replaceFunktion)(device.room);
      this.writeLog(`creating device with Name  box_${await (0, import_replaceFunktion.replaceFunktion)(room)}`, "debug");
      await this.setObjectNotExistsAsync(`box_${await (0, import_replaceFunktion.replaceFunktion)(room)}`, {
        type: "device",
        common: {
          name: room
        },
        native: {}
      });
      this.writeLog(`creating channel and states for device`, "debug");
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
          if (import_object_definition.deviceStateObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.device.${key}`)) {
              this.writeLog(`subscribe state box_${room}.device.${key}`, "debug");
              this.subscribeStates(`box_${room}.device.${key}`);
              this.subscribedStates.push(`box_${room}.device.${key}`);
            }
          }
        }
      }
      for (const key in import_object_definition.networkObj) {
        if (import_object_definition.networkObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.wifi.${key}`, import_object_definition.networkObj[key]);
          if (import_object_definition.networkObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.device.wifi.${key}`)) {
              this.writeLog(`subscribe state box_${room}.device.wifi.${key}`, "debug");
              this.subscribeStates(`box_${room}.device.wifi.${key}`);
              this.subscribedStates.push(`box_${room}.device.wifi.${key}`);
            }
          }
        }
      }
      for (const key in import_object_definition.updateObj) {
        if (import_object_definition.updateObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.update.${key}`, import_object_definition.updateObj[key]);
          if (import_object_definition.updateObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.device.update.${key}`)) {
              this.writeLog(`subscribe state box_${room}.device.update.${key}`, "debug");
              this.subscribeStates(`box_${room}.device.update.${key}`);
              this.subscribedStates.push(`box_${room}.device.update.${key}`);
            }
          }
        }
      }
      for (const key in import_object_definition.capabilitiesObj) {
        if (import_object_definition.capabilitiesObj.hasOwnProperty(key)) {
          await this.setObjectNotExistsAsync(`box_${room}.device.capabilities.${key}`, import_object_definition.capabilitiesObj[key]);
          if (import_object_definition.capabilitiesObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.device.capabilities.${key}`)) {
              this.writeLog(`subscribe state box_${room}.device.capabilities.${key}`, "debug");
              this.subscribeStates(`box_${room}.device.capabilities.${key}`);
              this.subscribedStates.push(`box_${room}.device.capabilities.${key}`);
            }
          }
        }
      }
      this.writeLog(`creating channel and states for hue`, "debug");
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
          if (import_object_definition.hueObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.hue.${key}`)) {
              this.writeLog(`subscribe state box_${room}.hue.${key}`, "debug");
              this.subscribeStates(`box_${room}.hue.${key}`);
              this.subscribedStates.push(`box_${room}.hue.${key}`);
            }
          }
        }
      }
      for (const groupKey in data.hue.groups) {
        for (const key in import_object_definition.groupsObj) {
          if (import_object_definition.groupsObj.hasOwnProperty(key)) {
            await this.setObjectNotExistsAsync(`box_${room}.hue.groups.${groupKey}.${key}`, import_object_definition.groupsObj[key]);
            if (import_object_definition.groupsObj[key].common.write) {
              if (!this.subscribedStates.includes(`box_${room}.hue.groups.${groupKey}.${key}`)) {
                this.writeLog(`subscribe state box_${room}.hue.groups.${groupKey}.${key}`, "debug");
                this.subscribeStates(`box_${room}.hue.groups.${groupKey}.${key}`);
                this.subscribedStates.push(`box_${room}.hue.groups.${groupKey}.${key}`);
              }
            }
          }
        }
      }
      this.writeLog(`creating channel and states for execution`, "debug");
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
          if (import_object_definition.executionObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.execution.${key}`)) {
              this.writeLog(`subscribe state box_${room}.execution.${key}`, "debug");
              this.subscribeStates(`box_${room}.execution.${key}`);
              this.subscribedStates.push(`box_${room}.execution.${key}`);
            }
          }
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
                if (import_object_definition.video_gameObj[key].common.write) {
                  if (!this.subscribedStates.includes(
                    `box_${room}.execution.${array[arrayKey]}.${key}`
                  )) {
                    this.writeLog(
                      `subscribe state box_${room}.execution.${array[arrayKey]}.${key}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${room}.execution.${array[arrayKey]}.${key}`);
                    this.subscribedStates.push(`box_${room}.execution.${array[arrayKey]}.${key}`);
                  }
                }
              }
            }
          } else {
            for (const key in import_object_definition.musicObj) {
              if (import_object_definition.musicObj.hasOwnProperty(key)) {
                await this.setObjectNotExistsAsync(
                  `box_${room}.execution.${array[arrayKey]}.${key}`,
                  import_object_definition.musicObj[key]
                );
                if (import_object_definition.musicObj[key].common.write) {
                  if (!this.subscribedStates.includes(
                    `box_${room}.execution.${array[arrayKey]}.${key}`
                  )) {
                    this.writeLog(
                      `subscribe state box_${room}.execution.${array[arrayKey]}.${key}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${room}.execution.${array[arrayKey]}.${key}`);
                    this.subscribedStates.push(`box_${room}.execution.${array[arrayKey]}.${key}`);
                  }
                }
              }
            }
          }
        }
      }
      this.writeLog(`creating channel and states for hdmi`, "debug");
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
          if (import_object_definition.hdmiObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.hdmi.${key}`)) {
              this.writeLog(`subscribe state box_${room}.hdmi.${key}`, "debug");
              this.subscribeStates(`box_${room}.hdmi.${key}`);
              this.subscribedStates.push(`box_${room}.hdmi.${key}`);
            }
          }
        }
      }
      for (const key in import_object_definition.hdmiInputObj) {
        if (import_object_definition.hdmiInputObj.hasOwnProperty(key)) {
          for (let i = 1; i < 5; i++) {
            await this.setObjectNotExistsAsync(`box_${room}.hdmi.input${i}.${key}`, import_object_definition.hdmiInputObj[key]);
            if (import_object_definition.hdmiInputObj[key].common.write) {
              if (!this.subscribedStates.includes(`box_${room}.hdmi.input${i}.${key}`)) {
                this.writeLog(`subscribe state box_${room}.hdmi.input${i}.${key}`, "debug");
                this.subscribeStates(`box_${room}.hdmi.input${i}.${key}`);
                this.subscribedStates.push(`box_${room}.hdmi.input${i}.${key}`);
              }
            }
          }
        }
        await this.setObjectNotExistsAsync(`box_${room}.hdmi.output.${key}`, import_object_definition.hdmiInputObj[key]);
        if (import_object_definition.hdmiInputObj[key].common.write) {
          if (!this.subscribedStates.includes(`box_${room}.hdmi.output.${key}`)) {
            this.writeLog(`subscribe state box_${room}.hdmi.output.${key}`, "debug");
            this.subscribeStates(`box_${room}.hdmi.output.${key}`);
            this.subscribedStates.push(`box_${room}.hdmi.output.${key}`);
          }
        }
      }
      this.writeLog(`creating channel and states for behavior`, "debug");
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
          if (import_object_definition.behaviorObj[key].common.write) {
            if (!this.subscribedStates.includes(`box_${room}.behavior.${key}`)) {
              this.writeLog(`subscribe state box_${room}.behavior.${key}`, "debug");
              this.subscribeStates(`box_${room}.behavior.${key}`);
              this.subscribedStates.push(`box_${room}.behavior.${key}`);
            }
          }
        }
      }
      for (const key in import_object_definition.behaviorInputObj) {
        if (import_object_definition.behaviorInputObj.hasOwnProperty(key)) {
          for (let i = 1; i < 5; i++) {
            await this.setObjectNotExistsAsync(
              `box_${room}.behavior.input${i}.${key}`,
              import_object_definition.behaviorInputObj[key]
            );
            if (import_object_definition.behaviorInputObj[key].common.write) {
              if (!this.subscribedStates.includes(`box_${room}.behavior.input${i}.${key}`)) {
                this.writeLog(`subscribe state box_${room}.behavior.input${i}.${key}`, "debug");
                this.subscribeStates(`box_${room}.behavior.input${i}.${key}`);
                this.subscribedStates.push(`box_${room}.behavior.input${i}.${key}`);
              }
            }
          }
        }
      }
      this.writeLog(`all device / channel and states were created for ${room}`, "debug");
    } catch (error) {
      this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, "error");
    }
  }
  onUnload(callback) {
    try {
      if (this.requestTimer)
        clearTimeout(this.requestTimer);
      this.setState("info.connection", false, true);
      callback();
    } catch (e) {
      callback();
    }
  }
  writeLog(logText, logType) {
    try {
      if (logType === "silly")
        this.log.silly(logText);
      if (logType === "info")
        this.log.info(logText);
      if (logType === "debug")
        this.log.debug(logText);
      if (logType === "warn")
        this.log.warn(logText);
      if (logType === "error")
        this.log.error(logText);
    } catch (error) {
      this.log.error(`writeLog error: ${error} , stack: ${error.stack}`);
    }
  }
  async onStateChange(id, state) {
    if (state) {
      if (state.from === "system.adapter." + this.namespace) {
        return;
      } else {
        this.writeLog(`state ${id} changed: ${state.val} (ack = ${state.ack})`, "debug");
        if (state.ack)
          return;
        const idWithoutAdapterName = id.replace(this.namespace + ".", "");
        if (this.subscribedStates.includes(idWithoutAdapterName)) {
          await this.sendCommand(idWithoutAdapterName, state);
        }
      }
    } else {
      return;
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new HueSyncBox(options);
} else {
  (() => new HueSyncBox())();
}
//# sourceMappingURL=main.js.map
