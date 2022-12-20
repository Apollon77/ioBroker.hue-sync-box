/**
 * Created by issi on 10.12.21
 */
import { FormControl, Grid, TextField } from '@mui/material';
import { useI18n } from 'iobroker-react/hooks';
import React, { useEffect, useState } from 'react';
import { IpAddressInput, PasswordInput } from 'iobroker-react';
import { decrypt } from 'iobroker-react/lib/shared/tools';

export interface RowProps {
	secret: string;
	newRow: (value: ioBroker.Devices) => void;
	oldRow: ioBroker.Devices | undefined;
	valid: (valid: boolean) => void;
}

export const EditComponent: React.FC<RowProps> = ({ secret, newRow, oldRow, valid }): JSX.Element => {
	if (!oldRow) {
		oldRow = oldRow || {
			name: '',
			ip: '',
			token: '',
			id: 0,
		};
	}
	const { translate: t } = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [name, setName] = useState<string>(oldRow.name);
	const [ip, setIp] = useState<string>(oldRow.ip);
	const [token, setToken] = useState<string>(decrypt(secret, oldRow.token));
	const [newEditRow, setNewRow] = useState<ioBroker.Devices>(oldRow);
	const [validIp, setValidIp] = React.useState(true);
	const [validToken, setValidToken] = React.useState(true);

	React.useEffect(() => {
		valid(validIp && validToken);
	}, [validIp, validToken]);

	useEffect(() => {
		// check if a change was made to the newRow
		if (oldRow) {
			if (ip !== oldRow.ip || token !== oldRow.token) {
				newRow(newEditRow);
			}
		}
	}, [newEditRow]);

	const handleIpChange = (value: string, valid: boolean | undefined): void => {
		if (value !== '') {
			setIp(value);
			setNewRow({ ...newEditRow, ip: value });
			setValidIp(valid || true);
		} else {
			setIp('');
			setNewRow({ ...newEditRow, ip: '' });
			setValidIp(false);
		}
	};

	const handleTokenChange = (value: string): void => {
		if (value !== '') {
			setToken(value);
			setNewRow({ ...newEditRow, token: value });
			setValidToken(true);
		} else {
			setToken('');
			setNewRow({ ...newEditRow, token: '' });
			setValidToken(false);
		}
	};

	return (
		<React.Fragment>
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
					<TextField
						label={t('name')}
						placeholder={t('namePlaceholder')}
						variant="outlined"
						required
						color={'success'}
						disabled
						value={name}
					/>
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
		</React.Fragment>
	);
};
