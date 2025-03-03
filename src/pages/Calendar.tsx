import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Event = {
  id: number;
  title: string;
  date: Date;
  type: "appointment" | "medication" | "exercise" | "other";
  priority: "high" | "medium" | "low";
  notes?: string;
  reminder: boolean;
  description?: string;
  location?: string;
  duration?: number;
};

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Cardiology Appointment",
    date: new Date(2024, 1, 15),
    type: "appointment",
    priority: "high",
    notes: "Bring latest test results",
    reminder: true,
  },
  {
    id: 2,
    title: "Take Blood Pressure Medicine",
    date: new Date(2024, 1, 15),
    type: "medication",
    priority: "high",
    reminder: true,
  },
];

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<Event["type"] | "all">("all");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    type: "appointment",
    priority: "medium",
    reminder: false,
    date: new Date(),
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const getDayEvents = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || event.type === filterType;
    const matchesDate =
      event.date.toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesFilter && matchesDate;
  });

  const addEvent = () => {
    const newEvent: Event = {
      id: events.length + 1,
      title: "New Event",
      date: selectedDate,
      type: "appointment",
      priority: "medium",
      reminder: false,
    };
    setEvents([...events, newEvent]);
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const event: Event = {
      id: events.length + 1,
      title: newEvent.title,
      date: newEvent.date || selectedDate,
      type: newEvent.type as Event["type"],
      priority: newEvent.priority as Event["priority"],
      reminder: newEvent.reminder || false,
      notes: newEvent.description,
      location: newEvent.location,
      duration: newEvent.duration,
    };

    setEvents([...events, event]);
    setIsAddingEvent(false);
    setNewEvent({
      title: "",
      type: "appointment",
      priority: "medium",
      reminder: false,
      date: new Date(),
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;

    for (let i = 0; i < totalDays; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      if (i < firstDayOfMonth || dayNumber > daysInMonth) {
        days.push(
          <td key={i} className="p-2 border border-gray-200 bg-gray-50"></td>
        );
        continue;
      }

      const dayEvents = getDayEvents(dayNumber);
      const isSelected =
        selectedDate.getDate() === dayNumber &&
        selectedDate.getMonth() === currentMonth.getMonth();
      const isToday =
        new Date().toDateString() ===
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          dayNumber
        ).toDateString();

      days.push(
        <td
          key={i}
          onClick={() =>
            setSelectedDate(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                dayNumber
              )
            )
          }
          className={`relative p-2 border border-gray-200 hover:bg-primary/5 cursor-pointer transition-colors
            ${isSelected ? "bg-primary/10 border-primary" : "bg-white"}
            ${isToday ? "font-bold" : ""}
          `}
        >
          <div className={`text-sm ${isToday ? "text-primary" : ""}`}>
            {dayNumber}
          </div>
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 right-1 left-1">
              <div className="flex gap-1 flex-wrap">
                {dayEvents.slice(0, 3).map((event, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      event.type === "appointment"
                        ? "bg-primary"
                        : event.type === "medication"
                        ? "bg-green-500"
                        : event.type === "exercise"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-primary text-right">
                  +{dayEvents.length - 3}
                </div>
              )}
            </div>
          )}
        </td>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
              )
            }
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors text-gray-600 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors text-gray-600 hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th
                  key={day}
                  className="p-2 border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.ceil((firstDayOfMonth + daysInMonth) / 7),
            }).map((_, i) => (
              <tr key={i}>{renderCalendarDays().slice(i * 7, (i + 1) * 7)}</tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:w-1/3 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Events</h3>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Add Event
            </button>
          </div>

          {isAddingEvent && (
            <form onSubmit={handleAddEvent} className="space-y-4 mb-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value as Event["type"] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <Select
                  value={newEvent.priority}
                  onValueChange={(value) =>
                    setNewEvent({
                      ...newEvent,
                      priority: value as Event["priority"],
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: new Date(e.target.value) })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newEvent.location || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newEvent.reminder || false}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, reminder: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <label className="text-sm">Set Reminder</label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  Save Event
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {event.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      event.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : event.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
