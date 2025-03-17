import SideMenu from "./components/SideMenu"
import FileMenu from "./components/FileMenu/FileMenu"
import Calendar from "./components/Calendar/Calendar"
import Notes from "./components/Notes/Notes"
import { useMenuStore } from "./stores/useMenuStore.js"

const Content = (): JSX.Element => {
  const menu = useMenuStore((state:any) => state.menu)

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
      <Content />
    </div>
  )
}

export default App
