import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <RouterProvider router={router} />,
)
