# Smart crop advisory system

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dhairyamittal28106-7951s-projects/v0-smart-crop-advisory-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/IAWgnEqiII6)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/dhairyamittal28106-7951s-projects/v0-smart-crop-advisory-system](https://vercel.com/dhairyamittal28106-7951s-projects/v0-smart-crop-advisory-system)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/IAWgnEqiII6](https://v0.app/chat/projects/IAWgnEqiII6)**

## Features

### Live Weather Updates
- **Real-time weather data** for Punjab, India using WeatherAPI.com
- **Auto-refresh** every 10 minutes to keep data current
- **Weather alerts** and warnings for farming activities
- **7-day forecast** with detailed weather conditions
- **Farming advice** based on current and forecasted weather
- **UV index monitoring** with safety recommendations
- **Wind and humidity tracking** for agricultural planning

### Weather-Based Farming Recommendations
- Irrigation scheduling based on rainfall predictions
- Harvest timing recommendations
- Pesticide application warnings during high winds
- Field work scheduling considering UV index
- Crop protection alerts for extreme temperatures
- Disease prevention advice based on humidity levels

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Weather API Setup

The weather functionality uses WeatherAPI.com for real-time data. The API key is configured in the environment variables:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

The system automatically fetches:
- Current weather conditions
- 7-day weather forecast
- Weather alerts and warnings
- Air quality data
