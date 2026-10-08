import airportDirectory from "airports-json/data/airports.json";

type AirportRecord = {
  id: string;
  name: string;
  municipality: string;
  iso_country: string;
  iata_code: string;
  scheduled_service: string;
};

const airports: AirportRecord[] = airportDirectory;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
    .get("q")
    ?.trim()
    .toLowerCase();

  if (!query || query.length < 2) {
    return Response.json({ airports: [] });
  }

  const matchingAirports = airports
    .filter(
      (airport) =>
        airport.iata_code &&
        airport.municipality &&
        (airport.municipality.toLowerCase().includes(query) ||
          airport.name.toLowerCase().includes(query) ||
          airport.iata_code.toLowerCase().startsWith(query)),
    )
    .sort((first, second) => {
      const getRelevance = (airport: AirportRecord) => {
        const city = airport.municipality.toLowerCase();
        const name = airport.name.toLowerCase();
        const code = airport.iata_code.toLowerCase();

        if (code === query) return 0;
        if (city.startsWith(query)) return 1;
        if (code.startsWith(query)) return 2;
        if (name.startsWith(query)) return 3;
        return 4;
      };
      const relevanceDifference =
        getRelevance(first) - getRelevance(second);

      if (relevanceDifference !== 0) {
        return relevanceDifference;
      }

      if (first.scheduled_service !== second.scheduled_service) {
        return first.scheduled_service === "yes" ? -1 : 1;
      }

      return first.municipality.localeCompare(second.municipality);
    })
    .slice(0, 12)
    .map(({ id, name, municipality, iso_country, iata_code }) => ({
      id,
      name,
      city: municipality,
      countryCode: iso_country,
      code: iata_code,
    }));

  return Response.json({ airports: matchingAirports });
}
