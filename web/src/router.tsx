import { createBrowserRouter } from 'react-router-dom'
import Browse from './pages/Browse/Browse'
import Home from './pages/Home/Home'
import NewCollection from './pages/NewCollection/NewCollection'
import Studio from './pages/Studio/Studio'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/browse', element: <Browse /> },
  { path: '/newcollection', element: <NewCollection /> },
  { path: '/studio/:collectionAddr', element: <Studio /> },
])

export default router
