import React, { useEffect } from 'react';

function Home () {
    useEffect(() => {
        console.log('Hello');
    }, []);

    return <div className="main">Hello</div>;
}

export default Home;
