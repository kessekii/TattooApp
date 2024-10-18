import styled from '@emotion/styled'
import { Button, FormControlLabel, TextField, Typography } from '@mui/material'
import theme from '../../utils/theme'

export const TitleComponent = styled(Typography)(({ theme: Theme }) => ({
	position: 'absolute',
	color: theme.palette.primary.main,
	fontFamily: theme.typography.fontFamily,
	fontSize: '18px',
	fontWeight: 'bold',
	left: '2%',
	top: '2%',
	backgroundColor: theme.palette.secondary.main,
}))

export const LoginPageWrapper = styled('div')(({ theme: Theme }) => ({
	position: 'absolute',
	width: '100%',
	height: '90%',

	backgroundColor: theme.palette.secondary.main,
	textAlign: 'center',
	paddingTop: '10rem',
}))

export const LoginWrapper = styled('div')(({ theme: Theme }) => ({
	backgroundColor: theme.palette.secondary.main,
	margin: 'auto',
	textAlign: 'center',
	width: '25%',
}))

export const RememberMeComponent = styled(FormControlLabel)(
	({ theme: Theme }) => ({
		fontSize: '12px',
		fontFamily: theme.typography.fontFamily,
		fontWeight: 'bold',
		margin: 'auto',
		color: theme.palette.primary.dark,
		textAlign: 'center',
		float: 'left',
	}),
)

export const LoginComponent = styled(TextField)(({ theme: Theme }) => ({
	fontFamily: theme.typography.fontFamily,
	margin: 'auto',
	color: theme.palette.primary.main,
	backgroundColor: theme.palette.secondary.main,
	fontSize: '18px',
	flexDirection: 'column',
	display: 'flex',
	borderBottom: '1px solid ' + theme.palette.secondary.light,
}))

export const ForgotEmailComponent = styled(TextField)(({ theme: Theme }) => ({
	fontFamily: theme.typography.fontFamily,
	margin: 'auto',
	color: 'white',
	backgroundColor: 'transparent',
	fontSize: '18px',
	flexDirection: 'column',
	display: 'flex',
	borderBottom: '1px solid ' + theme.palette.secondary.light,
}))

export const LoginButton = styled(Button)(({ theme: Theme }) => ({
	fontFamily: theme.typography.fontFamily,
	marginTop: '2rem',
	marginLeft: '65px',
	marginRight: '65px',
	width: '50%',
	background: theme.colors.gradient,
	borderRadius: '25px',
	color: theme.palette.primary.main,
}))

export const ForgotPasswordComponent = styled(Typography)(
	({ theme: Theme }) => ({
		fontSize: '12px',
		fontFamily: theme.typography.fontFamily,
		margin: 'auto',
		paddingTop: '0.8rem',
		fontWeight: 'bold',
		height: '42px',
		color: theme.palette.primary.main,
		textAlign: 'center',
		float: 'right',
		cursor: 'pointer',
	}),
)
export const ForgotPasswordButton = styled(Button)(({ theme: Theme }) => ({
	fontFamily: theme.typography.fontFamily,
	marginTop: '2rem',
	float: 'left',
	width: '30%',

	marginLeft: '100px',
	background: theme.colors.gradient,
	borderRadius: '25px',
	color: theme.palette.primary.main,
}))
export const ForgotPasswordCancel = styled(Button)(({ theme: Theme }) => ({
	fontFamily: theme.typography.fontFamily,
	marginTop: '2rem',
	float: 'right',
	width: '30%',
	marginRight: '100px',
	background: 'transparent',
	borderRadius: '25px',
	color: theme.colors.black,
}))

