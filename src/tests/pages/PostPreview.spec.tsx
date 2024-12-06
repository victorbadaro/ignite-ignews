import PostPreview, { getStaticProps } from '@/pages/posts/preview/[slug]';
import { getPrismicClient } from '@/services/prismic';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

jest.mock('next-auth/client');
jest.mock('next/router', () => {
	return {
		useRouter: jest.fn()
	};
});
jest.mock('../../services/prismic');

const post = {
	slug: 'my-new-post',
	title: 'My new post',
	content: '<p>Post excerpt</p>',
	updatedAt: '05 de maio de 2021'
};

describe('PostPreview page', () => {
	it('should render correctly', () => {
		const useSessionMocked = jest.mocked(useSession);
		const useRouterMocked = jest.mocked(useRouter);

		useSessionMocked.mockReturnValueOnce([null, false]);
		useRouterMocked.mockReturnValueOnce({
			push: jest.fn()

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

		render(<PostPreview post={post} />);

		expect(screen.getByText('My new post')).toBeInTheDocument();
		expect(screen.getByText('Post excerpt')).toBeInTheDocument();
		expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
	});

	it('should redirect user to full post when user is subscribed', async () => {
		const useSessionMocked = jest.mocked(useSession);
		const useRouterMocked = jest.mocked(useRouter);
		const pushMocked = jest.fn();

		useSessionMocked.mockReturnValueOnce([
			{
				activeSubscription: 'fake-active-subscription'
			},
			false
		]);

		useRouterMocked.mockReturnValueOnce({
			push: pushMocked

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

		render(<PostPreview post={post} />);

		expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post');
	});

	it('should load initial data', async () => {
		const getPrismicClientMocked = jest.mocked(getPrismicClient);

		getPrismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce({
				data: {
					title: [{ type: 'heading', text: 'My new post' }],
					content: [{ type: 'paragraph', text: 'Post content' }]
				},
				last_publication_date: '2021-05-06'
			})

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

		const response = await getStaticProps({
			params: {
				slug: 'my-new-post'
			}
		});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post: {
						slug: 'my-new-post',
						title: 'My new post',
						content: '<p>Post content</p>',
						updatedAt: '05 de maio de 2021'
					}
				}
			})
		);
	});
});
