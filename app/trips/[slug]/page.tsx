import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trip-card";
import { formatPrice, trips } from "@/lib/trips";

const popularTripSlugs = [
  "anse-source-dargent-seychelles",
  "aysen-patagonia-wilderness",
  "taman-negara-rainforest-trail",
  "zhangye-danxia-geopark",
];

export function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trips/[slug]">) {
  const { slug } = await params;
  const trip = trips.find((item) => item.slug === slug);
  if (!trip) return { title: "Trip not found | AuraTrip" };

  return {
    title: `${trip.name} | AuraTrip`,
    description: trip.summary,
  };
}

export default async function TripDetailsPage({ params }: PageProps<"/trips/[slug]">) {
  const { slug } = await params;
  const trip = trips.find((item) => item.slug === slug);
  if (!trip) notFound();

  const gallery = "gallery" in trip && trip.gallery
    ? trip.gallery
    : [{ image: trip.image, alt: trip.imageAlt }];
  const itinerary = "itinerary" in trip && trip.itinerary
    ? trip.itinerary
    : [{ day: 1, title: "Trip overview", activities: [trip.summary] }];
  const routeCities = "routeCities" in trip && trip.routeCities ? trip.routeCities : [trip.location];
  const subtitle = "subtitle" in trip ? trip.subtitle : `${trip.durationDays}-day guided getaway`;
  const detailHeading = "detailHeading" in trip && trip.detailHeading ? trip.detailHeading : trip.name;
  const bestTimeToVisit = "bestTimeToVisit" in trip && trip.bestTimeToVisit ? trip.bestTimeToVisit : [];
  const weather = "weather" in trip && trip.weather ? trip.weather : [];
  const mapImage = "mapImage" in trip && trip.mapImage ? trip.mapImage : null;
  const mapAlt = "mapAlt" in trip && trip.mapAlt ? trip.mapAlt : `image of a route map for ${trip.name}`;
  const bookingPrice = formatPrice(trip.pricePerPerson.amount, trip.pricePerPerson.currency);
  const bookingLabel = `Click here to Pay and join the ${trip.name} trip. Destinations: ${routeCities.join(", ")}. Price per person: ${bookingPrice}.`;
  const popularTrips = popularTripSlugs
    .filter((popularSlug) => popularSlug !== trip.slug)
    .map((popularSlug) => trips.find((item) => item.slug === popularSlug))
    .filter((item) => item !== undefined);

  return (
    <>
      <Link className="skip-link" href="#main-content">Skip to main content</Link>
      <header className="details-header">
        <nav className="details-nav" aria-label="Primary navigation">
          <Link className="brand" href="/" aria-label="AuraTrip home">
            <Image src="/figma/auratrip.svg" width={30} height={30} alt="image of the AuraTrip compass logo" priority />
            <span>AuraTrip</span>
          </Link>
          <div className="details-nav__actions">
            <span className="details-nav__name">John Doe</span>
            <Image className="profile-image" src="/figma/profile.png" alt="image of logged-in John Doe" width={40} height={40} />
            <Button className="logout-button" variant="ghost" size="icon" aria-label="Log out" disabled>
              <Image src="/figma/logout.svg" width={24} height={24} alt="" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="details-main" id="main-content" tabIndex={-1}>
        <div className="details-content">
          <Button className="details-back" variant="outline" aria-label="Go back to all trips" render={<Link href="/" />}>
            <span aria-hidden="true">←</span>
            Go back
          </Button>

          <section className="details-intro" aria-labelledby="trip-title">
            <h1 id="trip-title">{trip.name}</h1>
            <div className="details-meta">
              <p><span className="sr-only">Duration: </span>{trip.durationDays} day plan</p>
              <p><span className="sr-only">Route: </span>{routeCities.join(", ")}</p>
            </div>

            <figure className={`details-gallery${gallery.length === 1 ? " details-gallery--single" : ""}`} aria-label={`${trip.name} photo gallery`}>
              {gallery.map((photo, index) => (
                <Image
                  key={`${photo.image}-${index}`}
                  className={`details-gallery__image details-gallery__image--${index + 1}`}
                  src={`/figma/${photo.image}`}
                  alt={photo.alt}
                  width={index === 0 ? 924 : 440}
                  height={index === 0 ? 616 : 294}
                  priority={index === 0}
                  sizes={index === 0 ? "(max-width: 760px) 100vw, 742px" : "(max-width: 760px) 48vw, 220px"}
                />
              ))}
            </figure>

            <ul className="details-tags" aria-label="Trip highlights">
              {trip.tags.map((tag) => <li key={tag}>{tag}</li>)}
              <li className="details-availability">9 slots remaining</li>
              <li className="details-rating" aria-label={`${trip.rating} out of 5 stars`}>
                <span aria-hidden="true">★★★★★</span>
                <span>{trip.rating.toFixed(1)} / 5.0</span>
              </li>
            </ul>

            <div className="details-title-row">
              <div>
                <h2>{detailHeading}</h2>
                <p>{subtitle}</p>
              </div>
              <p className="details-price" aria-label={`${formatPrice(trip.pricePerPerson.amount, trip.pricePerPerson.currency)} per person`}>
                {formatPrice(trip.pricePerPerson.amount, trip.pricePerPerson.currency)}
              </p>
            </div>
            <p className="details-summary">{trip.summary}</p>
          </section>

          <section className="itinerary-section" aria-labelledby="itinerary-heading">
            <h2 className="sr-only" id="itinerary-heading">Day-by-day itinerary</h2>
            <ol className="itinerary-list">
              {itinerary.map((day) => (
                <li className="itinerary-day" key={day.day}>
                  <h3>Day {day.day}: {day.title}</h3>
                  <ul>
                    {day.activities.map((activity) => <li key={activity}>{activity}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          {bestTimeToVisit.length > 0 && (
            <section className="details-info-section" aria-labelledby="best-time-heading">
              <h2 id="best-time-heading">Best time to visit</h2>
              <ul>
                {bestTimeToVisit.map((season) => (
                  <li key={season.season}><strong>{season.season} ({season.months}):</strong> {season.description}</li>
                ))}
              </ul>
            </section>
          )}

          {weather.length > 0 && (
            <section className="details-info-section" aria-labelledby="weather-heading">
              <h2 id="weather-heading">Typical weather</h2>
              <ul>
                {weather.map((season) => (
                  <li key={season.season}><strong>{season.season}:</strong> {season.temperatureCelsius} ({season.temperatureFahrenheit})</li>
                ))}
              </ul>
            </section>
          )}

          {mapImage && (
            <section className="details-map" aria-labelledby="route-map-heading">
              <h2 className="sr-only" id="route-map-heading">Route map</h2>
              <Image src={`/figma/${mapImage}`} alt={mapAlt} width={1484} height={606} sizes="(max-width: 760px) 100vw, 742px" />
            </section>
          )}

          <div className="details-booking">
            <Button className="details-booking__button" size="lg" aria-label={bookingLabel}>
              Pay and join trip <span>{bookingPrice}</span>
            </Button>
          </div>
        </div>
      </main>

      {popularTrips.length > 0 && (
        <section className="popular-section" aria-labelledby="popular-heading">
          <h2 id="popular-heading">Popular Trips</h2>
          <ul className="popular-grid" aria-label="Popular trips">
            {popularTrips.map((popularTrip) => <li key={popularTrip.id}><TripCard trip={popularTrip} /></li>)}
          </ul>
        </section>
      )}

      <footer className="site-footer">
        <Link className="brand" href="/" aria-label="AuraTrip home">
          <Image src="/figma/auratrip.svg" width={30} height={30} alt="image of the AuraTrip compass logo" />
          <span>AuraTrip</span>
        </Link>
        <p className="site-footer__note">Sample itineraries for planning inspiration.</p>
      </footer>
    </>
  );
}
