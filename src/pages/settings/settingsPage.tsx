import { ThemeProvider } from '@emotion/react'
import { Box, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'

import { WarningPrompt } from '../../utils/notifications/WarningPrompt'
import theme from '../../utils/theme'
import {
	AddButton,
	ChipInputList,
	PageWrapper,
	TitleComponent,
} from '../components/reusableComponents'
const SettingsPage = (props: {
	setLoading: any
	errorMessage: null | string
	setErrorMessage: any
	isErrorPromptOpened: boolean
	setIsErrorPromptOpened: any
	setIsWarningPromptOpened: any
}) => {
	const { settings, login, users, avatars } = useTypedSelector((state) => state)
	const { getSettingsAction, updateSettings } = useActions()
	const [allowedPlatforms, setAllowedPlatforms] = useState([])
	const [vertical, setVertical] = useState([])
	const [capabilities, setCapabilities] = useState([])
	const [salesRepresentative, setSalesRepresentative] = useState([])
	const headers = {
		Authorization: `Token ${login.user.token}`,
	}
	const [teams, setTeams] = useState([])

	const [fraudTools, setFraudTools] = useState([])
	const [contactRole, setContactRole] = useState([])
	const [platforms, setPlatforms] = useState([])
	const [banners, setBanners] = useState([])
	const [videos, setVideos] = useState([])
	const [trafficRestrictions, setTrafficRestrictions] = useState([])
	const [existingChannels, setExistingChannels] = useState([])
	const [targetAudience, setTargetAudience] = useState([])
	const [targetAudienceOthers, setTargetAudienceOthers] = useState([])
	const [campaignGoals, setCampaignGoals] = useState([])
	const [paymentTerms, setPaymentTerms] = useState([])
	const [pauseReason, setPauseReason] = useState([])
	const [communicationChannel, setCommunicationChannel] = useState([])
	const [currency, setCurrency] = useState([])
	const [paymentMethod, setPaymentMethod] = useState([])
	const [branches, setBranches] = useState([])
	const [vatValues, setVatValues] = useState([])
	const [isWarningPromptOpened, setIsWarningPromptOpened] = useState(false)
	const [fileOpenLink, setFileOpenLink] = useState('')
	const [file, setFile] = useState<any>(null)
	const usersList = users.users.map((el: any) => el.name).sort()
	useEffect(() => {
		loadCurrentSettings()
	}, [])

	useEffect(() => {
		if (settings.settings.allowedPlatforms) {
			console.log(settings.settings)
			setAllowedPlatforms(settings.settings.allowedPlatforms)
			setVertical(settings.settings.vertical)
			setCapabilities(settings.settings.capabilities)
			setSalesRepresentative(settings.settings.salesRepresentative)
			setFraudTools(settings.settings.fraudTools || [])
			setPlatforms(settings.settings.platforms)
			setContactRole(settings.settings.contactRole)
			setBanners(settings.settings.banners || [])
			setVideos(settings.settings.videos || [])
			setPaymentTerms(settings.settings.paymentTerms || [])
			setPauseReason(settings.settings.pauseReason || [])
			setCommunicationChannel(settings.settings.communicationChannel || [])
			setCurrency(settings.settings.currency || [])
			setTrafficRestrictions(settings.settings.trafficRestrictions || [])
			setExistingChannels(settings.settings.existingChannels || [])
			setTargetAudience(settings.settings.targetAudience || [])
			setTargetAudienceOthers(settings.settings.targetAudienceOthers || [])
			setCampaignGoals(settings.settings.campaignGoals || [])
			setTeams(settings.settings.teams || [])
			setBranches(settings.settings.branches || [])
			setPaymentMethod(settings.settings.paymentMethod || [])
			setVatValues(settings.settings.vatValues || [])
		}
	}, [settings])

	const loadCurrentSettings = async () => {
		const headers = {
			Authorization: `Token ${login.user.token}`,
		}
		getSettingsAction(headers)
	}

	const checkValidInput = (arr: string[]) => {
		const nonAcceptedValues = '!@#$%^*(){}<>.;:~/?'
		const nonAcceptedArr = nonAcceptedValues.split('')
		if (arr.length === 0) {
			return true
		}
		const result = !arr.every((el) => {
			for (const char of nonAcceptedArr) {
				el.includes(char)
			}
		})
		return result
	}

	const handleSubmit = async () => {
		if (
			checkValidInput(allowedPlatforms) &&
			checkValidInput(vertical) &&
			checkValidInput(capabilities) &&
			checkValidInput(salesRepresentative) &&
			checkValidInput(fraudTools) &&
			checkValidInput(platforms) &&
			checkValidInput(contactRole) &&
			checkValidInput(banners) &&
			checkValidInput(videos) &&
			checkValidInput(communicationChannel) &&
			checkValidInput(existingChannels) &&
			checkValidInput(targetAudience) &&
			checkValidInput(targetAudienceOthers) &&
			checkValidInput(campaignGoals) &&
			checkValidInput(trafficRestrictions) &&
			checkValidInput(pauseReason) &&
			checkValidInput(paymentTerms) &&
			checkValidInput(trafficRestrictions) &&
			checkValidInput(existingChannels) &&
			checkValidInput(teams) &&
			checkValidInput(currency) &&
			checkValidInput(paymentMethod) &&
			checkValidInput(branches) &&
			checkValidInput(vatValues)
		) {
			const updatedSettings = {
				allowedPlatforms,
				vertical,
				capabilities,
				salesRepresentative,
				fraudTools,
				platforms,
				contactRole,
				banners,
				videos,
				paymentTerms,
				pauseReason,
				communicationChannel,
				trafficRestrictions,
				existingChannels,
				targetAudience,
				targetAudienceOthers,
				campaignGoals,
				teams,
				currency,
				branches,
				paymentMethod,
				vatValues,
			}
			const headers = {
				Authorization: `Token ${login.user.token}`,
			}
			await updateSettings(headers, updatedSettings, props.setErrorMessage)
		} else {
			console.error('check inputs')
		}
	}
	return (
		<ThemeProvider theme={theme}>
			<PageWrapper style={{ marginTop: '20px' }}></PageWrapper>
			<Grid
				container
				spacing={0}
				direction={'row'}
				alignItems={'center'}
				width={'100%'}
			>
				<Grid item xs={3} style={{ marginLeft: '30px' }}>

					<TitleComponent component='span'>Settings</TitleComponent>

				</Grid>
			</Grid>
			<Box
				sx={{
					width: '90%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-between',
					height: '90%',
					paddingBottom: '5%',
				}}
			>
				<ChipInputList
					onChange={(e: any) => setPlatforms(e)}
					label={'Active platforms'}
					options={platforms}
					value={platforms}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setAllowedPlatforms(e)}
					label={'Allowed Platforms for Advertisers'}
					options={allowedPlatforms}
					value={allowedPlatforms}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setVertical(e)}
					label={'Verticals'}
					options={vertical}
					value={vertical}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setSalesRepresentative(e)}
					label={'Sales Representative'}
					options={usersList}
					value={salesRepresentative}
					style={{ marginTop: '-6px', width: '60%' }}
					openWithClick
				/>
				<ChipInputList
					onChange={(e: any) => setTeams(e)}
					label={'Teams'}
					options={usersList}
					value={teams}
					style={{ marginTop: '-6px', width: '60%' }}
					openWithClick
				/>
				<ChipInputList
					onChange={(e: any) => setFraudTools(e)}
					label={'Fraud Tools'}
					options={fraudTools || []}
					value={fraudTools || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setCommunicationChannel(e)}
					label={'Communication Channel'}
					options={communicationChannel}
					value={communicationChannel}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setContactRole(e)}
					label={'Contacts roles'}
					options={contactRole}
					value={contactRole}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setBranches(e)}
					label={'Internal Legal Entities'}
					options={branches}
					value={branches}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<TitleComponent style={{ fontSize: '24px' }}>Advertiser</TitleComponent>
				<ChipInputList
					onChange={(e: any) => setPaymentTerms(e)}
					label={'Payment Terms'}
					options={paymentTerms}
					value={paymentTerms}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setPauseReason(e)}
					label={'Pause posible reasons'}
					options={pauseReason}
					value={pauseReason}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setTrafficRestrictions(e)}
					label={'Traffic Restrictions'}
					options={trafficRestrictions || []}
					value={trafficRestrictions || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setExistingChannels(e)}
					label={'Existing Channels'}
					options={existingChannels || []}
					value={existingChannels || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<TitleComponent style={{ fontSize: '24px' }}>Publishers</TitleComponent>
				<ChipInputList
					onChange={(e: any) => setCapabilities(e)}
					label={'Abilities for Publishers'}
					options={capabilities}
					value={capabilities}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setBanners(e)}
					label={'Format Types (Banners)'}
					options={banners || []}
					value={banners || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setVideos(e)}
					label={'Format Types (Videos)'}
					options={videos || []}
					value={videos || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<TitleComponent style={{ fontSize: '24px' }}>Campaigns</TitleComponent>
				<ChipInputList
					onChange={(e: any) => setTrafficRestrictions(e)}
					label={'Traffic Restrictions'}
					options={trafficRestrictions || []}
					value={trafficRestrictions || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setExistingChannels(e)}
					label={'Existing Channels'}
					options={existingChannels || []}
					value={existingChannels || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setTargetAudience(e)}
					label={'Target Audience'}
					options={targetAudience || []}
					value={targetAudience || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setTargetAudienceOthers(e)}
					label={'Target Audience Others'}
					options={targetAudienceOthers || []}
					value={targetAudienceOthers || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setCampaignGoals(e)}
					label={'Campaign Goals'}
					options={campaignGoals || []}
					value={campaignGoals || []}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<TitleComponent style={{ fontSize: '24px' }}>Finance</TitleComponent>
				<ChipInputList
					onChange={(e: any) => setCurrency(e)}
					label={'Currencies'}
					options={currency}
					value={currency}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setPaymentMethod(e)}
					label={'Payment Methods'}
					options={paymentMethod}
					value={paymentMethod}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<ChipInputList
					onChange={(e: any) => setVatValues(e)}
					label={'VAT (%)'}
					options={vatValues}
					value={vatValues}
					style={{ marginTop: '-6px', width: '60%' }}
				/>
				<AddButton
					onClick={() => {
						setIsWarningPromptOpened(true)
					}}
				>
					Save
				</AddButton>

				<WarningPrompt
					message={'Saving current changes?'}
					PopUpVisible={isWarningPromptOpened}
					setPopUpVisible={setIsWarningPromptOpened}
					onAgree={() => {
						handleSubmit()
						setIsWarningPromptOpened(false)
					}}
					onCancel={() => setIsWarningPromptOpened(false)}
				/>
			</Box>
		</ThemeProvider>
	)
}

export default SettingsPage
