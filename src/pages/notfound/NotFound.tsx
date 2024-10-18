import { Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import theme from '../../utils/theme'
import { LoginButton, TitleComponent } from '../login/loginPageComponents'

const NotFound = () => {
	const navigate = useNavigate()
	return (
		<>
			<script>
				{/* {(document.body.style.backgroundColor = theme.colors.lightGray)} */}
			</script>
			<TitleComponent
				style={{ color: theme.colors.black, backgroundColor: 'transparent' }}
			>
				Thing Or Two
			</TitleComponent>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '40px',
					marginTop: '20%',
				}}
			>
				<Typography style={{ color: theme.colors.black, fontSize: '18px' }}>
					Error 404 - Page not found.
				</Typography>
				<LoginButton
					variant='contained'
					size='large'
					onClick={() => {
						// document.body.style.backgroundColor = theme.colors.white
						navigate('/')
					}}
					style={{ width: '220px' }}
				>
					Go home
				</LoginButton>
			</div>
		</>
	)
}

export default NotFound
