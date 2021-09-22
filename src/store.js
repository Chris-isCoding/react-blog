import { createStore, action, thunk, computed } from 'easy-peasy';
import api from './api/posts';

export default createStore({
  posts: [],
  setPosts: action((state, payload) => {
    state.posts = payload;
  }),
  postTitle: '',
  setPostTitle: action((state, payload) => {
    state.postTitle = payload;
  }),
  postBody: '',
  setPostBody: action((state, payload) => {
    state.postBody = payload;
  }),
  editTitle: '',
  setEditTitle: action((state, payload) => {
    state.editTitle = payload;
  }),
  editBody: '',
  setEditBody: action((state, payload) => {
    state.editBody = payload;
  }),
  search: '',
  setSearch: action((state, payload) => {
    state.search = payload;
  }),
  searchResults: '',
  setSearchResults: action((state, payload) => {
    state.searchResults = payload;
  }),
  postCount: computed((state) => state.posts.length),
  getPostById: computed(
    (state) => (id) =>
      state.posts.find((post) => post.id.toString() === id)
  ),
  savePost: thunk(async (actions, newPost, helpers) => {
    const { posts } = helpers.getState();
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      actions.setPosts(allPosts);
      actions.setPostTitle('');
      actions.setPostBody('');
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
  }),
  deletePost: thunk(async (actions, id, helpers) => {
    const { posts } = helpers.getState();
    try {
      api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      actions.setPosts(postsList);
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
  }),
  editPost: thunk(async (actions, editedPost, helpers) => {
    const { posts } = helpers.getState();
    const { id } = editedPost;
    try {
      const response = await api.patch(`/posts/${id}`, editedPost);

      actions.setPosts(
        posts.map((post) =>
          post.id === id ? { ...response.data } : post
        )
      );
      actions.setEditTitle('');
      actions.setEditBody('');
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`);
    }
  }),
});
