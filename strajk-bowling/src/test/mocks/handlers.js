import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock POST booking endpoint
  http.post(
    "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
    async ({ request }) => {
      const body = await request.json();

      // Log when mock is used (only in test environment)
      console.log("MSW Mock POST-anrop!");
      console.log("Request body:", body);

      // Calculate price: 120 kr per person + 100 kr per lane
      const personPrice = body.people * 120;
      const lanePrice = body.lanes * 100;
      const totalPrice = personPrice + lanePrice;

      const response = {
        bookingDetails: {
          bookingId: "MOCK-BOOKING-12345",
          when: body.when,
          people: body.people,
          lanes: body.lanes,
          shoes: body.shoes || [],
          price: totalPrice,
        },
      };

      console.log("MSW Mock response:", response);

      return HttpResponse.json(response);
    }
  ),
];
