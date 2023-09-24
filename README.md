# Blog Website

A blog website where users can signup, write articles, and share their knowledge with others. Users can like, dislike, comment, and donate to the authors. The website also includes an admin page for managing articles, including deleting and editing them.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- User Registration: Allow users to create accounts and log in to the website.
- Article Creation: Users can write and publish articles to share their knowledge and insights.
- Interactions: Users can bookmark, like, dislike, and comment on articles to engage with the content.
- Donations: Provide the option for users to donate to the authors to support their work.
- Admin Page: An admin dashboard to manage articles, including editing and deleting them.

## Technologies

- MongoDB: A NoSQL database used to store user data, articles, and other information.
- Express.js: A web application framework for building the server-side logic and APIs.
- React: A JavaScript library for building user interfaces.
- Node.js: A JavaScript runtime environment used for server-side development.
- NodeMailer: Used for sending password reset link
- JWT (JSON Web Tokens): Used for user authentication and authorization.
- HTML/CSS/Tailwindcss: Markup and styling for the website's user interface.
- Other libraries and tools: (react-quill, react-icons, react-hook-form, @hookform/resolvers, yup and react-toastify)

## Installation

1. Clone the repository:
   git clone https://github.com/JRobera/summer-blog.git
2. Install dependencies for the server:
   cd summer-blog/server
   npm install
3. Install dependencies for the client:
   cd summer-blog/client
   npm install
4. Set up environment variables:

- Create a `.env` file in the `client` directory.
- Add VITE_SECRET_KEY
- Add VITE_CHAPA_PUBLIC_KEY

- Create a `.env` file in the `server` directory.
- Add server PORT
- Add DB connection string
- Add JWT ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
- Add Cloudinary credentials like cloud_name, api_key, api_secret
- Add NODEMAILERUSER user/email and NODEMAILERPASS

5. Start the development server:
   cd summer-blog/server
   npm run dev
6. Start the client:
   cd summer-blog/client
   npm run dev
7. Access the website at `http://localhost:3007` in your browser.

## Usage

- Register a new account on the website.
- Log in using your credentials.
- Explore articles, like, dislike, comment, and donate to authors.
- As an admin, log in to the admin page to manage articles, including editing and deleting them.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
