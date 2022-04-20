import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import M from "materialize-css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const history = useHistory();

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);

    const uploadPic = () => {
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

    const uploadFields = () => {
        fetch("http://localhost:8877/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.errors) {
                    data.errors.map(err => {
                        M.toast({ html: err.msg, classes: "#e53935 red darken-1" });
                    })
                } else {
                    M.toast({ html: data.msg, classes: "#00695c teal darken-3" });
                    history.push("/login");
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const postData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }

    }

    return (
        <div className='myCard'>
            <div className="card auth-card input-field ">
                <h2>Instagram</h2>
                <input placeholder='name' type="text"
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                <input placeholder='email' type="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <input placeholder='password' type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1" >
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action" onClick={() => postData()}>Register</button>
                <h5 style={{ marginTop: '10px' }}><Link style={{ textDecoration: 'none' }} to="/login">Already have an account?</Link></h5>
            </div>
        </div>
    )
}

export default Register;