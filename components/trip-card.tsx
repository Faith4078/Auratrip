import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Trip } from "@/lib/trips";

export function TripCard({ trip }: { trip: Trip }) {
  const pricePerPerson = formatPrice(trip.pricePerPerson.amount, trip.pricePerPerson.currency);

  return (
    <article className="trip-card">
      <Link className="trip-card__image" href={`/trips/${trip.slug}`} aria-label={`View trip: ${trip.name}. From ${pricePerPerson} per person.`}>
        <Image src={`/figma/${trip.image}`} alt={trip.imageAlt} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 25vw" />
        <span className="trip-card__price">
          From&nbsp;{pricePerPerson}
        </span>
      </Link>
      <div className="trip-card__body">
        <h3><Link href={`/trips/${trip.slug}`} aria-label={`View trip: ${trip.name}`}>{trip.name}</Link></h3>
        <p className="trip-card__location">
          <Image src="/figma/location.svg" width={16} height={16} alt="" aria-hidden="true" />
          <span>{trip.location}</span>
        </p>
        <p className="trip-card__duration">{trip.durationDays} days · {trip.durationDays - 1} nights</p>
        <p className="trip-card__summary">{trip.summary}</p>
        <ul className="trip-card__tags" aria-label="Trip categories">
          {trip.tags.slice(0, 2).map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
