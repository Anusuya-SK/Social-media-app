import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query, orderBy, addDoc } from 'firebase/firestore';
import './Post.css';
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import { serverStamp } from './firebase';

function Post( { postId, user, username, caption, imageurl } ) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            const commentRef = query(collection(db, 'Posts', postId, "comments"), orderBy('timestamp', 'desc'));
            unsubscribe = onSnapshot(commentRef, (snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }

        return () => {
            unsubscribe(); 
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        addDoc(collection(db, 'Posts', postId, "comments"), {
            text: comment,
            username: user.displayName,
            timestamp: serverStamp.now()
        });
        setComment('');
    }

    return (
        <div className="post">
            {/* header --> Avatar + Username */}
            {/* Image */}
            {/* Username + Caption */}

            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    src="static/images/avatar/1.jpg"
                    alt={username}
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" alt="" src={imageurl} />
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>

            <div className='post__comment'>
                {comments.map((comment, postId) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            
            {user && (
                <form className='post__commentbox'>
                    <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post