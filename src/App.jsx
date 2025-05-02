import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import html2pdf from "html2pdf.js";
import "leaflet/dist/leaflet.css";

export default function RouteMapperApp() {
  const [parkImages, setParkImages] = useState([]);
  const [caseImages, setCaseImages] = useState([]);
  const [routes, setRoutes] = useState([]);
  const pdfRef = useRef();

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "park") {
      setParkImages(files);
    } else {
      setCaseImages(files);
    }
  };

  const dummyRoute = [
    [39.7405, -84.1514],
    [39.7410, -84.1500],
    [39.7415, -84.1490],
  ];

  const generatePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `Route_2031_Relay_1.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-blue-900 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-blue-800"
            >
              <path d="M2 6l20-1-4 4 4 4-20-1v-6z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide">USPS Route Planner Maps</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="md:col-span-1 bg-white shadow-md rounded-2xl">
          <CardContent className="space-y-4">
            <div>
              <label className="font-bold block mb-2">Upload Park Point Images</label>
              <input type="file" multiple onChange={(e) => handleImageUpload(e, "park")} />
            </div>
            <div>
              <label className="font-bold block mb-2">Upload Case Images</label>
              <input type="file" multiple onChange={(e) => handleImageUpload(e, "case")} />
            </div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={() => alert("Processing images and generating maps...")}>Generate Maps</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white shadow-md rounded-2xl">
          <CardContent>
            <div ref={pdfRef} className="space-y-4">
              <h2 className="text-xl font-bold mb-2">Relay #1 - Park @ 2004 Hazel</h2>
              <MapContainer center={[39.7410, -84.1500]} zoom={16} className="h-96 w-full rounded-xl overflow-hidden">
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={dummyRoute} color="blue" />
                {dummyRoute.map((pos, idx) => (
                  <Marker position={pos} key={idx}>
                    <Popup>Address #{idx + 1}</Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="mt-4 text-sm">
                <p><strong>Total Addresses in This Relay:</strong> 3</p>
                <p><strong>Estimated Distance:</strong> 0.2 miles</p>
                <p><strong>Estimated Time:</strong> 5 minutes</p>
                <p><strong>Address List:</strong></p>
                <ul className="list-disc list-inside">
                  <li>2077 Richfield</li>
                  <li>2083 Richfield</li>
                  <li>2087 Richfield</li>
                </ul>
              </div>
            </div>
            <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={generatePDF}>Download PDF</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
