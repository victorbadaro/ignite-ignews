import Post, { getServerSideProps } from '@/pages/posts/[slug]';
import { getPrismicClient } from '@/services/prismic';
import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = { slug: 'my-new-post', title: 'My new post', content: '<p>Post excerpt</p>', updatedAt: '05 de maio de 2021' };

describe('Post page', () => {
	it('should render correctly', () => {
		render(<Post post={post} />);

		expect(screen.getByText('My new post')).toBeInTheDocument();
		expect(screen.getByText('Post excerpt')).toBeInTheDocument();
	});

	it('should redirect user if no subscription is found', async () => {
		const getSessionMocked = jest.mocked(getSession);

		getSessionMocked.mockResolvedValueOnce(null);

		const response = await getServerSideProps({
			params: {
				slug: 'my-new-post'
			}

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				redirect: expect.objectContaining({
					destination: '/posts/preview/my-new-post'
				})
			})
		);
	});

	it('should load initial data', async () => {
		const getSessionMocked = jest.mocked(getSession);
		const getPrismicClientMocked = jest.mocked(getPrismicClient);

		getSessionMocked.mockResolvedValueOnce({
			activeSubscription: 'fake-active-subscription'
		});

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

		const response = await getServerSideProps({
			params: {
				slug: 'my-new-post'
			}

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

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
