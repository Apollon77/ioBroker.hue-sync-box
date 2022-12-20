/**
 * Created by alex-issi on 10.12.22
 */
import { Delete, Edit } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Tooltip } from '@mui/material';
import { red } from '@mui/material/colors';
import { useI18n, useIoBrokerTheme } from 'iobroker-react/hooks';
import React from 'react';
import { decrypt } from 'iobroker-react/lib/shared/tools';

export interface TabletCardProps {
	secret: string;
	item: ioBroker.Devices;
	index: number;
	editModal: (value: { open: boolean; index: number | null; oldRow?: ioBroker.Devices }) => void;
	deleteModal: (value: { open: boolean; device: ioBroker.Devices }) => void;
}

export const BoxCard: React.FC<TabletCardProps> = ({ secret, item, index, editModal, deleteModal }): JSX.Element => {
	const { translate: t } = useI18n();
	const [themeName] = useIoBrokerTheme();
	const handleBackgroundColor = () => {
		if (themeName === 'dark') {
			return {
				color: '#f0f0f0',
				cardAction: '#211f1f',
				gradientStart: '#5D5B5BFF',
				gradientEnd: '#2F2D2DFF',
			};
		} else if (themeName === 'blue') {
			return {
				color: '#f0f0f0',
				cardAction: '#1a2426',
				gradientStart: '#415157',
				gradientEnd: '#1e262a',
			};
		} else {
			return {
				color: '#303030',
				cardAction: '#5d5b5b',
				gradientStart: '#cbcbcb',
				gradientEnd: '#726b6b',
			};
		}
	};

	const maskeToken = (token: string) => {
		// mask token ond cut the display to 10 characters
		return token.substring(0, 5) + '*****';
	};

	return (
		<Card
			sx={{
				margin: '10px',
				padding: '10px',
				width: '351px',
				height: '360px',
				maxWidth: '351px',
				maxHeight: '360px',
				borderRadius: '20px',
				boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
				color: handleBackgroundColor().color,
				backgroundImage: `linear-gradient(to right, ${handleBackgroundColor().gradientStart}, ${
					handleBackgroundColor().gradientEnd
				})`,
			}}
		>
			<CardHeader
				sx={{
					margin: '5 5 0 5',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderRadius: '15px 15px 0px 0px',
					borderTop: '2.5px solid',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: 'black',
					paddingTop: '2px',
					paddingBottom: '0px',
					'	.MuiCardHeader-content': {
						display: 'flex',
						alignItems: 'center',
						flexWrap: 'wrap',
						justifyContent: 'center',
						fontSize: '1.3rem',
					},
				}}
				title={item.name}
			/>
			<CardMedia
				component="img"
				image="media/box.svg"
				alt="hue-sync-box.svg"
				sx={{
					margin: '0 5 0 5',
					width: 'auto',
					maxHeight: '160px',
					minHeight: '160px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: 'black',
					paddingTop: '2px',
					paddingBottom: '0px',
				}}
			/>
			<CardContent
				sx={{
					padding: '40px',
					height: '20px',
					maxHeight: '20px',
					margin: '0 5 0 5',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderColor: 'black',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexWrap: 'wrap',
					alignContent: 'center',
					fontSize: '1.2rem',
				}}
			>
				{`IP: ${item.ip}`}
				<br />
				{t('token', maskeToken(decrypt(secret, item.token)))}
			</CardContent>
			<CardActions
				disableSpacing
				sx={{
					display: 'flex',
					justifyContent: 'space-around',
					margin: '0 5 5 5',
					borderRadius: '0px 0px 15px 15px',
					borderTop: '1.5px solid',
					borderRight: '2.5px solid',
					borderLeft: '2.5px solid',
					borderBottom: '2.5px solid',
					borderColor: 'black',
					backgroundColor: handleBackgroundColor().cardAction,
				}}
			>
				<React.Fragment>
					<Tooltip title={t('editConfig')}>
						<IconButton
							onClick={() => {
								editModal({ open: true, index, oldRow: item });
							}}
							size="small"
							color="primary"
							aria-label={t('editConfig')}
						>
							<Edit />
						</IconButton>
					</Tooltip>
					<Tooltip title={t('delete')}>
						<IconButton
							sx={{
								color: red[500],
							}}
							onClick={() => deleteModal({ open: true, device: item })}
							aria-label={t('delete')}
						>
							<Delete />
						</IconButton>
					</Tooltip>
				</React.Fragment>
			</CardActions>
		</Card>
	);
};
