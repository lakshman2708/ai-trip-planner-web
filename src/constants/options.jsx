export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Low',
    desc: '0 - 1000 USD',
    icon: '💰',
  },
  {
    id: 2,
    title: 'Medium',
    desc: '1000 - 2500 USD',
    icon: '💵',
  },
  {
    id: 3,
    title: 'High',
    desc: '2500+ USD',
    icon: '💎',
  },
]

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: '🧍',
    people: '1',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '👨‍👩‍👧‍👦',
    people: '3 to 5 People',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of friends on an adventure',
    icon: '👯',
    people: '3 to 10 People',
  },
]

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. " +
  "Give me Hotels options list with hotelName, hotelAddress, price, hotelImageUrl, geoCoordinates, rating, " +
  "description. Suggest itinerary with placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, " +
  "rating, and best time to visit. Generate a day-wise plan for {totalDays} days with each day's schedule in JSON format.";
