# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js



To secure sensitive information, the application uses the dotenv Node.js module to store database credentials in a separate .env file, keeping them out of the source code and preventing exposure if the project is pushed to a public repository. User passwords are never stored in plain text; instead, they are hashed using bcrypt before being saved in the database, and login attempts are verified by comparing the submitted password to the stored hash. Additionally, the application implements a login audit system: every successful and failed login attempt is recorded in a login_audit table along with the username and timestamp. This audit history can be viewed via the /audit route, providing a full record of login activity for monitoring and security purposes.