import moment from 'moment';
import PropTypes from 'prop-types';
import { Section } from './styles';

const PostInfo = ({ loading, Post, error }) => {
  if (loading) {
    return (
      <Section>
        <h1>Loading...</h1>
      </Section>
    );
  }

  if (error) {
    console.log(error); // eslint-disable-line no-console
    window.alert('Load error, check console'); // eslint-disable-line no-alert
    return;
  }

  return (
    <Section>
      <h1>
        {Post.title}
      </h1>
      <div>
        <span>
          ID: <b>{Post.id}</b>
        </span>
        <span>&nbsp;|&nbsp;</span>
        <span>
          Created At: {' '}
          <b>{moment(Post.createdAt).format('DD.MM.YYYY kk:mm')}</b>
        </span>
      </div>
      <p>
        <a target="_blank" href={Post.url} rel="noopener noreferrer nofollow">
          {Post.url}
        </a>
      </p>
    </Section>
  );
};

PostInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  Post: PropTypes.object,
  error: PropTypes.object,
  postId: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired
};

PostInfo.defaultProps = {
  Post: null,
  error: null
};

export default PostInfo;