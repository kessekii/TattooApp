import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@mui/material'
import React from 'react'
import { AddButton } from '../../pages/components/reusableComponents'

export const WarningPrompt = ({
	PopUpVisible,
	setPopUpVisible,
	message,
	onAgree,
	onCancel,
	obj,
}: {
	PopUpVisible: boolean
	setPopUpVisible: any
	message: string
	onAgree?: any
	onCancel?: any
	obj?: any
}) => {
	return (
		<Dialog open={PopUpVisible}>
			<DialogTitle>WARNING</DialogTitle>
			<DialogContent>
				<DialogContentText>{message.toString()}</DialogContentText>
			</DialogContent>
			<DialogActions>
				{onCancel ? (
					<AddButton
						style={{ margin: 'auto' }}
						onClick={() => {
							if (onCancel) onCancel()
							setPopUpVisible(false)
						}}
					>
						Cancel
					</AddButton>
				) : (
					<></>
				)}
				<AddButton
					style={{ margin: 'auto', width: 'auto' }}
					onClick={() => {
						if (onAgree) {
							onAgree(obj)
						}
						setPopUpVisible(false)
					}}
				>
					Understood
				</AddButton>
			</DialogActions>
		</Dialog>
	)
}

export const DeletionWarningPrompt = (props: {
	PopUpVisible: boolean
	setPopUpVisible: any
	message: string
	onAgree: any
	setObj: any
	obj: any
}) => {
	const handleOk = async (obj: any) => {
		console.log('OBJ : ', obj)
		await props.onAgree(obj)
		props.setPopUpVisible(false)
	}
	return (
		<Dialog open={props.PopUpVisible}>
			<DialogTitle>CAUTION</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.message.toString()}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<AddButton
					style={{ margin: 'auto' }}
					onClick={() => {
						props.setObj(undefined)
						props.setPopUpVisible(!props.PopUpVisible)
					}}
				>
					Cancel
				</AddButton>

				<AddButton
					style={{ margin: 'auto', width: 'auto', color: 'red' }}
					onClick={() => handleOk(props.obj)}
				>
					DELETE
				</AddButton>
			</DialogActions>
		</Dialog>
	)
}
