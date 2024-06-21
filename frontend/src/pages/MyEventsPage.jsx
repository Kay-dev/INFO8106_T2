import EventListings from '../components/EventListings';

const MyEventsPage = () => {
  return (
    <section className='bg-blue-50 px-4 py-6'>
      <EventListings myEvent={true}/>
    </section>
  );
};
export default MyEventsPage;
