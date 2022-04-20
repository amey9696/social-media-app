import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const { state, dispatch } = useContext(userContext);
    const { userid } = useParams();
    const [showFollow, setUShowFollow] = useState(state ? !state.following.includes(userid) : true);

    useEffect(() => {
        fetch(`http://localhost:8877/user/${userid}`, {
            method: "get",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            },
        }).then(res => res.json())
            .then(result => {
                if (result) {
                    setUserProfile(result);
                }
            })
    }, []);

    const followUser = () => {
        fetch('http://localhost:8877/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("insta_clone_token")
            },
            body: JSON.stringify({
                followId: userid,
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: result.following,
                        followers: result.followers
                    }
                });
                localStorage.setItem("insta_clone_user", JSON.stringify(result))
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, result._id]
                        }
                    }
                });
                setUShowFollow(false);
            })
    }

    const unfollowUser = () => {
        fetch('http://localhost:8877/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("insta_clone_token")
            },
            body: JSON.stringify({
                unfollowId: userid,
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: result.following,
                        followers: result.followers
                    }
                });
                localStorage.setItem("insta_clone_user", JSON.stringify(result))
                setUserProfile((prevState) => {
                    const newFollwer = prevState.user.followers.filter(item => item !== result._id);
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollwer
                        }
                    }
                });
                setUShowFollow(true);
            })
    }

    return (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: "18px 0px", borderBottom: '1px solid grey' }}>
                <div>
                    <img src={userProfile ? userProfile.user.pic : "loading..."} style={{ width: "160px", height: "160px", borderRadius: "80px" }} />
                </div>
                <div>
                    <h4>{userProfile ? userProfile.user.name : "loading..."}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: "108%" }}>
                        <h6>{userProfile ? userProfile.posts.length : "loading.."} posts</h6>
                        <h6>{userProfile ? userProfile.user.followers.length : "loading.."} followers</h6>
                        <h6>{userProfile ? userProfile.user.following.length : "loading.."} following</h6>
                    </div>
                    {
                        showFollow ?
                            <button style={{ margin: '10px' }} className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
                            <button style={{ margin: '10px' }} className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
                    }
                </div>
            </div>
            <div className='gallery'>
                {
                    userProfile ? userProfile.posts.map(item => {
                        return (
                            <img className='item' src={item.photo} alt={item.title} key={item._id} />
                        )
                    }) : "loading..."
                }
            </div>
        </div>
    )
}

export default UserProfile;