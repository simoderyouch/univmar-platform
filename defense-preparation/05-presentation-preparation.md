# 5. Preparing your internship presentation

## Tell a clear story

Organize your presentation around the business need, your work, and the result. A possible structure is:

1. **Context:** introduce the company and internship context using verified facts.
2. **Problem:** explain the practical coordination or tracking need that your project addresses.
3. **Objectives:** describe the scope agreed for your internship.
4. **Solution:** show the public website and internal management application at a high level.
5. **Architecture:** explain the frontend, Spring Boot API, database, and file storage.
6. **One workflow:** demonstrate or illustrate quotation → order → stock reservation.
7. **Your contribution:** identify what you personally designed or implemented.
8. **Validation:** explain the tests and demonstrations actually performed.
9. **Conclusion:** present the results, limitations, and realistic future improvements.

Adjust the number of slides and depth to the time given by your school. Spend more time explaining a meaningful workflow than listing every class.

## Example opening

> “My internship project concerns UNIVMAR, a platform for managing activities in a stone business. The solution brings together a public website and an internal application. The internal application connects commercial activities, such as quotations and orders, with inventory, delivery, and invoicing. I will present the need, the architecture, a key workflow, and my contribution.”

Replace any part that does not match your actual internship scope.

## What to show in a demonstration

Choose a short path you have tested beforehand. For example, show a quotation, explain its items and status, then show how an order is created and how stock is reserved. If you cannot safely perform that operation with the available data, use screenshots or a prepared test environment. Explain what is happening behind the interface using the controller → service → repository flow.

## Terms to explain naturally

- **REST API:** the interface through which clients make HTTP requests to the backend.
- **Spring Boot:** the Java framework setup used to build and run the API.
- **JPA / Hibernate:** the persistence mechanism mapping Java entities to database data.
- **Transaction:** a boundary that groups database changes into a unit of work.
- **JWT:** a signed token used by the application to authenticate subsequent requests.
- **Flyway:** the tool that applies versioned database migrations.
- **Docker:** used here to run the local stack as containers.

## Personal preparation checklist

- Write a two-minute explanation of the project without reading from slides.
- Explain one actual code path using [the order walkthrough](04-code-walkthrough.md).
- Distinguish features already present from work you personally contributed.
- Keep a backup of your demo and know the test data you will use.
- Prepare honest examples of a difficulty, a solution, a test, and an improvement.
- Check any dates, company information, screenshots, and results against your real internship records.

Continue with the [mock defense questions](06-defense-questions.md) when you are ready to practice.
