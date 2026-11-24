# Complete defense speech — aligned with the 19-slide presentation

This is an English speaking script, not a claim that every proposed feature is operating in production. Adapt the greeting, your exact contribution and duration. Practice it aloud; do not memorize figures or results you cannot substantiate. The presentation is [univmar_defense.pdf](../docs/univmar_defense.pdf), and page numbers below are PDF pages. The report is [the internship report](../docs/mohamed%20ed%20deryouch%20report%20internship.pdf).

## 1. Title

“Good morning, members of the jury, professors and guests. My name is Mohamed Ed Deryouch. Today I will present my internship project, carried out with Tecgroupe for UNIVMAR. The project concerns the design and implementation of an ERP platform for a natural-stone business, together with a public website and a cloud deployment approach on AWS. I will explain the business problem, the proposed solution, its design, implementation and infrastructure, and finish with a demonstration, limitations and future improvements.”

## 2. Plan

“First, I will introduce the host company and the context. Then I will present the problem and objectives, requirements and design. After that I will explain the application architecture and the DevOps and AWS deployment architecture. Finally, I will demonstrate the platform, discuss search visibility, and conclude with limitations and perspectives.”

The agenda mentions two live demonstrations, but the actual PDF contains one demonstration slide, page 15. Explain the website and ERP as two parts of the same demonstration; do not search for a second demonstration slide.

## 3. Host company

“My internship took place at Tecgroupe, a software engineering company that designs, develops and deploys custom digital solutions. The host company provided the professional setting for the project. UNIVMAR was the business whose operational needs guided the solution. This distinction matters: Tecgroupe is the host company, while UNIVMAR is the client business represented by the platform.”

## 4. Project context

“UNIVMAR operates in natural stone: marble, granite, limestone and other materials. Its work connects sales with physical operations. A customer might request a kitchen countertop, choose a specific stone and finish, and require cutting and delivery. The business must know what material is available, what has already been promised to another customer, and how each order progresses through the workshop and delivery. This makes inventory and operational traceability especially important.”

## 5. Problem statement

“The initial challenge was fragmented information. Customer details, quotations and stock could be distributed across spreadsheets, documents and separate tools. That makes it difficult to identify the latest information and creates repeated data entry. In addition, a physical quantity is not necessarily available for sale: part may already be reserved or damaged. Manual follow-up also makes it harder to connect an enquiry to a quotation, an order, delivery and payment. The objective was therefore to make these activities visible as one connected process.”

## 6. Functional objectives

“Functionally, the platform centralizes enquiries, customer records, quotations, orders, purchasing, deliveries and invoicing. It provides inventory visibility, including reservations and stock movements, and supports fabrication and operational follow-up. A second objective is to connect the public website to internal staff workflows: a visitor can submit an enquiry that staff can review and qualify. The value is continuity of information between customer contact and business operations.”

## 7. Technical objectives

“Technically, the application needed a maintainable structure with clear responsibilities, controlled access to internal functions, and persistent data. I also designed an automated delivery approach using containers, GitHub Actions, Terraform and AWS. These choices support repeatable builds and infrastructure changes. Reliability is a goal and an ongoing responsibility: it must be supported by tests, monitoring, backups and operational validation.”

## 8. Proposed solution

“The solution has three complementary parts. First, the public website, built with Next.js and React, presents the company, its materials and projects and collects customer enquiries. Second, the ERP workspace, built with React and a Spring Boot API backed by PostgreSQL, supports internal sales, stock, workshop, delivery and financial tracking. Third, the cloud and DevOps layer packages and deploys the applications. The business thread shown at the bottom is enquiry, quotation, sales order, stock reservation, delivery and invoice. It is a useful overview, although purchasing and fabrication can also be necessary, and invoicing is possible after an order is confirmed rather than only after delivery.”

## 9. Requirements analysis

“I separated the requirements into functional and non-functional requirements. Functional requirements describe what users need to do: manage customers, prepare quotations, reserve stock, deliver orders and track invoices. Non-functional requirements describe qualities and constraints: security and role-based access, consistency of business data, maintainability and controlled deployment. For example, ‘reserve stock’ is a function; ‘avoid allocating the same stock twice during concurrent requests’ is a consistency requirement.”

## 10. Sales use-case diagram

“This use-case diagram focuses on sales and customer management. The actor on the left is sales staff; the rectangle represents the system boundary. The ellipses show capabilities: creating and qualifying an RFQ, preparing and sending a quotation, accepting a quotation to create an order, following website enquiries, and managing customers and projects. The included stock reservation indicates that accepting the quotation involves allocating available material. The extension around enquiry qualification expresses a conditional follow-up: not every enquiry must become a customer and project. This is a functional view of who can do what, not a chronological algorithm or database schema.”

## 11. Inventory and reservation class diagram

“This diagram zooms in on inventory. A stone material has variants, such as the same marble with different thicknesses or finishes. The inventory item represents a quantity of a variant held in a warehouse and possibly a location. Its important values are on-hand, reserved and damaged quantities; available quantity is on-hand minus reserved minus damaged. An order line can have reservations against one or more inventory items. Stock movements record operational changes. Delivery items point to order lines; dispatch consumes the relevant reservation. If an eligible order is cancelled, the remaining reservation is released. This distinction prevents us from treating all physically held stock as available to promise.”

## 12. Application architecture

“At the top are two clients: a public Next.js website and an authenticated React and TypeScript ERP. Both communicate with the Spring Boot API through REST and JSON. Public endpoints expose selected content and enquiry functions; protected endpoints require authentication and appropriate role checks. Controllers receive requests, services apply business rules, and JPA repositories access PostgreSQL. The API also interacts with media storage and an email service. The diagram is a logical view: it explains responsibilities and dependencies, while the next diagram explains physical deployment.”

## 13. DevOps and CI/CD

“The delivery pipeline starts with source code in GitHub. GitHub Actions builds container images and publishes them to Amazon ECR. A separate deployment workflow checks out the selected revision, obtains AWS credentials through an assumed role, generates a Terraform plan, and can apply the reviewed plan in the production environment. The workflow then waits for ECS services and performs smoke checks. The diagram shows a manual approval gate; that gate depends on the GitHub production environment protection being configured, so the YAML alone does not prove an approver is currently required. Infrastructure as code makes changes reviewable and repeatable, but a successful build alone does not prove the business workflows are correct.”

## 14. AWS deployment

“This is the proposed production topology in the Paris region. DNS and the edge layer route requests to an application load balancer. Application containers run in ECS inside private application subnets, and PostgreSQL runs in RDS within private database subnets. ECR stores container images, S3 stores media and Terraform state separately, Secrets Manager supplies sensitive configuration, and CloudWatch collects operational information. Availability zones provide failure domains. Importantly, this slide depicts a highly available target, including a standby database, but the current Terraform configuration sets the database to single-AZ and each application service to one desired task. We should therefore describe the diagram as the target architecture, not claim that active redundancy is presently configured.”

## 15. Live demonstration

“I will first show the public catalogue and the enquiry form. I will then enter the ERP as an authorized staff member, review the enquiry and show the customer and quotation workflow. Next, I will show inventory and explain the difference between on-hand, reserved and available stock. Finally, I will open an order, delivery and invoice to show how the same customer request is followed across modules. For safety and time, I will use prepared demonstration records and explain any state-changing action before executing it.”

See [the scenarios and rehearsal guide](09-business-scenarios-and-demo.md) for a full example and negative tests. If the application or external email service is unavailable, use screenshots or existing records and state the limitation.

## 16. SEO optimization

“The public site has a second objective: helping potential customers discover UNIVMAR. The work includes research in Arabic, French and English, page titles and descriptions, structured headings, relevant material and service content, and technical elements such as sitemap, robots and canonical URLs. The report includes Search Console snapshots and example search results. Those numbers are historical observations for the reported periods, not live rankings or proof that every improvement was caused by this project. Search results depend on location, time and the query.”

## 17. Limitations and perspectives

“The main limitation is the need for more evaluation with actual users and real operating conditions. We also need to validate cloud costs against measured usage. Future work includes deeper automated tests, security review, cloud optimization and continued monitoring, and improvements based on feedback from UNIVMAR staff. An additional architectural priority is reconciling the high-availability design shown here with the actual production configuration and budget.”

## 18. Conclusion

“To conclude, this project connects public customer contact with internal commercial and operational activities. It combines a business-oriented ERP, a public website and an infrastructure delivery approach. The most important design idea is that a customer request, inventory reservation, delivery and invoice are related records with explicit states and business rules. Thank you for your attention. I will be happy to answer your questions.”

## 19. Closing slide

Leave the title visible while taking questions. If asked what you personally implemented, name only tasks you actually performed, explain a concrete example, and distinguish your contribution from planned features or team work.
