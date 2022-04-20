import React, { useState, useEffect, useContext } from 'react';
import { userContext } from "../../App";
import { Link } from 'react-router-dom';
const Home = () => {
    const [data, setData] = useState([]);
    const [image, setImage] = useState("");
    const [postId, setPostId] = useState('');
    const { state, dispatch } = useContext(userContext);

    useEffect(() => {
        fetch("http://localhost:8877/allPosts", {
            // method: "get",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            },
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setData(result.posts);
            })
    }, []);

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

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone"); //name of cloudinary project
            data.append("cloud_name", "thunderbolt");

            fetch('https://api.cloudinary.com/v1_1/thunderbolt/image/upload', {
                method: 'post',
                body: data,
            }).then(res => res.json())
                .then(data => {
                    fetch("http://localhost:8877/updatePhoto", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("insta_clone_token")
                        },
                        body: JSON.stringify({
                            photo: data.url,
                            postId: postId,
                        })
                    }).then(res => res.json())
                        .then(result => {
                            // console.log(result);
                            window.location.reload()
                            dispatch({ type: "UPDATE_PHOTO", payload: result.photo });
                        })
                }).catch(err => {
                    console.log(err);
                });
        }
    }, [image]);

    const updatePhoto = (file) => {
        setImage(file);
    }

    const pId = (id) => {
        setPostId(id);
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
                                {
                                    item.postedBy._id === state._id &&
                                    <>
                                        <i className="material-icons" style={{ float: "right", cursor: "pointer", marginTop: '2px' }}
                                            data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => pId(item._id)}
                                        >create</i>

                                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ width: "40%", height: '50vh' }}>
                                            <div className="modal-dialog" >
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Update Pic</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="file-field input-field">
                                                            <div className="btn #64b5f6 blue darken-1" >
                                                                <span>update Pic</span>
                                                                <input type="file"
                                                                    onChange={(e) => updatePhoto(e.target.files[0])}
                                                                />
                                                            </div>
                                                            <div className="file-path-wrapper">
                                                                <input className="file-path validate" type="text" style={{ width: '60%' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {
                                    item.postedBy._id === state._id &&
                                    <i className="material-icons" style={{ float: "right", cursor: "pointer", marginTop: '2px' }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }
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

export default Home;