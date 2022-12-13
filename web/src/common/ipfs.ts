import { NFTStorage } from 'nft.storage'

const NFT_STORAGE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVBRTdmRTcxNUM1MTliOWUxM2I5NGYwN0VCOWIzRkU3OTg1ZDkxYWIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDcxNDQzODYzMywibmFtZSI6Ik5GVCBhcyBhIENyZWF0b3IifQ.jaKPsG62vVansx0ZbjF4Ho6iAibO7SHKALDLcG-8CHw'

const nftStorage = new NFTStorage({ token: NFT_STORAGE_TOKEN })

export const uploadIPFSTokenMetadata = async ({
  name,
  symbol,
  description,
  sellerFeeBasisPoints,
  image,
}: {
  name: string
  symbol: string
  description: string
  sellerFeeBasisPoints: number
  image: File
}) => {
  const imageCID = await nftStorage.storeBlob(image)
  const metadataCID = await nftStorage.storeBlob(
    new Blob([
      JSON.stringify({
        name,
        symbol,
        description,
        seller_fee_basis_points: sellerFeeBasisPoints,
        image: `https://${imageCID}.ipfs.nftstorage.link`,
      }),
    ]),
  )

  return `https://${metadataCID}.ipfs.nftstorage.link`
}
