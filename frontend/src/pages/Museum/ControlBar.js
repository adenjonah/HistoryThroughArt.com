function ControlBar( {search, setSearch}) {

    const handleSearchChange = (e) => {
        //console.log(e.target.value);

        //This is a useState hook passed from Museum.js
        setSearch(e.target.value);
    }

  return (
    <div className='controlBar'>
        <div className='cb-Item'>Sort</div>
        <div className='cb-Item'>Filter</div>
        <div className='cb-Item'>Group</div>
        <input type='text' placeholder='Search' value={search} onChange={handleSearchChange}></input>
    </div>
  )
}

export default ControlBar