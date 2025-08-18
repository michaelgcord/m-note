import search from "../../assets/icons/search-line.svg"

const Search = () : JSX.Element => {
    return (
        <div className="search-container">
            <input placeholder="Search" className="search no-drag" type="text" />
            <img className="search-icon" src={search} alt="" height={21}/>
        </div>
    )
}

export default Search