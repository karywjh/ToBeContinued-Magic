import { createBrowserRouter } from 'react-router-dom'
import Browse from './pages/Browse/Browse'
import CollectionDetail from './pages/CollectionDetail/CollectionDetail'
import Home from './pages/Home/Home'
import Studio from './pages/Studio/Studio'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/browse', element: <Browse /> },
  { path: '/studio', element: <Studio /> },
  { path: '/collection/:collectionId', element: <CollectionDetail /> },
])

export default router
