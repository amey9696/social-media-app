import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App';

const Profile = () => {
    const [mypics, setMypics] = useState([]);
    const [image, setImage] = useState("");
    const { state, dispatch } = useContext(userContext);

    useEffect(() => {
        fetch("http://localhost:8877/myPost", {
            // method: "get",
            headers: {
                "Authorization": localStorage.getItem("insta_clone_token")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setMypics(result.post);
            })
    }, []);

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
                    // console.log(data);
                    // localStorage.setItem("insta_clone_user", JSON.stringify({ ...state, pic: data.url }));
                    // dispatch({ type: "UPDATE_PIC", payload: data.url });
                    fetch("http://localhost:8877/updatePic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("insta_clone_token")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            // console.log(result);
                            localStorage.setItem("insta_clone_user", JSON.stringify({ ...state, pic: result.pic }));
                            dispatch({ type: "UPDATE_PIC", payload: result.pic });
                        })
                }).catch(err => {
                    console.log(err);
                });
        }
    }, [image]);

    const updatePhoto = (file) => {
        setImage(file);
    }

    return (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
            <div style={{ margin: "18px 0px", borderBottom: '1px solid grey' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                        <img src={state ? state.pic : "loading.."} style={{ width: "160px", height: "160px", borderRadius: "80px" }} />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading.."}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: "108%" }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : 0} followers</h6>
                            <h6>{state ? state.following.length : 0} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1" >
                        <span>update Pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" style={{ width: '30%' }} />
                    </div>
                </div>
                {/* <button style={{ margin: '10px 0px 10px 65px' }} className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action" onClick={() => updatePhoto()}>Update Pic</button> */}
            </div>

            <div className='gallery'>
                {
                    mypics.map(item => {
                        return (
                            <img className='item' src={item.photo} alt={item.title} key={item._id} />
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Profile;