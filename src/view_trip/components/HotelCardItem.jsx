import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi'

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.png')

  useEffect(() => {
    if (hotel) GetPlacePhoto()
  }, [hotel])

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel?.hotelName
      }
      const resp = await GetPlaceDetails(data)
      const photos = resp?.data?.places?.[0]?.photos
      if (photos && photos.length > 0) {
        const url = PHOTO_REF_URL.replace('{NAME}', photos[0].name)
        setPhotoUrl(url)
      }
    } catch (err) {
      console.error("Hotel photo fetch error:", err.response?.data || err.message)
      setPhotoUrl('/placeholder.png')
    }
  }

  return (
    <div>
      <Link
        to={
          'https://www.google.com/maps/search/?api=1&query=' +
          hotel?.hotelName +
          ',' +
          hotel?.hotelAddress
        }
        target='_blank'
      >
        <div className='hover:scale-105 transition-all cursor-pointer'>
          <img
            src={photoUrl || '/placeholder.png'}
            className='rounded-lg h-[180px] w-full object-cover'
          />
          <div className='my-2 flex flex-col gap-2'>
            <h2 className='font-medium'>{hotel?.hotelName}</h2>
            <h2 className='text-xs text-gray-500'>📌 {hotel?.hotelAddress}</h2>
            <h2 className='text-sm'>💷 {hotel?.price}</h2>
            <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default HotelCardItem
