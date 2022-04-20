import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='center notFound'>
            <h5>Sorry, this page isn't available.</h5>
            <p>The link you followed may be broken, or the page may have been removed.<Link to="/login">Go back to Instagram</Link>.</p>
        </div>
    )
}

export default NotFound;