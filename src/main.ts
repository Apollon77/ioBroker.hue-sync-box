// TODO: API https://developers.meethue.com/develop/hue-entertainment/hue-hdmi-sync-box-api/#Device%20Discovery
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import {
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
	video_gameObj,
} from './lib/object_definition';
import * as https from 'https';
import axios from 'axios';
// Load your modules here, e.g.:
import { replaceFunktion } from './lib/replaceFunktion';
import { ApiResult } from './interface/apiResult';

// Global variables here

class HueSyncBox extends utils.Adapter {
	private requestTimer: NodeJS.Timeout | null;
	private subscribedStates: string[];
	private createdData: boolean;
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: 'hue-sync-box',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
		this.requestTimer = null;
		this.subscribedStates = [];
		this.createdData = false;
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here
		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);
		this.createdData = false;
		await this.request();
	}
	//
	private async request(): Promise<void> {
		try {
			for (const devicesKey in this.config.devices) {
				if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
					const device = this.config.devices[devicesKey];
					const result = await this.apiCall(`https://${device.ip}/api/v1`, device.token, 'GET');
					if (result.status === 200) {
						// if (!this.createdData) {
						this.writeLog('create data', 'debug');
						await this.createStates(device, result);
						this.createdData = true;
						this.setState('info.connection', true, true);
						// }
						await this.writeState(result, Number(devicesKey));
					}
				}
			}

			// timer for request of 15 seconds
			if (this.requestTimer) clearTimeout(this.requestTimer);
			this.requestTimer = setTimeout(async () => {
				await this.request();
			}, 15000);
		} catch (error) {
			this.writeLog(`request error: ${error} , stack: ${error.stack}`, 'error');
		}
	}

	private async writeState(result: { data: ApiResult }, key: number): Promise<void> {
		try {
			const data = result.data as ApiResult;
			if (data === undefined) {
				this.writeLog('no data received', 'error');
				return;
			}
			// write state of device
			this.writeLog(`prepare to write the data for ${this.config.devices[key].room}`, 'debug');
			for (const [resultKey, resultValue] of Object.entries(data)) {
				if (typeof resultValue === 'object') {
					for (const [valueKey, value] of Object.entries(resultValue)) {
						if (typeof value !== 'object') {
							if (resultKey !== 'ir' && resultKey !== 'registrations' && resultKey !== 'presets') {
								await this.setStateAsync(
									`box_${await replaceFunktion(
										this.config.devices[key].room,
									)}.${resultKey}.${valueKey}`,
									{
										val: value as any,
										ack: true,
									},
								);
							}
						} else {
							if (resultKey !== 'ir' && resultKey !== 'registrations' && resultKey !== 'presets') {
								for (const value1Key in value) {
									const valueObjKey = value1Key as keyof typeof value;

									if (Object.prototype.hasOwnProperty.call(value, valueObjKey)) {
										if (resultKey === 'hue') {
											for (const [hueGroupKey, hueGroupValue] of Object.entries(
												value[valueObjKey],
											)) {
												await this.setStateAsync(
													`box_${await replaceFunktion(
														this.config.devices[key].room,
													)}.${resultKey}.${valueKey}.${valueObjKey}.${hueGroupKey}`,
													{
														val: hueGroupValue as any,
														ack: true,
													},
												);
											}
										} else {
											await this.setStateAsync(
												`box_${await replaceFunktion(
													this.config.devices[key].room,
												)}.${resultKey}.${valueKey}.${valueObjKey}`,
												{
													val: value[valueObjKey] as any,
													ack: true,
												},
											);
										}
									}
								}
							}
						}
					}
				}
			}
			this.writeLog(`all data for ${this.config.devices[key].room} written`, 'debug');
		} catch (error) {
			this.writeLog(`writeState error: ${error} , stack: ${error.stack}`, 'error');
		}
	}

	private async apiCall(url: string, token: string, method: string, data?: any): Promise<any> {
		try {
			// create config for axios
			const config = {
				method: method,
				url: url,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				data: data,
			};

			// send request
			const response = await axios(config);
			this.writeLog(`response: ${JSON.stringify(response.data)}`, 'debug');
			return response;
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					this.writeLog(`error: ${error.response.status} ${error.message} - Authentication failed`, 'error');
					return error.response;
				} else if (error.response.status === 404) {
					this.writeLog(`error: ${error.response.status} ${error.message} - Invalid URL Path`, 'error');
					return error.response;
				} else if (error.response.status === 500) {
					this.writeLog(`error: ${error.response.status} ${error.message} - internal server error`, 'error');
					return;
				} else {
					this.writeLog(`error: ${error}`, 'error');
					return error.response;
				}
			} else {
				this.writeLog(`error Type ${error.name} error: ${error.code} Message: ${error.message}`, 'error');
			}
		}
	}

	private async sendCommand(id: string, state: ioBroker.State): Promise<void> {
		try {
			this.writeLog(`prepare to send the command for ${id}`, 'debug');

			// get the room from the id
			const room = id.split('.')[0].replace('box_', '');
			// get the channel from the id
			const channel = id.split('.')[1];
			// get the channel2 from the id
			const channel2 = id.split('.')[2];
			// get the channel3 from the id
			const channel3 = id.split('.')[3];
			// get the command from the id
			const commandWord = id.split('.').pop();

			// find the config for the room in the config
			const boxConfig = this.config.devices.find(
				async (boxConfig) => (await replaceFunktion(boxConfig.room)) === room,
			);
			this.writeLog(`get the boxConfig: ${JSON.stringify(boxConfig)}`, 'debug');

			// if no config was found, return
			if (!boxConfig) {
				this.writeLog(`no boxConfig found for ${room}`, 'error');
				return;
			}

			// create the Url for the request
			let url: string;
			// check all the channels and add the channel2 and channel3 to the url
			if (channel3 !== undefined) {
				// check if the channel3 same as the commandWord
				if (commandWord === channel3) {
					url = `https://${boxConfig?.ip}/api/v1/${channel}/${channel2}`;
				} else {
					// if not, add the channel3 to the url
					url = `https://${boxConfig?.ip}/api/v1/${channel}/${channel2}/${channel3}`;
				}
			} else {
				// check if the commandWord same as the channel2
				if (commandWord === channel2) {
					url = `https://${boxConfig?.ip}/api/v1/${channel}`;
				} else {
					// if not, add the channel2 to the url
					url = `https://${boxConfig?.ip}/api/v1/${channel}/${channel2}`;
				}
			}
			this.writeLog(`assemble the url ${url}`, 'debug');

			// send the request
			this.writeLog(`send the request to ${url}`, 'debug');
			const response = await this.apiCall(url, boxConfig.token, 'put', { [commandWord as string]: state.val });
			// check if the request was successful
			if (response.status === 200) {
				this.writeLog(`${id} was changed to ${state.val}`, 'debug');
				await this.setStateAsync(id, state.val, true);
			}
		} catch (error) {
			this.writeLog(`[sendCommand] ${error.message} Stack: ${error.stack}`, 'error');
		}
	}

	private async createStates(device: ioBroker.Devices | undefined, result: { data: ApiResult }): Promise<void> {
		try {
			const data = result.data as ApiResult;
			if (data === undefined) {
				this.writeLog('no data received', 'error');
				return;
			}
			this.writeLog(`initializing Object creation`, 'debug');

			// create the states for the devices
			if (!device) return this.writeLog(`No devices configured`, 'warn');

			// get the current space and replace all special characters, so it can be used as id
			const room = await replaceFunktion(device.room);

			// create the device
			this.writeLog(`creating device with Name  box_${await replaceFunktion(room)}`, 'debug');
			await this.setObjectNotExistsAsync(`box_${await replaceFunktion(room)}`, {
				type: 'device',
				common: {
					name: room,
				},
				native: {},
			});

			this.writeLog(`creating channel and states for device`, 'debug');
			// create the channels and states for the device
			await this.setObjectNotExistsAsync(`box_${await replaceFunktion(room)}.device`, {
				type: 'channel',
				common: {
					name: 'device',
				},
				native: {},
			});

			for (const key in deviceChannelObj) {
				if (deviceChannelObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.${key}`, deviceChannelObj[key]);
				}
			}

			for (const key in deviceStateObj) {
				if (deviceStateObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.${key}`, deviceStateObj[key]);
					// check if the state may be described
					if (deviceStateObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.device.${key}`)) {
							this.writeLog(`subscribe state box_${room}.device.${key}`, 'debug');
							this.subscribeStates(`box_${room}.device.${key}`);
							this.subscribedStates.push(`box_${room}.device.${key}`);
						}
					}
				}
			}

			for (const key in networkObj) {
				if (networkObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.wifi.${key}`, networkObj[key]);
					// check if the state may be described
					if (networkObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.device.wifi.${key}`)) {
							this.writeLog(`subscribe state box_${room}.device.wifi.${key}`, 'debug');
							this.subscribeStates(`box_${room}.device.wifi.${key}`);
							this.subscribedStates.push(`box_${room}.device.wifi.${key}`);
						}
					}
				}
			}
			for (const key in updateObj) {
				if (updateObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.update.${key}`, updateObj[key]);
					// check if the state may be described
					if (updateObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.device.update.${key}`)) {
							this.writeLog(`subscribe state box_${room}.device.update.${key}`, 'debug');
							this.subscribeStates(`box_${room}.device.update.${key}`);
							this.subscribedStates.push(`box_${room}.device.update.${key}`);
						}
					}
				}
			}
			for (const key in capabilitiesObj) {
				if (capabilitiesObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.capabilities.${key}`, capabilitiesObj[key]);
					// check if the state may be described
					if (capabilitiesObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.device.capabilities.${key}`)) {
							this.writeLog(`subscribe state box_${room}.device.capabilities.${key}`, 'debug');
							this.subscribeStates(`box_${room}.device.capabilities.${key}`);
							this.subscribedStates.push(`box_${room}.device.capabilities.${key}`);
						}
					}
				}
			}

			this.writeLog(`creating channel and states for hue`, 'debug');
			await this.setObjectNotExistsAsync(`box_${room}.hue`, {
				type: 'channel',
				common: {
					name: 'hue',
				},
				native: {},
			});

			for (const key in hueChannelObj) {
				if (hueChannelObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.hue.${key}`, hueChannelObj[key]);
				}
			}

			for (const key in hueObj) {
				if (hueObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.hue.${key}`, hueObj[key]);
					// check if the state may be described
					if (hueObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.hue.${key}`)) {
							this.writeLog(`subscribe state box_${room}.hue.${key}`, 'debug');
							this.subscribeStates(`box_${room}.hue.${key}`);
							this.subscribedStates.push(`box_${room}.hue.${key}`);
						}
					}
				}
			}
			for (const groupKey in data.hue.groups) {
				for (const key in groupsObj) {
					if (groupsObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${room}.hue.groups.${groupKey}.${key}`, groupsObj[key]);
						// check if the state may be described
						if (groupsObj[key].common.write) {
							// check if the state is in subscribedStates
							if (!this.subscribedStates.includes(`box_${room}.hue.groups.${groupKey}.${key}`)) {
								this.writeLog(`subscribe state box_${room}.hue.groups.${groupKey}.${key}`, 'debug');
								this.subscribeStates(`box_${room}.hue.groups.${groupKey}.${key}`);
								this.subscribedStates.push(`box_${room}.hue.groups.${groupKey}.${key}`);
							}
						}
					}
				}
			}

			this.writeLog(`creating channel and states for execution`, 'debug');
			await this.setObjectNotExistsAsync(`box_${room}.execution`, {
				type: 'channel',
				common: {
					name: 'execution',
				},
				native: {},
			});

			for (const key in executionChannelObj) {
				if (executionChannelObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.execution.${key}`, executionChannelObj[key]);
				}
			}

			for (const key in executionObj) {
				if (executionObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.execution.${key}`, executionObj[key]);
					// check if the state may be described
					if (executionObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.execution.${key}`)) {
							this.writeLog(`subscribe state box_${room}.execution.${key}`, 'debug');
							this.subscribeStates(`box_${room}.execution.${key}`);
							this.subscribedStates.push(`box_${room}.execution.${key}`);
						}
					}
				}
			}
			const array = ['game', 'music', 'video'];
			for (const arrayKey in array) {
				if (array.hasOwnProperty(arrayKey)) {
					if (array[arrayKey] !== 'music') {
						for (const key in video_gameObj) {
							if (video_gameObj.hasOwnProperty(key)) {
								await this.setObjectNotExistsAsync(
									`box_${room}.execution.${array[arrayKey]}.${key}`,
									video_gameObj[key],
								);
								// check if the state may be described
								if (video_gameObj[key].common.write) {
									// check if the state is in subscribedStates
									if (
										!this.subscribedStates.includes(
											`box_${room}.execution.${array[arrayKey]}.${key}`,
										)
									) {
										this.writeLog(
											`subscribe state box_${room}.execution.${array[arrayKey]}.${key}`,
											'debug',
										);
										this.subscribeStates(`box_${room}.execution.${array[arrayKey]}.${key}`);
										this.subscribedStates.push(`box_${room}.execution.${array[arrayKey]}.${key}`);
									}
								}
							}
						}
					} else {
						for (const key in musicObj) {
							if (musicObj.hasOwnProperty(key)) {
								await this.setObjectNotExistsAsync(
									`box_${room}.execution.${array[arrayKey]}.${key}`,
									musicObj[key],
								);
								// check if the state may be described
								if (musicObj[key].common.write) {
									// check if the state is in subscribedStates
									if (
										!this.subscribedStates.includes(
											`box_${room}.execution.${array[arrayKey]}.${key}`,
										)
									) {
										this.writeLog(
											`subscribe state box_${room}.execution.${array[arrayKey]}.${key}`,
											'debug',
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

			this.writeLog(`creating channel and states for hdmi`, 'debug');
			await this.setObjectNotExistsAsync(`box_${room}.hdmi`, {
				type: 'channel',
				common: {
					name: 'hdmi',
				},
				native: {},
			});

			for (const key in hdmiChannelObj) {
				if (hdmiChannelObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.hdmi.${key}`, hdmiChannelObj[key]);
				}
			}

			for (const key in hdmiObj) {
				if (hdmiObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.hdmi.${key}`, hdmiObj[key]);
					// check if the state may be described
					if (hdmiObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.hdmi.${key}`)) {
							this.writeLog(`subscribe state box_${room}.hdmi.${key}`, 'debug');
							this.subscribeStates(`box_${room}.hdmi.${key}`);
							this.subscribedStates.push(`box_${room}.hdmi.${key}`);
						}
					}
				}
			}

			for (const key in hdmiInputObj) {
				if (hdmiInputObj.hasOwnProperty(key)) {
					for (let i = 1; i < 5; i++) {
						await this.setObjectNotExistsAsync(`box_${room}.hdmi.input${i}.${key}`, hdmiInputObj[key]);
						// check if the state may be described
						if (hdmiInputObj[key].common.write) {
							// check if the state is in subscribedStates
							if (!this.subscribedStates.includes(`box_${room}.hdmi.input${i}.${key}`)) {
								this.writeLog(`subscribe state box_${room}.hdmi.input${i}.${key}`, 'debug');
								this.subscribeStates(`box_${room}.hdmi.input${i}.${key}`);
								this.subscribedStates.push(`box_${room}.hdmi.input${i}.${key}`);
							}
						}
					}
				}
				await this.setObjectNotExistsAsync(`box_${room}.hdmi.output.${key}`, hdmiInputObj[key]);
				// check if the state may be described
				if (hdmiInputObj[key].common.write) {
					// check if the state is in subscribedStates
					if (!this.subscribedStates.includes(`box_${room}.hdmi.output.${key}`)) {
						this.writeLog(`subscribe state box_${room}.hdmi.output.${key}`, 'debug');
						this.subscribeStates(`box_${room}.hdmi.output.${key}`);
						this.subscribedStates.push(`box_${room}.hdmi.output.${key}`);
					}
				}
			}

			this.writeLog(`creating channel and states for behavior`, 'debug');
			await this.setObjectNotExistsAsync(`box_${room}.behavior`, {
				type: 'channel',
				common: {
					name: 'behavior',
				},
				native: {},
			});

			for (const key in behaviorChannelObj) {
				if (behaviorChannelObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.behavior.${key}`, behaviorChannelObj[key]);
				}
			}

			for (const key in behaviorObj) {
				if (behaviorObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.behavior.${key}`, behaviorObj[key]);
					// check if the state may be described
					if (behaviorObj[key].common.write) {
						// check if the state is in subscribedStates
						if (!this.subscribedStates.includes(`box_${room}.behavior.${key}`)) {
							this.writeLog(`subscribe state box_${room}.behavior.${key}`, 'debug');
							this.subscribeStates(`box_${room}.behavior.${key}`);
							this.subscribedStates.push(`box_${room}.behavior.${key}`);
						}
					}
				}
			}

			for (const key in behaviorInputObj) {
				if (behaviorInputObj.hasOwnProperty(key)) {
					for (let i = 1; i < 5; i++) {
						await this.setObjectNotExistsAsync(
							`box_${room}.behavior.input${i}.${key}`,
							behaviorInputObj[key],
						);
						// check if the state may be described
						if (behaviorInputObj[key].common.write) {
							// check if the state is in subscribedStates
							if (!this.subscribedStates.includes(`box_${room}.behavior.input${i}.${key}`)) {
								this.writeLog(`subscribe state box_${room}.behavior.input${i}.${key}`, 'debug');
								this.subscribeStates(`box_${room}.behavior.input${i}.${key}`);
								this.subscribedStates.push(`box_${room}.behavior.input${i}.${key}`);
							}
						}
					}
				}
			}

			this.writeLog(`all device / channel and states were created for ${room}`, 'debug');
		} catch (error) {
			this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, 'error');
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			if (this.requestTimer) clearTimeout(this.requestTimer);
			this.setState('info.connection', false, true);
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * @description a function for log output
	 */
	private writeLog(logText: string, logType: 'silly' | 'info' | 'debug' | 'warn' | 'error'): void {
		try {
			if (logType === 'silly') this.log.silly(logText);
			if (logType === 'info') this.log.info(logText);
			if (logType === 'debug') this.log.debug(logText);
			if (logType === 'warn') this.log.warn(logText);
			if (logType === 'error') this.log.error(logText);
		} catch (error) {
			this.log.error(`writeLog error: ${error} , stack: ${error.stack}`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
		if (state) {
			// console.log('state: ', state);
			if (state.from === 'system.adapter.' + this.namespace) {
				// ignore the state change from the adapter itself
				return;
			} else {
				this.writeLog(`state ${id} changed: ${state.val} (ack = ${state.ack})`, 'debug');
				if (state.ack) return; // ignore the state change from the adapter itself
				// remove the adapter name from the id
				const idWithoutAdapterName = id.replace(this.namespace + '.', '');
				// check if the state is in subscribedStates
				if (this.subscribedStates.includes(idWithoutAdapterName)) {
					// send the command to the box
					await this.sendCommand(idWithoutAdapterName, state);
				}
			}
		} else {
			return;
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new HueSyncBox(options);
} else {
	// otherwise start the instance directly
	(() => new HueSyncBox())();
}
