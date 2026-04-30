export function LumaMapLink({
  googleMapsPlaceId,
}: {
  googleMapsPlaceId: string;
}) {
  const url = `https://www.google.com/maps/place/?q=place_id:${googleMapsPlaceId}`;
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-32 shrink-0 text-sm font-medium text-text-secondary">
        Map
      </dt>
      <dd className="text-sm">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent no-underline hover:underline"
        >
          View on Google Maps
        </a>
      </dd>
    </div>
  );
}
