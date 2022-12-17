import React from 'react';
import { useConnection, useGlobals } from 'iobroker-react/hooks';
import { Button } from '@mui/material';

interface RegistrationProps {
	config: { name: string; ip: string; token: string };
	results: (data: any) => void;
	buttonName: string;
	timer: (data: boolean) => void;
}
export const Registration: React.FC<RegistrationProps> = ({ config, results, buttonName, timer }) => {
	const connection = useConnection();
	const { namespace } = useGlobals();

	// This will be called when the button is clicked and sends a command to the adapter
	const registration = React.useCallback(async () => {
		timer(true);
		const result = await connection.sendTo(namespace, 'registrations', { ip: config.ip, name: config.name });
		if (!result) console.error('No result received');
		results(result);
	}, [connection, namespace]);

	return (
		<React.Fragment>
			<Button onClick={registration}>{buttonName}</Button>
		</React.Fragment>
	);
};
