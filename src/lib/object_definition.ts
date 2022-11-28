// Device
export const deviceChannelObj: { [key: string]: any } = {
	// Root object for Wifi information
	wifi: {
		type: 'channel',
		common: {
			name: 'Wifi',
			desc: 'Wifi information',
		},
		native: {},
	},
	// Root object for automatic update configuration
	update: {
		type: 'channel',
		common: {
			name: 'Update',
			desc: 'Automatic update configuration',
		},
		native: {},
	},
	// Root object for capabilities resource
	capabilities: {
		type: 'channel',
		common: {
			name: 'Capabilities',
			desc: 'Capabilities resource',
		},
		native: {},
	},
};
export const deviceStateObj: { [key: string]: any } = {
	// Friendly name of the device
	name: {
		type: 'state',
		common: {
			name: 'name',
			desc: 'name of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// Device Type identifier – currently fixed to HSB1
	deviceType: {
		type: 'state',
		common: {
			name: 'device Type',
			desc: 'Device Type identifier',
			type: 'string',
			role: 'text',
			def: 'HSB1',
			read: true,
			write: false,
		},
		native: {},
	},
	// Capitalized hex string of the 6 byte / 12 characters device id without delimiters. Used as unique id on label, certificate common name, hostname etc.
	uniqueId: {
		type: 'state',
		common: {
			name: 'unique Id',
			desc: 'unique Id of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// Local IP address of the device
	ipAddress: {
		type: 'state',
		common: {
			name: 'IP Address',
			desc: 'ip Address of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// Increased between firmware versions when api changes. Only apiLevel >= 7 is supported.
	apiLevel: {
		type: 'state',
		common: {
			name: 'API Level',
			desc: 'api Level of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
	// User readable version of the device firmware, starting with decimal major .minor .maintenance format e.g. “1.12.3”
	firmwareVersion: {
		type: 'state',
		common: {
			name: 'firmware Version',
			desc: 'firmware Version of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// User readable version of the firmware the device can upgrade to. Item is set to null when there is no update available.
	updatableFirmwareVersion: {
		type: 'state',
		common: {
			name: 'updatable Firmware Version',
			desc: 'updatable Firmware Version of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// Build number of the firmware. Unique for every build with newer builds guaranteed a higher number than older.
	buildNumber: {
		type: 'state',
		common: {
			name: 'build Number',
			desc: 'build Number of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
	// Build number that is available to update to. Item is set to null when there is no update available.
	updatableBuildNumber: {
		type: 'state',
		common: {
			name: 'updatable Build Number',
			desc: 'updatable Build Number of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
	// UTC time when last check for update was performed.
	lastCheckedUpdate: {
		type: 'state',
		common: {
			name: 'last Checked Update',
			desc: 'last Checked Update of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// 1 = regular; 0 = off in powersave, passthrough or sync mode; 2 = dimmed in powersave or passthrough mode and off in sync mode
	ledMode: {
		type: 'state',
		common: {
			name: 'LED Mode',
			desc: 'led Mode of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: true,
			states: {
				0: 'off',
				1: 'regular',
				2: 'dimmed',
			},
		},
		native: {},
	},
	// none, doSoftwareRestart,  doFirmwareUpdate
	action: {
		type: 'state',
		common: {
			name: 'action',
			desc: 'action of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				none: 'none',
				doSoftwareRestart: 'doSoftwareRestart',
				doFirmwareUpdate: 'doFirmwareUpdate',
			},
		},
		native: {},
	},
	// uninitialized, disconnected, lan, wan
	wifiState: {
		type: 'state',
		common: {
			name: 'wifi State',
			desc: 'wifi State of the device',
			type: 'string',
			role: 'text',
			def: 'disconnected',
			read: true,
			write: false,
			states: {
				uninitialized: 'uninitialized',
				disconnected: 'disconnected',
				lan: 'lan',
				wan: 'wan',
			},
		},
		native: {},
	},
	termsAgreed: {
		type: 'state',
		common: {
			name: 'terms Agreed',
			desc: 'terms Agreed of the device',
			type: 'boolean',
			role: 'indicator',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
	pushlink: {
		type: 'state',
		common: {
			name: 'pushlink',
			desc: 'pushlink of the device',
			type: 'string',
			role: 'text',
			def: 'idle',
			read: true,
			write: false,
		},
		native: {},
	},
	beta: {
		type: 'state',
		common: {
			name: 'beta',
			desc: 'beta of the device',
			type: 'boolean',
			role: 'indicator',
			def: false,
			read: true,
			write: false,
		},
		native: {},
	},
};
export const networkObj: { [key: string]: any } = {
	// Wifi SSID
	ssid: {
		type: 'state',
		common: {
			name: 'ssid',
			desc: 'ssid of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// Wifi strength 0 = not connected; 1 = weak; 2 = fair; 3 = good; 4 = excellent
	strength: {
		type: 'state',
		common: {
			name: 'strength',
			desc: 'strength of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
			states: {
				0: 'not connected',
				1: 'weak',
				2: 'fair',
				3: 'good',
				4: 'excellent',
			},
		},
		native: {},
	},
};
export const updateObj: { [key: string]: any } = {
	/**
	 * Sync Box checks daily for a firmware update.
	 * If true, an available update will automatically be installed.
	 * This will be postponed if Sync Box is passing through content to the TV and being used.
	 */
	autoUpdateEnabled: {
		type: 'state',
		common: {
			name: 'Auto Update Enabled',
			desc: 'If true, an available update will automatically be installed.',
			type: 'boolean',
			role: 'switch',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
	/**
	 * UTC hour when the automatic update will check and execute, values 0 – 23.
	 * Default is 10. Ideally this value should be set to 3AM according to user’s timezone.
	 */
	autoUpdateTime: {
		type: 'state',
		common: {
			name: 'Auto Update Time',
			desc: 'UTC hour when the automatic update will check and execute, values 0 – 23.',
			type: 'number',
			role: 'value',
			def: 10,
			read: true,
			write: true,
		},
		native: {},
	},
};
export const capabilitiesObj: { [key: string]: any } = {
	// The total number of IR codes configurable
	maxIrCodes: {
		type: 'state',
		common: {
			name: 'max Ir Codes',
			desc: 'max Ir Codes of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
	// The total number of Presets configurable
	maxPresets: {
		type: 'state',
		common: {
			name: 'max Presets',
			desc: 'max Presets of the device',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
};
// Hue
export const hueChannelObj: { [key: string]: any } = {
	/**
	 * All available entertainment areas on the current bridge.
	 * When this object is not available, it means the bridge areas have not been retrieved yet.
	 * When the object is empty, it means there are no entertainment areas on the bridge.
	 * When the bridge connection is lost, the last known values are remembered.
	 * Determining whether values may be outdated can be done based on connectionState.
	 */
	groups: {
		type: 'channel',
		common: {
			name: 'Groups',
			desc: 'All available entertainment areas on the current bridge.',
		},
		native: {},
	},
};
export const hueObj: { [key: string]: any } = {
	// 16 character ascii hex string bridge identifier
	bridgeUniqueId: {
		type: 'state',
		common: {
			name: 'bridge Unique Id',
			desc: 'bridge Unique Id of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// Readable, dot IPv4 address of the paired bridge EG “192.168.1.50”
	bridgeIpAddress: {
		type: 'state',
		common: {
			name: 'bridge Ip Address',
			desc: 'bridge Ip Address of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	groupId: {
		type: 'state',
		common: {
			name: 'group Id',
			desc: 'group Id of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	//connection State =  uninitialized, disconnected, connecting, unauthorized, connected, invalidgroup, streaming
	connectionState: {
		type: 'state',
		common: {
			name: 'connection State',
			desc: 'connection State of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
			states: {
				uninitialized: 'uninitialized',
				disconnected: 'disconnected',
				connecting: 'connecting',
				unauthorized: 'unauthorized',
				connected: 'connected',
				invalidgroup: 'invalidgroup',
				streaming: 'streaming',
			},
		},
		native: {},
	},
};
export const groupsObj: { [key: string]: any } = {
	// Friendly name of the entertainment area
	name: {
		type: 'state',
		common: {
			name: 'name',
			desc: 'name of the group',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// Number of lights in the entertainment area
	numLights: {
		type: 'state',
		common: {
			name: 'Number of lights',
			desc: 'Number of lights in the group',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: false,
		},
		native: {},
	},
	// active state of the entertainment area
	active: {
		type: 'state',
		common: {
			name: 'active',
			desc: 'active state of the group',
			type: 'boolean',
			role: 'switch',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
	// Only exposed if active is true
	owner: {
		type: 'state',
		common: {
			name: 'owner',
			desc: 'owner of the group',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
};
// execution
export const executionChannelObj: { [key: string]: any } = {
	// Root for video subresource
	video: {
		type: 'channel',
		common: {
			name: 'Video',
			desc: 'Video subresource',
		},
		native: {},
	},
	// Root for game subresource
	game: {
		type: 'channel',
		common: {
			name: 'Game',
			desc: 'Game subresource',
		},
		native: {},
	},
	// Root for music subresource
	music: {
		type: 'channel',
		common: {
			name: 'Music',
			desc: 'Music subresource',
		},
		native: {},
	},
};
export const executionObj: { [key: string]: any } = {
	/**
	 * Reports false in case of powersave or passthrough mode, and true in case of video, game, music, or ambient mode.
	 * When changed from false to true, it will start syncing in last used mode for current source.
	 * Requires hue /connectionState to be connected. When changed from true to false, will set passthrough mode.
	 */
	syncActive: {
		type: 'state',
		common: {
			name: 'sync Active',
			desc: 'sync Active of the device',
			type: 'boolean',
			role: 'switch',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
	/**
	 * Reports false in case of powersave mode, and true in case of passthrough, video, game, music or ambient mode.
	 * When changed from false to true, it will set passthrough mode.
	 * When changed from true to false, will set powersave mode.
	 */
	hdmiActive: {
		type: 'state',
		common: {
			name: 'hdmi Active',
			desc: 'hdmi Active of the device',
			type: 'boolean',
			role: 'switch',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
	/**
	 * powersave, passthrough, video, game, music, ambient (More modes can be added in the future, so clients must gracefully handle modes they don’t recognize)
	 */
	mode: {
		type: 'state',
		common: {
			name: 'mode',
			desc: 'mode of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				powersave: 'powersave',
				passthrough: 'passthrough',
				video: 'video',
				game: 'game',
				music: 'music',
				ambient: 'ambient',
			},
		},
		native: {},
	},
	// lastSyncMode video, game, music, ambient
	lastSyncMode: {
		type: 'state',
		common: {
			name: 'lastSyncMode',
			desc: 'lastSyncMode of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
			states: {
				video: 'video',
				game: 'game',
				music: 'music',
				ambient: 'ambient',
			},
		},
		native: {},
	},
	// input1, input2, input3, input4 (currently selected hdmi input)
	hdmiSource: {
		type: 'state',
		common: {
			name: 'hdmi Source',
			desc: 'hdmi Source of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				input1: 'input1',
				input2: 'input2',
				input3: 'input3',
				input4: 'input4',
			},
		},
		native: {},
	},
	/**
	 * Currently selected entertainment area (/groups/<id> for entertainment group on bridge api v1,
	 * and entertainment configuration <id> in UUID format for bridge api v2)
	 */
	hueTarget: {
		type: 'state',
		common: {
			name: 'hue Target',
			desc: 'hue Target of the device',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// 0 – 200 (100 = no brightness reduction/boost compared to input, 0 = max reduction, 200 = max boost)
	brightness: {
		type: 'state',
		common: {
			name: 'brightness',
			desc: 'brightness of the device',
			type: 'number',
			role: 'level',
			def: 100,
			read: true,
			write: true,
			min: 0,
			max: 200,
		},
		native: {},
	},
	// true toggles syncActive
	toggleSyncActive: {
		type: 'state',
		common: {
			name: 'toggle Sync Active',
			desc: 'toggle Sync Active true toggles syncActive',
			type: 'boolean',
			role: 'button',
			def: true,
			read: true,
			write: true,
		},
		native: {},
	},
	// true toggles hdmiActive
	toggleHdmiActive: {
		type: 'state',
		common: {
			name: 'toggle Hdmi Active',
			desc: 'toggle Hdmi Active true toggles hdmiActive',
			type: 'boolean',
			role: 'button',
			def: true,
			read: true,
			write: true,
		},
		native: {},
	},
	// next, previous
	cycleSyncMode: {
		type: 'state',
		common: {
			name: 'cycle Sync Mode',
			desc: 'cycle Sync Mode next, previous',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				next: 'next',
				previous: 'previous',
			},
		},
		native: {},
	},
	cycleHdmiSource: {
		type: 'state',
		common: {
			name: 'cycle Hdmi Source',
			desc: 'cycle Hdmi Source next, previous',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				next: 'next',
				previous: 'previous',
			},
		},
		native: {},
	},
	// incrementBrightness -200 to 200
	incrementBrightness: {
		type: 'state',
		common: {
			name: 'increment Brightness',
			desc: 'increment Brightness -200 to 200',
			type: 'number',
			role: 'level',
			def: 0,
			read: true,
			write: true,
			min: -200,
			max: 200,
		},
		native: {},
	},
	// next, previous (cycle intensity of current mode if syncing)
	cycleIntensity: {
		type: 'state',
		common: {
			name: 'cycle Intensity',
			desc: 'next, previous (cycle intensity of current mode if syncing)',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				next: 'next',
				previous: 'previous',
			},
		},
		native: {},
	},
	// subtle, moderate, high, intense (if syncing)
	intensity: {
		type: 'state',
		common: {
			name: 'intensity',
			desc: 'subtle, moderate, high, intense (if syncing)',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				subtle: 'subtle',
				moderate: 'moderate',
				high: 'high',
				intense: 'intense',
			},
		},
		native: {},
	},
	// Preset identifier, that will be executed
	preset: {
		type: 'state',
		common: {
			name: 'preset',
			desc: 'Preset identifier, that will be executed',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
};
export const video_gameObj: { [key: string]: any } = {
	//subtle, moderate, high, intense
	intensity: {
		type: 'state',
		common: {
			name: 'intensity',
			desc: 'intensity of the video',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// backgroundLighting
	backgroundLighting: {
		type: 'state',
		common: {
			name: 'backgroundLighting',
			desc: 'backgroundLighting of the video',
			type: 'boolean',
			role: 'switch',
			def: false,
			read: true,
			write: true,
		},
		native: {},
	},
};
export const musicObj: { [key: string]: any } = {
	//subtle, moderate, high, intense
	intensity: {
		type: 'state',
		common: {
			name: 'intensity',
			desc: 'intensity of the video',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	// happyEnergetic, happyCalm, melancholicCalm, melancholic Energetic, neutral
	palette: {
		type: 'state',
		common: {
			name: 'backgroundLighting',
			desc: 'backgroundLighting of the video',
			type: 'string',
			role: 'text',
			def: 'neutral',
			read: true,
			write: true,
			states: {
				happyEnergetic: 'happyEnergetic',
				happyCalm: 'happyCalm',
				melancholicCalm: 'melancholicCalm',
				melancholicEnergetic: 'melancholicEnergetic',
				neutral: 'neutral',
			},
		},
		native: {},
	},
};
// HDMI
export const hdmiChannelObj: { [key: string]: any } = {
	// Root object for each of the 4 hdmi input subresources and output
	input1: {
		type: 'channel',
		common: {
			name: 'Input 1',
			desc: 'HDMI input 1',
		},
		native: {},
	},
	input2: {
		type: 'channel',
		common: {
			name: 'Input 2',
			desc: 'HDMI input 2',
		},
		native: {},
	},
	input3: {
		type: 'channel',
		common: {
			name: 'Input 3',
			desc: 'HDMI input 3',
		},
		native: {},
	},
	input4: {
		type: 'channel',
		common: {
			name: 'Input 4',
			desc: 'HDMI input 4',
		},
		native: {},
	},
	output: {
		type: 'channel',
		common: {
			name: 'Output',
			desc: 'HDMI output',
		},
		native: {},
	},
};
export const hdmiObj: { [key: string]: any } = {
	// <horizontal pixels> x <vertical pixels> @ <framerate fpks> – <HDR>
	contentSpecs: {
		type: 'state',
		common: {
			name: 'content Specs',
			desc: 'content Specs of the HDMI input',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
		},
		native: {},
	},
	// Current content specs supported for video sync (video/game mode)
	videoSyncSupported: {
		type: 'state',
		common: {
			name: 'video Sync Supported',
			desc: 'Current content specs supported for video sync (video/game mode)',
			type: 'boolean',
			role: 'indicator',
			def: false,
			read: true,
			write: false,
		},
		native: {},
	},
	// Current content specs supported for audio sync (music mode)
	audioSyncSupported: {
		type: 'state',
		common: {
			name: 'audio Sync Supported',
			desc: 'Current content specs supported for audio sync (music mode)',
			type: 'boolean',
			role: 'indicator',
			def: false,
			read: true,
			write: false,
		},
		native: {},
	},
};
export const hdmiInputObj: { [key: string]: any } = {
	// Friendly name, not empty
	name: {
		type: 'state',
		common: {
			name: 'name',
			desc: 'name of the input',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
		},
		native: {},
	},
	/**
	 * Friendly type: generic, video, game, music, xbox, playstation, nintendoswitch, phone, desktop, laptop, appletv, roku, shield, chromecast, firetv, diskplayer, settopbox, satellite, avreceiver, soundbar, hdmiswitch
	 */
	type: {
		type: 'state',
		common: {
			name: 'type',
			desc: 'type of the input',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: true,
			states: {
				generic: 'generic',
				video: 'video',
				game: 'game',
				music: 'music',
				xbox: 'xbox',
				playstation: 'playstation',
				nintendoswitch: 'nintendoswitch',
				phone: 'phone',
				desktop: 'desktop',
				laptop: 'laptop',
				appletv: 'appletv',
				roku: 'roku',
				shield: 'shield',
				chromecast: 'chromecast',
				firetv: 'firetv',
				diskplayer: 'diskplayer',
				settopbox: 'settopbox',
				satellite: 'satellite',
				avreceiver: 'avreceiver',
				soundbar: 'soundbar',
				hdmiswitch: 'hdmiswitch',
			},
		},
		native: {},
	},
	// status unplugged, plugged, linked, unknown
	status: {
		type: 'state',
		common: {
			name: 'status',
			desc: 'status of the input',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
			states: {
				unplugged: 'unplugged',
				plugged: 'plugged',
				linked: 'linked',
				unknown: 'unknown',
			},
		},
		native: {},
	},
	// last Sync Mode video, game, music
	lastSyncMode: {
		type: 'state',
		common: {
			name: 'lastSyncMode',
			desc: 'lastSyncMode of the input',
			type: 'string',
			role: 'text',
			def: '',
			read: true,
			write: false,
			states: {
				video: 'video',
				game: 'game',
				music: 'music',
			},
		},
		native: {},
	},
};
// Behavior
export const behaviorChannelObj: { [key: string]: any } = {
	// Root object for each of the 4 hdmi input subresources
	input1: {
		type: 'channel',
		common: {
			name: 'Input 1',
			desc: 'HDMI input 1',
		},
		native: {},
	},
	input2: {
		type: 'channel',
		common: {
			name: 'Input 2',
			desc: 'HDMI input 2',
		},
		native: {},
	},
	input3: {
		type: 'channel',
		common: {
			name: 'Input 3',
			desc: 'HDMI input 3',
		},
		native: {},
	},
	input4: {
		type: 'channel',
		common: {
			name: 'Input 4',
			desc: 'HDMI input 4',
		},
		native: {},
	},
};
export const behaviorObj: { [key: string]: any } = {
	// Device automatically goes to powersave after this many minutes of being in
	// passthrough mode with no link on any source or no link on output. 0 is disabled, max is 10000. Default: 20.
	inactivePowersave: {
		type: 'state',
		common: {
			name: 'inactive Powersave',
			desc: 'Device automatically goes to powersave after this many minutes of being in passthrough mode with no link on any source or no link on output. 0 is disabled, max is 10000. Default: 20.',
			type: 'number',
			role: 'level',
			def: 20,
			read: true,
			write: true,
			min: 0,
			max: 10000,
		},
		native: {},
	},
	// Device goes to powersave when TV sends CEC OFF. Default: 1. Disabled 0, Enabled 1.
	cecPowersave: {
		type: 'state',
		common: {
			name: 'cec Powersave',
			desc: 'Device goes to powersave when TV sends CEC OFF. Default: 1. Disabled 0, Enabled 1.',
			type: 'number',
			role: 'value',
			def: 1,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
	// Device goes to powersave when USB power transitions from 5V to 0V. Default: 1. Disabled 0, Enabled 1.
	usbPowersave: {
		type: 'state',
		common: {
			name: 'usb Powersave',
			desc: 'Device goes to powersave when USB power transitions from 5V to 0V. Default: 1. Disabled 0, Enabled 1.',
			type: 'number',
			role: 'value',
			def: 1,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
	// Automatically switch input when any source is plugged in (or powered on). Default: 1. Disabled 0, Enabled 1.
	hpdInputSwitch: {
		type: 'state',
		common: {
			name: 'hpd Input Switch',
			desc: 'Automatically switch input when any source is plugged in (or powered on). Default: 1. Disabled 0, Enabled 1.',
			type: 'number',
			role: 'value',
			def: 1,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
	hpdOutputEnableMs: {
		type: 'state',
		common: {
			name: 'hpd Output Enable Ms',
			desc: 'Time in milliseconds to wait before enabling output after a source is plugged in. Default: 1000.',
			type: 'number',
			role: 'level',
			def: 1500,
			read: true,
			write: true,
			min: 0,
			max: 1000000,
		},
		native: {},
	},
	arcBypassMode: {
		type: 'state',
		common: {
			name: 'arc Bypass Mode',
			desc: 'Bypass mode for ARC. Default: 0. Disabled 0, Enabled 1.',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: true,
		},
		native: {},
	},
	// When the TV advertises Dolby Vision force to use native native mode. Disabled 0, Enabled 1.
	forceDoviNative: {
		type: 'state',
		common: {
			name: 'force Dovi Native',
			desc: 'When the TV advertises Dolby Vision force to use native native mode. Disabled 0, Enabled 1.',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
};
export const behaviorInputObj: { [key: string]: any } = {
	// Automatically switch input when this source sends CEC active. Default: 1. Disabled 0, Enabled 1.
	cecInputSwitch: {
		type: 'state',
		common: {
			name: 'cec Input Switch',
			desc: 'cec Input Switch of the input',
			type: 'number',
			role: 'value',
			def: 1,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
	// Automatically set syncActive true when this source and output are linked. Default: 0. Disabled 0, Enabled 1.
	linkAutoSync: {
		type: 'state',
		common: {
			name: 'link Auto Sync',
			desc: 'link Auto Sync of the input',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
	hdrMode: {
		type: 'state',
		common: {
			name: 'hdr Mode',
			desc: 'hdr Mode of the input',
			type: 'number',
			role: 'value',
			def: 0,
			read: true,
			write: true,
			states: {
				0: 'Disabled',
				1: 'Enabled',
			},
		},
		native: {},
	},
};
