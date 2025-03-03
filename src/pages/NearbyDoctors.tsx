// import { useEffect, useState, useCallback } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface Doctor {
//   id: string;
//   name: string;
//   address: string;
//   lat: number;
//   lng: number;
//   distance: number;
//   type: string;
// }

// const NearbyDoctors = () => {
//   const [userLocation, setUserLocation] = useState<Location | null>(null);
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const { toast } = useToast();
//   const [locationError, setLocationError] = useState<string>("");
//   const [isLocating, setIsLocating] = useState(false);

//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//     language: "ar",
//     region: "EG",
//   });

//   const defaultLocation = {
//     lat: 30.0444, // Cairo, Egypt coordinates
//     lng: 31.2357,
//   };

//   const fetchNearbyDoctors = async (lat: number, lng: number) => {
//     try {
//       setIsLoading(true);
//       const query = `
//         [out:json][timeout:25];
//         (
//           // Hospitals and clinics
//           way["amenity"="hospital"](around:10000,${lat},${lng});
//           way["amenity"="clinic"](around:10000,${lat},${lng});
//           node["amenity"="hospital"](around:10000,${lat},${lng});
//           node["amenity"="clinic"](around:10000,${lat},${lng});

//           // Doctors and medical centers
//           node["healthcare"="doctor"](around:10000,${lat},${lng});
//           node["healthcare"="centre"](around:10000,${lat},${lng});
//           way["healthcare"="centre"](around:10000,${lat},${lng});

//           // Specific doctor specialties
//           node["healthcare:speciality"="gastroenterologist"](around:10000,${lat},${lng});
//           node["healthcare:speciality"="internal"](around:10000,${lat},${lng});

//           // Medical specialty centers
//           way["name"~"."](around:10000,${lat},${lng})["name:ar"~"كبد|باطنة|مستشفى|عيادة|طبيب",i];
//           node["name"~"."](around:10000,${lat},${lng})["name:ar"~"كبد|باطنة|مستشفى|عيادة|طبيب",i];
//         );
//         out body;
//         >;
//         out skel qt;
//       `;

//       const response = await fetch("https://overpass-api.de/api/interpreter", {
//         method: "POST",
//         body: query,
//       });

//       const data = await response.json();

//       const doctors: Doctor[] = data.elements
//         .filter(
//           (item: any) => item.tags && (item.tags.name || item.tags["name:ar"])
//         )
//         .map((item: any) => ({
//           id: item.id.toString(),
//           name: item.tags["name:ar"] || item.tags.name, // Prefer Arabic name if available
//           address: item.tags["addr:street"]
//             ? `${item.tags["addr:street"]} ${
//                 item.tags["addr:housenumber"] || ""
//               }`
//             : "Address not available",
//           lat: item.lat || item.center?.lat,
//           lng: item.lon || item.center?.lon,
//           distance: calculateDistance(
//             lat,
//             lng,
//             item.lat || item.center?.lat,
//             item.lon || item.center?.lon
//           ),
//           type: getLocationType(item.tags),
//         }))
//         .filter((doctor: Doctor) => doctor.lat && doctor.lng); // Filter out invalid coordinates

//       setDoctors(doctors);

//       if (doctors.length === 0) {
//         toast({
//           title: "No Results",
//           description:
//             "No medical facilities found. Try increasing search radius.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch nearby facilities",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getLocationType = (tags: any) => {
//     if (tags["healthcare:speciality"]) {
//       return `طبيب ${tags["healthcare:speciality"]}`;
//     }
//     if (tags.amenity === "hospital") {
//       return "مستشفى";
//     }
//     if (tags.amenity === "clinic") {
//       return "عيادة";
//     }
//     if (tags.healthcare === "doctor") {
//       return "طبيب";
//     }
//     return tags.amenity || tags.healthcare || "مركز طبي";
//   };

//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c * 1000;
//   };

//   const requestLocation = useCallback(() => {
//     setIsLocating(true);
//     setLocationError("");

//     const options = {
//       enableHighAccuracy: true,
//       timeout: 10000, // Increased timeout to 10 seconds
//       maximumAge: 0,
//     };

//     const handleSuccess = (position: GeolocationPosition) => {
//       const { latitude, longitude } = position.coords;
//       console.log("Got location:", latitude, longitude); // Debug log
//       setUserLocation({ lat: latitude, lng: longitude });
//       fetchNearbyDoctors(latitude, longitude);
//       setIsLocating(false);
//     };

//     const handleError = (error: GeolocationPositionError) => {
//       console.error("Location error:", error); // Debug log
//       setLocationError(error.message);
//       setUserLocation(defaultLocation);
//       fetchNearbyDoctors(defaultLocation.lat, defaultLocation.lng);
//       setIsLocating(false);
//       toast({
//         title: "Location Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     };

//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       setUserLocation(defaultLocation);
//       fetchNearbyDoctors(defaultLocation.lat, defaultLocation.lng);
//       setIsLocating(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       handleSuccess,
//       handleError,
//       options
//     );
//   }, []);

//   useEffect(() => {
//     requestLocation();
//   }, [requestLocation]);

//   if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">خطأ</h2>
//         <p className="text-red-500">
//           مفتاح API غير موجود. يرجى إضافة VITE_GOOGLE_MAPS_API_KEY في ملف .env
//         </p>
//       </div>
//     );
//   }

//   if (loadError) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Error</h2>
//         <p className="text-red-500">
//           Failed to load Google Maps. Please check your API key and try again.
//         </p>
//       </div>
//     );
//   }

//   if (!isLoaded || isLoading) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           Nearby Medical Facilities
//         </h2>
//         <div className="p-8 text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Nearby Medical Facilities</h2>
//           <button
//             onClick={requestLocation}
//             disabled={isLocating}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
//           >
//             {isLocating ? "Getting Location..." : "Update Location"}
//           </button>
//         </div>

//         {locationError && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
//             {locationError}
//           </div>
//         )}

//         <div
//           style={{ height: "70vh", borderRadius: "0.5rem", overflow: "hidden" }}
//         >
//           <GoogleMap
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={userLocation || { lat: 0, lng: 0 }}
//             zoom={13}
//             options={{
//               disableDefaultUI: true,
//               zoomControl: true,
//               streetViewControl: true,
//             }}
//           >
//             {userLocation && (
//               <Marker
//                 position={userLocation}
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                 }}
//               />
//             )}

//             {doctors.map((doctor) => (
//               <Marker
//                 key={doctor.id}
//                 position={{ lat: doctor.lat, lng: doctor.lng }}
//                 onClick={() => setSelectedDoctor(doctor)}
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//                 }}
//               />
//             ))}

//             {selectedDoctor && (
//               <InfoWindow
//                 position={{ lat: selectedDoctor.lat, lng: selectedDoctor.lng }}
//                 onCloseClick={() => setSelectedDoctor(null)}
//               >
//                 <div className="p-2 max-w-xs">
//                   <h3 className="font-bold text-lg">{selectedDoctor.name}</h3>
//                   <p className="text-sm mt-1">{selectedDoctor.address}</p>
//                   <p className="text-sm text-blue-600">
//                     Distance: {(selectedDoctor.distance / 1000).toFixed(1)} km
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {selectedDoctor.type}
//                   </p>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         </div>

//         <div className="mt-4">
//           <p className="text-sm text-gray-600 mb-4">
//             Found {doctors.length} facilities in your area
//           </p>
//           <div className="grid gap-2">
//             {doctors.map((doctor) => (
//               <div
//                 key={doctor.id}
//                 className="text-sm bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100"
//                 onClick={() => setSelectedDoctor(doctor)}
//               >
//                 <strong>{doctor.name}</strong>
//                 <p className="text-xs text-gray-600">{doctor.address}</p>
//                 <p className="text-xs text-gray-500">
//                   {(doctor.distance / 1000).toFixed(1)} km
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NearbyDoctors;
/////////////////////////////////////////////////////////////////////////////
// MapWithDoctors.tsx
// MapWithLiverDoctors.tsx
// MapWithLiverDoctors.tsx
// MapWithLiverDoctors.tsx
///////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useGeolocation, Position } from "../hooks/useGeolocation";
// import "leaflet/dist/leaflet.css";

// interface Doctor {
//   id: number;
//   name: string;
//   position: Position;
// }

// const MapWithLiverDoctors: React.FC = () => {
//   const { isLoading, position, error, getPosition } = useGeolocation();
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctorError, setDoctorError] = useState<string | null>(null);

//   const fetchDoctors = async (query: string) => {
//     try {
//       const response = await fetch("https://overpass-api.de/api/interpreter", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: `data=${encodeURIComponent(query)}`,
//       });
//       const data = await response.json();
//       console.log("Overpass API response:", data);
//       if (!data.elements) throw new Error("No elements returned");
//       const fetchedDoctors: Doctor[] = data.elements.map((element: any) => ({
//         id: element.id,
//         name:
//           element.tags && element.tags.name
//             ? element.tags.name
//             : "Unnamed Doctor",
//         position: { lat: element.lat, lng: element.lon },
//       }));
//       return fetchedDoctors;
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setDoctorError("Error fetching doctor data.");
//       return [];
//     }
//   };

//   // Primary query: search for nodes with hepatology specialty.
//   const fetchLiverDoctors = async () => {
//     if (!position) return;
//     setLoadingDoctors(true);
//     setDoctorError(null);

//     // Bounding box for Cairo: south,west,north,east
//     const bbox = "29.90,30.90,30.20,31.40";
//     const primaryQuery = `
//       [out:json][timeout:25];
//       (
//         node["healthcare:speciality"="hepatology"](${bbox});
//       );
//       out body;
//     `;

//     let results = await fetchDoctors(primaryQuery);

//     // If no results, try a broader query using hospitals as fallback.
//     if (results.length === 0) {
//       console.log(
//         "No hepatology-specific data found. Trying a broader query..."
//       );
//       const fallbackQuery = `
//         [out:json][timeout:25];
//         (
//           node["amenity"="hospital"](${bbox});
//         );
//         out body;
//       `;
//       results = await fetchDoctors(fallbackQuery);
//     }
//     setDoctors(results);
//     setLoadingDoctors(false);
//   };

//   // Get user's current position on mount.
//   useEffect(() => {
//     getPosition();
//   }, []);

//   // When position is updated, fetch doctors.
//   useEffect(() => {
//     if (position) {
//       console.log("User position acquired:", position);
//       fetchLiverDoctors();
//     }
//   }, [position]);

//   // Use user's position if available, otherwise default to Cairo.
//   const center: Position = position || { lat: 30.0444, lng: 31.2357 };

//   return (
//     <div>
//       {isLoading && <p>Loading your location...</p>}
//       {error && <p>Error: {error}</p>}
//       {loadingDoctors && <p>Loading doctors data...</p>}
//       {doctorError && <p>{doctorError}</p>}
//       <MapContainer
//         center={center}
//         zoom={13}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Marker for user's current location */}
//         {position && (
//           <Marker position={position}>
//             <Popup>Your Location</Popup>
//           </Marker>
//         )}

//         {/* Markers for doctors */}
//         {doctors.length > 0
//           ? doctors.map((doctor) => (
//               <Marker key={doctor.id} position={doctor.position}>
//                 <Popup>{doctor.name}</Popup>
//               </Marker>
//             ))
//           : !loadingDoctors &&
//             position && (
//               <Popup position={center}>No doctors found in this area.</Popup>
//             )}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapWithLiverDoctors;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MapWithLiverDoctors.tsx
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import { useGeolocation, Position } from "../hooks/useGeolocation";
// import "leaflet/dist/leaflet.css";

// interface Doctor {
//   id: number;
//   name: string;
//   position: Position;
// }

// // Custom icons for user and doctors
// const userIcon = L.icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// const doctorIcon = L.icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// // Optional component to smoothly fly to the new center when updated.
// const FlyToLocation: React.FC<{ center: LatLngExpression }> = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.flyTo(center, 13, { duration: 2 });
//   }, [center, map]);
//   return null;
// };

// const NearbyDoctors: React.FC = () => {
//   const { isLoading, position, error, getPosition } = useGeolocation();
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctorError, setDoctorError] = useState<string | null>(null);

//   // Helper to build a bounding box around the user's position.
//   // Offset is in degrees (adjust for desired radius)
//   const buildBBox = (pos: Position, offset = 0.02): string => {
//     const south = pos.lat - offset;
//     const north = pos.lat + offset;
//     const west = pos.lng - offset;
//     const east = pos.lng + offset;
//     return `${south},${west},${north},${east}`;
//   };

//   const fetchDoctors = async (query: string) => {
//     try {
//       const response = await fetch("https://overpass-api.de/api/interpreter", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: `data=${encodeURIComponent(query)}`,
//       });
//       const data = await response.json();
//       console.log("Overpass API response:", data);
//       if (!data.elements) throw new Error("No elements returned");
//       const fetchedDoctors: Doctor[] = data.elements.map((element: any) => ({
//         id: element.id,
//         name: element.tags?.name || "Unnamed Doctor",
//         position: { lat: element.lat, lng: element.lon },
//       }));
//       return fetchedDoctors;
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setDoctorError("Error fetching doctor data.");
//       return [];
//     }
//   };

//   // Fetch liver doctors within a bounding box around the user.
//   const fetchLiverDoctors = async () => {
//     if (!position) return;
//     setLoadingDoctors(true);
//     setDoctorError(null);

//     const bbox = buildBBox(position, 0.02);
//     const query = `
//       [out:json][timeout:25];
//       (
//         node["healthcare:speciality"="hepatology"](${bbox});
//       );
//       out body;
//     `;
//     let results = await fetchDoctors(query);

//     // Fallback: broader query (hospitals) if no hepatology data is found.
//     if (results.length === 0) {
//       console.log("No hepatology data found nearby. Trying fallback query...");
//       const fallbackQuery = `
//         [out:json][timeout:25];
//         (
//           node["amenity"="hospital"](${bbox});
//         );
//         out body;
//       `;
//       results = await fetchDoctors(fallbackQuery);
//     }
//     setDoctors(results);
//     setLoadingDoctors(false);
//   };

//   // Get user's location on mount.
//   useEffect(() => {
//     getPosition();
//   }, []);

//   // When position updates, fetch nearby doctors.
//   useEffect(() => {
//     if (position) {
//       console.log("User position acquired:", position);
//       fetchLiverDoctors();
//     }
//   }, [position]);

//   // Center of the map: user's position or default (Cairo).
//   const center: Position = position || { lat: 30.0444, lng: 31.2357 };

//   return (
//     <div className="flex flex-col h-screen p-4">
//       {/* Info section */}
//       <div className="mb-4">
//         {isLoading && <p className="text-blue-600">Loading your location...</p>}
//         {error && <p className="text-red-600">Error: {error}</p>}
//         {loadingDoctors && (
//           <p className="text-blue-600">Loading doctors data...</p>
//         )}
//         {doctorError && <p className="text-red-600">{doctorError}</p>}
//       </div>
//       {/* Map Container */}
//       <div className="flex-1 rounded-lg border border-gray-300 overflow-hidden">
//         <MapContainer center={center} zoom={13} className="w-full h-full">
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <FlyToLocation center={center} />
//           {position && (
//             <Marker position={position} icon={userIcon}>
//               <Popup>Your Location</Popup>
//             </Marker>
//           )}
//           {doctors.map((doctor) => (
//             <Marker
//               key={doctor.id}
//               position={doctor.position}
//               icon={doctorIcon}
//             >
//               <Popup>{doctor.name}</Popup>
//             </Marker>
//           ))}
//           {!loadingDoctors && doctors.length === 0 && position && (
//             <Popup position={center}>No nearby liver doctors found.</Popup>
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// export default NearbyDoctors;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MapWithLiverDoctors.tsx
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import { useGeolocation, Position } from "../hooks/useGeolocation";
// import "leaflet/dist/leaflet.css";

// // Define the Doctor interface
// interface Doctor {
//   id: number;
//   name: string;
//   position: Position;
// }

// // Custom icons for user and doctor markers
// const userIcon = L.icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// const doctorIcon = L.icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// // Component for smooth transition when the map center updates.
// const FlyToLocation: React.FC<{ center: LatLngExpression }> = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.flyTo(center, 13, { duration: 2 });
//   }, [center, map]);
//   return null;
// };

// const NearbyDoctors: React.FC = () => {
//   const { isLoading, position, error, getPosition } = useGeolocation();
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctorError, setDoctorError] = useState<string | null>(null);

//   // Build a bounding box around the user's position with an offset corresponding to ~40km.
//   // 1° latitude ~111km, so 40km ≈ 0.36°
//   const buildLargeBBox = (pos: Position, offset = 0.36): string => {
//     const south = pos.lat - offset;
//     const north = pos.lat + offset;
//     const west = pos.lng - offset;
//     const east = pos.lng + offset;
//     return `${south},${west},${north},${east}`;
//   };

//   const fetchDoctors = async (query: string) => {
//     try {
//       const response = await fetch("https://overpass-api.de/api/interpreter", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: `data=${encodeURIComponent(query)}`,
//       });
//       const data = await response.json();
//       console.log("Overpass API response:", data);
//       if (!data.elements) throw new Error("No elements returned");
//       const fetchedDoctors: Doctor[] = data.elements.map((element: any) => ({
//         id: element.id,
//         name: element.tags?.name || "Unnamed Doctor",
//         position: { lat: element.lat, lng: element.lon },
//       }));
//       return fetchedDoctors;
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setDoctorError("Error fetching doctor data.");
//       return [];
//     }
//   };

//   // Fetch liver doctors using a large-scale bounding box (~40km lat)
//   const fetchLiverDoctors = async () => {
//     if (!position) return;
//     setLoadingDoctors(true);
//     setDoctorError(null);

//     const bbox = buildLargeBBox(position, 0.36);
//     const query = `
//       [out:json][timeout:25];
//       (
//         node["healthcare:speciality"="hepatology"](${bbox});
//       );
//       out body;
//     `;
//     let results = await fetchDoctors(query);

//     // Fallback query: search for hospitals if no hepatology-specific nodes are found.
//     if (results.length === 0) {
//       console.log("No hepatology data found nearby. Trying fallback query...");
//       const fallbackQuery = `
//         [out:json][timeout:25];
//         (
//           node["amenity"="hospital"](${bbox});
//         );
//         out body;
//       `;
//       results = await fetchDoctors(fallbackQuery);
//     }
//     setDoctors(results);
//     setLoadingDoctors(false);
//   };

//   // Get user's position on mount.
//   useEffect(() => {
//     getPosition();
//   }, []);

//   // Fetch doctors whenever the position updates.
//   useEffect(() => {
//     if (position) {
//       console.log("User position acquired:", position);
//       fetchLiverDoctors();
//     }
//   }, [position]);

//   // Center the map on user's position or default to Cairo.
//   const center: Position = position || { lat: 30.0444, lng: 31.2357 };

//   return (
//     <div className="flex flex-col h-screen p-4">
//       <h1 className="text-xl font-bold text-center mb-4">
//         Nearby Liver Doctors
//       </h1>
//       {isLoading && <p className="text-center">Loading your location...</p>}
//       {error && <p className="text-center text-red-500">Error: {error}</p>}
//       {loadingDoctors && <p className="text-center">Loading doctors data...</p>}
//       {doctorError && <p className="text-center text-red-500">{doctorError}</p>}
//       <div className="flex-1 border rounded-lg overflow-hidden">
//         <MapContainer center={center} zoom={13} className="w-full h-full">
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <FlyToLocation center={center} />
//           {position && (
//             <Marker position={position} icon={userIcon}>
//               <Popup>Your Location</Popup>
//             </Marker>
//           )}
//           {doctors.map((doctor) => (
//             <Marker
//               key={doctor.id}
//               position={doctor.position}
//               icon={doctorIcon}
//             >
//               <Popup>{doctor.name}</Popup>
//             </Marker>
//           ))}
//           {!loadingDoctors && doctors.length === 0 && position && (
//             <Popup position={center}>No nearby liver doctors found.</Popup>
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// export default NearbyDoctors;
// ////////////////////////////////////////////////////////////////

// MapWithLiverDoctors.tsx
// MapWithHospitals.tsx
// MapWithHospitals.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useGeolocation, Position } from "../hooks/useGeolocation";
import "leaflet/dist/leaflet.css";

// Define the Hospital interface
interface Hospital {
  id: number;
  name: string;
  position: Position;
  // Optionally, you can add a rating property if you have that data
  rating?: number;
}

// Custom icons for user and hospital markers
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Sample user icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Changed hospital icon to a different one
const hospitalIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png", // Alternative hospital icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component for smooth transition when the map center updates.
const FlyToLocation: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 2 });
  }, [center, map]);
  return null;
};

const NearbyDoctors: React.FC = () => {
  const { isLoading, position, error, getPosition } = useGeolocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [hospitalError, setHospitalError] = useState<string | null>(null);

  // Build a large bounding box around the user's position.
  // Offset: 0.5 degrees ≈ 55km each side (approx. 110km across)
  const buildLargeBBox = (pos: Position, offset = 0.5): string => {
    const south = pos.lat - offset;
    const north = pos.lat + offset;
    const west = pos.lng - offset;
    const east = pos.lng + offset;
    return `${south},${west},${north},${east}`;
  };

  // Function to fetch hospital data using the Overpass API.
  const fetchHospitals = async (query: string) => {
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });
      const data = await response.json();
      console.log("Overpass API response:", data);
      if (!data.elements) throw new Error("No elements returned");
      const fetchedHospitals: Hospital[] = data.elements.map(
        (element: any) => ({
          id: element.id,
          name: element.tags?.name || "Unnamed Hospital",
          position: { lat: element.lat, lng: element.lon },
        })
      );
      return fetchedHospitals;
    } catch (err) {
      console.error("Error fetching data:", err);
      setHospitalError("Error fetching hospital data.");
      return [];
    }
  };

  // Fetch hospitals using a large-scale bounding box.
  const fetchNearbyHospitals = async () => {
    if (!position) return;
    setLoadingHospitals(true);
    setHospitalError(null);

    const bbox = buildLargeBBox(position, 0.5); // Large search area
    // Overpass API query for hospitals
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](${bbox});
      );
      out body;
    `;
    let results = await fetchHospitals(query);

    // Simulate "top rated" by sorting by name alphabetically and taking the first 10 (replace this with real rating logic if available)
    results = results.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);

    setHospitals(results);
    setLoadingHospitals(false);
  };

  // Get user's position on mount.
  useEffect(() => {
    getPosition();
  }, []);

  // Fetch hospitals whenever the position updates.
  useEffect(() => {
    if (position) {
      console.log("User position acquired:", position);
      fetchNearbyHospitals();
    }
  }, [position]);

  // Center the map on user's position or default to Cairo.
  const center: Position = position || { lat: 30.0444, lng: 31.2357 };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        Top 10 Nearby Hospitals
      </h1>
      {isLoading && <p className="text-center">Loading your location...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {loadingHospitals && (
        <p className="text-center">Loading hospital data...</p>
      )}
      {hospitalError && (
        <p className="text-center text-red-500">{hospitalError}</p>
      )}
      <div className="flex-1 border rounded-lg overflow-hidden">
        <MapContainer center={center} zoom={10} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToLocation center={center} />
          {position && (
            <Marker position={position} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={hospital.position}
              icon={hospitalIcon}
            >
              <Popup>{hospital.name}</Popup>
            </Marker>
          ))}
          {!loadingHospitals && hospitals.length === 0 && position && (
            <Popup position={center}>No hospitals found in the area.</Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default NearbyDoctors;
