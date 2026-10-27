export type Tip = {
  id: string;
  title: string;
  content: string;
};


export async function fetchDailyTips(): Promise<Tip[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: "1",
      title: "Soil Moisture",
      content: "Check your soil moisture levels every morning. The top inch should be dry before you consider watering again.",
    },
    {
      id: "2",
      title: "Pest Control",
      content: "Inspect the underside of your leaves regularly for early signs of pests like aphids or spider mites.",
    },
    {
      id: "3",
      title: "Seasonal Crop Rotation",
      content: "Consider rotating your crops to prevent soil nutrient depletion and reduce disease build-up.",
    },
    {
      id: "4",
      title: "Fertilizer Timing",
      content: "Apply fertilizers early in the morning or late in the afternoon to prevent nutrient burn from direct sunlight.",
    },
    {
      id: "5",
      title: "Weed Management",
      content: "Regularly remove weeds to reduce competition for nutrients and water. Mulching can help suppress weed growth.",
    },
  ];
}
