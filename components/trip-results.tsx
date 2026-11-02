import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { Button } from "@/components/ui/button";
import type { Trip } from "@/lib/trips";

const ITEMS_PER_PAGE = 8;

export function TripResults({ trips, currentPage, queryString }: { trips: Trip[]; currentPage: number; queryString: string }) {
  const pageCount = Math.ceil(trips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleTrips = trips.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const firstItem = trips.length === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(startIndex + ITEMS_PER_PAGE, trips.length);
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams(queryString);
    params.set("page", String(targetPage));
    return `/?${params.toString()}`;
  };

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {trips.length === 0 ? "No trips are available." : `Showing trips ${firstItem} through ${lastItem} of ${trips.length}. Page ${currentPage} of ${pageCount}.`}
      </p>
      <ul className="trip-grid" aria-label="Handpicked trips">
        {visibleTrips.map((trip) => <li key={trip.id}><TripCard trip={trip} /></li>)}
      </ul>
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Trip pages">
          {currentPage > 1 ? (
            <Button variant="outline" className="pagination__button" aria-label="Previous page" render={<Link href={pageHref(currentPage - 1)} scroll={false} />}>
              <ArrowLeft className="pagination__arrow" aria-hidden="true" />
              <span>Previous</span>
            </Button>
          ) : (
            <Button variant="outline" className="pagination__button" aria-label="Previous page" disabled>
              <ArrowLeft className="pagination__arrow" aria-hidden="true" />
              <span>Previous</span>
            </Button>
          )}
          <ol className="pagination__pages" aria-label="Choose a trip page">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <li key={pageNumber}>
                <Button
                  variant="default"
                  className={`pagination__page${pageNumber === currentPage ? " is-current" : ""}`}
                  aria-label={`Page ${pageNumber}${pageNumber === currentPage ? ", current page" : ""}`}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  render={<Link href={pageHref(pageNumber)} scroll={false} />}
                >{pageNumber}</Button>
              </li>
            ))}
          </ol>
          {currentPage < pageCount ? (
            <Button variant="outline" className="pagination__button" aria-label="Next page" render={<Link href={pageHref(currentPage + 1)} scroll={false} />}>
              <span>Next</span>
              <ArrowRight className="pagination__arrow" aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="outline" className="pagination__button" aria-label="Next page" disabled>
              <span>Next</span>
              <ArrowRight className="pagination__arrow" aria-hidden="true" />
            </Button>
          )}
        </nav>
      )}
    </>
  );
}
