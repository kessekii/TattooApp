import { Paper, Typography } from '@mui/material'
import { sha256 } from 'js-sha256'
import { useEffect, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import {
	ForgotEmailComponent,
	ForgotPasswordButton,
	ForgotPasswordCancel,
} from './loginPageComponents'
export const ForgotPasswordPopup = (props: {
	isVisible: boolean
	setIsVisible: any
	setErrorMessage: any
}) => {

	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [codeHash, setCodeHash] = useState('')
	const [codeView, setCodeView] = useState(false)
	const [pwd, setPwd] = useState('')
	const [pwdRep, setPwdRep] = useState('')
	const [errorMes, setErrorMes] = useState('')
	const [newPasswordView, setNewPasswordView] = useState(false)
	const { login } = useTypedSelector((state) => state)
	// const headers = {
	// 	Authorization: `Token ${login.user.token}`,
	// }
	const [passwordVerify, setPasswordVerify] = useState<string | null>(null)
	const [isValid, setIsValid] = useState<boolean>(false)
	const [strength, setStrength] = useState('weak')

	const handlePasswordVerification = (password: string) => {
		const strongPassword = new RegExp(
			'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
		)
		if (strongPassword.test(password)) {
			setStrength('strong')
		} else {
			setStrength('weak')
		}
	}
	const trySubmit = async () => {
		const payload = {
			email: email,
			newPassword: pwd!,
			user: 'admin@thing02.com',
		}
		const headers = {
			Authorization: `Token ${login.user.token}`,
		}

		await resetPassword(headers, payload, setErrorMes)
	}

	useEffect(() => {
		handlePasswordVerification(pwd || '')
		setIsValid(pwd === pwdRep && !!pwdRep && !!pwd && strength !== 'weak')
	}, [pwd, pwdRep])
	const tryReset = async () => {
		const error = await forgotPasswordAction(email, setCodeHash)
		if (error) {
			props.setErrorMessage(error)
		}
		setCodeView(true)
	}
	const tryCode = async () => {
		if (sha256(code) === codeHash) {
			setNewPasswordView(true)
		}
	}
	const trySavePassword = async () => {
		trySubmit()
		props.setIsVisible(false)
	}
	return (
		<Paper
			style={{
				height: '400px',
				width: '600px',
				position: 'absolute',
				top: '200px',
				right: '400px',
				zIndex: '100',
				padding: '20px',
			}}
		>
			<Typography
				fontSize={'27px'}
				align='left'
				marginTop='5px'
				fontWeight={'bold'}
			>
				{codeView === false ? 'Forgot Password?' : ''}
			</Typography>

			<Typography align='left' marginTop='15px' fontWeight={'semibold'}>
				{codeView === false
					? 'Enter your email address to recover your account'
					: newPasswordView === false
						? 'Enter code sent to your email'
						: 'Enter new password'}
			</Typography>
			<ForgotEmailComponent
				variant='filled'
				id='new-pwd-form-first'
				key='new-pwd-form-first'
				type={
					codeView === false
						? 'email'
						: newPasswordView === false
							? 'number'
							: 'password'
				}
				label={
					codeView === false
						? 'Email'
						: newPasswordView === false
							? 'Code'
							: 'New Password'
				}
				placeholder={
					codeView === false && newPasswordView === false
						? 'yoni@thing02.com'
						: ''
				}
				inputProps={{
					style: {
						//color: theme.palette.secondary.main,
					},
				}}
				InputLabelProps={{
					style: {
						//color: theme.palette.primary.dark,
						fontSize: '12px',
					},
				}}
				onChange={(e) => {
					codeView === false
						? setEmail(e.target.value)
						: newPasswordView === false
							? setCode(e.target.value)
							: setPwd(e.target.value)
				}}
				value={
					codeView === false ? email : newPasswordView === false ? code : pwd
				}
			/>
			{newPasswordView === true ? (
				<ForgotEmailComponent
					variant='filled'
					id='new-pwd-form-second'
					key='new-pwd-form-second'
					type='password'
					label={'Repeat New Password'}
					inputProps={{
						style: {
							//color: theme.palette.secondary.main,
						},
					}}
					InputLabelProps={{
						style: {
							//color: theme.palette.primary.dark,
							fontSize: '12px',
						},
					}}
					onChange={(e) => {
						setPwdRep(e.target.value)
					}}
					value={pwdRep}
				/>
			) : (
				<></>
			)}
			<ForgotPasswordCancel
				variant='contained'
				size='large'
				onClick={() => props.setIsVisible(!props.isVisible)}
			>
				Cancel
			</ForgotPasswordCancel>
			<ForgotPasswordButton
				variant='contained'
				size='large'
				disabled={
					codeView && newPasswordView && (strength === 'weak' || pwd !== pwdRep)
				}
				onClick={
					codeView === false
						? tryReset
						: newPasswordView === false
							? tryCode
							: trySavePassword
				}
			>
				{codeView === false
					? 'Reset Password'
					: newPasswordView === false
						? 'Verify'
						: 'Save Password'}
			</ForgotPasswordButton>
		</Paper>
	)
}
