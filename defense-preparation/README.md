# UNIVMAR — Internship defense preparation

This study guide helps you understand the project, revise Spring Boot, and explain your work during your internship defense (*soutenance*). It is based on the current repository; adapt the business context and your personal contribution to what actually happened during your internship.

## Recommended reading order

1. [Business problem and project](01-business-and-project.md) — why the application exists and what it does.
2. [Architecture and technologies](02-architecture.md) — the components and how they communicate.
3. [Spring Boot revision](03-spring-boot-revision.md) — review the framework, then follow a staff login and a protected request in the [Spring Security deep dive](spring-security.md).
4. [Code walkthrough: quotation to order](04-code-walkthrough.md) — follow a real request through the backend.
5. [Presentation preparation](05-presentation-preparation.md) — build your story and practice explaining your contribution.
6. [Defense questions and practice answers](06-defense-questions.md) — revise likely jury questions and rehearse your answers.

Use the suggested answers as starting points. Personalize any answer about your own work, results, or internship experience.

## How to use the guides

Read each guide, open the linked source files, and try to explain the ideas aloud in your own words. The paths are relative to this folder and work when browsing the repository. The project code is the source of truth if behavior changes later.

## Start here for the current defense presentation

- [Complete slide-by-slide speech](07-complete-defense-speech.md) — a ready-to-practice script for all 19 PDF pages.
- [Detailed diagram explanations](08-diagram-explanations.md) — slide diagrams, report figures, UML notation and implementation differences.
- [Business scenarios and live demo](09-business-scenarios-and-demo.md) — end-to-end workflows, numerical stock example, failure cases and rehearsal.
- [Spring and security oral revision](10-spring-and-security-oral-revision.md) — framework concepts, actual JWT flow and common jury questions.

**Important correction:** the current code reserves inventory when a quotation is accepted and creates a pending order; confirmation is a separate subsequent action. The report sometimes describes reservation at confirmation. The AWS diagram depicts a high-availability target, while current Terraform sets RDS `multi_az = false` and each ECS service to one desired task.

- [Manual testing guide](11-manual-testing-guide.md) — sample data, steps and expected results for each ERP module, public website, authorization and key API-only operations.
