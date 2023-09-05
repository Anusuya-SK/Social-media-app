import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@mui/material';
import { serverStamp } from './firebase';
import './imageUpload.css';

function ImageUpload({ username }) {
    const[image, setImage] = useState(null);
    const[progress, setProgress] = useState(0);
    const[caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress Function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function...
                console.log(error);
                alert(error.message);
            },
            () => {
                // Complete Function...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // Post image inside db
                        addDoc(collection(db, 'Posts'), {
                            timestamp: serverStamp.now(),
                            caption: caption,
                            imageurl: downloadURL,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    };

    return (
        <div className="imageupload">
            {/* Caption Input */}
            {/* File Picker */}
            {/* Post Button */}

            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload