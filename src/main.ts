/*
 * Created with @iobroker/create-adapter v2.0.1
 */
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
import { ApiResult } from './interface/ApiResult';

// Global variables here

class HueSyncBox extends utils.Adapter {
	private timer: NodeJS.Timeout | null;
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: 'hue-sync-box',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
		this.timer = null;
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here
		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);
		// await this.createStates();
		// for (const devicesKey in this.config.devices) {
		// 	if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
		// 		const device = this.config.devices[devicesKey];
		// 		await this.createStates(device);
		// 	}
		// }
		await this.request();
	}
	//
	private async request(): Promise<void> {
		try {
			for (const devicesKey in this.config.devices) {
				if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
					const device = this.config.devices[devicesKey];
					const result = (await this.apiCall(`http://${device.ip}/api/v1`, device.token, 'GET')) as ApiResult;
					if (result) {
						await this.createStates(device, result);
						await this.writeState(result, Number(devicesKey));
					}
				}
			}

			// timer for request of 15 seconds
			if (this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(async () => {
				await this.request();
			}, 15000);
		} catch (error) {
			this.writeLog(
				`request error: ${error} , stack: ${error.stack}`,
				'error',
				true,
				`request error: ${error} , stack: ${error.stack}`,
			);
		}
	}

	private async writeState(result: ApiResult, key: number): Promise<void> {
		try {
			for (const [resultKey, resultValue] of Object.entries(result)) {
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
		} catch (error) {
			this.writeLog(
				`writeState error: ${error} , stack: ${error.stack}`,
				'error',
				true,
				`writeState error: ${error} , stack: ${error.stack}`,
			);
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
			this.writeLog(`response: ${JSON.stringify(response.data)}`, 'debug', false, response.data);
			return response.data;
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					this.writeLog(
						`error: ${error.response.status} ${error.response.message} - Authentication failed`,
						'error',
						true,
						`error: ${error.response.status} ${error.response.message} - Authentication failed`,
					);
					return;
				} else if (error.response.status === 404) {
					this.writeLog(
						`error: ${error.response.status} ${error.response.message} - Invalid URL Path`,
						'error',
						true,
						`error: ${error.response.status} ${error.response.message} - Invalid URL Path`,
					);
					return;
				} else if (error.response.status === 500) {
					this.writeLog(
						`error: ${error.response.status} ${error.response.message} - internal server error`,
						'error',
						true,
						`error: ${error.response.status} ${error.response.message} - internal server error`,
					);
					return;
				} else {
					this.writeLog(`error: ${error}`, 'error', true, `error: ${error}`);
					return;
				}
			} else {
				this.writeLog(
					`error Type ${error.name} error: ${error.code} Message: ${error.message}`,
					'error',
					true,
					error,
				);
			}
		}
	}

	private async createStates(device: ioBroker.Devices | undefined, result: ApiResult): Promise<void> {
		try {
			this.writeLog(`initializing Object creation`, 'debug', false);
			// const devices = this.config.devices;
			// create the states for the devices
			if (!device) return this.writeLog(`No devices configured`, 'warn', false);

			// get the current space and replace all special characters, so it can be used as id
			const room = await replaceFunktion(device.room);

			// create the device
			this.writeLog(`creating device with Name  bax_${await replaceFunktion(room)}`, 'debug', false);
			await this.setObjectNotExistsAsync(`box_${await replaceFunktion(room)}`, {
				type: 'device',
				common: {
					name: room,
				},
				native: {},
			});

			this.writeLog(`creating channel and states for device`, 'debug', false);
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
				}
			}

			for (const key in networkObj) {
				if (networkObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.wifi.${key}`, networkObj[key]);
				}
			}
			for (const key in updateObj) {
				if (updateObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.update.${key}`, updateObj[key]);
				}
			}
			for (const key in capabilitiesObj) {
				if (capabilitiesObj.hasOwnProperty(key)) {
					await this.setObjectNotExistsAsync(`box_${room}.device.capabilities.${key}`, capabilitiesObj[key]);
				}
			}

			this.writeLog(`creating channel and states for hue`, 'debug', false);
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
				}
			}
			for (const groupKey in result.hue.groups) {
				for (const key in groupsObj) {
					if (groupsObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${room}.hue.groups.${groupKey}.${key}`, groupsObj[key]);
					}
				}
			}

			this.writeLog(`creating channel and states for execution`, 'debug', false);
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
							}
						}
					} else {
						for (const key in musicObj) {
							if (musicObj.hasOwnProperty(key)) {
								await this.setObjectNotExistsAsync(
									`box_${room}.execution.${array[arrayKey]}.${key}`,
									musicObj[key],
								);
							}
						}
					}
				}
			}

			this.writeLog(`creating channel and states for hdmi`, 'debug', false);
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
				}
			}

			for (const key in hdmiInputObj) {
				if (hdmiInputObj.hasOwnProperty(key)) {
					for (let i = 1; i < 5; i++) {
						await this.setObjectNotExistsAsync(`box_${room}.hdmi.input${i}.${key}`, hdmiInputObj[key]);
					}
				}
				await this.setObjectNotExistsAsync(`box_${room}.hdmi.output.${key}`, hdmiInputObj[key]);
			}

			this.writeLog(`creating channel and states for behavior`, 'debug', false);
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
				}
			}

			for (const key in behaviorInputObj) {
				if (behaviorInputObj.hasOwnProperty(key)) {
					for (let i = 1; i < 5; i++) {
						await this.setObjectNotExistsAsync(
							`box_${room}.behavior.input${i}.${key}`,
							behaviorInputObj[key],
						);
					}
				}
			}

			this.subscribeForeignStates('0_userdata.0.example_state');

			this.writeLog(`all device / channel and states were created`, 'debug', false);
		} catch (error) {
			this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, 'error', false);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			if (this.timer) clearTimeout(this.timer);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * @description a function for log output
	 */
	private writeLog(
		logtext: string,
		logtype: 'silly' | 'info' | 'debug' | 'warn' | 'error',
		consoleLog: boolean,
		consoleLogMessage?: string,
	): void {
		try {
			if (logtype === 'silly') this.log.silly(logtext);
			if (logtype === 'info') this.log.info(logtext);
			if (logtype === 'debug') this.log.debug(logtext);
			if (logtype === 'warn') this.log.warn(logtext);
			if (logtype === 'error') this.log.error(logtext);
			if (consoleLog) console.log(consoleLogMessage);
		} catch (error) {
			this.log.error(`writeLog error: ${error} , stack: ${error.stack}`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
		if (state) {
			console.log('state: ', state.val);
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
			if (id === '0_userdata.0.example_state') {
				// await this.request('http://localhost:3000/api/v1');
				console.log('testVariable changed');
				for (const devicesKey in this.config.devices) {
					if (Object.prototype.hasOwnProperty.call(this.config.devices, devicesKey)) {
						const device = this.config.devices[devicesKey];
						await this.apiCall(`http://${device.ip}/api/v1`, device.token, 'GET');
					}
				}
			}
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
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
