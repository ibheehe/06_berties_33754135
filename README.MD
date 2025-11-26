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
