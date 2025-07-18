// Source for boundary data https://localboundries.oknp.org/

import { useEffect, useState } from "react";
import * as turf from "@turf/turf";

export const useLocalGovernment = () => {
  const [localGov, setLocalGov] = useState(null);

  useEffect(() => {
    const detectLocalGov = async () => {
      try {
        const [butwal, tilottama, omsatiya, siddharthanagar] =
          await Promise.all([
            fetch("/geojson/butwal.json").then((res) => res.json()),
            fetch("/geojson/tilottama.json").then((res) => res.json()),
            fetch("/geojson/omsatiya.json").then((res) => res.json()),
            fetch("/geojson/siddharthanagar.json").then((res) => res.json()),
          ]);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const point = turf.point([
              pos.coords.longitude,
              pos.coords.latitude,
            ]);

            const matched = [butwal, tilottama, omsatiya, siddharthanagar].find(
              (gj) => turf.booleanPointInPolygon(point, gj)
            );

            const name = matched?.properties?.GaPa_NaPa || "Unknown";
            setLocalGov(name);
          },
          (err) => {
            console.error("Geolocation Error", err.message);
            setLocalGov("Location Access Denied");
          }
        );
      } catch (err) {
        console.error("Boundary fetch failed", err);
        setLocalGov("Detection Failed");
      }
    };

    detectLocalGov();
  }, []);

  return localGov;
};
