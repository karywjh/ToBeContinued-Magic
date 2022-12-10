import { useParams } from 'react-router-dom'
import styles from './CollectionDetail.module.scss'
import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana'

const CollectionDetail = () => {
  const { collectionId } = useParams()

  return <div>detail</div>
}

export default CollectionDetail
