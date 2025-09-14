import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
function UserTripCardItem({ trip }) {
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
        <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-105 transition-all'>
            <img src={photoUrl?photoUrl:'/placeholder.png'}
                className="object-cover rounded-xl h-[220px] w-full" />
            <div>
                <h2 className='font-bold text-lg'>
                    {trip?.userSelection?.location?.label}
                </h2>
                <h2 className='text-sm text-gray-500'>
                    {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                </h2>
            </div>
        </div>
        </Link>
    )
}

export default UserTripCardItem