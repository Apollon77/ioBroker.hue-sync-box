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
	networkObj,
	updateObj,
	video_game_musicObj,
} from './lib/object_definition';
// Load your modules here, e.g.:

// Global variables here

class HueSyncBox extends utils.Adapter {
	private rooms: any[];
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
		this.rooms = [];
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here
		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);
		await this.createStates();
	}
	//
	// private async request(url: string): Promise<void> {
	// 	try {
	// 		// let data = JSON.stringify({
	// 		// 	hdmi: {
	// 		// 		input4: {
	// 		// 			name: 'test4',
	// 		// 		},
	// 		// 	},
	// 		// });
	// 		// const data2 = JSON.stringify({
	// 		// 	syncActive: false,
	// 		// });
	//
	// 		const config = {
	// 			method: 'get',
	// 			url: url,
	// 			headers: {
	// 				Authorization: `Bearer ${this.config.devices[0].token}`,
	// 				'Content-Type': 'application/json',
	// 			},
	// 			// httpsAgent: new https.Agent({ rejectUnauthorized: false }),
	// 			// data: data,
	// 		};
	//
	// 		console.log('request');
	// 		const response = await axios(config);
	// 		// this.log.info('response: ' + JSON.stringify(response.data));
	// 		console.log('response: ', response.data);
	// 	} catch (error) {
	// 		this.log.error('error: ' + error);
	// 		console.log('error: ', error);
	// 	}
	// }

	private async createStates(): Promise<void> {
		try {
			this.writeLog(`initializing Object creation`, false, 'debug');
			const devices = this.config.devices;
			// create the states for the devices
			for (const device of devices) {
				this.writeLog(`creating device with Name  bax_${device.room}`, false, 'debug');
				// create the device
				await this.setObjectNotExistsAsync(`box_${device.room}`, {
					type: 'device',
					common: {
						name: device.room,
					},
					native: {},
				});

				this.writeLog(`creating channel and states for device`, false, 'debug');
				// create the channels and states for the device
				await this.setObjectNotExistsAsync(`box_${device.room}.device`, {
					type: 'channel',
					common: {
						name: 'device',
					},
					native: {},
				});

				for (const key in deviceChannelObj) {
					if (deviceChannelObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.device.${key}`, deviceChannelObj[key]);
					}
				}

				for (const key in deviceStateObj) {
					if (deviceStateObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.device.${key}`, deviceStateObj[key]);
					}
				}

				for (const key in networkObj) {
					if (networkObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.device.wifi.${key}`, networkObj[key]);
					}
				}
				for (const key in updateObj) {
					if (updateObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.device.update.${key}`, updateObj[key]);
					}
				}
				for (const key in capabilitiesObj) {
					if (capabilitiesObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(
							`box_${device.room}.device.capabilities.${key}`,
							capabilitiesObj[key],
						);
					}
				}

				this.writeLog(`creating channel and states for hue`, false, 'debug');
				await this.setObjectNotExistsAsync(`box_${device.room}.hue`, {
					type: 'channel',
					common: {
						name: 'hue',
					},
					native: {},
				});

				for (const key in hueChannelObj) {
					if (hueChannelObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.hue.${key}`, hueChannelObj[key]);
					}
				}

				for (const key in hueObj) {
					if (hueObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.hue.${key}`, hueObj[key]);
					}
				}
				for (const key in groupsObj) {
					if (groupsObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.hue.groups.${key}`, groupsObj[key]);
					}
				}

				this.writeLog(`creating channel and states for execution`, false, 'debug');
				await this.setObjectNotExistsAsync(`box_${device.room}.execution`, {
					type: 'channel',
					common: {
						name: 'execution',
					},
					native: {},
				});

				for (const key in executionChannelObj) {
					if (executionChannelObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(
							`box_${device.room}.execution.${key}`,
							executionChannelObj[key],
						);
					}
				}

				for (const key in executionObj) {
					if (executionObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.execution.${key}`, executionObj[key]);
					}
				}
				const array = ['game', 'music', 'video'];
				for (const key in video_game_musicObj) {
					for (const arrayKey in array) {
						if (video_game_musicObj.hasOwnProperty(key)) {
							await this.setObjectNotExistsAsync(
								`box_${device.room}.execution.${array[arrayKey]}.${key}`,
								video_game_musicObj[key],
							);
						}
					}
				}

				this.writeLog(`creating channel and states for hdmi`, false, 'debug');
				await this.setObjectNotExistsAsync(`box_${device.room}.hdmi`, {
					type: 'channel',
					common: {
						name: 'hdmi',
					},
					native: {},
				});

				for (const key in hdmiChannelObj) {
					if (hdmiChannelObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.${key}`, hdmiChannelObj[key]);
					}
				}

				for (const key in hdmiObj) {
					if (hdmiObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.${key}`, hdmiObj[key]);
					}
				}

				for (const key in hdmiInputObj) {
					if (hdmiInputObj.hasOwnProperty(key)) {
						for (let i = 1; i < 5; i++) {
							await this.setObjectNotExistsAsync(
								`box_${device.room}.hdmi.input${i}.${key}`,
								hdmiInputObj[key],
							);
						}
					}
					await this.setObjectNotExistsAsync(`box_${device.room}.hdmi.output.${key}`, hdmiInputObj[key]);
				}

				this.writeLog(`creating channel and states for behavior`, false, 'debug');
				await this.setObjectNotExistsAsync(`box_${device.room}.behavior`, {
					type: 'channel',
					common: {
						name: 'behavior',
					},
					native: {},
				});

				for (const key in behaviorChannelObj) {
					if (behaviorChannelObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(
							`box_${device.room}.behavior.${key}`,
							behaviorChannelObj[key],
						);
					}
				}

				for (const key in behaviorObj) {
					if (behaviorObj.hasOwnProperty(key)) {
						await this.setObjectNotExistsAsync(`box_${device.room}.behavior.${key}`, behaviorObj[key]);
					}
				}

				for (const key in behaviorInputObj) {
					if (behaviorInputObj.hasOwnProperty(key)) {
						for (let i = 1; i < 5; i++) {
							await this.setObjectNotExistsAsync(
								`box_${device.room}.behavior.input${i}.${key}`,
								behaviorInputObj[key],
							);
						}
					}
				}
			}
			this.writeLog(`all device / channel and states were created`, false, 'debug');
		} catch (error) {
			this.writeLog(`[createObjects] ${error.message} Stack: ${error.stack}`, false, 'error');
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

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
		consoleLog: boolean,
		logtype: 'silly' | 'info' | 'debug' | 'warn' | 'error',
	): void {
		try {
			if (logtype === 'silly') this.log.silly(logtext);
			if (logtype === 'info') this.log.info(logtext);
			if (logtype === 'debug') this.log.debug(logtext);
			if (logtype === 'warn') this.log.warn(logtext);
			if (logtype === 'error') this.log.error(logtext);
			if (consoleLog) console.log(logtext);
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
			if (id === this.namespace + '.testVariable') {
				// await this.request('http://localhost:3000/api/v1');
				await this.createStates();
				console.log('testVariable changed');
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
