import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from "materialize-css";
import { userContext } from '../../App';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);

    const postData = () => {
        fetch("http://localhost:8877/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.errors) {
                    data.errors.map(err => {
                        M.toast({ html: err.msg, classes: "#e53935 red darken-1" });
                    })
                } else {
                    localStorage.setItem("insta_clone_token", data.token);
                    localStorage.setItem("insta_clone_user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    M.toast({ html: data.msg, classes: "#00695c teal darken-3" });
                    history.push("/");
                }
            }).catch(err => {
                console.log(err);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className='myCard'>
            <div className="card auth-card input-field ">
                <h2>Instagram</h2>
                <input placeholder='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action" onClick={() => postData()}>Login</button>
                <h5 style={{ marginTop: '10px' }}><Link style={{ textDecoration: 'none' }} to="/register">Don't have an account? </Link></h5>
            </div>
        </div>
    )
}

export default Login;