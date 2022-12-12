import { createBrowserRouter } from 'react-router-dom'
import Browse from './pages/Browse/Browse'
import Home from './pages/Home/Home'
import Mint from './pages/Mint/Mint'
import NewCollection from './pages/NewCollection/NewCollection'
import Studio from './pages/Studio/Studio'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/browse', element: <Browse /> },
  { path: '/newcollection', element: <NewCollection /> },
  { path: '/studio', element: <Studio /> },
  { path: '/mint', element: <Mint /> },
])

export default router
