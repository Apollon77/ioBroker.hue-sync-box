import React, { useState } from 'react';
import { useI18n } from 'iobroker-react/hooks';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { AlertComponent } from '../component/AlertComponent';
import { IpAddressInput, PasswordInput } from 'iobroker-react';
import { RegistrationDialog } from './RegistrationDialog';
import { encrypt } from 'iobroker-react/lib/shared/tools';
import { orange } from '@mui/material/colors';

interface AddHueSyncBoxProps {
	alive: boolean;
	settings: ioBroker.AdapterConfig;
	newRow: (value: ioBroker.Devices) => void;
	secret: string;
}

export const AddHueSyncBox: React.FC<AddHueSyncBoxProps> = ({ alive, settings, newRow, secret }): JSX.Element => {
	const { translate: t } = useI18n();
	const [name, setName] = useState<string>('');
	const [ip, setIp] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<ioBroker.Devices>({
		name: '',
		ip: '',
		token: '',
	});
	const [alert, setAlert] = useState({
		message: '',
		open: false,
	});
	const [registrationDisabled, setRegistrationDisabled] = React.useState(true);
	const [validIp, setValidIp] = React.useState(false);
	const [validToken, setValidToken] = React.useState(false);
	const [validName, setValidName] = React.useState(false);

	const handleClickAdd = async (currentRows: ioBroker.Devices[]): Promise<void> => {
		setAlert({ message: '', open: false });
		if (currentRows) {
			const foundName = currentRows.find(
				(rows: ioBroker.Devices) => rows.name.toLowerCase() === row.name.toLowerCase(),
			);

			if (foundName) {
				setAlert({ message: t('nameInUse', row.name), open: true });
				return;
			} else {
				const encryptedRow = {
					name: row.name,
					ip: row.ip,
					token: encrypt(secret, row.token),
				};

				newRow(encryptedRow);
				setOpen(false);
				setAlert({ message: '', open: false });
			}
		} else {
			console.warn('no config available');
		}
	};

	const handleClickOpen = (): void => {
		setOpen(true);
		setName('');
		setIp('');
		setToken('');
		setRow({
			name: '',
			ip: '',
			token: '',
		});
		setAlert({ message: '', open: false });
		setValidIp(false);
		setValidToken(false);
		setValidName(false);
	};
	const handleClose = async (): Promise<void> => {
		setOpen(false);
		setName('');
		setIp('');
		setToken('');
		setRow({
			name: '',
			ip: '',
			token: '',
		});
		setAlert({ message: '', open: false });
		setValidIp(false);
		setValidToken(false);
		setValidName(false);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const newName: string = event.target.value;
		if (newName !== '') {
			setName(newName);
			setRow({ ...row, name: newName });
			setValidName(true);
		} else {
			setName('');
			setRow({ ...row, name: '' });
			setValidName(false);
		}
	};

	const handleIpChange = (value: string, valid: boolean | undefined): void => {
		if (value !== '') {
			setIp(value);
			setRow({ ...row, ip: value });
		} else {
			setIp('');
			setRow({ ...row, ip: '' });
		}
		if (valid) {
			setValidIp(valid);
		} else {
			setValidIp(false);
		}
	};

	const handleTokenChange = (value: string): void => {
		if (value !== '') {
			setToken(value);
			setRow({ ...row, token: value });
			setValidToken(true);
		} else {
			setToken('');
			setRow({ ...row, token: '' });
			setValidToken(false);
		}
	};

	React.useEffect(() => {
		// check if all fields are filled
		if (name !== '' && ip !== '' && validIp) {
			setRegistrationDisabled(false);
		} else {
			setRegistrationDisabled(true);
		}
	}, [name, ip]);

	return (
		<React.Fragment>
			{
				<Grid
					container
					spacing={1}
					sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-around' }}
				>
					<Button variant="contained" size="large" color={'primary'} onClick={handleClickOpen}>
						{t('addBox')}
					</Button>
				</Grid>
			}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle
					sx={{
						textAlignLast: 'center',
						fontSize: '1.4rem',
					}}
				>
					{t('addNewBox')}
				</DialogTitle>
				{alive ? (
					<DialogContent
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<Grid
							container
							spacing={3}
							sx={{
								marginTop: '0',
								paddingBottom: '15px',
								alignItems: 'center',
								justifyContent: 'space-around',
								display: 'flex',
								flexWrap: 'wrap',
								flexDirection: 'row',
								marginLeft: '0px',
							}}
						>
							<FormControl
								variant="outlined"
								sx={{
									m: 1,
								}}
							>
								<Tooltip title={t('nameTooltip')} arrow placement={'top'}>
									<TextField
										label={t('name')}
										placeholder={t('namePlaceholder')}
										variant="outlined"
										required
										value={name}
										error={!validName}
										color={'success'}
										onChange={(value) => handleNameChange(value)}
									/>
								</Tooltip>
							</FormControl>
							<FormControl
								variant="outlined"
								sx={{
									m: 1,
								}}
							>
								<IpAddressInput
									value={ip}
									onChange={(value, valid) => handleIpChange(value, valid)}
									required={true}
									label={t('ipAddress')}
									placeholder={'192.168.179.20'}
									error={true}
									color={'success'}
									tooltip={{
										title: t('ipAddressTooltip'),
										placement: 'top',
									}}
								/>
							</FormControl>
							<FormControl
								variant="outlined"
								sx={{
									m: 1,
								}}
							>
								<PasswordInput
									value={token}
									onChange={(value) => handleTokenChange(value)}
									label={t('tokenInput')}
									required={true}
									error={!validToken}
									colors={{
										color: 'success',
									}}
									tooltip={{
										title: t('tokenTooltip'),
										placement: 'right',
									}}
								/>
							</FormControl>
						</Grid>
						<Grid
							container
							spacing={3}
							sx={{
								marginTop: '0',
								paddingBottom: '15px',
								alignItems: 'center',
								justifyContent: 'space-around',
								display: 'flex',
								flexWrap: 'wrap',
								flexDirection: 'column',
								marginLeft: '0px',
							}}
						>
							{registrationDisabled ? (
								<Typography
									variant={'body2'}
									align={'center'}
									sx={{ marginBottom: '10px', color: orange[500] }}
								>
									{t('registration_Notice')}
								</Typography>
							) : null}
							<RegistrationDialog
								settings={{ name: name, ip: ip, token: token }}
								token={(value) => handleTokenChange(value)}
								disabled={registrationDisabled}
							/>
						</Grid>
						{alert.open && open ? (
							<AlertComponent
								collapse={{
									active: false,
									open: false,
								}}
								text={alert.message}
								alertType={'error'}
								alertTitle={'error'}
							/>
						) : null}
					</DialogContent>
				) : open ? (
					<DialogContent
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<AlertComponent
							collapse={{
								active: false,
								open: false,
							}}
							text={t('adapterOffline')}
							alertType={'warning'}
							alertTitle={'warning'}
						/>
					</DialogContent>
				) : null}
				<DialogActions>
					<Button
						disabled={!(validIp && validName && validToken)}
						onClick={() => handleClickAdd(settings.devices)}
					>
						{t('add')}
					</Button>
					<Button onClick={handleClose}>{t('cancel')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
