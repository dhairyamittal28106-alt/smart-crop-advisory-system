"use client";
import React, { useEffect, useState } from "react";

type WeatherData = {
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  name: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            if (!res.ok) throw new Error("Failed to fetch weather");
            const data = await res.json();
            setWeather(data);
          } catch (err) {
            setError("Unable to fetch weather data");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (error) return <p>{error}</p>;
  if (!weather) return null;

  return (
    <div className="p-4 rounded-lg shadow bg-blue-100 max-w-sm">
      <h2 className="text-lg font-bold">Weather in {weather.name}</h2>
      <p className="capitalize">{weather.weather[0].description}</p>
      <p>🌡 {weather.main.temp}°C</p>
      <p>💧 {weather.main.humidity}% humidity</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
    </div>
  );
}
