import PropTypes from 'prop-types'
import { Link } from '~/routes'
import PostUpvoter from '~/containers/PostUpvoter'
import {
  Main,
  ItemList,
  Index,
  Title,
  ShowMore,
  Item,
  Loading
} from './styles'

const PostList = ({
  data: { allPosts, loading, _allPostsMeta },
  loadMorePosts
}) => {
  if (loading) {
    return <Loading>Loading</Loading>
  } else if (allPosts.length === 0) {
    return <p>no posts yet</p>
  } else {
    const areMorePosts = allPosts.length < _allPostsMeta.count
    return (
      <Main>
        <ItemList>
          {allPosts.map((post, index) =>
            <Item key={post.id}>
              <div>
                <Index>
                  {index + 1}.{' '}
                </Index>
                <Link
                  route="details"
                  params={{
                    postId: post.id,
                    postTitle: encodeURIComponent(post.title)
                  }}
                  passHref
                >
                  <Title>
                    {post.title}
                  </Title>
                </Link>
                <PostUpvoter id={post.id} votes={post.votes} />
              </div>
            </Item>
          )}
        </ItemList>
        {areMorePosts
          ? <ShowMore onClick={() => loadMorePosts()}>
              {loading ? 'Loading...' : 'Show More'}
            </ShowMore>
          : ''}
      </Main>
    )
  }
}

PostList.propTypes = {
  data: PropTypes.object.isRequired,
  loadMorePosts: PropTypes.func.isRequired
}

export default PostList
