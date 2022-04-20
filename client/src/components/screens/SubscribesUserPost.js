import React, { useState, useEffect, useContext } from 'react';
import { userContext } from "../../App";
import { Link } from 'react-router-dom';
const SubscribesUserPost = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(userContext);

    useEffect(() => {
        fetch("http://localhost:8877/getSubscriberPost", {
            // method: "get",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            },
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setData(result.post);
            })
    }, []);
    // console.log(data);

    const likePost = (id) => {
        fetch("http://localhost:8877/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("insta_clone_token")
            },
            body: JSON.stringify({
                postId: id,
            }),
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {
        fetch("http://localhost:8877/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("insta_clone_token")
            },
            body: JSON.stringify({
                postId: id,
            }),
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch("http://localhost:8877/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("insta_clone_token")
            },
            body: JSON.stringify({
                postId,
                text
            }),
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postId) => {
        fetch(`http://localhost:8877/deletePost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.filter(item => {
                    return item._id != result._id;
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const deleteComment = (postId, commentId) => {
        // console.log(commentId);
        fetch(`http://localhost:8877/deleteComment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        result.postedBy = item.postedBy;
                        return result
                    } else {
                        return item;
                    }
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id}>
                            <div style={{ display: 'flex', padding: '5px', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', width: "50%" }}>
                                    <img src={item.postedBy.pic} alt="userPic" style={{ width: '40px', height: "40px", borderRadius: "50%" }} />
                                    <h5 style={{ margin: '4px 0 0 10px' }}><Link style={{ textDecoration: 'none' }} to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link></h5>
                                </div>
                                {/* {
                                    item.postedBy._id === state._id &&
                                    <i className="material-icons" style={{ float: "right", cursor: "pointer", marginTop: '2px' }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                } */}
                            </div>
                            <div className='card-image'>
                                <img src={item.photo} />
                            </div>
                            <div className='card-content'>
                                {/* <i className="material-icons" style={{ color: 'red' }}>favorite</i> */}
                                {
                                    item.likes.includes(state._id) ?
                                        <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => unlikePost(item._id)}>thumb_down</i> :
                                        <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(comment => {
                                        return (
                                            <h6 key={comment._id}>
                                                <span style={{ fontWeight: '500', margin: '5px' }}>{comment.postedBy.name}</span>
                                                {comment.text}
                                                {
                                                    comment.postedBy._id === state._id &&
                                                    <i className="material-icons" style={{ float: "right", cursor: "pointer" }}
                                                        onClick={() => deleteComment(item._id, comment._id)}
                                                    >delete</i>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder='Add a comment and press enter' />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div >
    )
}

export default SubscribesUserPost;