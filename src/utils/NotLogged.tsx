import { Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TitleComponent } from '../pages/components/reusableComponents'
import { LoginButton } from '../pages/login/loginPageComponents'
import theme from './theme'

const NotLogged = () => {
	const navigate = useNavigate()
	return (
		<>
			<script>
				{(document.body.style.backgroundColor = theme.colors.lightGray)}
			</script>
			<TitleComponent
				style={{
					color: theme.colors.black,
					backgroundColor: 'transparent',
					fontSize: '18px',
					position: 'absolute',
					left: '2%',
					top: '2%',
					fontFamily: 'Montserrat, sans-serif',
					fontWeight: 'bold',
					marginLeft: '0',
				}}
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
					Your session expired.
				</Typography>
				<LoginButton
					variant='contained'
					size='large'
					onClick={() => {
						document.body.style.backgroundColor = theme.colors.white
						navigate('/')
					}}
					style={{ width: '220px' }}
				>
					Go to login
				</LoginButton>
			</div>
		</>
	)
}

export default NotLogged
