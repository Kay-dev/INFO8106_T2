import EventListings from '../components/EventListings';
import EventSearchForm from '../components/EventSearchForm';
import { useState } from 'react';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
  };
  return (
    <section className='bg-blue-50 px-4 py-6'>
      <EventSearchForm onSearch={handleSearch}/>
      <EventListings searchParams={searchParams}/>
    </section>
  );
};
export default EventsPage;
