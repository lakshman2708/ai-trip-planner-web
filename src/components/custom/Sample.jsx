import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Sample() {
  return (
    <div className="flex flex-col items-center justify-center mt-16 px-4">
      <h2 className="font-extrabold text-[40px] text-center leading-tight max-w-3xl">
        <span className="text-[#f56551]">
          Discover Your Next Adventure with AI:
        </span>{" "}
        Personalized Itineraries at Your Fingertips
      </h2>
      <p className="text-lg text-gray-500 text-center max-w-2xl mt-4">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
      <Link to={'/create-trip'}>
      <Button> Get Started, It's Free</Button>
      </Link>
    </div>
  )
}

export default Sample
