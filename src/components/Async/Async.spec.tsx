import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';

describe('Async component', () => {
	it('should render correctly with the visible button', async () => {
		render(<Async />);

		expect(screen.getByText('Hello, World')).toBeInTheDocument();
		// expect(await screen.findByText('Visible Button')).toBeInTheDocument();

		await waitFor(() => {
			return expect(screen.getByText('Visible Button')).toBeInTheDocument();
		});
	});

	it('should render correctly with the invisible button', async () => {
		render(<Async />);

		expect(screen.getByText('Hello, World')).toBeInTheDocument();

		// await waitFor(() => {
		// 	return expect(screen.queryByText('Invisible Button')).not.toBeInTheDocument();
		// });

		await waitForElementToBeRemoved(screen.queryByText('Invisible Button'));
	});
});
