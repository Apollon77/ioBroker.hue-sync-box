import React from 'react';
import { useConnection, useGlobals } from 'iobroker-react/hooks';
import { Button } from '@mui/material';

interface RegistrationProps {
	ip;
	results: (data: any) => void;
	buttonName: string;
}
export const Registration: React.FC<RegistrationProps> = ({ ip, results, buttonName }) => {
	const connection = useConnection();
	const { namespace } = useGlobals();

	// This will be called when the button is clicked and sends a command to the adapter
	const registration = React.useCallback(async () => {
		const result = await connection.sendTo(namespace, 'registrations', { ip });
		if (!result) console.error('No result received');
		results(result);
	}, [connection, namespace]);

	return (
		<React.Fragment>
			<Button onClick={registration}>{buttonName}</Button>
		</React.Fragment>
	);
};
