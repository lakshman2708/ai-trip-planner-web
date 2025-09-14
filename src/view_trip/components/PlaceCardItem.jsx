import { Button } from '@/components/ui/button'
import { Bluetooth } from 'lucide-react'
import React, {useState,useEffect} from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {

    const [PhotoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlacePhoto();
    }, [place])
    const GetPlacePhoto = async () => {
        const data = {
            textQuery: place.placeName
        }
        const result = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
            setPhotoUrl(PhotoUrl)
        })
    }
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + place.placeName} target='_blank'>
            <div className='border rounded-xl p-3 mb-5 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
                <img src={PhotoUrl?PhotoUrl:'/placeholder.png'}
                    className='w-[130px] h-[130px] rounded-xl object-cover' />
                <div>
                    <h2 className='font-bold text-lg'>{place.placeName}</h2>
                    <p className='text-sm text-gray-400'>{place.placeDetails}</p>
                    <h2 className='mt-2'>🕞 {place.travelTimeBetweenLocations}</h2>
                    <Button size="sm"><FaLocationDot /></Button>
                </div>
            </div>
        </Link>
    )
}

export default PlaceCardItem