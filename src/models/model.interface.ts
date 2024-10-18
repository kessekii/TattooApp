

export interface UserInterface {
	name: string
	email: string
	department: string
	role: string
	blocked?: boolean
	token?: string
	testaccess?: boolean
}

export interface NewsProps {
	news: any[]
	image: any
}
export interface LearningInterface {
	id: number
	file_title: string
	file_open_link: any
	file_link: string
}
export interface FinanceInterface {
	id: number
}
export interface NewsInterface {
	company_updates: NewsProps
	important_updates: NewsProps
	industry_updates: NewsProps
	new_advertisers: NewsProps
	new_publishers: NewsProps
}
export interface AdvertiserInterface {
	user_login: string
	advertiser_name: string
	platform: string
	email: string
	createdAt: Date
	hasChanged: Array<string>
	legal_name: string
	address: string
	geo: string[]
	link_to_io: string
	link_to_adv_file: string
	link_to_creative: string
	status: boolean
	sales_rep: string
	fraud_tool: any
	info: string
	apps?: any[]
	team: string
	communication_channel: string[]
	advertiser_type: string
	vertical: string[]
	created_by: string
	payment_terms: string
	pause_reason: string
	pause_explanation: string
	website: string
	linkedin: string
	brief: string
	special_request: string
	traffic_restrictions: string
	existing_channels: string
	past_owner: any
	parameters_template: string
	used_publisher: string[]
	daily_revenue: any
	monthly_revenue: any
	total_revenue: any
	daily_budget_limit: any
	monthly_budget_limit: any
	total_budget_limit: any
	branch: string
	vat: string
}

export interface InsertAdvertiserInterface {
	advertiser_name: string
	email: string
	platform: string
	apps?: string[]
}
export interface EditAdvertiserInterface {
	advertiser_name: string
	email: string
	status: boolean
	platform: string
	apps?: AppInterface[]
}

export interface PublisherInterface {
	contacts: any
	publisher_name: string
	platform: string
	status: boolean
	sales_rep: string
	email: string
	media_source_pid: string[]
}
export interface TrackedEvent {
	is_revenue_share?: boolean
	eventName: string
	defaultRevenue: number
	defaultCost: number
	createdAt?: Date
	endedAt?: Date
	uuid?: string
	order?: number
}
export interface checkboxValue {
	value: string
	label: string
}
export interface CampaignInterface {
	uuid?: string | undefined
	id?: number | undefined
	app_id: string
	c_parameter: string
	country: string[]
	email: string
	media_source_pid: string[]
	advertiser_name: string
	status: boolean
	campaign_name: string
	role: string
	is_revenue_share: boolean
	tracked_event: TrackedEvent[]
	goal: string
	target_audience: any
	kpi: string
	soft_kpi: string
	hard_kpi: string
	date_added: Date
	note: string
	vta_allowed: boolean
	retargeting: boolean
	traffic: any
	used_existing_channels: any
	campaign_goals: any
	events_flow: string
	prob_vta: boolean
	revenue_needed: boolean
	organic_needed: boolean
	adv_file_link: string
	creatives: string
	timeframe: string
	end_date: Date
	budget_amount: string
	rawdata: boolean
	preview_url?: string
	cap?: string
	fix_price?: string | null
	created_by: string
	pidConflicts: any
	privacy_level: string
	icon?: string | null
	app_name?: string
	auto_campaign_name?: string
	campaign_flow?: string
	fraud_tool?: string
	cost_from_data: boolean
}

export interface CampaignHistoryInterface {
	uuid?: string | undefined
	id?: number | undefined
	app_id: string
	c_parameter: string
	country: string[]
	email: string
	media_source_pid: string[]
	advertiser_name: string
	status: boolean
	campaign_name: string
	role: string
	is_revenue_share: boolean
	tracked_event: TrackedEvent[]
	goal: string
	target_audience: string
	kpi: string
	date_added: Date
	date_ended: Date
	history_uuid: string
	note: string
	vta_allowed: boolean
	traffic: string
	prob_vta: boolean
	revenue_needed: boolean
	organic_needed: boolean
	adv_file_link: string
	creatives: string
	timeframe: string
	end_date: Date
	budget_amount: string
	rawdata: boolean
	preview_url?: string
	cap?: string
	fix_price?: string | null
	created_by: string
	pidConflicts: any
	privacy_level: string
	icon?: string | null
	app_name?: string
	auto_campaign_name?: string
	campaign_flow?: string
	fraud_tool?: string
	cost_from_data: boolean
}

export interface AppInterface {
	app_id: string
	advertiser_name?: string
	uuid?: string
	status: boolean
	created_by: string
}

export interface GetAppsflayerInterface {
	id: string
	campaign_id: string
	date: string
	advertiser_name: string
	advertiser_owner: string
	campaign_name: string
	country: string
	media_source_pid: string
	campaign_c: string

	impressions: string
	clicks: string
	ctr: string
	installs: string

	conversion_rate: string
	sessions: string
	loyal_users: string
	loyal_users_installs: string

	total_revenue: string
	total_cost: string
	roi: string
	arpu: string

	unique_users: string
}

export interface GetPasswordsInterface {
	id: string
	created_by: string
	name: string

	internal_poc: string

	url: string

	user_name: string

	password: string

	access: string

	whitelist: string[]

	type: string

	contact_person: string

	contact_email: string

	contact_skype: string

	notes: string
}

export interface NetworksInterface {
	id: number
	app_id: string
	username: string
	company: string
	app_name: string
	advertiser: string
	'media_source_(pid)': string
	date: Date
	'campaign_(c)': string
	'agency/pmd_(af_prt)': string
	impressions: string
	clicks: string
	ctr: string
	installs: string
	conversion_rate: string
	platform: string
	total_revenue: string
	total_cost: string
	roi: string
	average_ecpi: string
}

export interface GetDashboardInterface {
	advertiser: any
	publisher: any
	daily: any
	country: any
	campaign: any
}

export interface AutoSwitchInterface {
	uid: string
	app_id: string
	calendar: any
	media_source_pid: string[]
}

export interface VersionInterface {
	version: string
}
