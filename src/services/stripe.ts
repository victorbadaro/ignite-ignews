import Stripe from 'stripe';
import packageFile from '../../package.json';

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
	apiVersion: '2024-11-20.acacia',
	appInfo: {
		name: 'Ignews',
		version: packageFile.version
	}
});
