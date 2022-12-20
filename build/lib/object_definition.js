"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var object_definition_exports = {};
__export(object_definition_exports, {
  behaviorChannelObj: () => behaviorChannelObj,
  behaviorInputObj: () => behaviorInputObj,
  behaviorObj: () => behaviorObj,
  capabilitiesObj: () => capabilitiesObj,
  deviceChannelObj: () => deviceChannelObj,
  deviceStateObj: () => deviceStateObj,
  executionChannelObj: () => executionChannelObj,
  executionObj: () => executionObj,
  groupsObj: () => groupsObj,
  hdmiChannelObj: () => hdmiChannelObj,
  hdmiInputObj: () => hdmiInputObj,
  hdmiObj: () => hdmiObj,
  hueChannelObj: () => hueChannelObj,
  hueObj: () => hueObj,
  musicObj: () => musicObj,
  networkObj: () => networkObj,
  updateObj: () => updateObj,
  video_gameObj: () => video_gameObj
});
module.exports = __toCommonJS(object_definition_exports);
const deviceChannelObj = {
  wifi: {
    type: "channel",
    common: {
      name: "Wifi",
      desc: "Wifi information"
    },
    native: {}
  },
  update: {
    type: "channel",
    common: {
      name: "Update",
      desc: "Automatic update configuration"
    },
    native: {}
  },
  capabilities: {
    type: "channel",
    common: {
      name: "Capabilities",
      desc: "Capabilities resource"
    },
    native: {}
  }
};
const deviceStateObj = {
  name: {
    type: "state",
    common: {
      name: "name",
      desc: "name of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  deviceType: {
    type: "state",
    common: {
      name: "device Type",
      desc: "Device Type identifier",
      type: "string",
      role: "text",
      def: "HSB1",
      read: true,
      write: false
    },
    native: {}
  },
  uniqueId: {
    type: "state",
    common: {
      name: "unique Id",
      desc: "unique Id of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  ipAddress: {
    type: "state",
    common: {
      name: "IP Address",
      desc: "ip Address of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  apiLevel: {
    type: "state",
    common: {
      name: "API Level",
      desc: "api Level of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  firmwareVersion: {
    type: "state",
    common: {
      name: "firmware Version",
      desc: "firmware Version of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  updatableFirmwareVersion: {
    type: "state",
    common: {
      name: "updatable Firmware Version",
      desc: "updatable Firmware Version of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  buildNumber: {
    type: "state",
    common: {
      name: "build Number",
      desc: "build Number of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  updatableBuildNumber: {
    type: "state",
    common: {
      name: "updatable Build Number",
      desc: "updatable Build Number of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  lastCheckedUpdate: {
    type: "state",
    common: {
      name: "last Checked Update",
      desc: "last Checked Update of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  ledMode: {
    type: "state",
    common: {
      name: "LED Mode",
      desc: "led Mode of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: true,
      states: {
        0: "off",
        1: "regular",
        2: "dimmed"
      }
    },
    native: {}
  },
  action: {
    type: "state",
    common: {
      name: "action",
      desc: "action of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true,
      states: {
        none: "none",
        doSoftwareRestart: "doSoftwareRestart",
        doFirmwareUpdate: "doFirmwareUpdate"
      }
    },
    native: {}
  },
  wifiState: {
    type: "state",
    common: {
      name: "wifi State",
      desc: "wifi State of the device",
      type: "string",
      role: "text",
      def: "disconnected",
      read: true,
      write: false,
      states: {
        uninitialized: "uninitialized",
        disconnected: "disconnected",
        lan: "lan",
        wan: "wan"
      }
    },
    native: {}
  },
  termsAgreed: {
    type: "state",
    common: {
      name: "terms Agreed",
      desc: "terms Agreed of the device",
      type: "boolean",
      role: "indicator",
      def: false,
      read: true,
      write: false
    },
    native: {}
  },
  pushlink: {
    type: "state",
    common: {
      name: "pushlink",
      desc: "pushlink of the device",
      type: "string",
      role: "text",
      def: "idle",
      read: true,
      write: false
    },
    native: {}
  },
  beta: {
    type: "state",
    common: {
      name: "beta",
      desc: "beta of the device",
      type: "boolean",
      role: "indicator",
      def: false,
      read: true,
      write: false
    },
    native: {}
  }
};
const networkObj = {
  ssid: {
    type: "state",
    common: {
      name: "ssid",
      desc: "ssid of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  strength: {
    type: "state",
    common: {
      name: "strength",
      desc: "strength of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false,
      states: {
        0: "not connected",
        1: "weak",
        2: "fair",
        3: "good",
        4: "excellent"
      }
    },
    native: {}
  }
};
const updateObj = {
  autoUpdateEnabled: {
    type: "state",
    common: {
      name: "Auto Update Enabled",
      desc: "If true, an available update will automatically be installed.",
      type: "boolean",
      role: "switch",
      def: false,
      read: true,
      write: true
    },
    native: {}
  },
  autoUpdateTime: {
    type: "state",
    common: {
      name: "Auto Update Time",
      desc: "UTC hour when the automatic update will check and execute, values 0 \u2013 23.",
      type: "number",
      role: "value",
      def: 10,
      read: true,
      write: true
    },
    native: {}
  }
};
const capabilitiesObj = {
  maxIrCodes: {
    type: "state",
    common: {
      name: "max Ir Codes",
      desc: "max Ir Codes of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  maxPresets: {
    type: "state",
    common: {
      name: "max Presets",
      desc: "max Presets of the device",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  }
};
const hueChannelObj = {
  groups: {
    type: "channel",
    common: {
      name: "Groups",
      desc: "All available entertainment areas on the current bridge."
    },
    native: {}
  }
};
const hueObj = {
  bridgeUniqueId: {
    type: "state",
    common: {
      name: "bridge Unique Id",
      desc: "bridge Unique Id of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  bridgeIpAddress: {
    type: "state",
    common: {
      name: "bridge Ip Address",
      desc: "bridge Ip Address of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  groupId: {
    type: "state",
    common: {
      name: "group Id",
      desc: "group Id of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  connectionState: {
    type: "state",
    common: {
      name: "connection State",
      desc: "connection State of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false,
      states: {
        uninitialized: "uninitialized",
        disconnected: "disconnected",
        connecting: "connecting",
        unauthorized: "unauthorized",
        connected: "connected",
        invalidgroup: "invalidgroup",
        streaming: "streaming"
      }
    },
    native: {}
  }
};
const groupsObj = {
  name: {
    type: "state",
    common: {
      name: "name",
      desc: "name of the group",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  numLights: {
    type: "state",
    common: {
      name: "Number of lights",
      desc: "Number of lights in the group",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: false
    },
    native: {}
  },
  active: {
    type: "state",
    common: {
      name: "active",
      desc: "active state of the group",
      type: "boolean",
      role: "switch",
      def: false,
      read: true,
      write: false
    },
    native: {}
  },
  owner: {
    type: "state",
    common: {
      name: "owner",
      desc: "owner of the group",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  }
};
const executionChannelObj = {
  video: {
    type: "channel",
    common: {
      name: "Video",
      desc: "Video subresource"
    },
    native: {}
  },
  game: {
    type: "channel",
    common: {
      name: "Game",
      desc: "Game subresource"
    },
    native: {}
  },
  music: {
    type: "channel",
    common: {
      name: "Music",
      desc: "Music subresource"
    },
    native: {}
  }
};
const executionObj = {
  syncActive: {
    type: "state",
    common: {
      name: "sync Active",
      desc: "sync Active of the device",
      type: "boolean",
      role: "switch",
      def: false,
      read: true,
      write: true
    },
    native: {}
  },
  hdmiActive: {
    type: "state",
    common: {
      name: "hdmi Active",
      desc: "hdmi Active of the device",
      type: "boolean",
      role: "switch",
      def: false,
      read: true,
      write: true
    },
    native: {}
  },
  mode: {
    type: "state",
    common: {
      name: "mode",
      desc: "mode of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true,
      states: {
        powersave: "powersave",
        passthrough: "passthrough",
        video: "video",
        game: "game",
        music: "music"
      }
    },
    native: {}
  },
  lastSyncMode: {
    type: "state",
    common: {
      name: "lastSyncMode",
      desc: "lastSyncMode of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false,
      states: {
        video: "video",
        game: "game",
        music: "music"
      }
    },
    native: {}
  },
  hdmiSource: {
    type: "state",
    common: {
      name: "hdmi Source",
      desc: "hdmi Source of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true,
      states: {
        input1: "input1",
        input2: "input2",
        input3: "input3",
        input4: "input4"
      }
    },
    native: {}
  },
  hueTarget: {
    type: "state",
    common: {
      name: "hue Target",
      desc: "hue Target of the device",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true,
      states: {}
    },
    native: {}
  },
  brightness: {
    type: "state",
    common: {
      name: "brightness",
      desc: "brightness of the device",
      type: "number",
      role: "level",
      def: 100,
      read: true,
      write: true,
      min: 0,
      max: 200
    },
    native: {}
  },
  toggleSyncActive: {
    type: "state",
    common: {
      name: "toggle Sync Active",
      desc: "toggle Sync Active true toggles syncActive",
      type: "boolean",
      role: "button",
      def: true,
      read: true,
      write: true
    },
    native: {}
  },
  toggleHdmiActive: {
    type: "state",
    common: {
      name: "toggle Hdmi Active",
      desc: "toggle Hdmi Active true toggles hdmiActive",
      type: "boolean",
      role: "button",
      def: true,
      read: true,
      write: true
    },
    native: {}
  },
  cycleSyncMode: {
    type: "state",
    common: {
      name: "cycle Sync Mode",
      desc: "cycle Sync Mode next, previous",
      type: "string",
      role: "text",
      def: "next",
      read: true,
      write: true,
      states: {
        next: "next",
        previous: "previous"
      }
    },
    native: {}
  },
  cycleHdmiSource: {
    type: "state",
    common: {
      name: "cycle Hdmi Source",
      desc: "cycle Hdmi Source next, previous",
      type: "string",
      role: "text",
      def: "next",
      read: true,
      write: true,
      states: {
        next: "next",
        previous: "previous"
      }
    },
    native: {}
  },
  incrementBrightness: {
    type: "state",
    common: {
      name: "increment Brightness",
      desc: "increment Brightness -200 to 200",
      type: "number",
      role: "level",
      def: 0,
      read: true,
      write: true,
      min: -200,
      max: 200
    },
    native: {}
  },
  cycleIntensity: {
    type: "state",
    common: {
      name: "cycle Intensity",
      desc: "next, previous (cycle intensity of current mode if syncing)",
      type: "string",
      role: "text",
      def: "next",
      read: true,
      write: true,
      states: {
        next: "next",
        previous: "previous"
      }
    },
    native: {}
  },
  intensity: {
    type: "state",
    common: {
      name: "intensity",
      desc: "subtle, moderate, high, intense (if syncing)",
      type: "string",
      role: "text",
      def: "high",
      read: true,
      write: true,
      states: {
        subtle: "subtle",
        moderate: "moderate",
        high: "high",
        intense: "intense"
      }
    },
    native: {}
  },
  preset: {
    type: "state",
    common: {
      name: "preset",
      desc: "Preset identifier, that will be executed",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true
    },
    native: {}
  }
};
const video_gameObj = {
  intensity: {
    type: "state",
    common: {
      name: "intensity",
      desc: "intensity of the video",
      type: "string",
      role: "text",
      def: "high",
      read: true,
      write: true,
      states: {
        subtle: "subtle",
        moderate: "moderate",
        high: "high",
        intense: "intense"
      }
    },
    native: {}
  },
  backgroundLighting: {
    type: "state",
    common: {
      name: "backgroundLighting",
      desc: "backgroundLighting of the video",
      type: "boolean",
      role: "switch",
      def: false,
      read: true,
      write: true
    },
    native: {}
  }
};
const musicObj = {
  intensity: {
    type: "state",
    common: {
      name: "intensity",
      desc: "intensity of the video",
      type: "string",
      role: "text",
      def: "high",
      read: true,
      write: true,
      states: {
        subtle: "subtle",
        moderate: "moderate",
        high: "high",
        intense: "intense"
      }
    },
    native: {}
  },
  palette: {
    type: "state",
    common: {
      name: "backgroundLighting",
      desc: "backgroundLighting of the video",
      type: "string",
      role: "text",
      def: "neutral",
      read: true,
      write: true,
      states: {
        happyEnergetic: "happyEnergetic",
        happyCalm: "happyCalm",
        melancholicCalm: "melancholicCalm",
        melancholicEnergetic: "melancholicEnergetic",
        neutral: "neutral"
      }
    },
    native: {}
  }
};
const hdmiChannelObj = {
  input1: {
    type: "channel",
    common: {
      name: "Input 1",
      desc: "HDMI input 1"
    },
    native: {}
  },
  input2: {
    type: "channel",
    common: {
      name: "Input 2",
      desc: "HDMI input 2"
    },
    native: {}
  },
  input3: {
    type: "channel",
    common: {
      name: "Input 3",
      desc: "HDMI input 3"
    },
    native: {}
  },
  input4: {
    type: "channel",
    common: {
      name: "Input 4",
      desc: "HDMI input 4"
    },
    native: {}
  },
  output: {
    type: "channel",
    common: {
      name: "Output",
      desc: "HDMI output"
    },
    native: {}
  }
};
const hdmiObj = {
  contentSpecs: {
    type: "state",
    common: {
      name: "content Specs",
      desc: "content Specs of the HDMI input",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false
    },
    native: {}
  },
  videoSyncSupported: {
    type: "state",
    common: {
      name: "video Sync Supported",
      desc: "Current content specs supported for video sync (video/game mode)",
      type: "boolean",
      role: "indicator",
      def: false,
      read: true,
      write: false
    },
    native: {}
  },
  audioSyncSupported: {
    type: "state",
    common: {
      name: "audio Sync Supported",
      desc: "Current content specs supported for audio sync (music mode)",
      type: "boolean",
      role: "indicator",
      def: false,
      read: true,
      write: false
    },
    native: {}
  }
};
const hdmiInputObj = {
  name: {
    type: "state",
    common: {
      name: "name",
      desc: "name of the input",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true
    },
    native: {}
  },
  type: {
    type: "state",
    common: {
      name: "type",
      desc: "type of the input",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: true,
      states: {
        generic: "generic",
        video: "video",
        game: "game",
        music: "music",
        xbox: "xbox",
        playstation: "playstation",
        nintendoswitch: "nintendoswitch",
        phone: "phone",
        desktop: "desktop",
        laptop: "laptop",
        appletv: "appletv",
        roku: "roku",
        shield: "shield",
        chromecast: "chromecast",
        firetv: "firetv",
        diskplayer: "diskplayer",
        settopbox: "settopbox",
        satellite: "satellite",
        avreceiver: "avreceiver",
        soundbar: "soundbar",
        hdmiswitch: "hdmiswitch"
      }
    },
    native: {}
  },
  status: {
    type: "state",
    common: {
      name: "status",
      desc: "status of the input",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false,
      states: {
        unplugged: "unplugged",
        plugged: "plugged",
        linked: "linked",
        unknown: "unknown"
      }
    },
    native: {}
  },
  lastSyncMode: {
    type: "state",
    common: {
      name: "lastSyncMode",
      desc: "lastSyncMode of the input",
      type: "string",
      role: "text",
      def: "",
      read: true,
      write: false,
      states: {
        video: "video",
        game: "game",
        music: "music"
      }
    },
    native: {}
  }
};
const behaviorChannelObj = {
  input1: {
    type: "channel",
    common: {
      name: "Input 1",
      desc: "HDMI input 1"
    },
    native: {}
  },
  input2: {
    type: "channel",
    common: {
      name: "Input 2",
      desc: "HDMI input 2"
    },
    native: {}
  },
  input3: {
    type: "channel",
    common: {
      name: "Input 3",
      desc: "HDMI input 3"
    },
    native: {}
  },
  input4: {
    type: "channel",
    common: {
      name: "Input 4",
      desc: "HDMI input 4"
    },
    native: {}
  }
};
const behaviorObj = {
  inactivePowersave: {
    type: "state",
    common: {
      name: "inactive Powersave",
      desc: "Device automatically goes to powersave after this many minutes of being in passthrough mode with no link on any source or no link on output. 0 is disabled, max is 10000. Default: 20.",
      type: "number",
      role: "level",
      def: 20,
      read: true,
      write: true,
      min: 0,
      max: 1e4
    },
    native: {}
  },
  cecPowersave: {
    type: "state",
    common: {
      name: "cec Powersave",
      desc: "Device goes to powersave when TV sends CEC OFF. Default: 1. Disabled 0, Enabled 1.",
      type: "number",
      role: "value",
      def: 1,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  },
  usbPowersave: {
    type: "state",
    common: {
      name: "usb Powersave",
      desc: "Device goes to powersave when USB power transitions from 5V to 0V. Default: 1. Disabled 0, Enabled 1.",
      type: "number",
      role: "value",
      def: 1,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  },
  hpdInputSwitch: {
    type: "state",
    common: {
      name: "hpd Input Switch",
      desc: "Automatically switch input when any source is plugged in (or powered on). Default: 1. Disabled 0, Enabled 1.",
      type: "number",
      role: "value",
      def: 1,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  },
  hpdOutputEnableMs: {
    type: "state",
    common: {
      name: "hpd Output Enable Ms",
      desc: "Time in milliseconds to wait before enabling output after a source is plugged in. Default: 1000.",
      type: "number",
      role: "level",
      def: 1500,
      read: true,
      write: true,
      min: 0,
      max: 1e6
    },
    native: {}
  },
  arcBypassMode: {
    type: "state",
    common: {
      name: "arc Bypass Mode",
      desc: "Bypass mode for ARC. Default: 0. Disabled 0, Enabled 1.",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: true
    },
    native: {}
  },
  forceDoviNative: {
    type: "state",
    common: {
      name: "force Dovi Native",
      desc: "When the TV advertises Dolby Vision force to use native native mode. Disabled 0, Enabled 1.",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  }
};
const behaviorInputObj = {
  cecInputSwitch: {
    type: "state",
    common: {
      name: "cec Input Switch",
      desc: "cec Input Switch of the input",
      type: "number",
      role: "value",
      def: 1,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  },
  linkAutoSync: {
    type: "state",
    common: {
      name: "link Auto Sync",
      desc: "link Auto Sync of the input",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  },
  hdrMode: {
    type: "state",
    common: {
      name: "hdr Mode",
      desc: "hdr Mode of the input",
      type: "number",
      role: "value",
      def: 0,
      read: true,
      write: true,
      states: {
        0: "Disabled",
        1: "Enabled"
      }
    },
    native: {}
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  behaviorChannelObj,
  behaviorInputObj,
  behaviorObj,
  capabilitiesObj,
  deviceChannelObj,
  deviceStateObj,
  executionChannelObj,
  executionObj,
  groupsObj,
  hdmiChannelObj,
  hdmiInputObj,
  hdmiObj,
  hueChannelObj,
  hueObj,
  musicObj,
  networkObj,
  updateObj,
  video_gameObj
});
//# sourceMappingURL=object_definition.js.map
