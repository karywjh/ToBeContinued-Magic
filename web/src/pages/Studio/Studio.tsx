import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Studio.module.scss'

const Studio = () => {
  const { collectionId } = useParams()

  return (
    <div>
      <Navbar />
      Studio
      {/* <iframe
        style={{ border: '1px, solid, rgba(0, 0, 0, 0.1)' }}
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FvukiJ94JWGLZZ0AqP6mC0p%2FLogo-Design%3Fnode-id%3D32%253A1139%26t%3D7xtX5yvM3MCX8svb-1"
        allowFullScreen
      ></iframe> */}
      {/* <iframe
        style={{ border: '1px, solid, rgba(0, 0, 0, 0.1)' }}
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FvukiJ94JWGLZZ0AqP6mC0p%2FLogo-Design%3Fnode-id%3D32%253A1139%26t%3D7xtX5yvM3MCX8svb-1"
        allowFullScreen
      ></iframe> */}
      <iframe
        style={{ border: '1px, solid, rgba(0, 0, 0, 0.1)' }}
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FvukiJ94JWGLZZ0AqP6mC0p%2FLogo-Design%3Fnode-id%3D0%253A1%26t%3D7xtX5yvM3MCX8svb-1"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default Studio
