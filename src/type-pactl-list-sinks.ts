// Interface for stdout:
// pactl -f json list sinks

export type Sinks = Sink[]

export interface Sink {
	active_port?: string
	balance: number
	base_volume: BaseVolume
	channel_map: string
	description: string
	driver: string
	flags: string[]
	formats: string[]
	index: number
	latency: Latency
	monitor_source: string
	mute: boolean
	name: string
	owner_module: number
	ports: Port[]
	properties: Properties
	sample_specification: string
	state: string
	volume: Volume
}

export interface BaseVolume {
	db: string
	value: number
	value_percent: string
}

export interface Latency {
	actual: number
	configured: number
}

export interface Port {
	availability: string
	availability_group: string
	description: string
	name: string
	priority: number
	type: string
}

export interface Properties {
	'alsa.card'?: string
	'alsa.card_name'?: string
	'alsa.class'?: string
	'alsa.device'?: string
	'alsa.driver_name'?: string
	'alsa.id'?: string
	'alsa.long_card_name'?: string
	'alsa.name'?: string
	'alsa.resolution_bits'?: string
	'alsa.subclass'?: string
	'alsa.subdevice'?: string
	'alsa.subdevice_name'?: string
	'device.access_mode'?: string
	'device.api'?: string
	'device.buffering.buffer_size'?: string
	'device.buffering.fragment_size'?: string
	'device.bus'?: string
	'device.bus_path'?: string
	'device.class': string
	'device.description': string
	'device.icon_name': string
	'device.product.id'?: string
	'device.product.name'?: string
	'device.profile.description'?: string
	'device.profile.name'?: string
	'device.string'?: string
	'device.vendor.id'?: string
	'device.vendor.name'?: string
	'module-udev-detect.discovered'?: string
	'sysfs.path'?: string
	'device.form_factor'?: string
	'device.intended_roles'?: string
	'device.master_device'?: string
}

export interface Volume {
	/**
	 * Not all keys are known. Few confimed are:
	 * 'front-left' | 'front-right' | 'mono'
	 **/
	[key: string]: VolumeValue
}

export interface VolumeValue {
	db: string
	value: number
	value_percent: string
}
