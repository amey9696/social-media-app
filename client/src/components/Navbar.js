import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../App';

const Navbar = () => {
    const { state, dispatch } = useContext(userContext);
    const history = useHistory();
    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link></li>,
                <li><Link to="/createPost" style={{ textDecoration: 'none' }}>Create Post</Link></li>,
                <li><Link to="/myFollowerPost" style={{ textDecoration: 'none' }}>My Following userpost</Link></li>,
                <li>
                    <button className="btn #e53935 red darken-1" type="submit" name="action"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push("/login")
                        }}>Logout</button>
                </li>,
            ]
        } else {
            return [
                <li><Link to='/login' style={{ textDecoration: 'none' }}>Login</Link></li>,
                <li><Link to="/register" style={{ textDecoration: 'none' }}>Register</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/login"} className="brand-logo left" style={{ textDecoration: 'none' }}>Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;