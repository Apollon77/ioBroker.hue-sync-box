/**
 * Created by alex-issi on 08.05.22
 */
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Typography,
} from '@mui/material';
import { useConnection, useGlobals, useI18n } from 'iobroker-react/hooks';
import React from 'react';
import { AlertComponent } from '../component/AlertComponent';

export interface DeleteConfirmModalProps {
	alive: boolean;
	show: boolean;
	device: ioBroker.Devices;
	onDelete: (id: string) => void;
	onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	alive,
	show,
	device,
	onDelete,
	onClose,
}): JSX.Element => {
	const { translate: t } = useI18n();
	const connection = useConnection();
	const { namespace } = useGlobals();

	const [deleteOption, setDeleteOption] = React.useState<{
		device: ioBroker.Devices;
		deleteObjects: boolean;
		logOut: boolean;
		functions: 'deleteObjects' | 'logOut' | 'deleteObjectsAndLogOut' | '';
	}>({
		device: { name: '', ip: '', token: '', id: 0 },
		deleteObjects: false,
		logOut: false,
		functions: '',
	});

	const handleClose = () => {
		onClose();
	};
	const deleteFunktion = React.useCallback(
		async (options) => {
			const result = await connection.sendTo(namespace, options.functions, options.device);
			return result;
		},
		[connection, namespace],
	);

	const handleDelete = async () => {
		if (deleteOption.deleteObjects && !deleteOption.logOut) {
			// delete objects
			deleteOption.functions = 'deleteObjects';
			const result = await deleteFunktion(deleteOption);
			if (result.delete) {
				onDelete(device.name);
				return;
			}
		}
		if (deleteOption.logOut && !deleteOption.deleteObjects) {
			// log out
			deleteOption.functions = 'logOut';
			const result = await deleteFunktion(deleteOption);
			if (result.logOut) {
				onDelete(device.name);
				return;
			}
		}
		if (deleteOption.deleteObjects && deleteOption.logOut) {
			// delete user and objects
			deleteOption.functions = 'deleteObjectsAndLogOut';
			const result = await deleteFunktion(deleteOption);
			if (result.delete && result.logOut) {
				onDelete(device.name);
				return;
			}
		} else {
			onDelete(device.name);
		}
	};

	const handleDeleteOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeleteOption({
			...deleteOption,
			[event.target.name]: event.target.checked,
			device: {
				name: device.name,
				ip: device.ip,
				token: device.token,
				id: device.id,
			},
		});
	};

	return (
		<React.Fragment>
			<Dialog
				open={show}
				onClose={handleClose}
				aria-labelledby="delete-confirm-dialog-titel"
				aria-describedby="delete-confirm-dialog-description"
				sx={{ '& .MuiDialog-paper': { minWidth: '500px' } }}
			>
				<DialogTitle
					id="delete-confirm-dialog-title"
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-around',
					}}
				>
					<Typography
						sx={{
							fontSize: '1.25rem',
						}}
					>
						{'Hue Sync Box'}
					</Typography>
					<Typography sx={{ color: '#ff9800', fontSize: '1.5rem' }}>{`${device.name} `}</Typography>
					<Typography
						sx={{
							fontSize: '1.25rem',
						}}
					>
						{t('delete')}
					</Typography>
				</DialogTitle>
				{alive ? (
					<DialogContent dividers id="delete-confirm-dialog-description">
						<React.Fragment>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									flexDirection: 'column',
								}}
							>
								<FormControlLabel
									control={<Checkbox name={'logOut'} onChange={handleDeleteOptionChange} />}
									sx={{ mr: 0, flexDirection: 'column-reverse' }}
									label={
										<React.Fragment>
											<Typography sx={{ fontWeight: 'bold' }}>
												Wollen Sie den Adapter von der Hue Sync App abmelden?
											</Typography>
											<Typography
												sx={{
													fontSize: '1.1rem',
													color: '#ff9800',
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												Achtung!
											</Typography>
											<Typography
												sx={{
													color: '#ff0000',
													fontWeight: 'bold',
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												Der Token wird dadurch ungültig!
											</Typography>
										</React.Fragment>
									}
								/>
								<FormControlLabel
									control={<Checkbox name={'deleteObjects'} onChange={handleDeleteOptionChange} />}
									sx={{ mr: 0, flexDirection: 'column-reverse' }}
									label={
										<React.Fragment>
											<Typography sx={{ fontWeight: 'bold' }}>
												Wollen Sie die Objekte und Zustände des Adapters löschen?
											</Typography>
										</React.Fragment>
									}
								/>
							</Box>
						</React.Fragment>
					</DialogContent>
				) : show ? (
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
					<Button disabled={!alive} onClick={handleDelete} autoFocus>
						{t('delete')}
					</Button>
					<Button onClick={handleClose}>{t('cancel')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
