import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import About from './components/About';
import Missing from './components/Missing';
import EditPost from './components/EditPost';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/posts.js';
import useWindowSize from './hooks/useWindowSize';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const history = useHistory();
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch(
    'http://localhost:3500/posts'
  );

  useEffect(() => {
    setPosts(data);
  }, [data]);

  useEffect(() => {
    const filteredPosts = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredPosts.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
    const newPost = {
      id,
      title: postTitle,
      body: postBody,
      datetime: datetime,
    };
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history.push('/');
    } catch (error) {
      console.log('Something went wrong:', error.message);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
    const editedPost = {
      id,
      datetime: datetime,
      title: editTitle,
      body: editBody,
    };

    try {
      const response = await api.put(`/posts/${id}`, editedPost);
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      history.push('/');
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <div className='App'>
      <Header title='React JS Blog' width={width} />
      <Nav search={search} setSearch={setSearch} />
      <Switch>
        <Route exact path='/'>
          <Home
            posts={searchResults}
            fetchError={fetchError}
            isLoading={isLoading}
          />
        </Route>
        <Route exact path='/post'>
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />
        </Route>
        <Route path='/edit/:id'>
          <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
          />
        </Route>
        <Route path='/post/:id'>
          <PostPage posts={posts} handleDelete={handleDelete} />
        </Route>
        <Route path='/about' component={About} />
        <Route path='*' component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
