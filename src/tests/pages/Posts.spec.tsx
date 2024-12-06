import Posts, { getStaticProps } from '@/pages/posts';
import { getPrismicClient } from '@/services/prismic';
import { render, screen } from '@testing-library/react';

jest.mock('../../services/prismic');

const posts = [{ slug: 'my-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '05 de maio de 2021' }];

describe('Posts page', () => {
	it('should render correctly', () => {
		render(<Posts posts={posts} />);

		expect(screen.getByText('My new post')).toBeInTheDocument();
	});

	it('should load initial data', async () => {
		const getPrismicClientMocked = jest.mocked(getPrismicClient);

		getPrismicClientMocked.mockReturnValueOnce({
			query: jest.fn().mockResolvedValueOnce({
				results: [
					{
						uid: 'my-new-post',
						data: {
							title: [{ type: 'heading', text: 'My new post' }],
							content: [{ type: 'paragraph', text: 'Post excerpt' }]
						},
						last_publication_date: '2021-05-06'
					}
				]
			})

			// biome-ignore lint/suspicious/noExplicitAny: just the properties above are necessary for this test case
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					posts
				}
			})
		);
	});
});
