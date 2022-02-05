import './App.css';
import Video from './pages/video'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Header from './components/Header';
import Post from './pages/blog post'
import Auth from './pages/authentication';
import Home from './pages/home';
import Posts from './pages/posts';
import Edit from './pages/edit';
import Project from './pages/projects'

function App() {
  const loggedIn = sessionStorage.getItem('loggedIn');

  if(loggedIn){
    return (
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route exact path= '/'>
              <Home />
            </Route>
            <Route path='/video_upload'>
              <Video />
            </Route>
            <Route path= '/blog_post' >
              <Post />
            </Route>
            <Route path= '/posts' >
              <Posts />
            </Route>
            <Route path= '/edit' >
              <Edit />
            </Route>
            <Route path ='/project' >
              < Project />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }else{
    return(
      <Router>
        <Auth />
      </Router>
      
    )
  }



  
}

export default App;
