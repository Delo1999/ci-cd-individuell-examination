# Guide: Hur man skriver tester steg för steg

## 1. Förstå vad som ska testas

### Steg 1: Läsa acceptanskriterierna

Exempel från User Story 1:

- ✅ Användaren ska kunna välja ett datum och en tid
- ✅ Användaren ska kunna ange antal spelare (minst 1)
- ✅ Användaren ska kunna reservera ett eller flera banor

**Tänk:** Varje acceptanskriterium = ett test (eller flera om det är komplext)

---

## 2. Analysera koden för att förstå hur den fungerar

### Steg 2: Kolla i Booking.jsx

```javascript
// Koden har inputs med name-attribut:
<input name="when" type="date" />
<input name="time" type="time" />
<input name="people" type="number" />
<input name="lanes" type="number" />
```

**Tänk:**

- Inputs har `name`-attribut, inte `id`
- Labels är inte kopplade (ingen `htmlFor` eller `id`)
- Därför måste vi använda `querySelector` med `name`-attributet

---

## 3. Skriv testet - strukturen

Varje test följer samma mönster (AAA-pattern):

### **Arrange** (Förbered)

```javascript
const { container } = renderBooking(); // Rendera komponenten
const dateInput = container.querySelector('input[name="when"]'); // Hitta elementet
```

### **Act** (Utför)

```javascript
await userEvent.type(dateInput, "2024-12-25"); // Simulera användaråtgärd
```

### **Assert** (Verifiera)

```javascript
expect(dateInput).toHaveValue("2024-12-25"); // Kontrollera resultatet
```

---

## 4. Exempel: Ett enkelt test steg för steg

### Test: "should allow user to select a date from calendar"

```javascript
it("should allow user to select a date from calendar", async () => {
  // ============================================
  // STEG 1: ARRANGE - Förbered testet
  // ============================================
  const { container } = renderBooking();
  // Varför? Vi måste rendera komponenten först så den finns i DOM

  // ============================================
  // STEG 2: HITTA ELEMENTET
  // ============================================
  const dateInput = container.querySelector('input[name="when"]');
  // Varför querySelector? För att inputs inte har kopplade labels
  // Varför 'input[name="when"]'? För att input har name="when"

  // ============================================
  // STEG 3: VERIFIERA ATT ELEMENTET FINNS
  // ============================================
  expect(dateInput).toBeInTheDocument();
  // Varför? Vi vill säkerställa att input faktiskt renderades

  expect(dateInput).toHaveAttribute("type", "date");
  // Varför? Vi vill verifiera att det är rätt typ av input

  // ============================================
  // STEG 4: ACT - Simulera användaråtgärd
  // ============================================
  await userEvent.type(dateInput, "2024-12-25");
  // Varför await? userEvent.type är asynkron
  // Varför userEvent? Det simulerar riktig användarinteraktion bättre än att sätta value direkt

  // ============================================
  // STEG 5: ASSERT - Verifiera resultatet
  // ============================================
  expect(dateInput).toHaveValue("2024-12-25");
  // Varför? Vi vill kontrollera att värdet faktiskt sparades korrekt
});
```

---

## 5. Exempel: Ett mer komplext test med felmeddelande

### Test: "should show error message when date is missing"

**Acceptanskriterium:** "VG - Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas"

**Tänk-process:**

1. Vad ska testas? Felmeddelande när datum saknas
2. Vad ska användaren göra? Fylla i alla fält UTAN datum
3. Vad ska hända? Ett felmeddelande ska visas med texten "Alla fälten måste vara ifyllda"

```javascript
it("should show error message when date is missing", async () => {
  // ============================================
  // STEG 1: ARRANGE
  // ============================================
  const { container } = renderBooking();

  // ============================================
  // STEG 2: Fylla i ALLA fält UTAN datum
  // ============================================
  const timeInput = container.querySelector('input[name="time"]');
  const playersInput = container.querySelector('input[name="people"]');
  const lanesInput = container.querySelector('input[name="lanes"]');

  await userEvent.type(timeInput, "18:00"); // ✅ Fyllt i
  await userEvent.type(playersInput, "2"); // ✅ Fyllt i
  await userEvent.type(lanesInput, "1"); // ✅ Fyllt i
  // ❌ Datum saknas medvetet!

  // ============================================
  // STEG 3: ACT - Försök slutföra bokningen
  // ============================================
  const submitButton = screen.getByTestId("booking-submit-button");
  await userEvent.click(submitButton);
  // Varför? Detta är när valideringen körs (i book()-funktionen)

  // ============================================
  // STEG 4: ASSERT - Vänta och verifiera felmeddelande
  // ============================================
  await waitFor(() => {
    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Alla fälten måste vara ifyllda");
  });
  // Varför waitFor? Felmeddelandet visas asynkront efter att state uppdaterats
  // Varför getByTestId? Vi la till data-testid="error-message" för att hitta det enkelt
});
```

---

## 6. Exempel: Test med skor (flera element)

### Test: "should allow user to select shoe size for all players"

**Acceptanskriterium:** "Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen"

**Tänk-process:**

1. Vad ska testas? Möjlighet att välja skostorlek för flera spelare
2. Steg: Lägg till 3 skor, fyll i storlekar, verifiera

```javascript
it("should allow user to select shoe size for all players in the booking", async () => {
  // ============================================
  // STEG 1: ARRANGE
  // ============================================
  const { container } = renderBooking();

  // ============================================
  // STEG 2: Lägg till 3 skor (3 spelare)
  // ============================================
  const addShoeButton = screen.getByTestId("add-shoe-button");
  await userEvent.click(addShoeButton); // Lägg till sko 1
  await userEvent.click(addShoeButton); // Lägg till sko 2
  await userEvent.click(addShoeButton); // Lägg till sko 3

  // ============================================
  // STEG 3: Hitta alla sko-inputs
  // ============================================
  const shoeInputs = container.querySelectorAll('input[type="text"]');
  // Varför querySelectorAll? Det finns flera sko-inputs
  // Varför 'input[type="text"]'? Skostorlekar är text-inputs

  expect(shoeInputs).toHaveLength(3);
  // Varför? Vi vill verifiera att exakt 3 inputs skapades

  // ============================================
  // STEG 4: ACT - Fyll i olika storlekar
  // ============================================
  await userEvent.type(shoeInputs[0], "42"); // Spelare 1: storlek 42
  await userEvent.type(shoeInputs[1], "40"); // Spelare 2: storlek 40
  await userEvent.type(shoeInputs[2], "38"); // Spelare 3: storlek 38

  // ============================================
  // STEG 5: ASSERT - Verifiera alla värden
  // ============================================
  expect(shoeInputs[0]).toHaveValue("42");
  expect(shoeInputs[1]).toHaveValue("40");
  expect(shoeInputs[2]).toHaveValue("38");
  // Varför? Vi vill säkerställa att alla värden sparades korrekt
});
```

---

## 7. Processen när du skriver tester

### ✅ Checklista:

1. **Läs acceptanskriteriet noggrant**

   - Vad exakt ska funktionen göra?
   - Vad är förväntat resultat?

2. **Kolla koden**

   - Vilka element finns? (inputs, knappar, etc.)
   - Vilka attribut har de? (name, type, data-testid)
   - Hur fungerar logiken? (validering, state updates, etc.)

3. **Planera testet**

   - Vilka steg måste användaren göra?
   - Vad ska verifieras i slutet?

4. **Skriv testet med AAA-pattern**

   - **Arrange:** Rendera och hitta element
   - **Act:** Simulera användaråtgärder
   - **Assert:** Verifiera resultat

5. **Kör testet och fixa fel**
   - Kör `npm test`
   - Läs felmeddelanden noggrant
   - Fixa och kör igen

---

## 8. Vanliga frågor och svar

### Q: Varför `await` överallt?

**A:** `userEvent` och `waitFor` är asynkrona. De väntar på att DOM ska uppdateras.

### Q: Varför `waitFor` för felmeddelanden?

**A:** React uppdaterar DOM asynkront. `waitFor` väntar tills elementet faktiskt visas.

### Q: Varför `container.querySelector` istället för `screen.getByLabelText`?

**A:** Labels är inte kopplade till inputs (saknar `htmlFor`). `querySelector` fungerar med `name`-attribut.

### Q: Varför `getByTestId` för knappar?

**A:** Vi la till `data-testid` specifikt för tester. Det gör testerna mer stabila.

### Q: Hur vet jag vilket felmeddelande som ska visas?

**A:** Kolla i `Booking.jsx` i `book()`-funktionen - där finns alla felmeddelanden definierade.

---

## 9. Tips för att komma igång

1. **Börja enkelt:** Skriv först tester för enkla saker (t.ex. input kan fyllas i)
2. **Bygg vidare:** När det fungerar, lägg till mer komplexa tester
3. **Kopiera mönster:** Använd samma struktur för liknande tester
4. **Testa fel:** Glöm inte att testa felhantering (saknade fält, ogiltiga värden)
5. **Kör ofta:** Kör `npm test` efter varje nytt test för att se om det fungerar

---

## 10. Exempel på hur man tänker för ett nytt test

**Scenario:** Du vill testa "användaren kan ta bort en skostorlek"

**Tänk-process:**

1. **Vad ska hända?**

   - Användaren klickar på "-"-knappen
   - Skostorleken försvinner

2. **Hur testar jag det?**

   - Lägg till 2 skor
   - Klicka på remove-knappen för första skon
   - Verifiera att bara 1 sko finns kvar

3. **Kod:**

```javascript
it("should allow user to remove a shoe size", async () => {
  const { container } = renderBooking();

  // Lägg till 2 skor
  const addShoeButton = screen.getByTestId("add-shoe-button");
  await userEvent.click(addShoeButton);
  await userEvent.click(addShoeButton);

  // Verifiera att 2 finns
  let shoeInputs = container.querySelectorAll('input[type="text"]');
  expect(shoeInputs).toHaveLength(2);

  // Ta bort första skon
  const removeButton = screen.getByTestId("remove-shoe-0");
  await userEvent.click(removeButton);

  // Verifiera att bara 1 finns kvar
  shoeInputs = container.querySelectorAll('input[type="text"]');
  expect(shoeInputs).toHaveLength(1);
});
```

**Klart!** 🎉
