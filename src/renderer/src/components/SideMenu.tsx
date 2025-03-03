import barChart from '../assets/icons/bar-chart.svg'
import calendar from '../assets/icons/calendar.svg'
import fileList from '../assets/icons/file-list.svg'

const SideMenu = (): JSX.Element => {
    return (
        <div className="side-menu-container">
            <img src={calendar} alt="calendar" className='side-menu-item'/>
            <img src={fileList} alt="file-list" className='side-menu-item'/>
            <img src={barChart} alt="bar-chart" className='side-menu-item'/>
        </div>
    )
}

export default SideMenu