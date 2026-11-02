import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TripResults } from "@/components/trip-results";
import { trips } from "@/lib/trips";

const featuredTours = [
  { name: "Venice Canal Tour", image: "barcelona.png", imageAlt: "image of a stone arch bridge over a narrow canal between historic waterfront buildings", size: "large", activities: "196 Activities", rating: "3.5" },
  { name: "London, England", image: "london.png", imageAlt: "image of Tower Bridge spanning the River Thames in London", size: "medium", activities: "196 Activities", rating: "3.5" },
  { name: "Coastal Ruins Tour", image: "australia.png", imageAlt: "image of weathered stone ruins on a rocky coastline above a deep blue sea", size: "medium", activities: "196 Activities", rating: "3.5" },
  { name: "Venice City Tour", image: "australia-alt.png", imageAlt: "image of terracotta-roofed buildings beside a Venetian canal", size: "small", activities: "196 Activities", rating: "3.5" },
  { name: "Coastal Village Tour", image: "japan.png", imageAlt: "image of a pastel coastal village on a rocky headland above turquoise water", size: "small", activities: "196 Activities", rating: "3.5" },
  { name: "Bangkok Temple Tour", image: "japan-alt.png", imageAlt: "image of ornate Thai temple roofs and golden spires against a blue sky", size: "small", activities: "196 Activities", rating: "3.5" },
];

function Brand() {
  return (
    <Link className="brand" href="/#top" aria-label="AuraTrip home">
      <Image src="/figma/auratrip.svg" width={30} height={30} alt="image of the AuraTrip compass logo" priority />
      <span>AuraTrip</span>
    </Link>
  );
}

function FeaturedTour({ tour }: { tour: (typeof featuredTours)[number] }) {
  return (
    <article className={`featured-tour featured-tour--${tour.size}`}>
      <Image
        className="featured-tour__image"
        src={`/figma/${tour.image}`}
        alt={tour.imageAlt}
        fill
        sizes={tour.size === "large" ? "(max-width: 760px) 100vw, 70vw" : "(max-width: 760px) 100vw, 25vw"}
      />
      <div className="featured-tour__shade" aria-hidden="true" />
      <div className="featured-tour__content">
        <span className="rating" aria-label={`${tour.rating} out of 5 rating`}>{tour.rating}</span>
        <div className="featured-tour__details">
          <h3>{tour.name}</h3>
          <p>
            {tour.size === "large" ? (
              <span className="activity-avatar"><Image src="/figma/activity-avatar.png" width={43} height={29} alt="image of a traveler wearing glasses and a green sweater" /></span>
            ) : (
              <Image src={tour.size === "medium" ? "/figma/activity-dot.png" : "/figma/activity-dot-alt.png"} width={tour.size === "medium" ? 20 : 16} height={tour.size === "medium" ? 20 : 16} alt="image of a traveler wearing glasses and a green sweater" />
            )}
            {tour.activities}
          </p>
        </div>
      </div>
    </article>
  );
}

function TripListingFallback() {
  return (
    <section className="page-section trips-section" id="trips" aria-labelledby="trips-heading">
      <div className="section-heading">
        <h2 id="trips-heading">Handpicked Trips</h2>
        <p>Browse well-planned trips designed for different travel styles and interests</p>
      </div>
      <p role="status" aria-live="polite">Loading handpicked trips.</p>
    </section>
  );
}

async function TripListing({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const query = await searchParams;
  const pageCount = Math.ceil(trips.length / 8);
  const rawPage = query.page;
  const requestedPage = typeof rawPage === "string" && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN;
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pageCount)
    : 1;
  const preservedParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (key === "page" || value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => preservedParams.append(key, item));
    else preservedParams.set(key, value);
  }

  if (rawPage !== undefined && (Array.isArray(rawPage) || rawPage !== String(currentPage))) {
    preservedParams.set("page", String(currentPage));
    redirect(`/?${preservedParams.toString()}`);
  }

  return (
    <section className="page-section trips-section" id="trips" aria-labelledby="trips-heading">
      <div className="section-heading">
        <h2 id="trips-heading">Handpicked Trips</h2>
        <p>Browse well-planned trips designed for different travel styles and interests</p>
      </div>
      <TripResults trips={trips} currentPage={currentPage} queryString={preservedParams.toString()} />
    </section>
  );
}

export default function Home({ searchParams }: PageProps<"/">) {
  const smallTours = featuredTours.slice(1);

  return (
    <>
      <Link className="skip-link" href="#main-content">Skip to main content</Link>
      <header className="hero" id="top">
        <Image className="hero__image" src="/figma/hero-free-stock.jpg" alt="image of snow-covered mountain peaks rising above an evergreen forest at sunrise" fill priority sizes="100vw" />
        <div className="hero__wash" aria-hidden="true" />
        <nav className="site-nav" aria-label="Primary navigation">
          <Brand />
          <div className="site-nav__actions">
            <Image className="profile-image" src="/figma/profile.png" alt="image of logged-in John Doe" width={40} height={40} />
            <Button className="logout-button" variant="ghost" size="icon" aria-label="Log out" disabled>
              <Image src="/figma/logout.svg" width={24} height={24} alt="" aria-hidden="true" />
            </Button>
          </div>
        </nav>
        <div className="hero__copy">
          <h1>Plan Your<br />Trip with Ease</h1>
          <p>Customize your travel itinerary in minutes—pick your destination, set your preferences, and explore with confidence.</p>
          <Button className="primary-cta" size="lg" render={<Link href="#destinations" />}>
            Get Started
          </Button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="page-section featured-section" id="destinations" aria-labelledby="featured-heading">
          <div className="section-heading">
            <h2 id="featured-heading">Featured Travel Destinations</h2>
            <p>Check out some of the best places you can visit around the world.</p>
          </div>
          <div className="featured-grid">
            <div className="featured-grid__main">
              <FeaturedTour tour={featuredTours[0]} />
              <div className="featured-grid__pair">
                {smallTours.slice(0, 2).map((tour, index) => <FeaturedTour key={`${tour.name}-${index}`} tour={tour} />)}
              </div>
            </div>
            <div className="featured-grid__side">
              {smallTours.slice(2).map((tour, index) => <FeaturedTour key={`${tour.name}-${index}`} tour={tour} />)}
            </div>
          </div>
        </section>

        <Suspense fallback={<TripListingFallback />}>
          <TripListing searchParams={searchParams} />
        </Suspense>
      </main>

      <footer className="site-footer">
        <Brand />
        <p className="site-footer__note">Sample itineraries for planning inspiration.</p>
      </footer>
    </>
  );
}
