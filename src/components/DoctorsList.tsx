
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Phone, Star } from "lucide-react";

const MOCK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    location: "123 Medical Center, Downtown",
    rating: 4.8,
    distance: "0.8 miles",
    availability: "Today",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    location: "456 Health Plaza, Uptown",
    rating: 4.9,
    distance: "1.2 miles",
    availability: "Tomorrow",
  },
  {
    id: 3,
    name: "Dr. Emily Martinez",
    specialty: "Family Medicine",
    location: "789 Care Avenue, Midtown",
    rating: 4.7,
    distance: "1.5 miles",
    availability: "Today",
  },
];

const DoctorsList = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Available Doctors Near You
      </h2>
      <div className="space-y-4">
        {MOCK_DOCTORS.map((doctor) => (
          <Card key={doctor.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{doctor.distance}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Available {doctor.availability}
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button className="w-full">Book Now</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
