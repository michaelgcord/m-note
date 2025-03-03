import SideMenu from "./components/SideMenu"
import FileMenu from "./components/FileMenu/FileMenu"
import Calendar from "./components/Calendar/Calendar"
import Notes from "./components/Notes/Notes"
import { useMenuController } from "./stores/useMenuController.js"

const Content = (): JSX.Element => {
  const menu = useMenuController((state:any) => state.menu)

  return (
    <>
      {menu === 'notes' &&
        <Notes/>
      }
      {menu === 'calendar' &&
        <Calendar/>
      }
    </>
  )
}

const App = (): JSX.Element => {
  return (
    <div className="app-container">
      <SideMenu />
      <FileMenu />
      {/* <Content /> */}
    </div>
  )
}

export default App
