import type {} from '@mui/lab/themeAugmentation'
import { createTheme, responsiveFontSizes, Theme } from '@mui/material'
declare module '@mui/material/styles' {
	export interface Theme {
		colors: {
			white: string
			black: string
			gradient: string
			buttonGradient: string
			lightGradient: string
			activeGradient: string
			disabledGradient: string
			titleGradient: string
			green: string
			gray: string
			lightGray: string
			purple: string
			yellow: string
			red: string
			blue: string
		}
		animatedItem: any
		shadow: {
			boxShadow: string
			lightShadow: string
		}
		dimentions: {
			drawerWidth: number
			smallerRadius: string
			biggerRadius: string
		}
	}

	export interface ThemeOptions {
		colors?: {
			white?: string
			black?: string
			gradient?: string
			buttonGradient?: string
			lightGradient?: string
			activeGradient?: string
			disabledGradient?: string
			titleGradient?: string
			green?: string
			gray?: string
			lightGray?: string
			purple?: string
			yellow?: string
			red?: string
			blue?: string
		}
		animatedItem?: any
		shadow?: {
			boxShadow?: string
			lightShadow?: string
		}
		dimentions?: {
			drawerWidth?: number
			smallerRadius?: string
			biggerRadius?: string
		}
	}
}
const smallerRadius = '6px'
const biggerRadius = '15px'

const lightGradient =
	'linear-gradient(90deg, rgba(238,29,66,0.5) 0%, rgba(64,19,129,0.5) 100%) !important'

export const theme: Theme = responsiveFontSizes(
	createTheme({
		palette: {
			primary: {
				main: '#fafbfc', // background
				dark: '#808080',
			},
			secondary: {
				main: '#000000', // black
			},
		},

		components: {
			MuiCheckbox: {
				styleOverrides: {
					colorPrimary: {
						color: '#ee1d4a',
					},
					colorSecondary: {
						color: 'white',
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						borderRadius: smallerRadius,
						padding: '0px',
						'& .MuiOutlinedInput-notchedOutline': {
							border: 'none',
							maxHeight: '14px',
						},
					},
				},
			},
			MuiFormLabel: {
				styleOverrides: {
					asterisk: {
						color: '#ee1d4a',
					},
					root: {
						color: '#808080',
						fontWeight: 'bolder',
						top: '25%',
						'&.Mui-focused': {
							color: '#808080',
							fontWeight: 'bolder',
							top: '0%',
						},
					},
				},
			},
			MuiSwitch: {
				styleOverrides: {
					switchBase: {
						'&.Mui-checked': {
							color: '#d0d0d0',
						},
						'&.Mui-checked+.MuiSwitch-track': {
							background:
								'linear-gradient(140deg, rgba(0,254,86,1) 0%, rgba(0,203,69,1) 100%)',
							opacity: '1',
						},
					},
				},
			},
			MuiFormControlLabel: {
				styleOverrides: {
					root: {
						color: '#ffffff',
						'&.MuiDisabled': {
							color: '#aaaaaa',
						},
					},
				},
			},
			MuiListItem: {
				styleOverrides: {
					root: {
						backgroundColor: '#fafbfc',
						fontWeight: 600,
					},
				},
			},

			MuiButton: {
				styleOverrides: {
					startIcon: {
						color: '#ee1d4a',
					},
					endIcon: {
						color: '#ee1d4a',
					},
					root: {
						'&:hover': {
							background: lightGradient,
							color: 'white',
							// border: '0px !important'
							borderColor: 'transparent',
						},
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						borderRadius: smallerRadius,
					},
				},
			},

			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&:hover': {
							background: lightGradient,
							color: 'white',
							borderRadius: smallerRadius,
						},
					},
				},
			},
			MuiListItemButton: {
				styleOverrides: {
					root: {
						stroke: 'black',
						'&:hover': {
							background: lightGradient,
							color: 'white',
							stroke: 'white',
						},
					},
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					bar: {
						// color: '#ee1d4a!important',
						// background: 'rgba(238,29,66,1)',
					},

					barColorPrimary: {
						color: '#ee1d4a!important',
						background: 'rgba(238,29,66,1)',
					},
					barColorSecondary: {
						color: '#ee1d4a!important',
						background: 'rgba(238,29,66,1)',
					},
				},
			},
			MuiAutocomplete: {
				styleOverrides: {
					input: {
						fontSize: '14px',
						fontWeight: 500,
					},
					option: {
						'&:hover': {
							background: lightGradient,
							color: 'white',
							borderRadius: smallerRadius,
						},
					},
					popper: {
						width: 'fit-content!important',
					},
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						'& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
						'& .MuiOutlinedInput-notchedOutline': {
							top: '0px',
						},
					},
				},
			},
			// MuiListItemText: {
			// 	styleOverrides: {
			// 		root: {
			// 			color: 'inherit',
			// 		},
			// 	},
			// },
			MuiSvgIcon: {
				styleOverrides: {
					colorDisabled: {
						color: '#aaaaaa',
					},
					colorPrimary: {
						color: '#ee1d4a',
					},
					colorSecondary: {
						color: 'white',
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					icon: { color: '#000000' },
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						borderRadius: biggerRadius,
						width: '500px',
					},
				},
			},
		},
		typography: {
			fontFamily: "'Montserrat', sans-serif",
			button: {
				textTransform: 'none',
			},
		},
		shadow: {
			boxShadow: '-8px 8px 17px 0px rgb(0 0 0 / 21%)',
			lightShadow: '-8px 8px 17px 0px rgb(0 0 0 / 10%)',
		},
		colors: {
			white: '#ffffff',
			black: '#000000',
			gradient:
				'linear-gradient(90deg, rgba(238,29,66,1) 0%, rgba(64,19,129,1) 100%)',
			buttonGradient: '#fafbfc',
			lightGradient:
				'linear-gradient(90deg, rgba(238,29,66,0.5) 0%, rgba(64,19,129,0.5) 100%)',
			activeGradient:
				'linear-gradient(65deg, rgba(0,254,86,1) 0%, rgba(0,203,69,1) 100%)',
			disabledGradient:
				'linear-gradient(65deg, rgba(228,131,144, 1) 0%, rgba(238,29,66,1) 100%)',
			green: 'rgba(0,203,69,1)',
			gray: '#fafbfc',
			lightGray: '#0000001f',
			purple: '#401381',
			yellow: 'rgba(255,130,0,1)',
			red: 'rgba(238,29,66,1)',
			blue: 'rgba(64,19,129,1)',
		},
		dimentions: {
			drawerWidth: 40,
			smallerRadius: smallerRadius,
			biggerRadius: biggerRadius,
		},
	}),
)

export default theme
