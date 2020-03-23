# auth-sample

### [demo](https://penta-auth-sample.now.sh/)

server side
* express
* monk (mongodb)


client side https://github.com/y-kawamura/auth-example-vue-app
* vue.js
* bootstrap
* bootswatch

## Authentication
- [x] POST /auth/signup - Signup user
  - [x] Validate required fields with Joi
  - [x] Check if username is unique
  - [x] Hash password with bcrypt
  - [x] Insert into DB
- [x] POST /auth/login - Login user
  - [x] Check if username in DB
  - [x] Compare password with hashed password in DB
  - [x] Create and sign a JWT
  - [x] Respond with JWT
- [x] Create login form
  - [x] Validate required fields
  - [x] Show errors
  - [x] Redirect
- [x] Create signup form
  - [x] Validate required fields
  - [x] Show errors
  - [x] Redirect

## Authorization
- [x] Check token in middleware
  - [x] Get token form Authroization header
    - [x] if defined 
      - [x] Verify the token with the token secret
      - [x] Set req.user to be the decoded verified payload
    - [x] else - move along
- [x] Check logged in user in middleware
  - [x] if req.user is set - move along
  - [x] else - send an unauthorized error message
- [x] Post /api/v1/notes - create note
  - [x] Must be logged in
  - [x] Logged in users can create notes
    - [x] Title
    - [x] Descrition - markdown
    - [x] Set user_id on server with logged in users id
- [x] Get /api/v1/notes - list all notes of logged in user
  - [x] Must be logged in 
  - [x] Logged in users can request all their notes
    - [x] Get all notes in DB with logged in users user_id

- [x] List all notes on client
  - [x] Render description with Markdown
- [x] Create note form

- [x] GET /api/v1/users - list all users
- [x] PATCH /api/v1/user/:id - update a user
- [x] Add a role property to users when created
- [x] Add a active property to users when created
- [x] Prevent inactive users from logging in
- [x] Seed the DB with an admin user
- [x] Restrict GET /api/v1/users to only users with admin role
- [x] Restrict PATCH /api/v1/user/:id to only users with admin role
