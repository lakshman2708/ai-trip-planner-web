import React, { useEffect, useState } from 'react'
import { CiShare1 } from "react-icons/ci"
import { Button } from '../../components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi'

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.png')

  useEffect(() => {
    if (trip) GetPlacePhoto()
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label
    }

    try {
      const resp = await GetPlaceDetails(data)
      const photos = resp?.data?.places?.[0]?.photos
      if (photos && photos.length > 0) {
        const url = PHOTO_REF_URL.replace('{NAME}', photos[0].name)
        setPhotoUrl(url)
      }
    } catch (err) {
      console.error("Photo fetch error:", err.response?.data || err.message)
      setPhotoUrl('/placeholder.png')
    }
  }

  return (
    <div>
      <img
        src={photoUrl || '/placeholder.png'}
        className='h-[340px] w-full object-cover rounded-xl'
      />

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📅 {trip?.userSelection?.noOfDays} Days
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💶 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🥂 No. of Traveller: {trip?.userSelection?.traveller}
            </h2>
          </div>
        </div>
        <Button><CiShare1 /></Button>
      </div>
    </div>
  )
}

export default InfoSection
