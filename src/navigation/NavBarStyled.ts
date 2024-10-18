import { Button } from '@mui/material'
import { styled as stylied } from '@mui/material/styles'

export const MenuIsSelected = stylied('div')(({ theme }) => ({
	marginTop: '0.5rem',
	marginBottom: '0.5rem',
	width: '100%',
	background: theme.colors.gradient,
	borderRadius: '8px',
	color: theme.palette.secondary.main,
}))

export const MenuNotSelected = stylied('div')(({ theme }) => ({
	marginTop: '0.5rem',
	marginBottom: '0.5rem',
	width: '100%',
	background: theme.colors.gray,
	borderRadius: '15px',
	color: theme.palette.secondary.main,
}))

export const MenuComponent = stylied('div')(({ theme }) => ({
	backgroundColor: theme.colors.gray,
	overflow: 'hidden',
	height: 'inherit',
}))

export const SettingsButton = stylied(Button)(({ theme }) => ({
	position: 'relative',
	left: '95%',
	borderRadius: theme.dimentions.biggerRadius,
	boxShadow: theme.shadow.boxShadow,
	backgroundColor: theme.palette.common.white,
	fontFamily: theme.typography.fontFamily,
	'&:hover': {
		backgroundColor: theme.palette.common.white,
	},

	height: '39px',
	width: '39px',
	minWidth: '39px',
}))
