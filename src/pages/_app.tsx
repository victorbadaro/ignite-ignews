import { Provider as NextAuthProvider } from 'next-auth/client';
import type { AppProps } from 'next/app';
import { Header } from '../components/Header';

import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<NextAuthProvider session={pageProps.session}>
			<Header />
			<Component {...pageProps} />
		</NextAuthProvider>
	);
}
