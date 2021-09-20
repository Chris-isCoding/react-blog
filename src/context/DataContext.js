import { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/posts';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const history = useHistory();
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
        search,
        setSearch,
        searchResults,
        fetchError,
        isLoading,
        posts,
        handleDelete,
        handleEdit,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
