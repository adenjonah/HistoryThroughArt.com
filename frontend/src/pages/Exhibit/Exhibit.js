import React, {useEffect} from 'react'

function Exhibit() {

    useEffect(() => {

        //Gets the parameter in the search query
        const urlParam = new URLSearchParams(window.location.search);
        const exhibitID = urlParam.get('id');

        fetch(`http://localhost:5000/exhibit?id=${exhibitID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }, []);
    return (
        <div className='about pagecontainer'>
            <h1 className="title">Exhibit</h1>
            <p className='blurb'>Here is a deep dive into a single piece</p>
        </div>
    )
}

export default Exhibit;