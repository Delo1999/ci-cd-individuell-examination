import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Booking from "../Booking";

// Helper function to render Booking component with router
const renderBooking = () => {
  return render(
    <BrowserRouter>
      <Booking />
    </BrowserRouter>
  );
};

describe("Booking Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("User Story 1: Book date, time, and number of players", () => {
    it("should allow user to select a date from calendar", async () => {
      const { container } = renderBooking();

      const dateInput = container.querySelector('input[name="when"]');
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute("type", "date");

      await userEvent.type(dateInput, "2024-12-25");
      expect(dateInput).toHaveValue("2024-12-25");
    });

    it("should allow user to select a time", async () => {
      const { container } = renderBooking();

      const timeInput = container.querySelector('input[name="time"]');
      expect(timeInput).toBeInTheDocument();
      expect(timeInput).toHaveAttribute("type", "time");

      await userEvent.type(timeInput, "18:00");
      expect(timeInput).toHaveValue("18:00");
    });

    it("should allow user to enter number of players (minimum 1)", async () => {
      const { container } = renderBooking();

      const playersInput = container.querySelector('input[name="people"]');
      expect(playersInput).toBeInTheDocument();
      expect(playersInput).toHaveAttribute("type", "number");

      await userEvent.type(playersInput, "4");
      expect(playersInput).toHaveValue(4);
    });

    it("should allow user to reserve one or more lanes based on number of players", async () => {
      const { container } = renderBooking();

      const lanesInput = container.querySelector('input[name="lanes"]');
      expect(lanesInput).toBeInTheDocument();
      expect(lanesInput).toHaveAttribute("type", "number");

      await userEvent.type(lanesInput, "2");
      expect(lanesInput).toHaveValue(2);
    });
  });

  describe("User Story 2: Select shoe size for each player", () => {
    it("should allow user to enter shoe size for each player", async () => {
      const { container } = renderBooking();

      // shoe input
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);

      // Find shoe inputs by finding all textbox inputs (shoe inputs are type="text")
      const shoeInputs = container.querySelectorAll('input[type="text"]');
      const shoeInput = shoeInputs[shoeInputs.length - 1]; // Get the last one (the newly added)
      expect(shoeInput).toBeInTheDocument();

      await userEvent.type(shoeInput, "42");
      expect(shoeInput).toHaveValue("42");
    });

    it("should allow user to change shoe size for each player", async () => {
      const { container } = renderBooking();

      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      const shoeInput = shoeInputs[shoeInputs.length - 1];
      await userEvent.type(shoeInput, "42");
      expect(shoeInput).toHaveValue("42");

      // Change the size
      await userEvent.clear(shoeInput);
      await userEvent.type(shoeInput, "43");
      expect(shoeInput).toHaveValue("43");
    });

    it("should allow user to select shoe size for all players in the booking", async () => {
      const { container } = renderBooking();

      const addShoeButton = screen.getByTestId("add-shoe-button");

      // Add 3 shoe inputs
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      expect(shoeInputs).toHaveLength(3);

      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");
      await userEvent.type(shoeInputs[2], "38");

      expect(shoeInputs[0]).toHaveValue("42");
      expect(shoeInputs[1]).toHaveValue("40");
      expect(shoeInputs[2]).toHaveValue("38");
    });

    it("should display an overview of selected shoe sizes before completing booking", async () => {
      const { container } = renderBooking();

      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");

      // Verify the inputs are visible with their values
      expect(shoeInputs[0]).toHaveValue("42");
      expect(shoeInputs[1]).toHaveValue("40");
    });
  });

  describe("User Story 3: Remove shoe size field", () => {
    it("should allow user to remove a previously selected shoe size field by clicking minus button", async () => {
      const { container } = renderBooking();

      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      // Verify two shoe inputs exist
      const shoeInputs = container.querySelectorAll('input[type="text"]');
      expect(shoeInputs).toHaveLength(2);

      // Click remove button for first shoe
      const removeButton1 = screen.getByTestId("remove-shoe-0");
      await userEvent.click(removeButton1);

      // One shoe input should remain
      const remainingInputs = container.querySelectorAll('input[type="text"]');
      expect(remainingInputs).toHaveLength(1);
    });

    it("should update booking so no shoes are booked for removed player", async () => {
      const { container } = renderBooking();

      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");

      // Remove the first shoe
      const removeButton1 = screen.getByTestId("remove-shoe-0");
      await userEvent.click(removeButton1);

      // The shoe input should be gone, meaning no shoes are booked for that player
      const remainingInputs = container.querySelectorAll('input[type="text"]');
      expect(remainingInputs).toHaveLength(1);
    });
  });

  describe("User Story 4: Complete booking and receive booking number and total", () => {
    it("should allow user to complete booking by clicking submit button", async () => {
      renderBooking();

      const submitButton = screen.getByTestId("booking-submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("strIIIIIike!");
    });

    it("should generate booking number and navigate to confirmation after booking is completed", async () => {
      const { container } = render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      // Fill in all required fields
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      // Add shoes for 2 players
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");

      // Submit booking
      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      // Wait for booking to be saved to sessionStorage
      await waitFor(() => {
        const confirmation = JSON.parse(sessionStorage.getItem("confirmation"));
        expect(confirmation).toBeTruthy();
        expect(confirmation.bookingId).toBeTruthy();
      });
    });

    it("should calculate and display total sum based on players (120 kr per person) and lanes (100 kr per lane)", async () => {
      const { container } = render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      // Fill in booking: 3 players, 2 lanes
      // Expected total: 3 * 120 + 2 * 100 = 360 + 200 = 560
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "3");
      await userEvent.type(lanesInput, "2");

      // Add shoes for 3 players
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");
      await userEvent.type(shoeInputs[2], "38");

      // Submit booking
      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      // Verify the price calculation: 3 players * 120 + 2 lanes * 100 = 560
      await waitFor(() => {
        const confirmation = JSON.parse(sessionStorage.getItem("confirmation"));
        expect(confirmation).toBeTruthy();
        expect(confirmation.price).toBe(560);
      });
    });
  });

  describe("VG Acceptance Criteria - Error Messages", () => {
    it("should show error message when date is missing", async () => {
      // Testing specific case: missing date
      const { container } = renderBooking();

      // Fill in other fields but not date
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Alla fälten måste vara ifyllda"
        );
      });
    });

    it("should show error message when time is missing", async () => {
      // Testing specific case: missing time
      const { container } = renderBooking();

      // Fill in other fields but not time
      const dateInput = container.querySelector('input[name="when"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Alla fälten måste vara ifyllda"
        );
      });
    });

    it("should show error message when number of players is missing", async () => {
      // Testing specific case: missing number of players
      const { container } = renderBooking();

      // Fill in other fields but not players
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(lanesInput, "1");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Alla fälten måste vara ifyllda"
        );
      });
    });

    it("should show error message when number of lanes is missing", async () => {
      // Testing specific case: missing number of lanes
      const { container } = renderBooking();

      // Fill in other fields but not lanes
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "2");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Alla fälten måste vara ifyllda"
        );
      });
    });

    it("should show error message when multiple fields are missing", async () => {
      // Testing combination: missing date and time
      const { container } = renderBooking();

      // Only fill in players and lanes
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Alla fälten måste vara ifyllda"
        );
      });
    });

    it("should show error message when number of players exceeds available lanes (max 4 per lane)", async () => {
      const { container } = renderBooking();

      // Fill in all required fields: 5 players but only 1 lane (max 4 per lane)
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "5");
      await userEvent.type(lanesInput, "1");

      // Add shoes for 5 players
      const addShoeButton = screen.getByTestId("add-shoe-button");
      for (let i = 0; i < 5; i++) {
        await userEvent.click(addShoeButton);
      }

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      for (let i = 0; i < 5; i++) {
        await userEvent.type(shoeInputs[i], "42");
      }

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Det får max vara 4 spelare per bana"
        );
      });
    });

    it("should show error message when trying to complete booking without filling shoe size for a player", async () => {
      const { container } = renderBooking();

      // Fill in all required fields
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      // Add shoes for 2 players
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      // Fill in only one shoe size, leave the other empty
      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent("Alla skor måste vara ifyllda");
      });
    });

    it("should show error message when number of people and shoes do not match", async () => {
      const { container } = renderBooking();

      // Fill in all required fields: 3 players
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "3");
      await userEvent.type(lanesInput, "1");

      // Add only 2 shoes (but we have 3 players)
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Antalet skor måste stämma överens med antal spelare"
        );
      });
    });

    it("should show error message when more shoes than players are added", async () => {
      const { container } = renderBooking();

      // Fill in all required fields: 2 players
      const dateInput = container.querySelector('input[name="when"]');
      const timeInput = container.querySelector('input[name="time"]');
      const playersInput = container.querySelector('input[name="people"]');
      const lanesInput = container.querySelector('input[name="lanes"]');

      await userEvent.type(dateInput, "2024-12-25");
      await userEvent.type(timeInput, "18:00");
      await userEvent.type(playersInput, "2");
      await userEvent.type(lanesInput, "1");

      // Add 3 shoes (but we have 2 players)
      const addShoeButton = screen.getByTestId("add-shoe-button");
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);
      await userEvent.click(addShoeButton);

      const shoeInputs = container.querySelectorAll('input[type="text"]');
      await userEvent.type(shoeInputs[0], "42");
      await userEvent.type(shoeInputs[1], "40");
      await userEvent.type(shoeInputs[2], "38");

      const submitButton = screen.getByTestId("booking-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Antalet skor måste stämma överens med antal spelare"
        );
      });
    });
  });
});
