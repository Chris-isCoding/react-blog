import { useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { useStoreState, useStoreActions } from 'easy-peasy';

const EditPost = () => {
  const history = useHistory();
  const { id } = useParams();

  const editTitle = useStoreState((state) => state.editTitle);
  const editBody = useStoreState((state) => state.editBody);
  const editPost = useStoreActions((actions) => actions.editPost);
  const setEditTitle = useStoreActions((actions) => actions.setEditTitle);
  const setEditBody = useStoreActions((actions) => actions.setEditBody);

  const getPostById = useStoreState((state) => state.getPostById);
  const post = getPostById(id);

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
    const editedPost = {
      id,
      title: editTitle,
      body: editBody,
      datetime: datetime,
    };
    editPost(editedPost);
    history.push(`/post/${id}`);
  };

  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);

  return post ? (
    <main className='NewPost'>
      <h2>Edit Post</h2>
      <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
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
