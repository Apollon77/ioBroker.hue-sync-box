import React from 'react';
import { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number; time: number }) {
	return (
		// <Box sx={{ position: 'relative', display: 'inline-flex' }}>
		<Box
			sx={{
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				// position: 'absolute',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Typography variant="caption" component="div" color="text.secondary">{`${props.time} sec`}</Typography>
		</Box>
		// </Box>
	);
}
interface RegistrationsTimerProps {
	progress: (percent: number) => void;
	cancel: boolean;
}
let timer: any;
export const RegistrationsTimer: React.FC<RegistrationsTimerProps> = (props): JSX.Element => {
	const [progress, setProgress] = React.useState(0);
	const [time, setTime] = React.useState(5);

	React.useEffect(() => {
		timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 20));
			setTime((prevTime) => (prevTime <= 0 ? 5 : prevTime - 1));
		}, 1000);
		return () => {
			if (timer) clearInterval(timer);
		};
	}, []);

	React.useEffect(() => {
		if (progress === 100) {
			if (timer) clearInterval(timer);
			props.progress(progress);
		}
	}, [progress]);

	React.useEffect(() => {
		if (props.cancel) {
			if (timer) clearInterval(timer);
			setProgress(0);
			setTime(5);
		}
	}, [props.cancel]);

	return (
		<React.Fragment>
			<Box sx={{ width: '100%', height: '30px' }}>
				<LinearProgress variant="determinate" value={progress} />
				<CircularProgressWithLabel value={progress} time={time} />
			</Box>
		</React.Fragment>
	);
};
