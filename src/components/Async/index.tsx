import { useEffect, useState } from 'react';

export function Async() {
	const [isButtonVisible, setIsButtonVisible] = useState(false);
	const [isButtonInvisible, setIsButtonInvisible] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsButtonVisible(true);
			setIsButtonInvisible(true);
		}, 1000);
	}, []);

	return (
		<div>
			<div>Hello, World</div>
			{isButtonVisible ? <button type="button">Visible Button</button> : null}
			{!isButtonInvisible ? <button type="button">Invisible Button</button> : null}
		</div>
	);
}
