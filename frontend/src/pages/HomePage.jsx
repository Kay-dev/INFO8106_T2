import Hero from '../components/Hero';
import EventListings from '../components/EventListings';
import ViewAllEvents from '../components/ViewAllEvents';

const HomePage = () => {
  return (
    <>
      <Hero />
      <EventListings isHome={true} />
      <ViewAllEvents />
    </>
  );
};
export default HomePage;
