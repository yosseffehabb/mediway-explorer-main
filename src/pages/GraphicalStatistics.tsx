import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const SYMPTOMS = [
  "Headache",
  "Back Pain",
  "Joint Pain",
  "Fever",
  "Nausea",
  "Fatigue",
  "Dizziness",
  "Cough",
  "Shortness of Breath",
  "Chest Pain",
];

const MOCK_HISTORY_DATA = [
  {
    month: "Jan",
    userHeadache: 4,
    normalHeadache: 2,
    userBackPain: 2,
    normalBackPain: 1,
    userFever: 1,
    normalFever: 0.5,
  },
  {
    month: "Feb",
    userHeadache: 3,
    normalHeadache: 2,
    userBackPain: 3,
    normalBackPain: 1,
    userFever: 0,
    normalFever: 0.5,
  },
  {
    month: "Mar",
    userHeadache: 5,
    normalHeadache: 2,
    userBackPain: 1,
    normalBackPain: 1,
    userFever: 2,
    normalFever: 0.5,
  },
  {
    month: "Apr",
    userHeadache: 2,
    normalHeadache: 2,
    userBackPain: 4,
    normalBackPain: 1,
    userFever: 1,
    normalFever: 0.5,
  },
];

const TREND_DATA = [
  { month: "Jan", userValue: 30, normalValue: 20 },
  { month: "Feb", userValue: 45, normalValue: 22 },
  { month: "Mar", userValue: 35, normalValue: 21 },
  { month: "Apr", userValue: 60, normalValue: 23 },
  { month: "May", userValue: 25, normalValue: 20 },
  { month: "Jun", userValue: 40, normalValue: 22 },
];

const GraphicalStatistics = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    console.log("Submitted symptoms:", selectedSymptoms);
    // TODO: Implement API call to save symptoms
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Health Statistics</h1>

      <Card className="p-6 mb-8 border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-6">Overall Health Index</h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="userValue"
                stroke="#8884d8"
                name="Your Health Index"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="normalValue"
                stroke="#8884d8"
                name="Average Health Index"
                strokeDasharray="5 5"
                opacity={0.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Your overall health status compared to average. Lower values indicate
          better health conditions.
        </p>
      </Card>

      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Track Your Symptoms</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {SYMPTOMS.map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                checked={selectedSymptoms.includes(symptom)}
                onCheckedChange={() => handleSymptomToggle(symptom)}
              />
              <label
                htmlFor={symptom}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {symptom}
              </label>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit}>Submit Symptoms</Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Symptoms Comparison</h2>
        <div className="w-full h-[500px]">
          <ResponsiveContainer>
            <LineChart data={MOCK_HISTORY_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="userHeadache"
                stroke="#8884d8"
                name="Your Headache"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="normalHeadache"
                stroke="#8884d8"
                name="Average Headache"
                strokeDasharray="5 5"
                opacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="userBackPain"
                stroke="#82ca9d"
                name="Your Back Pain"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="normalBackPain"
                stroke="#82ca9d"
                name="Average Back Pain"
                strokeDasharray="5 5"
                opacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="userFever"
                stroke="#ffc658"
                name="Your Fever"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="normalFever"
                stroke="#ffc658"
                name="Average Fever"
                strokeDasharray="5 5"
                opacity={0.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Solid lines represent your symptoms, dashed lines show average
          symptoms in healthy individuals.
        </p>
      </Card>
    </div>
  );
};

export default GraphicalStatistics;
