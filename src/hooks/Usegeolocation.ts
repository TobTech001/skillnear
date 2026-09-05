import { useState } from "react";
import { DEFAULT_CENTER } from "../data/providers";

export type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unsupported";

interface GeoState {
  latitude: number;
  longitude: number;
  status: GeoStatus;
  /** True once we're using the real, permission-granted location. */
  isPrecise: boolean;
  requestLocation: () => void;
}

/**
 * Gives components the customer's coordinates when they opt in, falling
 * back to a fixed Ibadan centre point otherwise \u2014 so distance sorting
 * always has something to work with, real or approximate.
 */
export function useGeolocation(): GeoState {
  const [coords, setCoords] = useState({
    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,
  });
  const [status, setStatus] = useState<GeoStatus>("idle");

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("granted");
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  return {
    ...coords,
    status,
    isPrecise: status === "granted",
    requestLocation,
  };
}