import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import EditPost from './components/EditPost';
import PostPage from './components/PostPage';
import About from './components/About';
import Missing from './components/Missing';

import { Route, Switch } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <DataProvider>
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/post' component={NewPost} />
          <Route path='/edit/:id' component={EditPost} />
          <Route path='/post/:id' component={PostPage} />
          <Route path='/about' component={About} />
          <Route path='*' component={Missing} />
        </Switch>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
