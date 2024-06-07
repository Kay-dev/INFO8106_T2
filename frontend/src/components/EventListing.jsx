import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';


const EventListing = ({ event }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [subscribed, setSubscribed] = useState(3);
  const [maxSubscribers, setMaxSubscribers] = useState(30);
  const navigate = useNavigate();

  let description = event.description;

  if (!showFullDescription) {
    description = description.substring(0, 90) + '...';
  }

  const toEventPage = () => {
    navigate(`/events/${event.id}`);
  };

  const handleButtonClick = (event) => {
    // eslint-disable-next-line react/prop-types
    event.stopPropagation();

  };

  return (
    <div className='bg-white rounded-xl shadow-md relative'>
      <div className='p-4' onClick={toEventPage}>
        <div className='mb-6'>
          <div className="flex justify-between">
            <div className="text-gray-600 my-2">{event.type}</div>
            <div className="text-gray-600 my-2">Subscribed: {subscribed}/{event.maxParticipants}</div>
          </div>
          <h3 className="text-xl font-bold">{event.title}</h3>
        </div>
        <div className='mb-5'>{description}</div>
        <h3 className='text-indigo-500 mb-2'>{event.startTime}-{event.endTime}</h3>
        <div className='border border-gray-100 mb-5'></div>
        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='text-orange-700 mb-3'>
            <FaMapMarker className='inline text-lg mb-1 mr-1' />
            {event.location}
          </div>
          <button
                className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                onClick={handleButtonClick}
                >
                Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};
export default EventListing;
