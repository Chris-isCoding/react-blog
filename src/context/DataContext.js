import { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/posts';
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
      console.log(`Something went wrong: ${error.message}`);
    }
  };

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

  const handleDelete = async (id) => {
    try {
      api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      history.push('/');
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        width,
        search,
        setSearch,
        searchResults,
        fetchError,
        isLoading,
        handleSubmit,
        postTitle,
        setPostTitle,
        postBody,
        setPostBody,
        posts,
        handleDelete,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
