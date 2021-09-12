import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import About from './components/About';
import Missing from './components/Missing';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/post'>
          <NewPost />
        </Route>
        <Route path='/post/:id'>
          <PostPage />
        </Route>
        <Route path='/about' component={About} />
        <Route path='*' component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
