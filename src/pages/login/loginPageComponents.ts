import styled from 'styled-components';
import { Button, FormControlLabel, TextField, Typography } from '@mui/material';

// Use your theme instead of MUI's theme
export const TitleComponent = styled(Typography)<({ theme })>`
  position: absolute;
  color: ${(props) => props.theme.text};
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  font-weight: bold;
  left: 2%;
  top: 2%;
  background-color: ${(props) => props.theme.background};
`;

export const LoginPageWrapper = styled('div')<({ theme })>`
  position: relative;
  width: 100%;
  
  height: 100%;
  background-color: ${(props) => props.theme.background};
  text-align: center;
  
  padding-top: 10rem;
`;

export const LoginWrapper = styled('div')<({ theme })>`
background-color: ${(props) => props.theme.background};
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;

export const RememberMeComponent = styled(FormControlLabel)`
  font-size: 12px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  margin: auto;
  color: ${( props ) => props.theme.text};
  text-align: center;
  float: left;
`;

export const LoginComponent = styled(TextField)`
  font-family: 'Arial', sans-serif;
  margin: auto;
  color: ${( props ) => props.theme.text};
  background-color: ${(props) => props.theme.background};
  font-size: 18px;
  display: flex;
  border-bottom: 1px solid ${( props ) => props.theme.border};
`;

export const ForgotEmailComponent = styled(TextField)`
  font-family: 'Arial', sans-serif;
  margin: auto;
  color: ${( props ) => props.theme.text};
  background-color: transparent;
  font-size: 18px;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const LoginButton = styled(Button)`
  font-family: 'Arial', sans-serif;
  margin-top: 2rem;
  margin-left: 65px;
  margin-right: 65px;
  width: 50%;
  background: ${(props) => props.theme.buttonBackground};
  border-radius: 25px;
  color: ${( props ) => props.theme.text};
`;

export const ForgotPasswordComponent = styled(Typography)`
  font-size: 12px;
  font-family: 'Arial', sans-serif;
  margin: auto;
  padding-top: 0.8rem;
  font-weight: bold;
  height: 42px;
  color: ${( props ) => props.theme.text};
  text-align: center;
  float: right;
  cursor: pointer;
`;

export const ForgotPasswordButton = styled(Button)`
  font-family: 'Arial', sans-serif;
  margin-top: 2rem;
  float: left;
  width: 30%;
  margin-left: 100px;
  background: ${(props) => props.theme.buttonBackground};
  border-radius: 25px;
  color: ${( props ) => props.theme.text};
`;

export const ForgotPasswordCancel = styled(Button)`
  font-family: 'Arial', sans-serif;
  margin-top: 2rem;
  float: right;
  width: 30%;
  margin-right: 100px;
  background: transparent;
  border-radius: 25px;
  color: ${( props ) => props.theme.text};
`;