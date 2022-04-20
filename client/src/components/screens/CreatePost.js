import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from "materialize-css";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (url) {
            fetch("http://localhost:8877/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("insta_clone_token")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.errors) {
                        data.errors.map(err => {
                            M.toast({ html: err.msg, classes: "#e53935 red darken-1" });
                        })
                    } else {
                        M.toast({ html: data.msg, classes: "#00695c teal darken-3" });
                        history.push("/");
                    }
                }).catch(err => {
                    console.log(err);
                }).catch(err => {
                    console.log(err);
                })
        }
    }, [url]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone"); //name of cloudinary project
        data.append("cloud_name", "thunderbolt");

        fetch('https://api.cloudinary.com/v1_1/thunderbolt/image/upload', {
            method: 'post',
            body: data,
        }).then(res => res.json())
            .then(data => {
                // console.log(data.url);
                setUrl(data.url);
            }).catch(err => {
                console.log(err);
            });
    }

    return (
        <div className='card input-filed' style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: 'center' }}>
            <input type="text" placeholder='title' value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='body' value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1" >
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" name="action" onClick={() => postDetails()}>Submit Post</button>
        </div>
    )
}

export default CreatePost;