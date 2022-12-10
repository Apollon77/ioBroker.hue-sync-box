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
const protocol = "https";
class HueSyncBox extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "hue-sync-box"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.requestTimer = null;
    this.subscribedStates = [];
  }
  async onReady() {
    this.setState("info.connection", false, true);
    this.writeLog("create data", "debug");
    await this.createStates();
    this.writeLog("request data", "debug");
    await this.request();
  }
  async request() {
    try {
      for (const devicesKey in this.config.devices) {
        if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
          const device = this.config.devices[devicesKey];
          const result = await this.apiCall(`${protocol}://${device.ip}/api/v1`, device.token, "GET");
          if (result.status === 200) {
            this.setState("info.connection", true, true);
            await this.writeState(result, parseInt(devicesKey));
          }
        }
      }
      if (this.requestTimer)
        this.clearTimeout(this.requestTimer);
      this.requestTimer = this.setTimeout(async () => {
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
      this.writeLog(`prepare to write the data for ${this.config.devices[key].name}`, "debug");
      for (const [resultKey, resultValue] of Object.entries(data)) {
        if (typeof resultValue === "object") {
          for (const [valueKey, value] of Object.entries(resultValue)) {
            if (typeof value !== "object") {
              if (resultKey !== "ir" && resultKey !== "registrations" && resultKey !== "presets") {
                await this.setStateAsync(
                  `box_${await (0, import_replaceFunktion.replaceFunktion)(
                    this.config.devices[key].name
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
                            this.config.devices[key].name
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
                          this.config.devices[key].name
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
      this.writeLog(`all data for ${this.config.devices[key].name} written`, "debug");
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
          Authorization: `Bearer ${this.decrypt(token)}`,
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
        if (error.response.status === 400) {
          this.writeLog(`error: ${error.response.status} ${error.message} - Body malformed.`, "error");
        } else if (error.response.status === 401) {
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
      const name = id.split(".")[0].replace("box_", "");
      const channel = id.split(".")[1];
      const channel2 = id.split(".")[2];
      const channel3 = id.split(".")[3];
      const commandWord = id.split(".").pop();
      let boxConfig = null;
      for (const devicesKey in this.config.devices) {
        if (await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name) === name) {
          boxConfig = this.config.devices[devicesKey];
        }
      }
      this.writeLog(`get the boxConfig: ${JSON.stringify(boxConfig)}`, "debug");
      if (!boxConfig) {
        this.writeLog(`no boxConfig found for ${name}`, "error");
        return;
      }
      let url;
      if (channel3 !== void 0) {
        if (commandWord === channel3) {
          url = `${protocol}://${boxConfig.ip}/api/v1/${channel}/${channel2}`;
        } else {
          url = `${protocol}://${boxConfig.ip}/api/v1/${channel}/${channel2}/${channel3}`;
        }
      } else {
        if (commandWord === channel2) {
          url = `${protocol}://${boxConfig.ip}/api/v1/${channel}`;
        } else {
          url = `${protocol}://${boxConfig.ip}/api/v1/${channel}/${channel2}`;
        }
      }
      this.writeLog(`assemble the url ${url}`, "debug");
      this.writeLog(`send the request to ${url}`, "debug");
      const response = await this.apiCall(url, boxConfig.token, "put", {
        [commandWord]: state.val
      });
      if (response.status === 200) {
        this.writeLog(`${id} was changed to ${state.val}`, "debug");
        await this.setStateAsync(id, state.val, true);
      }
    } catch (error) {
      this.writeLog(`[sendCommand] ${error.message} Stack: ${error.stack}`, "error");
    }
  }
  async createStates() {
    try {
      for (const key in this.config.devices) {
        if (Object.prototype.hasOwnProperty.call(this.config.devices, key)) {
          const result = await this.apiCall(
            `${protocol}://${this.config.devices[key].ip}/api/v1`,
            this.config.devices[key].token,
            "GET"
          );
          const data = result.data;
          if (data === void 0) {
            this.writeLog("no data received", "error");
            return;
          }
          this.writeLog(`initializing Object creation`, "debug");
          if (!this.config.devices)
            return this.writeLog(`No devices configured`, "warn");
          const name = await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[key].name);
          this.writeLog(`creating device with Name  box_${name}`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}`, {
            type: "device",
            common: {
              name: this.config.devices[key].name
            },
            native: {}
          });
          this.writeLog(`creating channel and states for device`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}.device`, {
            type: "channel",
            common: {
              name: "device"
            },
            native: {}
          });
          for (const key2 in import_object_definition.deviceChannelObj) {
            if (import_object_definition.deviceChannelObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.device.${key2}`, import_object_definition.deviceChannelObj[key2]);
            }
          }
          for (const key2 in import_object_definition.deviceStateObj) {
            if (import_object_definition.deviceStateObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.device.${key2}`, import_object_definition.deviceStateObj[key2]);
              if (import_object_definition.deviceStateObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.device.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.device.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.device.${key2}`);
                  this.subscribedStates.push(`box_${name}.device.${key2}`);
                }
              }
            }
          }
          for (const key2 in import_object_definition.networkObj) {
            if (import_object_definition.networkObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.device.wifi.${key2}`, import_object_definition.networkObj[key2]);
              if (import_object_definition.networkObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.device.wifi.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.device.wifi.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.device.wifi.${key2}`);
                  this.subscribedStates.push(`box_${name}.device.wifi.${key2}`);
                }
              }
            }
          }
          for (const key2 in import_object_definition.updateObj) {
            if (import_object_definition.updateObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.device.update.${key2}`, import_object_definition.updateObj[key2]);
              if (import_object_definition.updateObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.device.update.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.device.update.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.device.update.${key2}`);
                  this.subscribedStates.push(`box_${name}.device.update.${key2}`);
                }
              }
            }
          }
          for (const key2 in import_object_definition.capabilitiesObj) {
            if (import_object_definition.capabilitiesObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(
                `box_${name}.device.capabilities.${key2}`,
                import_object_definition.capabilitiesObj[key2]
              );
              if (import_object_definition.capabilitiesObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.device.capabilities.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.device.capabilities.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.device.capabilities.${key2}`);
                  this.subscribedStates.push(`box_${name}.device.capabilities.${key2}`);
                }
              }
            }
          }
          this.writeLog(`creating channel and states for hue`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}.hue`, {
            type: "channel",
            common: {
              name: "hue"
            },
            native: {}
          });
          for (const key2 in import_object_definition.hueChannelObj) {
            if (import_object_definition.hueChannelObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.hue.${key2}`, import_object_definition.hueChannelObj[key2]);
            }
          }
          for (const key2 in import_object_definition.hueObj) {
            if (import_object_definition.hueObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.hue.${key2}`, import_object_definition.hueObj[key2]);
              if (import_object_definition.hueObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.hue.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.hue.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.hue.${key2}`);
                  this.subscribedStates.push(`box_${name}.hue.${key2}`);
                }
              }
            }
          }
          for (const groupKey in data.hue.groups) {
            for (const key2 in import_object_definition.groupsObj) {
              if (import_object_definition.groupsObj.hasOwnProperty(key2)) {
                await this.setObjectNotExistsAsync(
                  `box_${name}.hue.groups.${groupKey}.${key2}`,
                  import_object_definition.groupsObj[key2]
                );
                if (import_object_definition.groupsObj[key2].common.write) {
                  if (!this.subscribedStates.includes(`box_${name}.hue.groups.${groupKey}.${key2}`)) {
                    this.writeLog(
                      `subscribe state box_${name}.hue.groups.${groupKey}.${key2}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${name}.hue.groups.${groupKey}.${key2}`);
                    this.subscribedStates.push(`box_${name}.hue.groups.${groupKey}.${key2}`);
                  }
                }
              }
            }
          }
          this.writeLog(`creating channel and states for execution`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}.execution`, {
            type: "channel",
            common: {
              name: "execution"
            },
            native: {}
          });
          for (const key2 in import_object_definition.executionChannelObj) {
            if (import_object_definition.executionChannelObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(
                `box_${name}.execution.${key2}`,
                import_object_definition.executionChannelObj[key2]
              );
            }
          }
          for (const key2 in import_object_definition.executionObj) {
            if (import_object_definition.executionObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.execution.${key2}`, import_object_definition.executionObj[key2]);
              if (import_object_definition.executionObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.execution.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.execution.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.execution.${key2}`);
                  this.subscribedStates.push(`box_${name}.execution.${key2}`);
                }
              }
            }
          }
          const array = ["game", "music", "video"];
          for (const arrayKey in array) {
            if (array.hasOwnProperty(arrayKey)) {
              if (array[arrayKey] !== "music") {
                for (const key2 in import_object_definition.video_gameObj) {
                  if (import_object_definition.video_gameObj.hasOwnProperty(key2)) {
                    await this.setObjectNotExistsAsync(
                      `box_${name}.execution.${array[arrayKey]}.${key2}`,
                      import_object_definition.video_gameObj[key2]
                    );
                    if (import_object_definition.video_gameObj[key2].common.write) {
                      if (!this.subscribedStates.includes(
                        `box_${name}.execution.${array[arrayKey]}.${key2}`
                      )) {
                        this.writeLog(
                          `subscribe state box_${name}.execution.${array[arrayKey]}.${key2}`,
                          "debug"
                        );
                        this.subscribeStates(`box_${name}.execution.${array[arrayKey]}.${key2}`);
                        this.subscribedStates.push(
                          `box_${name}.execution.${array[arrayKey]}.${key2}`
                        );
                      }
                    }
                  }
                }
              } else {
                for (const key2 in import_object_definition.musicObj) {
                  if (import_object_definition.musicObj.hasOwnProperty(key2)) {
                    await this.setObjectNotExistsAsync(
                      `box_${name}.execution.${array[arrayKey]}.${key2}`,
                      import_object_definition.musicObj[key2]
                    );
                    if (import_object_definition.musicObj[key2].common.write) {
                      if (!this.subscribedStates.includes(
                        `box_${name}.execution.${array[arrayKey]}.${key2}`
                      )) {
                        this.writeLog(
                          `subscribe state box_${name}.execution.${array[arrayKey]}.${key2}`,
                          "debug"
                        );
                        this.subscribeStates(`box_${name}.execution.${array[arrayKey]}.${key2}`);
                        this.subscribedStates.push(
                          `box_${name}.execution.${array[arrayKey]}.${key2}`
                        );
                      }
                    }
                  }
                }
              }
            }
          }
          this.writeLog(`creating channel and states for hdmi`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}.hdmi`, {
            type: "channel",
            common: {
              name: "hdmi"
            },
            native: {}
          });
          for (const key2 in import_object_definition.hdmiChannelObj) {
            if (import_object_definition.hdmiChannelObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.hdmi.${key2}`, import_object_definition.hdmiChannelObj[key2]);
            }
          }
          for (const key2 in import_object_definition.hdmiObj) {
            if (import_object_definition.hdmiObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.hdmi.${key2}`, import_object_definition.hdmiObj[key2]);
              if (import_object_definition.hdmiObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.hdmi.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.hdmi.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.hdmi.${key2}`);
                  this.subscribedStates.push(`box_${name}.hdmi.${key2}`);
                }
              }
            }
          }
          for (const key2 in import_object_definition.hdmiInputObj) {
            if (import_object_definition.hdmiInputObj.hasOwnProperty(key2)) {
              for (let i = 1; i < 5; i++) {
                await this.setObjectNotExistsAsync(
                  `box_${name}.hdmi.input${i}.${key2}`,
                  import_object_definition.hdmiInputObj[key2]
                );
                if (import_object_definition.hdmiInputObj[key2].common.write) {
                  if (!this.subscribedStates.includes(`box_${name}.hdmi.input${i}.${key2}`)) {
                    this.writeLog(`subscribe state box_${name}.hdmi.input${i}.${key2}`, "debug");
                    this.subscribeStates(`box_${name}.hdmi.input${i}.${key2}`);
                    this.subscribedStates.push(`box_${name}.hdmi.input${i}.${key2}`);
                  }
                }
              }
            }
            await this.setObjectNotExistsAsync(`box_${name}.hdmi.output.${key2}`, import_object_definition.hdmiInputObj[key2]);
            if (import_object_definition.hdmiInputObj[key2].common.write) {
              if (!this.subscribedStates.includes(`box_${name}.hdmi.output.${key2}`)) {
                this.writeLog(`subscribe state box_${name}.hdmi.output.${key2}`, "debug");
                this.subscribeStates(`box_${name}.hdmi.output.${key2}`);
                this.subscribedStates.push(`box_${name}.hdmi.output.${key2}`);
              }
            }
          }
          this.writeLog(`creating channel and states for behavior`, "debug");
          await this.setObjectNotExistsAsync(`box_${name}.behavior`, {
            type: "channel",
            common: {
              name: "behavior"
            },
            native: {}
          });
          for (const key2 in import_object_definition.behaviorChannelObj) {
            if (import_object_definition.behaviorChannelObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.behavior.${key2}`, import_object_definition.behaviorChannelObj[key2]);
            }
          }
          for (const key2 in import_object_definition.behaviorObj) {
            if (import_object_definition.behaviorObj.hasOwnProperty(key2)) {
              await this.setObjectNotExistsAsync(`box_${name}.behavior.${key2}`, import_object_definition.behaviorObj[key2]);
              if (import_object_definition.behaviorObj[key2].common.write) {
                if (!this.subscribedStates.includes(`box_${name}.behavior.${key2}`)) {
                  this.writeLog(`subscribe state box_${name}.behavior.${key2}`, "debug");
                  this.subscribeStates(`box_${name}.behavior.${key2}`);
                  this.subscribedStates.push(`box_${name}.behavior.${key2}`);
                }
              }
            }
          }
          for (const key2 in import_object_definition.behaviorInputObj) {
            if (import_object_definition.behaviorInputObj.hasOwnProperty(key2)) {
              for (let i = 1; i < 5; i++) {
                await this.setObjectNotExistsAsync(
                  `box_${name}.behavior.input${i}.${key2}`,
                  import_object_definition.behaviorInputObj[key2]
                );
                if (import_object_definition.behaviorInputObj[key2].common.write) {
                  if (!this.subscribedStates.includes(`box_${name}.behavior.input${i}.${key2}`)) {
                    this.writeLog(`subscribe state box_${name}.behavior.input${i}.${key2}`, "debug");
                    this.subscribeStates(`box_${name}.behavior.input${i}.${key2}`);
                    this.subscribedStates.push(`box_${name}.behavior.input${i}.${key2}`);
                  }
                }
              }
            }
          }
          this.writeLog(`all device / channel and states were created for ${name}`, "debug");
        }
      }
    } catch (error) {
      this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, "error");
    }
  }
  onUnload(callback) {
    try {
      if (this.requestTimer)
        this.clearTimeout(this.requestTimer);
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
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "registrations") {
        try {
          this.writeLog("start registrations", "info");
          const device = obj.message;
          device.ip = "localhost:3000";
          const registrationsUrl = `${protocol}://${device.ip}/api/v1/registrations`;
          const registrations = await import_axios.default.post(registrationsUrl, {
            headers: {
              contentType: "application/json"
            },
            data: { appName: "ioBroker", instanceName: `hue_sync_box_${device.name}` }
          });
          if (obj.callback)
            this.sendTo(obj.from, obj.command, registrations.data, obj.callback);
        } catch (error) {
          this.writeLog(`[registrations] ${error.message} Stack: ${error.stack}`, "error");
        }
      }
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new HueSyncBox(options);
} else {
  (() => new HueSyncBox())();
}
//# sourceMappingURL=main.js.map
