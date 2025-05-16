"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

interface MapPickerProps {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const [position, setPosition] = useState<LatLngExpression>([
    value.lat,
    value.lng,
  ]);

  useEffect(() => {
    setPosition([value.lat, value.lng]);
  }, [value]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const coords = e.latlng;
        setPosition([coords.lat, coords.lng]);
        onChange({ lat: coords.lat, lng: coords.lng });
      },
    });

    return <Marker position={position} />;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      scrollWheelZoom={false}
      markerZoomAnimation={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}
