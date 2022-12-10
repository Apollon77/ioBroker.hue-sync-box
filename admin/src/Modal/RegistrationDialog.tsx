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
	settings: { name: string; ip: string; token: string };
	token: (token: string) => void;
	disabled: boolean;
}

export const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ settings, token, disabled }): JSX.Element => {
	const { translate: t } = useI18n();
	const [registration, setRegistration] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [cancel, setCancel] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleRegistration = (data) => {
		if (data) {
			if (data.registrationId) {
				setCancel(true);
				setSuccess(true);
				setRegistration(false);
				setError(false);
				token(data.accessToken);
			}

			if (data.code === 16) {
				setRegistration(true);
				setSuccess(false);
				setError(false);
				setCancel(false);
			}
		} else {
		}
	};

	const handleProgress = (percent) => {
		if (percent === 100) {
			setSuccess(false);
			setRegistration(false);
			setError(true);
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
				<DialogTitle>{t('registration_titel', settings.name)}</DialogTitle>
				<DialogContent>
					<Stack sx={{ width: '100%' }} spacing={2}>
						<Registration
							ip={settings.ip}
							results={(data) => handleRegistration(data)}
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
								<RegistrationsTimer cancel={cancel} progress={(percent) => handleProgress(percent)} />
								<Registration
									ip={settings.ip}
									results={(data) => handleRegistration(data)}
									buttonName={t('next')}
								/>
							</React.Fragment>
						)}
						{error && (
							<Alert variant="filled" severity="error">
								<AlertTitle>{t('error')}</AlertTitle>
								<Typography variant="body2" color="text.secondary" component="p">
									{t('registration_error_1', settings.name)}
									<br />
									{t('registration_error_2', settings.name)}
								</Typography>
							</Alert>
						)}
						{success && (
							<Alert variant="filled" severity="success">
								<AlertTitle>{t('success')}</AlertTitle>
								<Typography variant="body2" color="text.secondary" component="p">
									{t('registration_success', settings.name)}
									<br />
									{t('registration_success_token', settings.token)}
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
