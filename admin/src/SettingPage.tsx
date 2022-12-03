import React from 'react';
import { IpAddressInput, Logo, PasswordInput } from 'iobroker-react';
import { Box, Stack, TextField } from '@mui/material';

interface SettingPageProps {
	onChange: (key: keyof ioBroker.AdapterConfig, value: any) => void;
	settings: ioBroker.AdapterConfig;
}

export const SettingPage: React.FC<SettingPageProps> = ({ onChange, settings }): JSX.Element => {
	// const { translate: _ } = useI18n();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, attr: string) => {
		const val = typeof event === 'string' ? event : event.target.value;
		onChange(attr as keyof ioBroker.AdapterConfig, val);
	};

	return (
		<React.Fragment>
			<Stack spacing={2}>
				<Logo />
			</Stack>
			<Box
				component="form"
				sx={{
					mt: 4,
					'& > :not(style)': { m: 1, width: '25ch' },
				}}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="outlined-basic"
					label="Name"
					placeholder={'Wohnzimmer'}
					variant="outlined"
					required
					value={settings.devices[0].room}
					onChange={(value) => handleChange(value, 'name')}
				/>
				<IpAddressInput
					value={settings.devices[0].ip}
					onChange={(value) => handleChange(value, 'ip')}
					required={true}
					label={'Ip Address'}
				/>
				<PasswordInput
					value={settings.devices[0].token}
					onChange={(value) => handleChange(value, 'token')}
					label={'Token'}
					required={true}
				/>
			</Box>
		</React.Fragment>
	);
};
