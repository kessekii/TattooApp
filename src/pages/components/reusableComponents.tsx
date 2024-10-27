import { Public } from '@mui/icons-material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import ClearIcon from '@mui/icons-material/Clear'
import DownloadIcon from '@mui/icons-material/Download'
import ErrorIcon from '@mui/icons-material/Error'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import FilterListIcon from '@mui/icons-material/FilterList'
import HelpIcon from '@mui/icons-material/Help'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import LinkIcon from '@mui/icons-material/Link'
import SearchIcon from '@mui/icons-material/Search'
import {
	default as Visibility,
	default as VisibilityIcon,
} from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
	Autocomplete,
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	Chip,
	Dialog,
	FormControl,
	FormControlProps,
	IconButton,
	InputAdornment,
	InputBase,
	InputLabel,
	Menu,
	MenuItem,
	Popper,
	Select,
	styled,
	TextField,
	TextFieldProps,
	Theme,
	Tooltip,
	Typography,
	TypographyProps,
} from '@mui/material'
import { GridColDef, GridToolbarContainer } from '@mui/x-data-grid'
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro'
import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import ReactCountryFlag from 'react-country-flag'
import downloadFolderIconWhite from '../../assets/download-white.png'
import downloadFolderIcon from '../../assets/download.png'
import sendWhiteIcon from '../../assets/send-white.png'
import sendIcon from '../../assets/send.png'
import uploadFolderIconWhite from '../../assets/upload-white.png'
import uploadFolderIcon from '../../assets/upload.png'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { UserInterface } from '../../models/model.interface'
import theme from '../../utils/theme'

export const TableWrapper = (props: {
	style?: any
	children: any
	theme: Theme
	setRowWidth: any
	rowCount: number
}) => {
	const [tableWidth, setTableWidth] = useState(
		window.innerWidth - 20 - props.theme.dimentions.drawerWidth,
	)
	useEffect(() => {
		const handleResize = debounce((e: UIEvent) => {
			const target = e.target as Window
			const width = target.innerWidth - props.theme.dimentions.drawerWidth
			setTableWidth(width)
			props.setRowWidth(width / props.rowCount)
		}, 100)

		window.addEventListener('resize', handleResize, true)
		return () => {
			window.removeEventListener('resize', handleResize, true)
		}
	}, [props])

	return (
		<div style={props.style}>
			<div
				style={{
					position: 'absolute',
					fontSize: '150px',
					//align: 'center',
					marginLeft: '-40px',
					height: '90vh',
					width: tableWidth * 0.98,
				}}
			>
				{props.children}
			</div>
		</div>
	)
}

export const CustomToolbar: React.FunctionComponent<{
	setFilterButtonEl: React.Dispatch<
		React.SetStateAction<HTMLButtonElement | null>
	>
	filterStatus?: any
	setFilterStatus?: any
	setSearch: any
	search: any
	handlePopUp: any
	downloadButtonOptions: any
	handlePasswordVisibility: any
	mediaPlanHandler?: any
	filterHandler?: any
	customFilter?: any
	clearAllFilters?: any
	showClearAllFiltersButton?: boolean
	setShowClearAllFiltersButton?: any
	mainFilterOptions: any
	isAutoSwitch?: any
	appIdList?: any[]
	appId?: any
	setAppId?: any
	selector?: any
	selectorProp?: any
	monthFilterArray?: any
	setMonthFilterArray?: any
	yearFilterArray?: any
	setYearFilterArray?: any
	downloadTemplate?: any
	fileInputClickHandler?: any
	sendEmail?: any
	financeLastSend?: any
	financeFinalSent?: boolean
	hideBlockedUsersButton?: boolean
	applyFilter: any
	clearFilter: any
	autoswitch?: any
}> = ({
	setFilterButtonEl,
	filterStatus,
	setFilterStatus,
	setSearch,
	search,
	handlePopUp,
	downloadButtonOptions,
	handlePasswordVisibility,
	mediaPlanHandler,
	isAutoSwitch,
	appIdList,
	appId,
	setAppId,
	selector,
	selectorProp,
	filterHandler,
	customFilter,
	clearAllFilters,
	showClearAllFiltersButton,
	setShowClearAllFiltersButton,
	mainFilterOptions,
	monthFilterArray,
	setMonthFilterArray,
	yearFilterArray,
	setYearFilterArray,
	downloadTemplate,
	fileInputClickHandler,
	sendEmail,
	financeLastSend,
	financeFinalSent,
	hideBlockedUsersButton,
	applyFilter,
	clearFilter,
	autoswitch,
}) => {
		const possibleCampaignFilter = mainFilterOptions
			? mainFilterOptions
			: ['Both', 'Active', 'Disabled']
		// const [filterTitleColor, setFilterTitleColor] = useState(theme.colors.black)
		const activeFilterHandler = (
			possibleCampaign: any,
			filterCurrent: any,
			setFilter: any,
		) => {
			const maxNumber = possibleCampaign.length
			const number = filterCurrent + 1
			if (number === maxNumber) setFilter(0)
			else setFilter(number)
		}

		const handleClearAllFilters = () => {
			clearAllFilters()
			applyFilter()
			setShowClearAllFiltersButton(false)
		}
		const [downloadFocus, setDownloadFocus] = useState(false)
		const [uploadFocus, setUploadFocus] = useState(false)
		const [sendFocus, setSendFocus] = useState(false)
		// const handleFilterColor = (isHovered: boolean) => {
		// 	if (isHovered) {
		// 		setFilterTitleColor(theme.colors.white)
		// 	} else {
		// 		setFilterTitleColor(theme.colors.black)
		// 	}
		// }

		return (
			<GridToolbarContainer
				style={{
					gap: '12px',
					display: 'flex',
					justifyContent: 'flex-start',
					marginBottom: '20px',
				}}
			>
				{/* <GridToolbarFilterButton
				ref={setFilterButtonEl}
				style={{ color: filterTitleColor }}
				nonce={undefined}
				onResize={undefined}
				onResizeCapture={undefined}
				onMouseEnter={() => handleFilterColor(true)}
				onMouseLeave={() => handleFilterColor(false)}
			/> */}
				{filterStatus !== undefined && (
					<BorderGradientButton
						style={{
							width: '140px',
							marginLeft: '20px',
							marginTop: '1px',
							marginRight: '4px',
							backgroundColor: 'inherit',
						}}
						onClick={() =>
							activeFilterHandler(
								possibleCampaignFilter,
								filterStatus,
								setFilterStatus,
							)
						}
					>
						{'Status: ' + possibleCampaignFilter[filterStatus]}
					</BorderGradientButton>
				)}
				{search !== undefined && (
					<TableSearchComponent
						style={{
							width: '18vw',
							boxShadow: 'none',
							border: '1px solid rgba(0,0,0,0.12)',
							borderRadius: '3px',
							marginTop: '9px',
						}}
						setSearch={setSearch}
						search={search}
						filterHandler={filterHandler}
					/>
				)}
				{handlePopUp !== undefined && autoswitch == undefined && (
					<AddButton
						onClick={handlePopUp}
						style={{
							// boxShadow: 'none',
							width: '80px',
							height: '30px',
							marginTop: '9px',
							fontSize: '12px',
						}}
					>
						+ Add
					</AddButton>
				)}
				{selector && selectorProp && (
					<AddButton
						onClick={() => selector(selectorProp)}
						style={{
							// boxShadow: 'none',
							width: '80px',
							height: '30px',
							marginTop: '9px',
							fontSize: '12px',
						}}
					>
						Apps
					</AddButton>
				)}
				{mediaPlanHandler !== undefined && (
					<AddButton
						onClick={mediaPlanHandler}
						style={{
							// boxShadow: 'none',
							width: '100px',
							height: '30px',
							marginTop: '9px',
							fontSize: '12px',
						}}
					>
						Media Plan
					</AddButton>
				)}
				{customFilter !== undefined && (
					<AddButton
						onClick={handleClearAllFilters}
						style={{
							// boxShadow: 'none',
							width: '120px',
							height: '30px',
							marginTop: '9px',
							fontSize: '12px',
						}}
						disabled={!showClearAllFiltersButton}
					>
						Clear All Filters
					</AddButton>
				)}
				{hideBlockedUsersButton && (
					<AddButton
						onClick={handlePopUp}
						style={{
							// boxShadow: 'none',
							width: '80px',
							height: '30px',
							marginTop: '9px',
							fontSize: '12px',
						}}
					>
						Blocked
					</AddButton>
				)}
				<div style={{ display: 'flex', marginLeft: 'auto', marginRight: '3%' }}>
					{downloadButtonOptions !== undefined && (
						<SimpleActionsButton
							width={0}
							row={undefined}
							style={{
								// background: theme.colors.buttonGradient,
								// borderRadius: '10px',
								// color: theme.colors.black,
								height: '30px',
								width: '80px',
								marginTop: '-1px',
							}}
							label={'download'}
							options={downloadButtonOptions}
							id={'downloadButton'}
							noArrow
						>
							<DownloadIcon style={{ width: '20px' }} />
						</SimpleActionsButton>
					)}
					{handlePasswordVisibility !== undefined && (
						<AddButton
							fullWidth
							style={{
								width: '80px',
								height: '30px',
								marginTop: '9px',
								fontSize: '12px',
							}}
							onClick={() => {
								handlePasswordVisibility()
							}}
						>
							<VisibilityIcon />
						</AddButton>
					)}
					{yearFilterArray && (
						<div
							style={{
								display: 'flex',
								marginRight: '3%',
								maxWidth: '420px',
								// overflow: 'auto',
								marginLeft: 'auto',
							}}
						>
							<StaticChipInputList
								onChange={setYearFilterArray}
								options={['This Year', '2022', '2021', '2020']}
								value={yearFilterArray}
								openWithClick={true}
								style={
									{
										height: 'inherit',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '8px',
										width: 'auto',
										minWidth: '100px',
										// marginTop: '25px',
									} as any
								}
								onlyOptionsAllowed
								noMarginTop
								placeholder={'Year'}
							/>
						</div>
					)}
					{monthFilterArray && (
						<div
							style={{
								display: 'flex',
								marginRight: '30px',
								maxWidth: '420px',
							}}
						>
							<StaticChipInputList
								onChange={setMonthFilterArray}
								options={[
									'January',
									'February',
									'March',
									'April',
									'May',
									'June',
									'July',
									'August',
									'September',
									'October',
									'November',
									'December',
								]}
								value={monthFilterArray}
								openWithClick={true}
								style={
									{
										height: 'inherit',
										display: 'flex',
										alignItems: 'center',
										// justifyContent: 'center',
										margin: '8px',
										width: 'auto',
										minWidth: '140px',
										// marginTop: '25px',
									} as any
								}
								onlyOptionsAllowed
								noMarginTop
								placeholder={'Month'}
							/>
						</div>
					)}
					{downloadTemplate && (
						<AddButton
							onClick={downloadTemplate}
							style={{
								display: 'flex',
								flexDirection: 'column',
								fontSize: '28px',
								width: '80px',
								height: '58px',
								paddingTop: '8px',
							}}
							onMouseEnter={() => setDownloadFocus(true)}
							onMouseLeave={() => setDownloadFocus(false)}
						>
							<img
								src={downloadFocus ? downloadFolderIconWhite : downloadFolderIcon}
								style={{ height: '32px' }}
								alt='download-icon'
							></img>
							<span style={{ fontSize: '12px' }}>Download</span>
						</AddButton>
					)}
					{fileInputClickHandler && (
						<AddButton
							onClick={fileInputClickHandler}
							style={{
								display: 'flex',
								flexDirection: 'column',
								fontSize: '28px',
								width: '80px',
								height: '58px',
								paddingTop: '8px',
							}}
							onMouseEnter={() => setUploadFocus(true)}
							onMouseLeave={() => setUploadFocus(false)}
						>
							<img
								src={uploadFocus ? uploadFolderIconWhite : uploadFolderIcon}
								style={{ height: '32px' }}
								alt='upload-icon'
							></img>
							<span style={{ fontSize: '12px' }}>Upload</span>
						</AddButton>
					)}
					{sendEmail && (
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<SimpleActionsButton
								// onClick={sendEmail}
								style={{
									display: 'flex',
									flexDirection: 'column',
									fontSize: '28px',
									width: '80px',
									height: '58px',
									paddingTop: '8px',
									marginTop: '10px',
									border: '1px solid rgba(0,0,0,0.2)',
									borderRadius: '10px',
								}}
								onMouseEnter={() => setSendFocus(true)}
								onMouseLeave={() => setSendFocus(false)}
								noArrow
								width={0}
								row={undefined}
								label={'Send Email'}
								options={sendEmail}
								id={'downloadButton'}
							>
								<img
									src={sendFocus ? sendWhiteIcon : sendIcon}
									style={{ height: '32px' }}
									alt='upload-icon'
								></img>
								<span style={{ fontSize: '12px' }}>Send</span>
							</SimpleActionsButton>
							{financeLastSend && (
								<div
									style={{
										color: 'black',
										position: 'relative',
										// left: '-10px',
										fontSize: '11px',
										width: '100px',
										marginTop: '4px',
									}}
								>
									{financeFinalSent
										? 'Final Numbers sent: '
										: 'Last Status sent: '}
									<span style={{ fontWeight: '600' }}>{financeLastSend}</span>
								</div>
							)}
						</div>
					)}
				</div>
			</GridToolbarContainer>
		)
	}

export const TableComponent = (props: {
	style?: any
	setLoading: any
	columns: GridColDef[]
	rows: any[]
	setPageSize: any
	pageSize: any
	rowsPerPageOptions: any
	onRowClick?: any
	experimentalFeatures?: any
	onRowEditStop?: any
	onRowEditCommit?: any
	commitCellChange?: any
	filterStatus?: any
	setFilterStatus?: any
	setSearch?: any
	search?: any
	handlePopUp?: any
	downloadButtonOptions?: any
	handlePasswordVisibility?: any
	mediaPlanHandler?: any
	onCellClick?: any
	sortModel?: any
	rowHeight?: any
	onSortModelChange?: any
	filterHandler?: any
	setFilterHander?: any
	customFilter?: any
	setCustomFilter?: any
	currentFilters?: any
	applyFilter?: any
	filterLabel?: any
	optionsFilters?: any
	mainFilterOptions?: any
	rowModesModel?: any
	handleRowModesModelChange?: any
	selector?: any
	isAutoSwitch?: any
	appIdList?: any[]
	appId?: any
	setAppId?: any
	selectorProp?: any
	processRowUpdate?: any
	handleRowEditStop?: any
	handleDoubleCellClick?: any
	handleCellKeyDown?: any
	handleCellFocusOut?: any
	monthFilterArray?: any
	setMonthFilterArray?: any
	yearFilterArray?: any
	setYearFilterArray?: any
	downloadTemplate?: any
	fileInputClickHandler?: any
	treeData?: boolean
	getTreeDataPath?: any
	groupingColDef?: any
	sendEmail?: any
	financeLastSend?: any
	financeFinalSent?: boolean
	getRowClassName?: any
	customSx?: any
	customMessage?: any
	columnVisibility?: any
	autoswitch?: any
	pinnedBottomRow?: any
	apiRef?: any
}) => {
	// useEffect(() => {
	// 	props.setLoading(false)
	// })

	const [filterButtonEl, setFilterButtonEl] =
		React.useState<HTMLButtonElement | null>(null)
	const [filterSearch, setFilterSearch] = useState([])
	const [showClearAllFiltersButton, setShowClearAllFiltersButton] =
		useState(false)
	const filterRef = useRef(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [hoverRow, setHoverRow] = useState(false)
	const [currentHoveredRow, setCurrentHoveredRow] = useState<any>({})

	// const applyFilter = () => {
	// 	if (filterSearch.length === 0) {
	// 		props.customFilter[
	// 			props.currentFilters as keyof typeof props.customFilter
	// 		] = filterSearch
	// 	}
	// 	props.applyFilter(props.rows)
	// }
	const clearFilter = () => {
		if (props.customFilter) {
			props.customFilter[
				props.currentFilters as keyof typeof props.customFilter
			] = []
		}

		setFilterSearch([])
		props.applyFilter()
	}
	const clearAllFilters = () => {
		if (props.customFilter) {
			for (const key in props.customFilter) {
				props.customFilter[key as keyof typeof props.customFilter] = []
			}
		}

		setFilterSearch([])
		props.applyFilter()
	}

	const handleClickOutside = (event: any) => {
		if (
			filterRef.current &&
			!(filterRef.current as any).contains(event.target) &&
			event.target.tagName.toLowerCase() !== 'li' &&
			event.target.role !== 'option'
		) {
			if (props.setFilterHander) props.setFilterHander(false)
		}
	}

	const calculateLeftPosition = () => {
		let result = 0
		for (let i = 0; i <= props.columns.length; i++) {
			if (props.columns[i].field === props.currentFilters) {
				result = i
				break
			}
		}
		return (result * 90) / props.columns.length + '%'
	}

	useEffect(() => {
		if (props.customFilter) {
			if (filterSearch.length !== 0) {
				props.customFilter[props.currentFilters] = filterSearch
				setShowClearAllFiltersButton(true)
			} else {
				props.customFilter[props.currentFilters] = []
				props.applyFilter()
				// setFilterSearch([])
				setShowClearAllFiltersButton(false)
			}
		}

		// console.log(filterSearch, props.customFilter)
	}, [filterSearch])

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (props.customMessage) {
			const handleMouseMove = (e: any) => {
				// Subtract part of the div position in order to be closer to the cursor
				setPosition({
					x: e.clientX,
					y: e.clientY - 90,
				})
			}
			document.addEventListener('mousemove', handleMouseMove)
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
			}
		}
	}, [])

	const renderCustomMessage = () => {
		if (props.customMessage) {
			return props.customMessage(currentHoveredRow, position)
		} else {
			return <></>
		}
	}

	const filterSearchComponentArray = (filterKeysList: any) => {
		const wholeList: any = {}
		// console.log(props.currentFilters)

		for (const e of filterKeysList)
			wholeList[e] = (
				<FilterSearchComponent
					style={{
						width: '95%',
						boxShadow: 'none',
						border: '1px solid rgba(0,0,0,0.12)',
						borderRadius: '3px',
						marginTop: '9px',
						height: 'inherit',
					}}
					key={'FilterSearchComponent___' + e}
					setSearch={setFilterSearch}
					search={filterSearch}
					applyFilter={props.applyFilter}
					filterLabel={props.filterLabel}
					currentFilters={props.currentFilters}
					clearFilter={clearFilter}
					optionsFilters={props.optionsFilters}
					setFilterHander={props.setFilterHander}
					filtersKey={e}
					customFilter={props.customFilter}
				/>
			)
		// console.log(wholeList)

		return wholeList[props.currentFilters]
	}
	let filterKeysList: any = []
	if (props.customFilter) {
		filterKeysList = Object.keys(props.customFilter)
	}

	return (
		<>
			<DataGridPro
				initialState={{
					sorting: {
						sortModel: [
							props.sortModel
								? props.sortModel
								: { field: 'createdAt', sort: 'desc' },
						],
					},
					columns: { columnVisibilityModel: props.columnVisibility },
				}}
				rows={props.rows}
				columns={props.columns}
				// onPageSizeChange={(newPageSize) => props.setPageSize(newPageSize)}
				onCellEditStop={props.onRowEditStop}
				disableColumnMenu
				rowHeight={37}
				// headerHeight={50}
				sortModel={props.sortModel}
				slots={{
					toolbar: CustomToolbar,
				}}
				editMode={'row'}
				rowModesModel={props.rowModesModel}
				onRowModesModelChange={props.handleRowModesModelChange}
				slotProps={{
					panel: {
						anchorEl: filterButtonEl,
					},
					toolbar: {
						setFilterButtonEl,
						filterStatus: props.filterStatus,
						setFilterStatus: props.setFilterStatus,
						setSearch: props.setSearch,
						search: props.search,
						handlePopUp: props.handlePopUp,
						downloadButtonOptions: props.downloadButtonOptions,
						handlePasswordVisibility: props.handlePasswordVisibility,
						mediaPlanHandler: props.mediaPlanHandler,
						filterHandler: props.filterHandler,
						customFilter: props.customFilter,
						clearAllFilters: clearAllFilters,
						showClearAllFiltersButton: showClearAllFiltersButton,
						setShowClearAllFiltersButton: setShowClearAllFiltersButton,
						mainFilterOptions: props.mainFilterOptions,
						setAppId: props.setAppId,
						appId: props.appId,
						selector: props.selector,
						selectorProp: props.selectorProp,
						monthFilterArray: props.monthFilterArray,
						setMonthFilterArray: props.setMonthFilterArray,
						yearFilterArray: props.yearFilterArray,
						setYearFilterArray: props.setYearFilterArray,
						downloadTemplate: props.downloadTemplate,
						fileInputClickHandler: props.fileInputClickHandler,
						sendEmail: props.sendEmail,
						financeLastSend: props.financeLastSend,
						financeFinalSent: props.financeFinalSent,
						applyFilter: props.applyFilter,
						autoswitch: props.autoswitch,
					},
					cell: { onBlur: props.handleCellFocusOut },
					row: {
						onMouseEnter: (event) => {
							if (event.currentTarget.dataset.id) {
								const id = parseInt(event.currentTarget.dataset.id)
								const row = props.rows.find((el: any) => el.id === id)
								setCurrentHoveredRow(row)
								setHoverRow(true)
							}
						},
						onMouseLeave: () => {
							setHoverRow(false)
						},
					},
				}}
				getRowHeight={() => props.rowHeight}
				onCellClick={props.onCellClick}
				onSortModelChange={props.onSortModelChange}
				onCellDoubleClick={props.handleDoubleCellClick}
				onCellKeyDown={props.handleCellKeyDown}
				treeData={props.treeData}
				getTreeDataPath={props.getTreeDataPath}
				groupingColDef={props.groupingColDef}
				getRowClassName={(params) => {
					if (props.getRowClassName) {
						return props.getRowClassName(params)
					} else {
						return props.treeData &&
							params.row.hierarchy &&
							params.row.hierarchy.length > 1
							? 'treed-row'
							: ''
					}
				}}
				sx={props.customSx}
				processRowUpdate={props.processRowUpdate}
				pinnedRows={{ bottom: props.pinnedBottomRow }}
				style={props.style}
				apiRef={props.apiRef}
			// {...props}
			/>
			<div ref={filterRef}>
				{props.filterHandler && (
					<div
						style={{
							background: theme.colors.gray,
							width: '40%',
							padding: '0px 18px 0px 18px',
							minWidth: '400px',
							height: 'auto',
							display: 'flex',
							position: 'absolute',
							top: '11%',
							left: calculateLeftPosition(),
							boxShadow: '2px 2px 6px 1px rgba(0,0,0,0.4)',
							borderRadius: '12px',
							alignItems: 'center',
						}}
					>
						{filterSearchComponentArray(filterKeysList)}
					</div>
				)}
				{hoverRow && currentHoveredRow && renderCustomMessage()}
			</div>
		</>
	)
}

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
	paddingTop: '0px',

	'& .MuiOutlinedInput-root': {
		backgroundColor: 'transparent',
		borderRadius: theme.dimentions.smallerRadius,

		padding: '0px',
		'& .MuiAutocomplete-input': {
			padding: '0px',
			// width: '800px',
		},
	},
	'& .MuiOutlinedInput-input': {
		backgroundColor: 'transparent',
		//borderRadius: theme.dimentions.smallerRadius,
		'& .MuiAutocomplete-popper': {
			width: '500px',
		},
		padding: '0px',
	},
}))

export const TableSearch = styled(Card)(({ theme }) => ({
	position: 'relative',
	width: '90%',
	float: 'left',
	margin: '10px',
	borderRadius: theme.dimentions.biggerRadius,
	boxShadow: theme.shadow.boxShadow,
	backgroundColor: theme.palette.common.white,
	fontFamily: theme.typography.fontFamily,
	'&:hover': {
		backgroundColor: theme.palette.common.white,
	},
}))
export const InfoTag = (props: { title: string; ml?: string; mt?: string }) => {
	return (
		<Tooltip title={props.title}>
			<HelpIcon
				style={{
					fill: theme.colors.red,
					marginLeft: props.ml,
					position: 'absolute',
					zIndex: 2,
					paddingTop: '7px',
					marginTop: props.mt,
				}}
			/>
		</Tooltip>
	)
}
export const ErrorTag = (props: {
	title: string
	ml?: string
	mt?: string
	color?: string
}) => {
	return (
		<Tooltip title={props.title}>
			<ErrorIcon
				style={{
					fill: props.color || theme.colors.red,
					marginLeft: props.ml,
					position: 'absolute',
					zIndex: 2,
					paddingTop: '7px',
					marginTop: props.mt,
				}}
			/>
		</Tooltip>
	)
}
export const CancelIconButton = styled(IconButton)(({ theme }) => ({
	flow: 'left',
	position: 'absolute',
	zIndex: 4,
	marginLeft: '140px',
	marginTop: '-20px',
	padding: 'unset',

	color: theme.colors.red,
	'&.Mui-disabled': {
		background: theme.colors.lightGray,
		boxShadow: 'none',
	},
}))
export const UserNameWithAvatar = (props: {
	avatars?: any
	value: string
	withoutName?: boolean
	bigPicture?: boolean
}) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', marginBlock: '25px' }}>
			{props.avatars && <Avatar
				src={props.avatars[props.value] || 'na '}
				// {...stringAvatar(props.value)}
				style={{
					height: props.bigPicture ? '130px' : 'inherited',
					width: props.bigPicture ? '130px' : 'inherited',
				}}
			/>}

			{!props.withoutName && (
				<Typography marginLeft={2}>{props.value}</Typography>
			)}
		</div>
	)
}
export const CancelButton = styled(Button)(({ theme }) => ({
	flow: 'left',
	position: 'relative',
	margin: '10px',
	width: '15%',
	background: theme.palette.primary.main,
	borderRadius: '10px',
	borderColor: theme.colors.lightGray,
	border: '1px solid rgba(0,0,0,0.2)',
	boxShadow: '1px 1px 0px 1px rgba(0,0,0,0.2)',
	color: theme.palette.primary.dark,
	'&.Mui-disabled': {
		background: theme.colors.lightGray,
		boxShadow: 'none',
	},
}))
export const AddButton = styled(Button)(({ theme }) => ({
	flow: 'right',
	position: 'relative',
	margin: '10px',
	width: '15%',
	background: theme.colors.buttonGradient,
	borderRadius: '10px',
	// boxShadow: theme.shadow.boxShadow,
	color: theme.colors.black,
	border: '1px solid rgba(0,0,0,0.2)',
	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
	'&.Mui-disabled': {
		background: theme.colors.lightGray,
		boxShadow: 'none',
	},
}))
export const StyledButtonComp = styled(Button)(({ theme }) => ({
	flow: 'right',
	position: 'relative',

	width: '15%',
	background: theme.colors.gradient,
	borderRadius: '11px',
	// boxShadow: theme.shadow.boxShadow,
	color: theme.colors.black,
	// border: '1px solid rgba(0,0,0,0.2)',
	// boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
	'&.Mui-disabled': {
		background: theme.colors.lightGray,
		boxShadow: 'none',
	},
}))
export const BorderGradientButton = (props: {
	tooltip?: string
	onClick: any
	children?: any
	style?: any
}) => {
	return (
		<StyledButtonComp
			onClick={props.onClick}
			style={{
				...props.style,
				margin: '0px 4px',
				width: props.style ? props.style.width ?? '200px' : '200px',
				padding: '1px',
				boxShadow: 'none',
				marginTop: props.style ? props.style.marginTop ?? '20px' : '20px',
			}}
		>
			{props.tooltip ? (
				<Tooltip
					title={props.tooltip}
					// style={{ marginLeft: '35px' }}
					placement='top-end'
				>
					<AddButton
						style={{
							margin: '0px',
							width: '100%',
							padding: '10px',
							paddingInline: '20px',
							boxShadow: 'none',
							border: 'none',
						}}
						children={props.children}
					></AddButton>
				</Tooltip>
			) : (
				<AddButton
					style={{
						margin: '0px',
						width: '100%',
						padding: '10px',
						paddingInline: '20px',
						boxShadow: 'none',
						border: 'none',
					}}
					children={props.children}
				></AddButton>
			)}
		</StyledButtonComp>
	)
}
export const PageWrapper = styled('div')(({ theme }) => ({
	...theme.typography,
	marginInline: '2rem',
}))

export const Logo = styled(Box)(() => ({
	position: 'absolute',
	width: '120px',
	bottom: '3%',
	zIndex: 12,
}))

export const GreetingsComponent = styled(Typography)(({ theme }) => ({
	...theme.typography,
	color: theme.palette.common.black,
	fontSize: '20px',
	fontWeight: '600',
	marginLeft: '5px',
	marginBottom: '30px',
	// border: '1px solid rgba(0,0,0,0.1)',
	// 						borderRadius: '20px',
	// 						boxShadow: '-2px 2px 0px 1px rgba(0,0,0,0.4)',
}))
type MyT = React.ComponentType<TypographyProps<'span', { component?: 'span' }>>

export const TitleComponent: MyT = styled(Typography)(({ theme }) => ({
	...theme.typography,
	color: theme.palette.common.black,
	fontSize: '30px',
	fontWeight: 'bold',
	marginLeft: '15px',
}))

export const ItemTitle = styled('span')(({ theme }) => ({
	...theme.typography,
	fontWeight: '400',
}))

export const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	width: '20%',
	borderRadius: theme.dimentions.biggerRadius,
	boxShadow: theme.shadow.boxShadow,
	backgroundColor: theme.palette.common.white,
	fontFamily: theme.typography.fontFamily,
	'&:hover': {
		backgroundColor: theme.palette.common.white,
	},

	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		left: '60%',
	},
}))

export const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	'& .MuiSvgIcon-root': {
		fill: '#000000',
		color: '#000000',
	},
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		fontFamily: theme.typography.fontFamily,
		transition: theme.transitions.create('width'),
		width: '100%',
		// [theme.breakpoints.up('sm')]: {
		// 	width: '12ch',
		// 	'&:focus': {
		// 		width: '40ch',
		// 	},
		// },
	},
}))
export const SimpleActionsButton = (props: {
	children?: any
	width: number
	row: any
	label?: string
	options?: any
	style?: any
	onClick?: any
	arrowColor?: string
	id?: string
	noArrow?: boolean
	onMouseEnter?: any
	onMouseLeave?: any
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const [arrowColor, setArrowColor] = useState(props.arrowColor)
	const open = Boolean(anchorEl)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const MenuOptions = () => {
		if (props.options) {
			return props.options
		}
		return (
			<div>
				{/* <MenuItem onClick={handleClose}>Preview</MenuItem> */}
				<MenuItem key={'menuption_edit'} onClick={handleClose}>
					Edit
				</MenuItem>
				<MenuItem key={'menuption_delete'} onClick={handleClose}>
					Delete
				</MenuItem>
			</div>
		)
	}
	const handleHoverArrowColor = (hovered: boolean) => {
		if (hovered) {
			setArrowColor('inherit')
		} else {
			setArrowColor(props.arrowColor)
		}
	}
	return (
		<div style={{ display: 'inherit' }} id={props.id}>
			<StyledButton
				id='basic-button'
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={(e) => {
					handleClick(e)
					//props.onClick()
				}}
				onMouseEnter={() => {
					handleHoverArrowColor(true)
					if (props.onMouseEnter) {
						props.onMouseEnter()
					}
				}}
				onMouseLeave={() => {
					handleHoverArrowColor(false)
					if (props.onMouseLeave) {
						props.onMouseLeave()
					}
				}}
				style={{
					...props.style,
					zIndex: 9,
					background:
						props.label === 'Selector' || props.label === 'settings'
							? 'none'
							: 'rgba(0, 0, 0, 0.02)',
					boxShadow:
						props.label === 'Selector' || props.label === 'settings'
							? 'none'
							: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					justifyContent: props.label === 'Selector' ? 'flex-start' : 'center',
				}}
			>
				{props.children || (props.width > 150 ? props.label : '')}
				{!props.noArrow && (
					<KeyboardArrowDownIcon
						style={{
							fontSize: '26px',
							color: props.arrowColor ? arrowColor : 'inherit',
						}}
					/>
				)}
			</StyledButton>
			<StyledMenuItem
				id='demo-positioned-menu'
				aria-labelledby='demo-positioned-button'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: props.label === 'Selector' ? 'right' : 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<MenuOptions />
			</StyledMenuItem>
		</div>
	)
}
export const ActionsButton = (props: {
	children?: any
	width: number
	row: any
	label?: string
	options?: any
	style?: any
	onClick?: any
	arrowColor?: string
	id?: string
	noArrow?: boolean
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const [arrowColor, setArrowColor] = useState(props.arrowColor)
	const open = Boolean(anchorEl)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const MenuOptions = () => {
		if (props.options) {
			return props.options
		}
		return (
			<div>
				{/* <MenuItem onClick={handleClose}>Preview</MenuItem> */}
				<MenuItem key={'menuption_edit1'} onClick={handleClose}>
					Edit
				</MenuItem>
				<MenuItem key={'menuption_delete1'} onClick={handleClose}>
					Delete
				</MenuItem>
			</div>
		)
	}
	const handleHoverArrowColor = (hovered: boolean) => {
		if (hovered) {
			setArrowColor('inherit')
		} else {
			setArrowColor(props.arrowColor)
		}
	}
	return (
		<div style={{ display: 'inherit' }} id={props.id}>
			<StyledButton
				id='basic-button'
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={(e) => {
					handleClick(e)
					//props.onClick()
				}}
				onMouseEnter={() => handleHoverArrowColor(true)}
				onMouseLeave={() => handleHoverArrowColor(false)}
				style={{
					...props.style,
					zIndex: 9,
					background:
						props.label === 'Selector' ||
							props.label === 'settings' ||
							props.label === 'Finance' ||
							props.label === 'Dashboard' ||
							props.label === 'Tools' ||
							props.label === 'Autoswitch' ||
							props.label === 'Standard' ||
							props.label === 'Advanced'
							? 'none'
							: 'rgba(0, 0, 0, 0.02)',
					boxShadow:
						props.label === 'Selector' ||
							props.label === 'settings' ||
							props.label === 'Finance' ||
							props.label === 'Dashboard' ||
							props.label === 'Tools' ||
							props.label === 'Autoswitch' ||
							props.label === 'Standard' ||
							props.label === 'Advanced'
							? 'none'
							: '1px 1px 0px 1px rgba(0,0,0,0.1)',
					justifyContent:
						props.label === 'Selector' || 'Tools' ? 'flex-start' : 'center',
				}}
			>
				{props.children || (props.width > 150 ? props.label : '')}
				{!props.noArrow && (
					<KeyboardArrowDownIcon
						style={{
							fontSize: '26px',
							color: props.arrowColor ? arrowColor : 'inherit',
						}}
					/>
				)}
			</StyledButton>
			<StyledMenuItem
				id='demo-positioned-menu'
				aria-labelledby='demo-positioned-button'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical:
						props.label === 'Tools' ||
							props.label === 'Selector' ||
							props.label === 'Finance' ||
							props.label === 'Advanced' ||
							props.label === 'Advertisers'
							? 'bottom'
							: 'top',
					horizontal: props.label === 'Standard' ? 'right' : 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<MenuOptions />
			</StyledMenuItem>
		</div>
	)
}

export const StyledMenuItem = styled(Menu)(({ theme }) => ({
	paddingTop: '0px',

	'& 	.MuiMenu-list': {
		minWidth: '185px',

		padding: '0px',
	},
}))

export const InputFormField = (props: {
	label: string
	type: string
	onChange?: any
	required?: boolean
	value?: any
	color?:
	| 'primary'
	| 'secondary'
	| 'error'
	| 'info'
	| 'success'
	| 'warning'
	| undefined
}) => {
	return (
		<TextField
			required={props.required}
			label={props.label}
			type={props.type}
			margin='dense'
			fullWidth
			value={props.value}
			onChange={props.onChange}
			variant='standard'
			color={props.color}
		/>
	)
}

export const StatusSelect = (props: { onChange: any }) => {
	return (
		<FormControl fullWidth variant='standard'>
			<InputLabel required id='demo-simple-select-label'>
				Status
			</InputLabel>
			<Select
				labelId='demo-simple-select-label'
				id='demo-simple-select'
				label='Status'
				onChange={props.onChange}
				defaultValue={''}
			>
				<MenuItem value={'active'}>Active</MenuItem>
				<MenuItem value={'disabled'}>Disabled</MenuItem>
			</Select>
		</FormControl>
	)
}
export const PlusButton = styled(Button)(({ theme }) => ({
	background: theme.colors.activeGradient,
	borderRadius: theme.dimentions.biggerRadius,
	position: 'relative',
	height: '20px',
	width: '20px',
	minWidth: '10px',
	top: '300px',
}))
const StyledButton = styled(Button)(({ theme }) => ({
	flow: 'right',
	position: 'relative',
	margin: '0px',
	width: '100%',
	background: theme.palette.primary.main,
	borderRadius: '6px',
	boxShadow: theme.shadow.lightShadow,
	color: theme.palette.secondary.light,
}))

export const StyledDialog = styled(Dialog)(({ theme }) => ({
	borderRadius: theme.dimentions.smallerRadius,
}))

export const PresetDialog = styled(Dialog)(({ theme }) => ({
	borderRadius: theme.dimentions.smallerRadius,

	'& .MuiDialog-paper': {
		width: '800px',
	},
}))

export const StyledTextField = styled(TextField)<TextFieldProps | any>(
	({ theme, urlIcon }) => ({
		backgroundColor: 'rgba(238, 238, 238, 0.6)',
		height: 'auto',
		fontWeight: '500',
		fontSize: '14px',
		borderRadius: theme.dimentions.smallerRadius,
		marginTop: '30px',
		paddingTop: '-20px',
		minHeight: '40px',
		'& .MuiOutlinedInput-input': {
			backgroundColor: 'transparent',
			borderRadius: theme.dimentions.smallerRadius,
			height: 'auto',
			fontSize: '14px',
			minHeight: '40px',
			fontWeight: '500',
			width: urlIcon ? '80%' : '100%',
			paddingTop: '1px',
			paddingBottom: '1px',
			paddingRight: '6px',
			paddingLeft: '8px',
			transition: 'all 0.2s ease-in-out',
		},
		'& .MuiOutlinedInput-root': {
			backgroundColor: 'transparent',
			borderRadius: theme.dimentions.smallerRadius,
			height: 'auto',
			minHeight: '40px',

			paddingLeft: '8px',
		},
	}),
)

export const PopperMy = (props: any) => {
	return <Popper {...props} style={{ width: '400px' }} placement='top-start' />
}

export const EventNameAutocomplete = (props: {
	onChange: any
	onBlur?: any
	label?: string
	options: string[]
	disabled?: boolean
	value?: string[] | string
	float?: 'left' | 'right'
	fullWidth?: boolean
	name?: string
	ref?: any
	id?: string
}) => {
	return (
		<StyledAutocomplete
			freeSolo
			disableCloseOnSelect
			disabled={props.disabled}
			options={props.options}
			id={props.id ? props.id : 'tags-filled'}
			value={props.value}
			PopperComponent={PopperMy}
			ListboxProps={{
				style: {
					fontSize: '11px',
				},
			}}
			onChange={(a: any, n: any) => props.onChange(n)}
			onBlur={props.onBlur}
			renderInput={(params: any) => (
				<StyledTextField
					{...params}
					focused
					name={props.name}
					fullWidth
					ref={props.ref}
					variant='outlined'
					style={{
						float: props.float,
						fontSize: '11px',
						maxHeight: '40px',
						marginTop: '2px',
					}}
					onKeyDown={(e: any) => {
						props.onChange(e.target.value)
					}}
					onKeyUp={(e: any) => {
						props.onChange(e.target.value)
					}}
					InputProps={{
						...params.InputProps,
						style: {
							fontSize: '11px',
							paddingLeft: '10px',
						},
					}}
				/>
			)}
		/>
	)
}


export const CountryListSelector = (props: {
	onChange?: any
	label?: string
	options?: any[]
	disabled?: boolean
	value?: string[]
	fullWidth?: boolean
	multiple?: boolean
	singular?: boolean
	float?: 'left' | 'right'
	style?: React.CSSProperties
	onBlur?: any
	loginRole?: string
}) => {
	const [open, setOpen] = useState(false)
	const StyleForSelectedOption = (value: string, list: string[]) => {
		if (
			(list.length === 0 && value === 'GLOBAL') ||
			list.indexOf(value.substring(0, 2)) !== -1 ||
			list.indexOf(value.substring(0, 2).toLowerCase()) !== -1
		) {
			return {
				fontWeight: '900',
				backgroundColor: 'rgba(238,238,238,0.7)',
				width: '100%',
			}
		}
	}
	const selectedOptions: string[] = []
	const notSelectedOptions: string[] = []
	props.options!.forEach((el) => {
		if (
			props.value?.includes(el.substring(0, 2)) ||
			props.value?.includes(el.substring(0, 2).toLowerCase())
		) {
			selectedOptions.push(el)
		} else {
			notSelectedOptions.push(el)
		}
	})
	const orderedOptions = [...selectedOptions, 'GLOBAL', ...notSelectedOptions]

	const renderValueIfEmpty = (values: string[]) => {
		if (values?.length === 0 || (values?.length === 1 && values[0] === '')) {
			return ['GLOBAL']
		}
		return values.map((el: string) => el.toUpperCase())
	}
	const optionsCovertor = (options: string) => {
		let option
		if (options === 'GLOBAL') option = options
		else option = options.length > 2 ? options.substring(0, 2) : options
		const checkedOptions = option === 'UK' ? 'GB' : option
		return checkedOptions
	}
	const renderOptionsWhenOpening = (propsd: any, options: any) => {
		const checkedOption = optionsCovertor(options)
		return checkedOption !== 'GLOBAL' ? (
			<li {...propsd} key={propsd.id}>
				<ReactCountryFlag
					style={{
						width: '2em',
						height: '2em',
						borderRadius: '30px',
						display: 'block',
					}}
					key={options + '_flags'}
					countryCode={checkedOption}
					svg
				/>
				<MenuItem
					key={options}
					value={options}
					style={StyleForSelectedOption(options, props.value || [])}
				>
					{options}
				</MenuItem>
			</li>
		) : (
			<></>
		)
	}
	const renderSelectedOptions = (value: any[], getTagProps: any) => {
		const chips: any = value.map((options: any, index: number) => {
			const checkedOption = optionsCovertor(options)
			if (!open) {
				if (index <= 5) {
					return (
						<React.Fragment key={index + '-fragment-option'}>
							{index !== 5 ? (
								<Chip
									icon={
										checkedOption !== 'GLOBAL' ? (
											<ReactCountryFlag
												style={{
													width: '2em',
													height: '2em',
													borderRadius: '30px',
												}}
												countryCode={checkedOption}
												svg
											/>
										) : (
											<Public />
										)
									}
									variant='outlined'
									label={options}
									deleteIcon={
										// checkedOption !== 'GLOBAL' ? <ClearIcon /> : <></>
										<ClearIcon />
									}
									{...getTagProps({ index })}
								/>
							) : (
								<Chip
									style={{ marginLeft: '18px' }}
									onClick={() => {
										setOpen(!open)
									}}
									variant='outlined'
									label={` + ${(value?.length || 5) - 5}`}
								/>
							)}
						</React.Fragment>
					)
				}
			} else {
				return (
					<Chip
						icon={
							checkedOption !== 'GLOBAL' ? (
								<ReactCountryFlag
									style={{
										width: '2em',
										height: '2em',
										borderRadius: '30px',
									}}
									countryCode={checkedOption}
									svg
								/>
							) : (
								<Public />
							)
						}
						variant='outlined'
						label={options}
						// deleteIcon={checkedOption !== 'GLOBAL' ? <ClearIcon /> : <></>}
						deleteIcon={<ClearIcon />}
						{...getTagProps({ index })}
					/>
				)
			}
		})
		return chips
	}
	const renderInputField = (params: any) => (
		<StyledTextField
			{...params}
			focused
			label={props.label}
			margin='dense'
			fullWidth
			key={params + 'key-input'}
			variant='outlined'
			style={{
				float: props.float,
			}}
			InputProps={{
				...params.InputProps,
				style: {
					paddingLeft: '10px',
				},
			}}
			InputLabelProps={{
				style: { top: '-10px' },
			}}
			onClick={() => !props.disabled && setOpen(!open)}
		/>
	)
	const customFilter = (options: any, state: any) => {
		const geoCodeResult =
			state.inputValue.length <= 2
				? options.filter((el: any) => {
					return el
						.substring(0, 2)
						.toLowerCase()
						.includes(state.inputValue.toLowerCase())
				})
				: []
		const countryResult = options.filter((el: any) => {
			return (
				el.toLowerCase().includes(state.inputValue.toLowerCase()) &&
				el.substring(0, 2).toLowerCase() !== state.inputValue.toLowerCase()
			)
		})
		return [...geoCodeResult, ...countryResult]
	}

	return (
		<StyledAutocomplete
			multiple={props.multiple ? false : true}
			freeSolo={!props.singular}
			disabled={props.disabled}
			open={open}
			options={orderedOptions || []}
			style={props.style}
			id='tags-filled'
			value={renderValueIfEmpty(props.value as string[])}
			onChange={(a: any, n: any) => {
				if (n[0] === 'GLOBAL') n.shift()
				if (n.includes('GLOBAL')) props.onChange([])
				else {
					const result = n.map((el: string) => {
						return el.substring(0, 2) === 'GB' ? 'UK' : el.substring(0, 2)
					})
					props.onChange(result)
				}
			}}
			isOptionEqualToValue={(option: any, value: any) => {
				if (value === 'GLOBAL') return option === value
				return option.substring(0, 2) === value.substring(0, 2)
			}}
			onBlur={() => {
				setOpen(false)
				return props.onBlur
			}}
			filterOptions={customFilter}
			renderOption={renderOptionsWhenOpening}
			renderTags={renderSelectedOptions}
			renderInput={renderInputField}
		/>
	)
}

export const StaticChipInputList = (props: {
	onChange?: any
	label?: string
	options?: any[]
	hint?: string
	hintmargin?: string
	disabled?: boolean
	value?: string[]
	float?: 'left' | 'right'
	fullWidth?: boolean
	multiple?: boolean
	singular?: boolean
	style?: React.CSSProperties
	onBlur?: any
	seeAll?: boolean
	loginRole?: string
	openWithClick?: boolean
	setMainHeightChange?: any
	onlyOneOptionAllowed?: boolean
	noMarginTop?: boolean
	ShowSelected?: boolean
	onlyOptionsAllowed?: boolean
	placeholder?: string
}) => {
	const ref = useRef()
	const [open, setOpen] = useState(false)

	let gotCurrentHeight = false
	const getCurrentHeight = () => {
		const { current }: any = ref
		if (current?.clientHeight) {
			if (!gotCurrentHeight) {
				requestAnimationFrame(getCurrentHeight)
			}
			gotCurrentHeight = true
			//2.0 is hardcoded. It's the number of max px/ this element px that looks optimal to messure if the main buttons need to move.
			if (2.0 > window.innerHeight / current.clientHeight) {
				props.setMainHeightChange !== undefined &&
					props.setMainHeightChange(true)
			}
		}
	}
	getCurrentHeight()
	const StyleForSelectedOption = (value: string, list: string[]) => {
		if (list.indexOf(value) !== -1) {
			return {
				fontWeight: '900',
				backgroundColor: 'rgba(238,238,238,0.7)',
				width: '100%',
			}
		}
	}
	const selectedOptions: string[] = []
	const notSelectedOptions: string[] = []
	props.options!.forEach((el) => {
		if (props.value?.includes(el)) {
			selectedOptions.push(el)
		} else {
			notSelectedOptions.push(el)
		}
	})
	const orderedOptions = [...selectedOptions, ...notSelectedOptions]
	props.seeAll && orderedOptions.push('All')

	const renderOptionsWhenOpening = (propsd: any, option: any) => {
		// if (props.seeAll && option === 'All') {
		// 	return null
		// }
		return (
			<div {...propsd} key={propsd.id}>
				<MenuItem
					key={option}
					value={option}
					style={StyleForSelectedOption(option, props.value ? props.value : [])}
				>
					{option}
				</MenuItem>
			</div>
		)
	}
	// const renderSelectedOptions = (value: any[], getTagProps: any) => {
	// 	const chips: any = value.map((option: any, index: number) => {
	// 		const CustomLabel = (props: any) => {
	// 			const { children } = props
	// 			return (
	// 				<div
	// 					style={{
	// 						whiteSpace: 'normal',
	// 						overflow: 'hidden',
	// 						textOverflow: 'ellipsis',
	// 						paddingLeft: '2px',
	// 						paddingRight: '2px',
	// 					}}
	// 				>
	// 					{children}
	// 				</div>
	// 			)
	// 		}
	// 		return (
	// 			<Chip
	// 				variant='outlined'
	// 				label={
	// 					props.ShowSelected ? <CustomLabel>{option}</CustomLabel> : option
	// 				}
	// 				deleteIcon={<ClearIcon />}
	// 				style={{
	// 					width: 'auto',
	// 					minWidth: props.ShowSelected ? '100px' : '0px',
	// 					height: 'auto',
	// 				}}
	// 				{...getTagProps({ index })}
	// 			/>
	// 		)
	// 	})

	// 	return chips
	// }
	const renderInputField = (params: any) => {
		return (
			<>
				<StyledTextField
					{...params}
					focused
					label={props.label}
					margin='dense'
					fullWidth
					key={params + 'key-input'}
					variant='outlined'
					style={{
						border: 0,
						clip: 'rect(0 0 0 0)',
						height: '1px',
						margin: '-1px',
						overflow: 'hidden',
						padding: 0,
						position: 'absolute',
						width: '130px',
						whiteSpace: 'nowrap',
						float: props.float,
					}}
					InputProps={{
						...params.InputProps,
						style: {
							paddingLeft: '10px',
						},
					}}
					InputLabelProps={{
						style: { top: '-10px' },
					}}
					onClick={() => {
						if (props.openWithClick && !props.disabled) {
							setOpen(!open)
						}
					}}
					placeholder={props.placeholder}
				/>
				<AddButton
					style={{ minWidth: '100px' }}
					onClick={() => {
						if (props.openWithClick && !props.disabled) {
							setOpen(!open)
						}
					}}
				>
					<span>{props.placeholder}</span>{' '}
					{open ? (
						<KeyboardArrowUpIcon style={{ scale: '1', color: 'inherit' }} />
					) : (
						<KeyboardArrowDownIcon style={{ scale: '1', color: 'inherit' }} />
					)}
				</AddButton>
				<button
					style={{
						border: 'none',
						borderRadius: '60px',
						height: '24px',
						width: '24px',
						fontSize: '12px',
						display: 'flex',
						alignItems: 'center',
						background: theme.colors.lightGray,
						cursor: props.value?.length === 0 ? 'not-allowed' : 'pointer',
					}}
					onClick={() => {
						props.onChange([])
					}}
					disabled={props.value && props.value.length === 0}
				>
					<FilterAltOffIcon fontSize={'inherit'} />
				</button>
			</>
		)
	}
	function compareArrays(array1: string[], array2: string[]) {
		for (let i = 0; i < array1.length; i++) {
			if (!array2.includes(array1[i])) {
				return false
			}
		}
		return true
	}

	return (
		<StyledAutocomplete
			ref={props.setMainHeightChange !== undefined ? ref : undefined}
			multiple={props.multiple ? false : true}
			freeSolo={!props.singular}
			disabled={props.disabled}
			open={
				props.seeAll && props.value!.length === props.options!.length
					? false
					: open
			}
			options={orderedOptions}
			style={props.style}
			id='tags-filled'
			value={
				props.seeAll
					? props.value &&
						props.value.length > 0 &&
						props.value!.length === props.options!.length
						? ['All']
						: props.value || []
					: props.value && props.value.length === 1 && props.value[0] === ''
						? []
						: props.value
			}
			onChange={(a: any, n: any) => {
				if (props.onlyOneOptionAllowed) {
					n.reverse()
					n[0] ? props.onChange([n[0]]) : props.onChange([])
				}
				if (props.onlyOptionsAllowed) {
					if (compareArrays(n, props.options as string[])) {
						props.onChange(n)
					} else return null
				} else props.onChange(n)
			}}
			isOptionEqualToValue={(option: any, value: any) => {
				return option === value ? true : false
			}}
			onBlur={() => {
				setOpen(false)
				props.setMainHeightChange !== undefined &&
					props.setMainHeightChange(false)
				return props.onBlur
			}}
			renderOption={renderOptionsWhenOpening}
			renderTags={() => <></>}
			renderInput={renderInputField}
		/>
	)
}

export const ChipInputList = (props: {
	onChange?: any
	label?: string
	options?: any[]
	hint?: string
	hintmargin?: string
	disabled?: boolean
	value?: string[]
	float?: 'left' | 'right'
	fullWidth?: boolean
	multiple?: boolean
	singular?: boolean
	style?: React.CSSProperties
	onBlur?: any
	seeAll?: boolean
	loginRole?: string
	openWithClick?: boolean
	setMainHeightChange?: any
	onlyOneOptionAllowed?: boolean
	noMarginTop?: boolean
	ShowSelected?: boolean
	onlyOptionsAllowed?: boolean
	placeholder?: string
	clickableFunction?: (option: any) => void
	errored?: boolean
}) => {
	const ref = useRef()
	const [open, setOpen] = useState(false)

	let gotCurrentHeight = false
	const getCurrentHeight = () => {
		const { current }: any = ref
		if (current?.clientHeight) {
			if (!gotCurrentHeight) {
				requestAnimationFrame(getCurrentHeight)
			}
			gotCurrentHeight = true
			//2.0 is hardcoded. It's the number of max px/ this element px that looks optimal to messure if the main buttons need to move.
			if (2.0 > window.innerHeight / current.clientHeight) {
				props.setMainHeightChange !== undefined &&
					props.setMainHeightChange(true)
			}
		}
	}
	getCurrentHeight()
	const StyleForSelectedOption = (value: string, list: string[]): any => {
		if (list.indexOf(value) !== -1) {
			return {
				fontWeight: '900',
				backgroundColor: 'rgba(238,238,238,0.7)',
				width: '100%',
				position: 'relative',
			}
		}
	}
	const selectedOptions: string[] = []
	const notSelectedOptions: string[] = []
	props.options!.forEach((el) => {
		if (props.value?.includes(el)) {
			selectedOptions.push(el)
		} else {
			notSelectedOptions.push(el)
		}
	})
	const orderedOptions = [...selectedOptions, ...notSelectedOptions]
	props.seeAll && orderedOptions.push('All')

	const renderOptionsWhenOpening = (propsd: any, option: any) => {
		// if (props.seeAll && option === 'All') {
		// 	return null
		// }
		return (
			<div {...propsd} key={propsd.id}>
				<MenuItem
					key={option}
					value={option}
					style={StyleForSelectedOption(option, props.value ? props.value : [])}
				>
					{option}
				</MenuItem>
			</div>
		)
	}

	const renderSelectedOptions = (value: any[], getTagProps: any) => {
		const chips: any = value.map((option: any, index: number) => {
			const CustomLabel = (props: any) => {
				const { children } = props
				return (
					<div
						style={{
							whiteSpace: 'normal',
							overflow: 'auto',
							textOverflow: 'ellipsis',
							paddingLeft: '2px',
							paddingRight: '2px',
							// width: '400px',
						}}
					>
						{children}
					</div>
				)
			}
			return (
				<Chip
					variant='outlined'
					onClick={() => {
						if (props.clickableFunction) {
							props.clickableFunction(option)
						}
					}}
					label={
						props.ShowSelected ? <CustomLabel>{option}</CustomLabel> : option
					}
					deleteIcon={<ClearIcon />}
					style={{
						width: 'auto',
						minWidth: props.ShowSelected ? '100px' : '0px',
						height: 'auto',
					}}
					{...getTagProps({ index })}
				/>
			)
		})

		return chips
	}
	const renderInputField = (params: any) => (
		<>
			{props.hint ? <InfoTag title={props.hint} ml={props.hintmargin} /> : null}
			<StyledTextField
				{...params}
				focused
				label={props.label ? props.label : undefined}
				margin='dense'
				fullWidth
				key={params + 'key-input'}
				variant='outlined'
				style={{
					float: props.float,
					margin: props.noMarginTop ? '0px' : '',
					// backgroundColor: props.errored ? '#eeafaf' : 'rgba(238,238,238,0.6)',
					boxShadow: props.errored ? 'red 0px 0px 7px' : 'none'
				}}
				InputProps={{
					...params.InputProps,
					style: {
						paddingLeft: '10px',

					},
				}}
				InputLabelProps={{
					style: { top: '-10px' },
				}}
				onClick={() => {
					if (props.openWithClick && !props.disabled) {
						setOpen(!open)
					}
				}}
				placeholder={props.placeholder}
			/>
		</>
	)
	function compareArrays(array1: string[], array2: string[]) {
		for (let i = 0; i < array1.length; i++) {
			if (!array2.includes(array1[i])) {
				return false
			}
		}
		return true
	}

	return (
		<StyledAutocomplete
			ref={props.setMainHeightChange !== undefined ? ref : undefined}
			multiple={props.multiple ? false : true}
			freeSolo={!props.singular}
			disabled={props.disabled}
			open={
				props.seeAll &&
					props.value &&
					props.options &&
					props.value.length === props.options.length
					? false
					: open
			}
			options={orderedOptions}
			style={props.style}
			id='tags-filled'
			value={
				props.seeAll
					? props.value &&
						props.value.length > 0 &&
						props.value.length === (props.options?.length || 0)
						? ['All']
						: props.value || []
					: props.value && props.value.length === 1 && props.value[0] === ''
						? []
						: props.value
			}
			onChange={(a: any, n: any) => {
				if (props.onlyOneOptionAllowed) {
					n.reverse()
					n[0] ? props.onChange([n[0]]) : props.onChange([])
				}
				if (props.onlyOptionsAllowed) {
					if (compareArrays(n, props.options as string[])) {
						props.onChange(n)
					} else return null
				} else props.onChange(n)
			}}

			isOptionEqualToValue={(option: any, value: any) => {
				return option === value ? true : false
			}}
			onBlur={() => {
				setOpen(false)
				props.setMainHeightChange !== undefined &&
					props.setMainHeightChange(false)
				return props.onBlur
			}}
			renderOption={renderOptionsWhenOpening}
			renderTags={renderSelectedOptions}
			renderInput={renderInputField}
		/>
	)
}

export const StyledFormControl = (
	props: FormControlProps & { children: any; fullWidth?: boolean },
) => {
	const StyledForm = styled(FormControl)(({ theme }) => ({
		width: props.fullWidth ? '100%' : '45%',
		marginTop: '20px',
	}))
	return (
		<StyledForm focused {...props}>
			{props.children}
		</StyledForm>
	)
}


export const StyledTextAreaField = (props: {
	label: string
	value: string
	onChange: any
}) => {
	return (
		<TextField
			label={props.label}
			value={props.value}
			key={props.label + 'textarea'}
			onChange={(e) => props.onChange(e.target.value)}
			fullWidth
			variant='outlined'
			multiline
			focused
			rows={6}
			InputLabelProps={{ shrink: true, style: { marginTop: '-12px' } }}
			inputProps={{
				style: {
					padding: '20px',
				},
			}}
			color={'primary'}
			style={{
				marginTop: '12px',
				borderRadius: '8px',
				backgroundColor: 'rgb(243,243,243)',
			}}
		/>
	)
}
export const StyledNameField = (props: {
	label: string
	type: string
	value: string | number | null
	onChange?: any
	onBlur?: any
	onFocus?: any
	required?: boolean //deprecated
	disabled?: boolean
	hintmargin?: string
	defaultValue?: string
	keyname?: string
	float?: 'left' | 'right'
	hint?: any
	errormessage?: any
	warning?: any
	visible?: any
	checked?: boolean
	multiline?: boolean
	style?: any
	customInputLabel?: string
	color?:
	| 'primary'
	| 'secondary'
	| 'error'
	| 'info'
	| 'success'
	| 'warning'
	| undefined
	urlIcon?: boolean
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const handleClickShowPassword = () => setShowPassword(!showPassword)
	const handleMouseDownPassword = () => setShowPassword(!showPassword)
	const handleEndAdornment = (type: string) => {
		if (type === 'password') {
			return (
				<InputAdornment position='end'>
					<IconButton
						aria-label='toggle password visibility'
						onClick={handleClickShowPassword}
						onMouseDown={handleMouseDownPassword}
					>
						{showPassword ? <Visibility /> : <VisibilityOff />}
					</IconButton>
				</InputAdornment>
			)
		}
		if (type === 'custom') {
			return (
				<InputAdornment position='start'>
					{props.customInputLabel}
				</InputAdornment>
			)
		} else {
			return <></>
		}
	}

	const errorStyling = () => {
		if (props.errormessage) {
			return {
				backgroundColor: '#ffcdd2',
				boxShadow: '0px 0px 0px 1px #d32f2f',
				color: '#d32f2f',
			}
		}
	}
	return (
		<div style={{ display: 'flex', position: 'relative' }}>
			<StyledTextField
				multiline={props.multiline ? true : false}
				focused
				{...props}
				key={props.keyname ? props.keyname : 'InputName' + props.label}
				margin='dense'
				type={props.type === 'password' && showPassword ? 'text' : props.type}
				value={props.value}
				fullWidth
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				style={{ ...props.style, ...errorStyling(), marginTop: '22px' }}
				onChange={(e: any) => {
					if (props.value === 'All') {
						const newState = e.target.value.slice(4)
						props.onChange(newState)
					} else {
						props.onChange(e.target.value)
					}
				}}
				variant='outlined'
				color={
					props.color ? props.color : props.checked ? 'success' : 'primary'
				}
				InputLabelProps={{
					style: { top: '-8px', fontSize: '15px' },
				}}
				InputProps={{
					// <-- This is where the toggle button is added.
					endAdornment: props.customInputLabel
						? handleEndAdornment('custom')
						: handleEndAdornment(props.type),
				}}
				urlIcon={props.urlIcon}
			/>
			{props.urlIcon && props.value && !props.errormessage && (
				<button
					onClick={() => {
						const newTab: any = window.open(props.value as string, '_blank')
						newTab.focus()
					}}
					style={{
						position: 'absolute',
						right: '4%',
						top: '43%',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					<LinkIcon></LinkIcon>
				</button>
			)}
			{props.hint ? (
				<InfoTag title={props.hint} ml={props.hintmargin} mt={'-8px'} />
			) : null}
			{props.errormessage ? (
				<ErrorTag
					title={props.errormessage}
					ml={props.hintmargin}
					mt={'-8px'}
				/>
			) : null}
			{props.warning ? (
				<ErrorTag
					title={props.warning}
					ml={props.hintmargin}
					mt={'-8px'}
					color={'rgb(237,108,4)'}
				/>
			) : null}
		</div>
	)
}

export const TableSearchComponent = (props: {
	setSearch: any
	search: string
	style?: any
	filterHandler?: any
}) => {
	return (
		<TableSearch style={props.style}>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder='Search'
				inputProps={{
					'aria-label': 'search',
				}}
				autoFocus={!props.filterHandler}
				onChange={(e: any) => props.setSearch(e.target.value)}
				value={props.search}
			/>
		</TableSearch>
	)
}
export const FilterSearchComponent = (props: {
	setSearch: any
	search: string[]
	style?: any
	applyFilter?: any
	filterLabel?: any
	currentFilters?: any
	clearFilter?: any
	optionsFilters?: any
	setFilterHander?: any
	filtersKey?: any
	customFilter?: any
}) => {
	let options: any = []
	for (const key in props.optionsFilters) {
		if (key === props.currentFilters) {
			if (typeof [...props.optionsFilters[key]][0] === 'string') {
				options = [...props.optionsFilters[key]].sort()
			} else if (
				typeof [...props.optionsFilters[key]][0] === 'object' &&
				!Array.isArray([...props.optionsFilters[key]][0])
			) {
				for (const element of props.optionsFilters[key]) {
					if (key === 'email' || key === 'publisher_manager') {
						options.push(element.name)
					} else {
						options.push(element[key])
					}
				}
				options.sort()
				// console.log(props.optionsFilters[key])
			}
			// if (options)
			break
		}
	}
	// const StyleForSelectedOption = (value: string, list: string[]) => {
	// 	if (list.indexOf(value) !== -1) {
	// 		return { fontWeight: '900', backgroundColor: 'rgba(238,238,238,0.7)' }
	// 	}
	// }
	// const renderedOptions = (opt: any) => {
	// 	return (
	// 		<MenuItem
	// 			key={opt.id}
	// 			value={opt.key}
	// 			onClick={() => {
	// 				props.setSearch((prev: any) =>
	// 					prev ? [...prev, opt.key] : [opt.key],
	// 				)
	// 			}}
	// 			style={StyleForSelectedOption(opt.key, props.search)}
	// 		>
	// 			{opt.key}
	// 		</MenuItem>
	// 	)
	// }

	useEffect(() => {
		if (props.customFilter) {
			props.setSearch(props.customFilter[props.filtersKey])
		}
	}, [props.currentFilters])
	useEffect(() => {
		if (props.customFilter) {
			props.setSearch(props.customFilter[props.filtersKey])
		} else {
			props.setSearch([])
		}
	}, [])

	return (
		<>
			<div
				style={{
					display: 'inherit',
					alignItems: 'center',
					justifyContent: 'center',
					height: 'inherit',
					width: '100%',
				}}
			>
				{options.length === 0 ? (
					<StyledInputBase
						style={{ width: '100%' }}
						placeholder={'Filter for ' + props.filterLabel}
						inputProps={{
							'aria-label': 'search',
						}}
						autoFocus
						onChange={(e: any) => {
							props.setSearch(e.target.value)
						}}
						value={props.search}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								props.applyFilter()
								props.setFilterHander(false)
							}
						}}
					/>
				) : (
					<ChipInputList
						onChange={props.setSearch}
						options={options}
						value={props.search}
						openWithClick={true}
						style={
							{
								height: 'inherit',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '8px',
								width: 'inherit',
								// marginTop: '-25px',
							} as any
						}
						onlyOptionsAllowed
						noMarginTop
					/>
					// <Autocomplete
					// 	style={{
					// 		height: '50px',
					// 	}}
					// 	sx={{
					// 		'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
					// 			{
					// 				border: 'none',
					// 			},
					// 		'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
					// 			border: 'none',
					// 		},
					// 	}}
					// 	options={options}
					// 	renderOption={(option: any) => {
					// 		return renderedOptions(option)
					// 	}}
					// 	renderInput={(params) => (
					// 		<TextField
					// 			{...params}
					// 			style={{ height: 'inherit' }}
					// 			placeholder={props.filterLabel}
					// 		/>
					// 	)}
					// 	onChange={(_, value) => {
					// 		if (!value) {
					// 			props.setSearch([])
					// 		} else {
					// 			props.setSearch((prev: any) =>
					// 				prev ? [...prev, value] : [value],
					// 			)
					// 		}
					// 	}}
					// 	onKeyDown={(e) => {
					// 		if (e.key === 'Enter') {
					// 			props.applyFilter()
					// 			props.setFilterHander(false)
					// 		}
					// 	}}
					// 	getOptionLabel={(option: any) => {
					// 		return option.toString()
					// 	}}
					// 	value={props.search}
					// />
				)}
			</div>
			<AddButton
				style={{ fontSize: '12px' }}
				onClick={() => props.applyFilter()}
			>
				Apply
			</AddButton>
			<button
				style={{
					fontSize: '12px',
					border: 'none',
					boxShadow: 'none',
					textDecoration: 'solid underline 2px',
					textUnderlineOffset: '6px',
					marginLeft: '4px',
					paddingLeft: '0px',
					cursor: 'pointer',
				}}
				onClick={props.clearFilter}
				disabled={props.search.length === 0}
			>
				Clear
			</button>
		</>
	)
}

