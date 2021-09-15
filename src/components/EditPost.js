import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EditPost = ({
  posts,
  handleEdit,
  editBody,
  setEditBody,
  editTitle,
  setEditTitle,
}) => {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);

  return post ? (
    <main className='NewPost'>
      <h2>Edit Post</h2>
      <form
        className='newPostForm'
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor='postTitle'>Title:</label>
        <input
          id='postTitle'
          type='text'
          required
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <label htmlFor='postBody'>Post:</label>
        <textarea
          id='postBody'
          required
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
        />
        <button
          type='submit'
          onClick={() => {
            if (editTitle && editBody) {
              handleEdit(post.id);
            }
          }}
        >
          Confirm Edit
        </button>
      </form>
    </main>
  ) : (
    <main className='Missing'>
      <h2>Post Not Found</h2>
      <p>Well, that's disappointing.</p>
      <p>
        <Link to='/'>Visit Our Homepage</Link>
      </p>
    </main>
  );
};

export default EditPost;
