# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js



To secure sensitive information, the application uses the dotenv Node.js module to store database credentials in a separate .env file, keeping them out of the source code and preventing exposure if the project is pushed to a public repository. User passwords are never stored in plain text; instead, they are hashed using bcrypt before being saved in the database, and login attempts are verified by comparing the submitted password to the stored hash. Additionally, the application implements a login audit system: every successful and failed login attempt is recorded in a login_audit table along with the username and timestamp. This audit history can be viewed via the /audit route, providing a full record of login activity for monitoring and security purposes.


week 8: 

The application now includes a full login system using bcrypt hashing, session-based authentication, and an audit log for all login attempts. This was added to improve security.

-A /users/login route allows users to log in using a username and password.
When a user successfully logs in:
-Their userId is saved inside the session.
-They are  then shown a confirmation page.

A /logout route was added.
-It destroys the user’s session and logs them out securely.
-After logout, the user is shown a logout confirmation page.

for the /audit page a login redirect was added for security purposes so that only logged in users can view the audit page.
To restrict pages to logged-in users only, we added a middleware function called redirectLogin.
This checks if req.session.userId exists.
If a user tries to access any of these pages while not logged in, they are automatically redirected to /login.


extension task
This project uses express-validator to validate user input on the login and registration pages. Validation ensures that data submitted by users meets specific rules before it is processed or stored in the database. This improves data integrity, security, and user experience.


**Fields Validated**
Username
-Must not be empty.
-Must be between 5–20 characters.
-Must be unique in the database (duplicate usernames are not allowed).
First Name / Last Name
-Optional, but if provided, they can be stored in the database.
Password
-Must not be empty.
-Stored securely in the database using bcrypt hashing.
express-validator checks the submitted usernames.

**Fields Validated**
Username
-Must exist in the database.
Password
-Must match the hashed password stored in the database.
Validation Implementation
The login route checks if the username exists
Passwords are compared using bcrypt.compare().
Failed login attempts are logged in the database for audit purposes.



**sanitization**

Sanitization is the process of removing unsafe characters from user input to protect the website from:
XSS attacks (Cross-Site Scripting)
Malicious HTML or JavaScript injections
Unexpected rendering issues in templates
If any field is later displayed back to the user, it must be sanitized.
In this project, sanitization is done using:
req.sanitize(value)

Without sanitization, a user could enter something like:
**Henry script alert("Gothca!") script
If this is shown on a page later, their code would run in someone else’s browser.
Sanitization removes harmful characters so this becomes harmless text instead of running as JavaScript.


**week 9**


The Bertie’s Books API provides access to the books database, allowing users to retrieve, search, filter, and sort books in the DB. /api/books returns all books as a JSON file containing id, name, and PRICE. Users can filter results. If no parameters are provided, all books are returned. The API includes basic error handling, returning JSON error objects if a database query fails. All filtering and sorting are handled securely, and search is case-insensitive. The application provides a /weather route, where users can enter a city name to retrieve current weather information, including temperature, humidity, and wind, displayed in a user-friendly format.