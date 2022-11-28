export interface Device {
	name: string;
	deviceType: string;
	uniqueId: string;
	apiLevel: number;
	firmwareVersion: string;
	buildNumber: number;
	termsAgreed: boolean;
	wifiState: 'uninitialized' | 'disconnected' | 'lan' | 'wan';
	ipAddress: string;
	wifi: {
		ssid: string;
		strength: number;
	};
	lastCheckedUpdate: string;
	updatableBuildNumber: number | null;
	updatableFirmwareVersion: string | null;
	update: {
		autoUpdateEnabled: boolean;
		autoUpdateTime: number;
	};
	ledMode: number;
	action: 'none' | 'doSoftwareRestart' | 'doFirmwareUpdate';
	pushlink: 'idle';
	capabilities: {
		maxIrCodes: number;
		maxPresets: number;
	};
	beta: boolean;
}
export interface Hue {
	bridgeUniqueId: string;
	bridgeIpAddress: string;
	groupId: number;
	groups: {
		[key: string]: {
			name: string;
			numLights: number;
			active: boolean;
			owner?: string | null;
		};
	};
	connectionState:
		| 'uninitialized'
		| 'disconnected'
		| 'connecting'
		| 'unauthorized'
		| 'connected'
		| 'invalidgroup'
		| 'streaming';
}
export interface Execution {
	mode: 'powersave' | 'passthrough' | 'video' | 'game' | 'music' | 'ambient'; // (More modes can be added in the future, so clients must gracefully handle modes they don’t recognize)
	syncActive: boolean;
	hdmiActive: boolean;
	hdmiSource: 'input1' | 'input2' | 'input3' | 'input4'; // (currently selected hdmi input)
	hueTarget: string;
	brightness: number;
	lastSyncMode: 'video' | 'game' | 'music' | 'ambient';
	video: {
		intensity: 'subtle' | 'moderate' | 'high' | 'intense';
		backgroundLighting: boolean;
	};
	game: {
		intensity: 'subtle' | 'moderate' | 'high' | 'intense';
		backgroundLighting: boolean;
	};
	music: {
		intensity: 'subtle' | 'moderate' | 'high' | 'intense';
		palette: 'happyEnergetic' | 'happyCalm' | 'melancholicCalm' | 'melancholic' | 'Energetic' | 'neutral';
	};
	preset: string | null;
}
export interface Hdmi {
	contentSpecs: string;
	videoSyncSupported: boolean;
	audioSyncSupported: boolean;
	input1: {
		name: string;
		type:
			| 'generic'
			| 'video'
			| 'game'
			| 'music'
			| 'xbox'
			| 'playstation'
			| 'nintendoswitch'
			| 'phone'
			| 'desktop'
			| 'laptop'
			| 'appletv'
			| 'roku'
			| 'shield'
			| 'chromecast'
			| 'firetv'
			| 'diskplayer'
			| 'settopbox'
			| 'satellite'
			| 'avreceiver'
			| 'soundbar'
			| 'hdmiswitch';
		status: 'unplugged' | 'plugged' | 'linked' | 'unknown';
		lastSyncMode: 'video' | 'game' | 'music';
	};
	input2: {
		name: string;
		type:
			| 'generic'
			| 'video'
			| 'game'
			| 'music'
			| 'xbox'
			| 'playstation'
			| 'nintendoswitch'
			| 'phone'
			| 'desktop'
			| 'laptop'
			| 'appletv'
			| 'roku'
			| 'shield'
			| 'chromecast'
			| 'firetv'
			| 'diskplayer'
			| 'settopbox'
			| 'satellite'
			| 'avreceiver'
			| 'soundbar'
			| 'hdmiswitch';
		status: 'unplugged' | 'plugged' | 'linked' | 'unknown';
		lastSyncMode: 'video' | 'game' | 'music';
	};
	input3: {
		name: string;
		type:
			| 'generic'
			| 'video'
			| 'game'
			| 'music'
			| 'xbox'
			| 'playstation'
			| 'nintendoswitch'
			| 'phone'
			| 'desktop'
			| 'laptop'
			| 'appletv'
			| 'roku'
			| 'shield'
			| 'chromecast'
			| 'firetv'
			| 'diskplayer'
			| 'settopbox'
			| 'satellite'
			| 'avreceiver'
			| 'soundbar'
			| 'hdmiswitch';
		status: 'unplugged' | 'plugged' | 'linked' | 'unknown';
		lastSyncMode: 'video' | 'game' | 'music';
	};
	input4: {
		name: string;
		type:
			| 'generic'
			| 'video'
			| 'game'
			| 'music'
			| 'xbox'
			| 'playstation'
			| 'nintendoswitch'
			| 'phone'
			| 'desktop'
			| 'laptop'
			| 'appletv'
			| 'roku'
			| 'shield'
			| 'chromecast'
			| 'firetv'
			| 'diskplayer'
			| 'settopbox'
			| 'satellite'
			| 'avreceiver'
			| 'soundbar'
			| 'hdmiswitch';
		status: 'unplugged' | 'plugged' | 'linked' | 'unknown';
		lastSyncMode: 'video' | 'game' | 'music';
	};
	output: {
		name: string;
		type:
			| 'generic'
			| 'video'
			| 'game'
			| 'music'
			| 'xbox'
			| 'playstation'
			| 'nintendoswitch'
			| 'phone'
			| 'desktop'
			| 'laptop'
			| 'appletv'
			| 'roku'
			| 'shield'
			| 'chromecast'
			| 'firetv'
			| 'diskplayer'
			| 'settopbox'
			| 'satellite'
			| 'avreceiver'
			| 'soundbar'
			| 'hdmiswitch';
		status: 'unplugged' | 'plugged' | 'linked' | 'unknown';
		lastSyncMode: 'video' | 'game' | 'music';
	};
}
export interface Behavior {
	inactivePowersave: number;
	cecPowersave: number;
	usbPowersave: number;
	hpdInputSwitch: number;
	hpdOutputEnableMs: number;
	arcBypassMode: number;
	forceDoviNative: number;
	input1: {
		cecInputSwitch: number;
		linkAutoSync: number;
		hdrMode: number;
	};
	input2: {
		cecInputSwitch: number;
		linkAutoSync: number;
		hdrMode: number;
	};
	input3: {
		cecInputSwitch: number;
		linkAutoSync: number;
		hdrMode: number;
	};
	input4: {
		cecInputSwitch: number;
		linkAutoSync: number;
		hdrMode: number;
	};
}
export interface ApiResult {
	device: Device;
	hue: Hue;
	execution: Execution;
	hdmi: Hdmi;
	behavior: Behavior;
	ir: { [key: string]: any };
	registrations: { [key: string]: any };
	presets: { [key: string]: any };
}
