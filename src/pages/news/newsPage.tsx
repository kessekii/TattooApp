import { Grid, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { theme } from '../../utils/theme'
import {
	AddButton,
	PageWrapper,
	PlusButton,
} from '../components/reusableComponents'

import { fetchData } from '../../utils/helpers/navigationHelper'

const NewsPage = (props: {
	children?: any
	setLoading?: any
	errorMessage?: null | string
	setErrorMessage?: any
	isErrorPromptOpened?: boolean
	setIsErrorPromptOpened?: any
}) => {
	const { login } = useTypedSelector(
		(state) => state,
	)
	const [topics, setTopics] = useState<any>(null)
	const [editMode, setEditMode] = useState(false)
	const [deletedElements, setDeleted] = useState<any[]>([])
	const [newsAdvertiserList, setNewsAdvertiserList] = useState([])
	const [newsPublisherList, setNewsPublisherList] = useState([])
	const [mainHeight, setMainHeight] = useState(0)
	// const [cardHoveredIndex, setCardHoveredIndex] = useState(0)
	const {
		postNewsImageAction,
		postNewsAction,
		getNewsAction,
		getAdvertiserAction,
		getPublisherAction,
	} = useActions()
	const ref = useRef()
	const headers = useMemo(() => {
		return {
			Authorization: `Token ${login.user.token}`,
		}
	}, [login.user.token])



	const addTitle = () => {
		const newTopic = {
			title: 'Default title',
			elements: [],
			titles: [],
			id: uuidv4(),
		}
		setTopics((prev: any) => (prev ? [...prev, newTopic] : [newTopic]))
	}
	const deleteTitle = (id: string) => {
		const deletedTopic = topics.filter((el: any) => el.id === id)[0]
		const filteredTopics = topics.filter((el: any) => el.id !== id)
		setTopics(filteredTopics)
		const imagesToDelete: any = []
		for (const el of deletedTopic.elements) {
			if (el.image === 'uploaded') {
				imagesToDelete.push(el.id)
			}
		}
		setDeleted((prev: any) =>
			prev ? [...prev, ...imagesToDelete] : imagesToDelete,
		)
	}

	const encodeImageFileAsURL = async (img: any, id: string) => {
		const reader = new FileReader()
		var file = img
		reader.onloadend = function () {
			if (reader.result !== null) {
				const payload = {
					image: reader.result.toString().split(',')[1],
					name: id,
				}
				postNewsImageAction(headers, payload)
			}
		}
		reader.readAsDataURL(file)
	}
	const uploadData = async () => {
		for (const topic of topics) {
			for (const element of topic.elements) {
				if (element.image && element.image !== 'uploaded') {
					await encodeImageFileAsURL(element.image, element.id)
					element.image = 'uploaded'
				}
			}
			// console.log(topic.elements)
			if (typeof topic.elements !== 'string') {
				topic.elements = JSON.stringify(topic.elements)
			}
			if (typeof topic.titles !== 'string') {
				topic.titles = JSON.stringify(topic.titles)
			}
		}
		const dataToSave = {
			topics: topics,
			deleted: deletedElements,
		}
		console.log(dataToSave)
		postNewsAction(headers, dataToSave)
	}

	let gotCurrentHeight = false
	const getCurrentHeight = () => {
		const { current }: any = ref
		if (current?.clientHeight) {
			if (!gotCurrentHeight) {
				requestAnimationFrame(getCurrentHeight)
			}
			gotCurrentHeight = true
			if (mainHeight === 0) setMainHeight(current.clientHeight)
		}
	}
	return (
		<ThemeProvider theme={theme}>
			<PageWrapper style={{ marginTop: '45px', color: theme.colors.black }}>
				<Grid
					container
					spacing={0}
					direction={'row'}
					alignItems={'flex-start'}
					width={'95%'}
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						height:
							login.user.role.toLowerCase() === 'designer' ||
								login.user.role.toLowerCase() === 'super'
								? '50px'
								: '0px',
					}}
				>
					{/* <Grid item xs={9} style={{marginLeft: '6px'}}>
						<GreetingsComponent>Welcome, {login.user.name}</GreetingsComponent>

					</Grid> */}
					{login.user.role.toLowerCase() === 'designer' ? (
						editMode ? (
							<AddButton
								style={{ marginTop: '0px', width: '160px' }}
								onClick={() => {
									setEditMode(!editMode)
									uploadData()
								}}
							>
								SAVE
							</AddButton>
						) : (
							<AddButton
								style={{ marginTop: '0px', width: '160px' }}
								onClick={() => setEditMode(!editMode)}
							>
								EDIT
							</AddButton>
						)
					) : (
						<></>
					)}
				</Grid>
				<Grid
					container
					spacing={0}
					width={'100%'}
					style={{
						display: 'flex',
						// height: '100%',
						marginTop: '-20px',
						paddingBottom: '60px',
					}}
				>
					<Grid
						item
						xs={6}
						style={{
							display: 'flex',
							flexDirection: 'column',
							marginTop: '0px',
							marginLeft: '0px',
							// paddingBottom: '30px',
							// paddingLeft: '40px',
							padding: '40px',
							paddingTop: '10px',
							gap: '12px',
							// border: '1px solid rgba(0,0,0,0.1)',
							// borderRadius: '20px',
							// boxShadow: '-2px 2px 0px 1px rgba(0,0,0,0.4)',
						}}
						ref={ref as unknown as any}
					>
						{/* <GreetingsComponent>
							Welcome to <span style={{color: theme.colors.green}}>Varys</span>,{' '}
							<span style={{ fontSize: '24px' }}>{login.user.name}</span>
						</GreetingsComponent> */}
						<div
							style={{
								display: 'flex',
								position: 'relative',
								flexDirection: 'column',
							}}
						>
							{topics?.map((el: any, index: number) => {
								return (
									<React.Fragment key={el.id + 'main-fragment'}>

									</React.Fragment>
								)
							})}
						</div>
						{editMode && (
							<React.Fragment>
								<PlusButton
									style={{ top: '12px', left: '45%' }}
									onClick={addTitle}
								>
									+
								</PlusButton>
								<Typography
									component={'span'}
									onClick={addTitle}
									style={{
										color: theme.colors.green,
										position: 'relative',
										width: '90px',
										left: '49%',
										top: '-10px',
										cursor: 'pointer',
									}}
								>
									Add Group
								</Typography>
							</React.Fragment>
						)}
					</Grid>

				</Grid>
			</PageWrapper>
		</ThemeProvider>
	)
}

export default NewsPage
