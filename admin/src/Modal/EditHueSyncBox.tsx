import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useI18n } from 'iobroker-react/hooks';
import React, { useState } from 'react';
import { AlertComponent } from '../component/AlertComponent';
import { EditComponent } from '../component/EditComponent';
import { encrypt } from 'iobroker-react/lib/shared/tools';

export interface EditModalProps {
	alive: boolean;
	newRow: (value: ioBroker.Devices, index: number | null) => void;
	oldRow: ioBroker.Devices | undefined;
	index: number | null;
	open: boolean;
	onClose: () => void;
	secret: string;
}

export const EditHueSyncBox: React.FC<EditModalProps> = ({
	alive,
	newRow,
	index,
	oldRow,
	open,
	onClose,
	secret,
}): JSX.Element => {
	const [row, setRow] = useState<ioBroker.Devices>(
		oldRow || {
			name: '',
			ip: '',
			token: '',
		},
	);
	const { translate: t } = useI18n();
	const [validConfig, setValidConfig] = useState<boolean>(false);

	const handleSave = async (row: ioBroker.Devices): Promise<void> => {
		if (row) {
			const newConfig = {
				name: row.name,
				ip: row.ip,
				token: encrypt(secret, row.token),
			};
			newRow(newConfig, index);
		}
		onClose();
	};
	const handleClose = async (): Promise<void> => {
		onClose();
	};

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle
					sx={{
						textAlignLast: 'center',
						fontSize: '1.4rem',
					}}
				>
					{t('editBoxConfig')}
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
						<EditComponent
							newRow={(value) => setRow(value)}
							oldRow={oldRow}
							valid={(valid) => setValidConfig(valid)}
							secret={secret}
						/>
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
					<Button disabled={!validConfig} onClick={() => handleSave(row)}>
						{t('edit')}
					</Button>
					<Button onClick={handleClose}>{t('cancel')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
