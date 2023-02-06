import React, { useState } from 'react';
import { SettingsHeader, useAdapter } from 'iobroker-react';
import { Grid, Stack } from '@mui/material';
import { AddHueSyncBox } from './Modal/AddHueSyncBox';
import { BoxCard } from './component/BoxCard';
import { DeleteConfirmModal } from './Modal/DeleteConfirmModal';
import { EditHueSyncBox } from './Modal/EditHueSyncBox';

interface SettingPageProps {
	onChange: (key: keyof ioBroker.AdapterConfig, value: any) => void;
	settings: ioBroker.AdapterConfig;
	secret: string;
}
let newRow: any = [];
export const SettingPage: React.FC<SettingPageProps> = ({ onChange, settings, secret }): JSX.Element => {
	const { alive } = useAdapter();

	const [showConfirmDialog, setShowConfirmDialog] = useState<{
		open: boolean;
		device: ioBroker.Devices;
	}>({
		open: false,
		device: {
			name: '',
			ip: '',
			token: '',
			id: 0,
		},
	});
	const [editModal, setEditModal] = useState<{
		open: boolean;
		index: number | null;
		oldRow?: ioBroker.Devices;
	}>({
		open: false,
		index: null,
		oldRow: undefined,
	});

	const handleAdd = (value: ioBroker.Devices): void => {
		if (newRow.length === 0) {
			newRow = [...settings.devices];
		}
		newRow.push(value);
		onChange('devices', newRow);
	};
	const handleEdit = (value: ioBroker.Devices, index: number | null): void => {
		if (settings.devices.length === 0) {
			settings.devices = [];
		}
		const newRows = [...settings.devices];
		if (index !== null) {
			newRows[index] = value;
		}
		onChange('devices', newRows);
	};
	const handleDeleteRow = (name: string): void => {
		const newRows = settings.devices.filter((row) => row.name !== name);
		newRow = [];
		setShowConfirmDialog({ open: false, device: { name: '', ip: '', token: '', id: 0 } });
		onChange('devices', newRows);
	};

	return (
		<React.Fragment>
			<Stack spacing={2}>
				<SettingsHeader
					classes={{
						logo: 'logo',
					}}
				/>
			</Stack>
			<Grid container spacing={0} sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
				<React.Fragment>
					<AddHueSyncBox
						alive={alive}
						settings={settings}
						newRow={(value) => handleAdd(value)}
						secret={secret}
					/>
					<EditHueSyncBox
						alive={alive}
						newRow={(editRows, index) => handleEdit(editRows, index)}
						oldRow={editModal.oldRow}
						open={editModal.open}
						onClose={() => setEditModal({ index: null, open: false })}
						index={editModal.index}
						secret={secret}
					/>
					<DeleteConfirmModal
						alive={alive}
						show={showConfirmDialog.open}
						device={showConfirmDialog.device}
						onClose={() =>
							setShowConfirmDialog({ open: false, device: { name: '', ip: '', token: '', id: 0 } })
						}
						onDelete={(name) => handleDeleteRow(name)}
					/>
					{settings.devices.map((item, index) => {
						return (
							<BoxCard
								key={`${item.name}${index}`}
								secret={secret}
								item={item}
								index={index}
								editModal={(value) => setEditModal(value)}
								deleteModal={(value) => setShowConfirmDialog(value)}
							/>
						);
					})}
				</React.Fragment>
			</Grid>
		</React.Fragment>
	);
};
