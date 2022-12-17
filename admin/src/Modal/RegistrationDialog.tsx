import React from 'react';
import { useI18n } from 'iobroker-react/hooks';
import {
	Alert,
	AlertTitle,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from '@mui/material';
import { Registration } from '../component/Registration';
import { RegistrationsTimer } from '../component/RegistrationsTimer';
import { orange } from '@mui/material/colors';

interface RegistrationDialogProps {
	config: { name: string; ip: string; token: string };
	token: (token: string) => void;
	disabled: boolean;
}

export const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ config, token, disabled }): JSX.Element => {
	const { translate: t } = useI18n();
	const [registration, setRegistration] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [cancel, setCancel] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [dataError, setDataError] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
		setRegistration(false);
	};
	const handleRegistration = (data: {
		registrationId: any;
		accessToken: string;
		code: string | number;
		message: any;
		codeString: any;
	}) => {
		if (data) {
			console.log(data);
			if (data.code === 500) {
				setSuccess(false);
				setRegistration(false);
				setError(true);
			}
			if (data.accessToken) {
				setCancel(true);
				setSuccess(true);
				setRegistration(false);
				setError(false);
				token(data.accessToken);
			}
			if (data.code === 404) {
				setRegistration(false);
				setSuccess(false);
				setError(false);
				setCancel(false);
				setDataError(true);
				console.error(data.message);
				console.error(data.codeString);
			}
			if (data.code === 'ETIMEDOUT') {
				setRegistration(false);
				setSuccess(false);
				setError(false);
				setCancel(false);
				setDataError(true);
				console.error(data.message);
			}
		} else {
			console.log('data ', data);
			setDataError(true);
			setSuccess(false);
			setError(false);
			setCancel(false);
		}
	};
	const handleTimer = (data: boolean) => {
		if (data) {
			setRegistration(true);
			setError(false);
			setCancel(false);
			setSuccess(false);
			setDataError(false);
		}
	};

	return (
		<React.Fragment>
			<Button disabled={disabled} variant="outlined" onClick={handleOpen}>
				{t('open_registration')}
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				sx={{
					'& .MuiDialog-paper': {
						maxWidth: '540px',
					},
				}}
			>
				<DialogTitle>{t('registration_titel', config.name)}</DialogTitle>
				<DialogContent>
					<Stack sx={{ width: '100%' }} spacing={2}>
						<Registration
							config={config}
							results={(data) => handleRegistration(data)}
							timer={(data) => handleTimer(data)}
							buttonName={t('registration_button')}
						/>
						<Typography variant="body2" color="text.secondary" component="p">
							{t('registration_description1')}
						</Typography>
						<Typography variant="body2" color="text.secondary" component="p">
							{t('registration_description2')}
						</Typography>
						<Typography variant="body2" color="text.secondary" component="p">
							{t('registration_description3')}
						</Typography>
						<Typography variant="body2" color={orange[500]} component="p">
							{t('registration_description4')}
						</Typography>
						{registration && (
							<React.Fragment>
								<RegistrationsTimer
									cancel={cancel}
									// progress={(percent) => handleProgress(percent)}
								/>
							</React.Fragment>
						)}
						{error && (
							<Alert variant="filled" severity="error">
								<AlertTitle>{t('error')}</AlertTitle>
								<Typography variant="body2" color="text.secondary" component="p">
									{t('registration_error_1', config.name)}
									<br />
									{t('registration_error_2', config.name)}
								</Typography>
							</Alert>
						)}
						{dataError && (
							<Alert variant="filled" severity="error">
								<AlertTitle>{t('error')}</AlertTitle>
								<Typography variant="body2" color="text.secondary" component="p">
									{t('registration_dataError', config.name)}
								</Typography>
							</Alert>
						)}
						{success && (
							<Alert variant="filled" severity="success">
								<AlertTitle>{t('success')}</AlertTitle>
								<Typography variant="body2" color="text.secondary" component="p">
									{t('registration_success', config.name)}
									<br />
									{t('registration_success_token', config.token)}
								</Typography>
							</Alert>
						)}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>{t('close')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
