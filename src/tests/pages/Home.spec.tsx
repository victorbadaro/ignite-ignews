import Home, { getStaticProps } from '@/pages';
import { stripe } from '@/services/stripe';
import { render, screen } from '@testing-library/react';

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn()
	};
});

jest.mock('next-auth/client', () => {
	return {
		useSession() {
			return [null, false];
		}
	};
});

jest.mock('../../services/stripe', () => {
	return {
		stripe: {
			prices: {
				retrieve: jest.fn()
			}
		}
	};
});

describe('Home page', () => {
	it('should render correctly', () => {
		render(<Home product={{ priceID: 'fake-price-id', amount: '$10.00' }} />);

		expect(screen.getByText('for $10.00 month')).toBeInTheDocument();
	});

	it('should load initial data', async () => {
		const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

		retrieveStripePricesMocked.mockResolvedValueOnce({
			id: 'fake-price-id',
			unit_amount: 1000

			// biome-ignore lint/suspicious/noExplicitAny: just id and unit_amount properties are necessary here
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					product: {
						priceID: 'fake-price-id',
						amount: '$10.00'
					}
				}
			})
		);
	});
});
