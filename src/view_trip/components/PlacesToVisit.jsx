import React from 'react'
import PlaceCardItem from './PlaceCardItem'

const timeMap = {
  "morning": "8:00 AM - 11:00 AM",
  "early afternoon": "12:00 PM - 2:00 PM",
  "late afternoon": "3:00 PM - 5:30 PM",
  "evening": "6:00 PM - 9:00 PM",
  "sunset": "6:30 PM - 7:30 PM",
  "early morning": "6:00 AM - 8:00 AM",
  "afternoon": "12:00 PM - 4:00 PM"
}

const convertToTime = (text = "") => {
  const lower = text.toLowerCase()
  for (let key in timeMap) {
    if (lower.includes(key)) {
      return timeMap[key]
    }
  }
  return text
}

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.itinerary ?? trip?.itinerary ?? []

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-lg mb-4'>Places To Visit</h2>
      <div className='space-y-8'>
        {itinerary.map((item, index) => (
          <div key={index}>
            <h2 className='font-medium text-lg mb-3'>Day {item?.day ?? index + 1}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {(item?.places ?? item?.plan ?? item?.plans ?? []).map((place, pIndex) => (
                <div key={pIndex} className='space-y-2'>
                  <h2 className='font-medium text-sm text-orange-600'>
                    {convertToTime(place?.bestTimeToVisit ?? "")}
                  </h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit
