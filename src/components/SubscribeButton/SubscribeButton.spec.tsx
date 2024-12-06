import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn()
	};
});

describe('SubscribeButton component', () => {
	it('should render correctly', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce([null, false]);

		render(<SubscribeButton />);

		expect(screen.getByText('Subscribe now')).toBeInTheDocument();
	});

	it('should redirect user to sign in when not authenticated', async () => {
		const signInMocked = jest.mocked(signIn);
		const useSessionMocked = jest.mocked(useSession);
		const user = userEvent.setup();

		useSessionMocked.mockReturnValueOnce([null, false]);

		render(<SubscribeButton />);

		const subscribeButton = screen.getByText('Subscribe now');

		await user.click(subscribeButton);

		expect(signInMocked).toHaveBeenCalled();
	});

	it('should redirect to posts when user already has a subscription', async () => {
		const useRouterMocked = jest.mocked(useRouter);
		const useSessionMocked = jest.mocked(useSession);
		const pushMocked = jest.fn();
		const user = userEvent.setup();

		useRouterMocked.mockReturnValueOnce({
			push: pushMocked

			// biome-ignore lint/suspicious/noExplicitAny: only push function is being used here
		} as any);
		useSessionMocked.mockReturnValueOnce([
			{
				user: {
					name: 'John Doe',
					email: 'john.doe@example.com'
				},
				activeSubscription: 'fake-active-subscription',
				expires: 'fake-expires'
			},
			false
		]);

		render(<SubscribeButton />);

		const subscribeButton = screen.getByText('Subscribe now');

		await user.click(subscribeButton);

		expect(pushMocked).toHaveBeenCalledWith('/posts');
	});
});
