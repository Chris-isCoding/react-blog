import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import api from '../api/posts';
import { DataContext } from '../context/DataContext';
import { format } from 'date-fns';

const EditPost = () => {
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const { posts, setPosts } = useContext(DataContext);
  const history = useHistory();
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
    const editedPost = {
      id,
      title: editTitle,
      body: editBody,
      datetime: datetime,
    };

    try {
      const response = await api.patch(`/posts/${id}`, editedPost);

      setPosts(
        posts.map((post) =>
          post.id === id ? { ...response.data } : post
        )
      );
      setEditTitle('');
      setEditBody('');
      history.push('/');
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
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
