import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

interface ActiveLinkProps extends LinkProps {
	children: ReactNode;
	activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
	const { asPath } = useRouter();
	const className = asPath === rest.href ? activeClassName : '';

	// return <Link {...rest}>{cloneElement(children, { className })}</Link>;
	return (
		<Link {...rest} className={className}>
			{children}
		</Link>
	);
}
