import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';

import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import { Button, Input } from '@mui/material';
import ImageUpload from './imageUpload';
import { InstagramEmbed } from 'react-social-media-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    bgcolor: 'background.paper',
    backgroundColor: 'white',
    border:'2px solid #000',
    boxShadow: 24,
    padding: 20,
  },
}));

function App() {
  const classes = useStyles(); 
  const[modalStyle] = useState(getModalStyle); 

  const[posts, setPosts] = useState([]);
  const[open, setOpen] = useState(false);
  const[openSignIn, setOpenSignIn] = useState(false);
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[email, setEmail] = useState('');
  const[user, setUser] = useState(null);

  // useEfect -> Runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User has logged in
        console.log(currentUser);
        setUser(currentUser);
      } else {
        // User has logged out
        setUser(null);
      }
    })

    return () => {
      //Perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    //this is where code runs. Here 'Posts' refers from firebase
    const postRef = query(collection(db, 'Posts'), orderBy('timestamp', 'desc'));
    onSnapshot(postRef, (snapshot) => {
      //every time the new post added this code fires....
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      updateProfile(auth.currentUser, {
        displayName: username
      });
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      updateProfile(auth.currentUser, {
        displayName: username
      });
    })
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className='app__headerImage'
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
              alt="Logo"
            />
          </center>
          <Input          
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input           
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input          
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>      
        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className='app__headerImage'
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
              alt="Logo"
            />
          </center>
          <Input           
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input          
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>      
        </form>
      </div>
      </Modal>

      <div className="app__header">
        <img
          className='app__headerImage'
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
          alt="Logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>      
        )} 

      </div>

      <div className="app__posts">
        <div className="app__postsRight">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl} />
            ))
          }

          {user ? ( 
            <ImageUpload username={username}/>
          ): (
            <h3 className='app__postlog'>Sorry you need to login to upload</h3>
          )}

        </div>
        <div className="app__postsLeft">
          <InstagramEmbed url="https://www.instagram.com/p/CUbHfhpswxt/" width={328} />
        </div>
      </div>
      
    </div>
  );
}

export default App;
