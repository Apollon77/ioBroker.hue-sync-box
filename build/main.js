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
var import_register = require("source-map-support/register");
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
    this.registrationTimer = null;
    this.messageHandlerTimer = null;
    this.subscribedStates = [];
    this.hueTarget = [];
    this.hdmiSource = [];
    this.requestCounter = 0;
    this.messageHandler = [];
  }
  async onReady() {
    this.messageHandler = [];
    this.setState("info.connection", false, true);
    this.writeLog(`[Adapter v.${this.version} onReady] create data`, `debug`);
    await this.createStates();
    this.writeLog(`[Adapter v.${this.version} onReady] request data`, `debug`);
    await this.request();
  }
  async request() {
    for (const devicesKey in this.config.devices) {
      if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
        const device = this.config.devices[devicesKey];
        const result = await this.apiCall(`https://${device.ip}/api/v1`, device, "GET");
        if (!result) {
          this.writeLog(
            `[Adapter v.${this.version} request] no result found for ${device.ip} request is aborted`,
            "error"
          );
          await this.setStateAsync(
            `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name)}.reachable`,
            false,
            true
          );
          break;
        }
        if (result && result.status === 200) {
          this.writeLog(`[Adapter v.${this.version} request] result found for ${device.ip}`, "debug");
          this.setState("info.connection", true, true);
          await this.writeState(result, parseInt(devicesKey));
          await this.setStateAsync(
            `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name)}.reachable`,
            true,
            true
          );
        } else {
          this.writeLog(
            `[Adapter v.${this.version} request] no result found for ${device.ip} request is aborted`,
            "error"
          );
          await this.setStateAsync(
            `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name)}.reachable`,
            false,
            true
          );
          break;
        }
      }
    }
    if (this.requestTimer)
      this.clearTimeout(this.requestTimer);
    this.requestTimer = this.setTimeout(async () => {
      await this.request();
    }, 15e3);
  }
  async writeState(result, key) {
    const data = result.data;
    if (data === void 0) {
      this.writeLog(`[Adapter v.${this.version} writeState] no data received`, `error`);
      return;
    }
    this.writeLog(
      `[Adapter v.${this.version} writeState] prepare to write the data for ${this.config.devices[key].name}`,
      "debug"
    );
    await this.setStateAsync(
      `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[key].name)}.json`,
      JSON.stringify(data),
      true
    );
    for (const [resultKey, resultValue] of Object.entries(data)) {
      if (typeof resultValue === "object") {
        for (const [valueKey, value] of Object.entries(resultValue)) {
          if (typeof value !== "object") {
            if (resultKey !== "ir" && resultKey !== "registrations" && resultKey !== "presets") {
              await this.setStateAsync(
                `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[key].name)}.${resultKey}.${valueKey}`,
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
                    for (const [hueGroupKey, hueGroupValue] of Object.entries(value[valueObjKey])) {
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
                    if (resultKey === "execution" && valueObjKey === "intensity" && valueKey === data.execution.lastSyncMode) {
                      this.writeLog(
                        `[Adapter v.${this.version} writeState] write state for ${resultKey}.${valueObjKey} with value ${value[valueObjKey]} from ${resultKey}.${valueKey}.${valueObjKey}`,
                        "debug"
                      );
                      const mode = data.execution.lastSyncMode;
                      await this.setStateAsync(
                        `box_${await (0, import_replaceFunktion.replaceFunktion)(
                          this.config.devices[key].name
                        )}.${resultKey}.${valueObjKey}`,
                        {
                          val: data.execution[mode].intensity,
                          ack: true
                        }
                      );
                    }
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
    this.writeLog(
      `[Adapter v.${this.version} writeState] all data for ${this.config.devices[key].name} written`,
      "debug"
    );
  }
  async apiCall(url, device, method, data) {
    try {
      const config = {
        method,
        url,
        headers: {
          Authorization: `Bearer ${this.decrypt(device.token)}`,
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        data
      };
      const response = await (0, import_axios.default)(config);
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] response: ${JSON.stringify(
          response.data
        )}`,
        "debug"
      );
      return response;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.response.status} ${error.message} - Body malformed.`,
            "error"
          );
        } else if (error.response.status === 401) {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.response.status} ${error.message} - Authentication failed`,
            "error"
          );
          if (error.response.data.code === 2) {
            this.writeLog(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.response.status} ${error.message} - Invalid Token`,
              "error"
            );
          }
          return error.response;
        } else if (error.response.status === 404) {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.response.status} ${error.message} - Invalid URL Path`,
            "error"
          );
          return error.response;
        } else if (error.response.status === 500) {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.response.status} ${error.message} - internal server error`,
            "error"
          );
          return;
        } else {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error}`,
            "error"
          );
          return error.response;
        }
      } else {
        if (error.code === "ECONNREFUSED") {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.code} - Connection refused Message: ${error.message}`,
            "error"
          );
          return error;
        }
        if (error.code === "ECONNRESET") {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.code} - Connection reset by peer Message: ${error.message}`,
            "error"
          );
          return error;
        }
        if (error.code === "ETIMEDOUT") {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.code} - Connection timed out Message: ${error.message}`,
            "error"
          );
          return error;
        }
        if (error.code === "ENOTFOUND") {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.code} - DNS lookup failed Message: ${error.message}`,
            "error"
          );
          return error;
        }
        if (error.code === "EHOSTUNREACH") {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error: ${error.code} - Host is unreachable Message: ${error.message}`,
            "error"
          );
          return error;
        }
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} apiCall] error Code: ${error.code} Message: ${error.message}`,
          "error"
        );
      }
    }
  }
  async sendCommand(id, state) {
    this.writeLog(`[Adapter v.${this.version} sendCommand] prepare to send the command for ${id}`, "debug");
    const name = id.split(".")[0].replace("box_", "");
    const channel = id.split(".")[1];
    const channel2 = id.split(".")[2];
    const commandWord = id.split(".").pop();
    let boxConfig = null;
    for (const devicesKey in this.config.devices) {
      if (await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name) === name) {
        boxConfig = this.config.devices[devicesKey];
      }
    }
    this.writeLog(
      `[Adapter v.${this.version} sendCommand] get the boxConfig: ${JSON.stringify(boxConfig)}`,
      "debug"
    );
    if (!boxConfig) {
      this.writeLog(`[Adapter v.${this.version} sendCommand] no boxConfig found for ${name}`, "error");
      return;
    }
    let url;
    if (commandWord === channel2) {
      url = `https://${boxConfig.ip}/api/v1/${channel}`;
    } else {
      url = `https://${boxConfig.ip}/api/v1/${channel}/${channel2}`;
    }
    this.writeLog(`[Adapter v.${this.version} sendCommand] assemble the url ${url}`, "debug");
    this.writeLog(`[Adapter v.${this.version} sendCommand] send the request to ${url}`, "debug");
    const response = await this.apiCall(url, boxConfig, "put", {
      [commandWord]: state.val
    });
    if (response.status === 200) {
      if (this.requestTimer)
        this.clearTimeout(this.requestTimer);
      this.writeLog(`[Adapter v.${this.version} sendCommand] ${id} was changed to ${state.val}`, "debug");
      await this.setStateAsync(id, state.val, true);
      await this.request();
    } else {
      this.writeLog(
        `[Adapter v.${this.version} sendCommand] response status: ${response.status} - ${response.statusText}`,
        "error"
      );
    }
  }
  async createStates() {
    if (this.config.devices) {
      for (const key in this.config.devices) {
        if (Object.prototype.hasOwnProperty.call(this.config.devices, key)) {
          const result = await this.apiCall(
            `https://${this.config.devices[key].ip}/api/v1`,
            this.config.devices[key],
            "GET"
          );
          if (!result) {
            this.writeLog(
              `[Adapter v.${this.version} createObjects]  no result found for ${this.config.devices[key].ip} createStates is aborted`,
              "error"
            );
            return;
          }
          const data = result.data;
          if (data === void 0) {
            this.writeLog(`[Adapter v.${this.version} createObjects] no data received`, `error`);
            return;
          }
          if (result.status === 401) {
            if (result.data.code === 2) {
              this.writeLog(`[Adapter v.${this.version} createObjects] invalid token`, `error`);
              return;
            }
            this.writeLog(`[Adapter v.${this.version} createObjects] Authentication failed`, `error`);
          }
          this.writeLog(`[Adapter v.${this.version} createObjects] initializing Object creation`, "debug");
          if (!this.config.devices)
            return this.writeLog(`No devices configured`, "warn");
          const name = await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[key].name);
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating device with Name  box_${name}`,
            "debug"
          );
          await this.extendObjectAsync(`box_${name}`, {
            type: "device",
            common: {
              name: this.config.devices[key].name,
              statusStates: {
                onlineId: `${this.namespace}.box_${name}.reachable`
              }
            },
            native: {
              id: this.config.devices[key].id ? this.config.devices[key].id : "no id"
            }
          });
          await this.setObjectNotExistsAsync(`box_${name}.json`, {
            type: "state",
            common: {
              name: "response JSON",
              desc: "The data JSON from the request",
              type: "string",
              role: "json",
              def: "",
              read: true,
              write: false
            },
            native: {}
          });
          await this.setObjectNotExistsAsync(`box_${name}.reachable`, {
            type: "state",
            common: {
              name: "reachable",
              desc: "Is the box reachable",
              type: "boolean",
              role: "indicator.reachable",
              def: false,
              read: true,
              write: false
            },
            native: {}
          });
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating channel and states for device`,
            "debug"
          );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.device.${key2}`,
                    "debug"
                  );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.device.wifi.${key2}`,
                    "debug"
                  );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.device.update.${key2}`,
                    "debug"
                  );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.device.capabilities.${key2}`,
                    "debug"
                  );
                  this.subscribeStates(`box_${name}.device.capabilities.${key2}`);
                  this.subscribedStates.push(`box_${name}.device.capabilities.${key2}`);
                }
              }
            }
          }
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating channel and states for hue`,
            "debug"
          );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.hue.${key2}`,
                    "debug"
                  );
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
                      `[Adapter v.${this.version} createObjects] subscribe state box_${name}.hue.groups.${groupKey}.${key2}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${name}.hue.groups.${groupKey}.${key2}`);
                    this.subscribedStates.push(`box_${name}.hue.groups.${groupKey}.${key2}`);
                  }
                }
              }
            }
          }
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating channel and states for execution`,
            "debug"
          );
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
              if (key2 === "hueTarget") {
                const hueTargetObj = {};
                for (const dataKey in data.hue.groups) {
                  if (data.hue.groups.hasOwnProperty(dataKey)) {
                    if (!this.hueTarget.some((element) => element.id === dataKey)) {
                      this.hueTarget.push({ id: dataKey, name: data.hue.groups[dataKey].name });
                    }
                  }
                }
                for (const hueTargetKey in this.hueTarget) {
                  if (this.hueTarget.hasOwnProperty(hueTargetKey)) {
                    hueTargetObj[this.hueTarget[hueTargetKey].id] = this.hueTarget[hueTargetKey].name;
                  }
                }
                const oldObj = await this.getObjectAsync(`box_${name}.execution.${key2}`);
                if (oldObj) {
                  oldObj.common.states = hueTargetObj;
                  await this.setObjectAsync(`box_${name}.execution.${key2}`, oldObj);
                } else {
                  await this.setObjectNotExistsAsync(`box_${name}.execution.${key2}`, {
                    ...import_object_definition.executionObj[key2],
                    common: {
                      ...import_object_definition.executionObj[key2].common,
                      states: hueTargetObj
                    }
                  });
                }
                if (!this.subscribedStates.includes(`box_${name}.execution.${key2}`)) {
                  this.writeLog(
                    `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} createObjects] subscribe state box_${name}.execution.${key2}`,
                    "debug"
                  );
                  this.subscribeStates(`box_${name}.execution.${key2}`);
                  this.subscribedStates.push(`box_${name}.execution.${key2}`);
                }
              } else if (key2 === "hdmiSource") {
                const hdmiSourceObj = {};
                for (const dataKey in data.hdmi) {
                  if (data.hdmi.hasOwnProperty(dataKey)) {
                    if (dataKey === "input1" || dataKey === "input2" || dataKey === "input3" || dataKey === "input4") {
                      if (!this.hdmiSource.some((element) => element.id === dataKey)) {
                        this.hdmiSource.push({ id: dataKey, name: data.hdmi[dataKey].name });
                      } else {
                      }
                    }
                  }
                }
                for (const hdmiSourceKey in this.hdmiSource) {
                  if (this.hdmiSource.hasOwnProperty(hdmiSourceKey)) {
                    hdmiSourceObj[this.hdmiSource[hdmiSourceKey].id] = this.hdmiSource[hdmiSourceKey].name;
                  }
                }
                const oldObj = await this.getObjectAsync(`box_${name}.execution.${key2}`);
                if (oldObj) {
                  oldObj.common.states = hdmiSourceObj;
                  await this.setObjectAsync(`box_${name}.execution.${key2}`, oldObj);
                } else {
                  await this.setObjectNotExistsAsync(`box_${name}.execution.${key2}`, {
                    ...import_object_definition.executionObj[key2],
                    common: {
                      ...import_object_definition.executionObj[key2].common,
                      states: hdmiSourceObj
                    }
                  });
                }
                if (!this.subscribedStates.includes(`box_${name}.execution.${key2}`)) {
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.execution.${key2}`,
                    "debug"
                  );
                  this.subscribeStates(`box_${name}.execution.${key2}`);
                  this.subscribedStates.push(`box_${name}.execution.${key2}`);
                }
              } else {
                await this.setObjectNotExistsAsync(`box_${name}.execution.${key2}`, import_object_definition.executionObj[key2]);
                if (import_object_definition.executionObj[key2].common.write) {
                  if (!this.subscribedStates.includes(`box_${name}.execution.${key2}`)) {
                    this.writeLog(
                      `[Adapter v.${this.version} createObjects] subscribe state box_${name}.execution.${key2}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${name}.execution.${key2}`);
                    this.subscribedStates.push(`box_${name}.execution.${key2}`);
                  }
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
                          `[Adapter v.${this.version} createObjects] subscribe state box_${name}.execution.${array[arrayKey]}.${key2}`,
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
                          `[Adapter v.${this.version} createObjects] subscribe state box_${name}.execution.${array[arrayKey]}.${key2}`,
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
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating channel and states for hdmi`,
            "debug"
          );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.hdmi.${key2}`,
                    "debug"
                  );
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
                    this.writeLog(
                      `[Adapter v.${this.version} createObjects] subscribe state box_${name}.hdmi.input${i}.${key2}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${name}.hdmi.input${i}.${key2}`);
                    this.subscribedStates.push(`box_${name}.hdmi.input${i}.${key2}`);
                  }
                }
              }
            }
            await this.setObjectNotExistsAsync(`box_${name}.hdmi.output.${key2}`, import_object_definition.hdmiInputObj[key2]);
            if (import_object_definition.hdmiInputObj[key2].common.write) {
              if (!this.subscribedStates.includes(`box_${name}.hdmi.output.${key2}`)) {
                this.writeLog(
                  `[Adapter v.${this.version} createObjects] subscribe state box_${name}.hdmi.output.${key2}`,
                  "debug"
                );
                this.subscribeStates(`box_${name}.hdmi.output.${key2}`);
                this.subscribedStates.push(`box_${name}.hdmi.output.${key2}`);
              }
            }
          }
          this.writeLog(
            `[Adapter v.${this.version} createObjects] creating channel and states for behavior`,
            "debug"
          );
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
                  this.writeLog(
                    `[Adapter v.${this.version} createObjects] subscribe state box_${name}.behavior.${key2}`,
                    "debug"
                  );
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
                    this.writeLog(
                      `[Adapter v.${this.version} createObjects] subscribe state box_${name}.behavior.input${i}.${key2}`,
                      "debug"
                    );
                    this.subscribeStates(`box_${name}.behavior.input${i}.${key2}`);
                    this.subscribedStates.push(`box_${name}.behavior.input${i}.${key2}`);
                  }
                }
              }
            }
          }
          this.writeLog(
            `[Adapter v.${this.version} createObjects] all device / channel and states were created for ${name}`,
            "debug"
          );
        }
      }
    } else {
      this.writeLog(
        `[Adapter v.${this.version} createObjects] no devices configured, please configure the adapter`,
        "warn"
      );
    }
  }
  writeLog(logText, logType) {
    if (logType === "warn" || logType === "error") {
      if (this.messageHandler.length > 0) {
        if (!this.messageHandler.find((message) => message.message === logText)) {
          this.messageHandler.push({
            severity: logType,
            clearTimer: false,
            message: logText
          });
          if (logType === "warn")
            this.log.warn(logText);
          if (logType === "error")
            this.log.error(logText);
          this.log.debug(
            `[Adapter v.${this.version} writeLog] messageHandler: ` + JSON.stringify(this.messageHandler)
          );
        } else {
          if (!this.messageHandler.find((message) => message.message === logText).clearTimer) {
            this.messageHandler.find((message) => message.message === logText).clearTimer = true;
            this.messageHandlerTimer = this.setTimeout(() => {
              this.messageHandler.find((message) => message.message === logText).clearTimer = false;
              this.messageHandler = this.messageHandler.filter((message) => message.message !== logText);
              this.log.debug(`[Adapter v.${this.version} writeLog] clear messageHandler for ${logText}`);
            }, 3e5);
          }
          this.log.debug(
            `[Adapter v.${this.version} writeLog] messageHandler: ` + JSON.stringify(this.messageHandler)
          );
        }
      } else {
        this.messageHandler.push({
          severity: logType,
          clearTimer: false,
          message: logText
        });
        if (logType === "warn")
          this.log.warn(logText);
        if (logType === "error")
          this.log.error(logText);
        this.log.debug(
          `[Adapter v.${this.version} writeLog] messageHandler: ` + JSON.stringify(this.messageHandler)
        );
      }
    } else {
      if (logType === "silly")
        this.log.silly(logText);
      if (logType === "info")
        this.log.info(logText);
      if (logType === "debug")
        this.log.debug(logText);
    }
  }
  async registration(obj) {
    this.requestCounter++;
    try {
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] start registrations`,
        `info`
      );
      const device = obj.message;
      const registrationsUrl = `https://${device.ip}/api/v1/registrations`;
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      const registrations = await import_axios.default.post(
        registrationsUrl,
        {
          appName: "ioBroker",
          instanceName: `hue_sync_box_${device.name}`
        },
        {
          httpsAgent: agent
        }
      );
      if (registrations.status === 200) {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} was successful`,
          "info"
        );
        if (registrations.data.accessToken) {
          if (obj.callback)
            this.sendTo(obj.from, obj.command, registrations.data, obj.callback);
          this.requestCounter = 5;
          return;
        }
      }
    } catch (error) {
      const device = obj.message;
      if (error.code === "ETIMEDOUT") {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, timeout. > message => ${error.message} Stack: ${error.stack} <`,
          "error"
        );
        const response = {
          code: error.code,
          message: error.message
        };
        if (obj.callback)
          this.sendTo(obj.from, obj.command, response, obj.callback);
        this.requestCounter = 5;
        return;
      }
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.code === 16) {
            const response = error.response.data;
            console.log(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] Code: 16 => ${JSON.stringify(response)}`
            );
            this.writeLog(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] Code: 16 => ${JSON.stringify(response)}`,
              "debug"
            );
          } else {
            console.log(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.response.statusText} > message => ${error.message} Stack: ${error.stack} <`
            );
            this.writeLog(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.response.statusText} > message => ${error.message} Stack: ${error.stack} <`,
              "error"
            );
            const response = {
              code: error.response.status,
              codeString: error.code,
              message: error.message,
              responseMessage: error.response.statusText
            };
            if (obj.callback)
              this.sendTo(obj.from, obj.command, response, obj.callback);
            this.requestCounter = 5;
            return;
          }
        } else {
          console.log(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.response.statusText} > message => ${error.message} Stack: ${error.stack} <`
          );
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.response.statusText} > message => ${error.message} Stack: ${error.stack} <`,
            "error"
          );
          const response = {
            code: error.response.status,
            codeString: error.code,
            message: error.message,
            responseMessage: error.response.statusText
          };
          if (obj.callback)
            this.sendTo(obj.from, obj.command, response, obj.callback);
          this.requestCounter = 5;
          return;
        }
      } else {
        console.log(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.message} > message => ${error.message} Stack: ${error.stack} <`
        );
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registration] registration for ${device.name} failed, error: ${error.message} > message => ${error.message} Stack: ${error.stack} <`,
          "error"
        );
        const response = {
          code: error.code,
          message: error.message
        };
        if (obj.callback)
          this.sendTo(obj.from, obj.command, response, obj.callback);
        this.requestCounter = 5;
        return;
      }
    }
    if (this.requestCounter < 5) {
      this.registrationTimer = this.setTimeout(async () => {
        await this.registration(obj);
      }, 4e3);
    } else {
      if (this.registrationTimer)
        this.clearTimeout(this.registrationTimer);
      this.requestCounter = 0;
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} registrations] registration failed`,
        `error`
      );
      const response = {
        code: 500,
        message: "registration failed"
      };
      if (obj.callback)
        this.sendTo(obj.from, obj.command, response, obj.callback);
    }
  }
  async requestRegistrationsId(obj) {
    try {
      const device = obj.message;
      let registrationsId = null;
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} requestRegistrationsId] request registrations id for ${device.name}`,
        "info"
      );
      const registrationsUrl = `https://${device.ip}/api/v1/registrations`;
      const agent = new https.Agent({ rejectUnauthorized: false });
      const registrations = await import_axios.default.get(registrationsUrl, {
        headers: {
          Authorization: `Bearer ${this.decrypt(device.token)}`,
          "Content-Type": "application/json"
        },
        httpsAgent: agent
      });
      if (registrations.status === 200) {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} requestRegistrationsId] request registrations id for ${device.name} was successful`,
          "info"
        );
        for (const index in registrations.data) {
          const instanceName = `hue_sync_box_${device.name}`;
          if (registrations.data[index].instanceName === instanceName) {
            this.writeLog(
              `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} requestRegistrationsId] registrations id for ${device.name} is ${index}`,
              "info"
            );
            registrationsId = parseInt(index, 10);
          }
        }
      }
      return registrationsId;
    } catch (error) {
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} requestRegistrationsId] ${error.message} Stack: ${error.stack}`,
        "error"
      );
      return null;
    }
  }
  async deleteRegistrations(obj) {
    try {
      const device = obj.message;
      if (device.id == 0 || device.id == void 0 || device.id == null) {
        const id = await this.requestRegistrationsId(obj);
        if (id != null) {
          console.log(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] deleteRegistrations new id`,
            id
          );
          device.id = id;
        } else {
          this.writeLog(
            `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] no id found`,
            `error`
          );
          const response = {
            code: 500,
            message: "no id found"
          };
          if (obj.callback)
            this.sendTo(obj.from, obj.command, response, obj.callback);
          return;
        }
      }
      if (!device.id) {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] no id found`,
          `error`
        );
        const response = {
          code: 500,
          message: "no id found"
        };
        if (obj.callback)
          this.sendTo(obj.from, obj.command, response, obj.callback);
        return;
      }
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] delete registrations for ${device.name}`,
        "info"
      );
      const deleteUrl = `https://${device.ip}/api/v1/registrations/${device.id}`;
      const deleteConfig = {
        method: "delete",
        url: deleteUrl,
        headers: {
          Authorization: `Bearer ${this.decrypt(device.token)}`,
          "Content-Type": "application/json"
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      };
      const deleteResponse = await (0, import_axios.default)(deleteConfig);
      if (deleteResponse.status === 200) {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] registration for ${device.name} was deleted`,
          "info"
        );
        if (obj.command === "deleteObjectsAndLogOut") {
          const status = { delete: true, logOut: true };
          if (obj.callback)
            this.sendTo(obj.from, obj.command, status, obj.callback);
        } else {
          const status = { delete: false, logOut: true };
          if (obj.callback)
            this.sendTo(obj.from, obj.command, status, obj.callback);
        }
      } else {
        this.writeLog(
          `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] delete registration for ${device.name} failed with status ${deleteResponse.status}`,
          "error"
        );
      }
    } catch (error) {
      this.writeLog(
        `[Adapter v.${this.version} axios v.${import_axios.default.VERSION} deleteRegistrations] ${error.message} Stack: ${error.stack}`,
        "error"
      );
    }
  }
  async deleteObjects(obj) {
    const device = obj.message;
    if (device.id == 0 || device.id == void 0 || device.id == null) {
      const id = await this.requestRegistrationsId(obj);
      if (id != null) {
        device.id = id;
      } else {
        this.writeLog(`[Adapter v.${this.version} deleteObjects] no id found`, `error`);
        const response = {
          code: 500,
          message: "no id found"
        };
        if (obj.callback)
          this.sendTo(obj.from, obj.command, response, obj.callback);
        return;
      }
    }
    if (!device.id) {
      this.writeLog(`[Adapter v.${this.version} deleteObjects] no id found`, `error`);
      const response = {
        code: 500,
        message: "no id found"
      };
      if (obj.callback)
        this.sendTo(obj.from, obj.command, response, obj.callback);
      return;
    }
    this.writeLog(`[Adapter v.${this.version} deleteObjects] delete objects for ${device.name}`, "info");
    const objects = await this.getAdapterObjectsAsync();
    const deviceObjects = [];
    if (objects) {
      this.writeLog(`[Adapter v.${this.version} deleteObjects] search for all device objects`, "debug");
      Object.keys(objects).filter((key) => {
        if (objects[key].type === "device") {
          deviceObjects.push(objects[key]);
        }
      });
      if (deviceObjects.length > 0) {
        const deviceObject = deviceObjects.find((obj2) => {
          this.writeLog(
            `[Adapter v.${this.version} deleteObjects] check if the native id ${device.id} is present`,
            "info"
          );
          if (obj2.native && obj2.native.id === "no id" || !obj2.native.id) {
            this.writeLog(`[Adapter v.${this.version} deleteObjects] no id in native available`, "info");
            this.writeLog(
              `[Adapter v.${this.version} deleteObjects] search for the names ${device.name}`,
              "info"
            );
            if (obj2.common.name === device.name) {
              this.writeLog(`[Adapter v.${this.version} deleteObjects] Name found`, "info");
              return obj2;
            }
          }
          if (obj2.native && obj2.native.id === device.id) {
            this.writeLog(`[Adapter v.${this.version} deleteObjects] id found`, "info");
            return obj2;
          }
        });
        if (deviceObject) {
          await this.delObjectAsync(deviceObject._id, { recursive: true });
          this.writeLog(
            `[Adapter v.${this.version} deleteObjects] device object for ${device.name} was deleted`,
            "info"
          );
          if (obj.command === "deleteObjectsAndLogOut") {
            this.writeLog(
              `[Adapter v.${this.version} deleteObjects] delete registration for ${device.name}`,
              "info"
            );
            await this.deleteRegistrations(obj);
          } else {
            this.writeLog(
              `[Adapter v.${this.version} deleteObjects] delete objects for ${device.name} was finished send status to the Frontend`,
              "info"
            );
            const status = { delete: true, logOut: false };
            if (obj.callback)
              this.sendTo(obj.from, obj.command, status, obj.callback);
          }
        }
      }
    }
  }
  async onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "registrations") {
        if (this.requestCounter === 0) {
          this.requestCounter = 0;
          await this.registration(obj);
        } else {
          if (this.registrationTimer)
            this.clearTimeout(this.registrationTimer);
          this.requestCounter = 0;
        }
      }
      if (obj.command === "deleteObjects") {
        await this.deleteObjects(obj);
      }
      if (obj.command === "logOut") {
        await this.deleteRegistrations(obj);
      }
      if (obj.command === "deleteObjectsAndLogOut") {
        await this.deleteObjects(obj);
      }
    }
  }
  async onStateChange(id, state) {
    if (state) {
      if (state.from === "system.adapter." + this.namespace) {
        return;
      } else {
        this.writeLog(
          `[Adapter v.${this.version} onStateChange] state ${id} changed: ${state.val} (ack = ${state.ack})`,
          "debug"
        );
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
  async onUnload(callback) {
    try {
      if (this.requestTimer)
        this.clearTimeout(this.requestTimer);
      if (this.registrationTimer)
        this.clearTimeout(this.registrationTimer);
      if (this.messageHandlerTimer)
        this.clearTimeout(this.messageHandlerTimer);
      this.setState("info.connection", false, true);
      for (const devicesKey in this.config.devices) {
        this.setState(
          `box_${await (0, import_replaceFunktion.replaceFunktion)(this.config.devices[devicesKey].name)}.reachable`,
          false,
          true
        );
      }
      callback();
    } catch (e) {
      callback();
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new HueSyncBox(options);
} else {
  (() => new HueSyncBox())();
}
//# sourceMappingURL=main.js.map
