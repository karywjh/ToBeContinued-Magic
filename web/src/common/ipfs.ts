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
  const { url } = await nftStorage.store({
    name,
    symbol,
    description,
    seller_fee_basis_points: sellerFeeBasisPoints,
    image,
  })

  return url
}

export const getIPFSURL = (uri: string) => {
  const replaced = uri.replace('ipfs://', '')

  return `https://nftstorage.link/ipfs/${replaced}`
}

export const getIPFSMetadataJSON = async (uri: string) => {
  const res = await fetch(getIPFSURL(uri))

  return res.json()
}
