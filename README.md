# Pack-N-Quack
Pack N Quack is an innovative solution that empowers travelers to create unforgettable experiences, discover local gems, and plan every detail of their trips with ease. With a user-friendly interface and a comprehensive suite of features, the app allows adventurers to personalize their itineraries, book accommodations and transport, and explore curated activities, all within a single, seamless platform. Designed for everyone—from solo travelers to families—our app brings the world to your fingertips, making travel planning both enjoyable and stress-free.

## Build Status
The project is currently under development, we are actively creating and improving the various features of the platform.

### Bugs & Issues
More updates will be provided as development progresses.

## Code Style

We follow the **[Standard](https://standardjs.com/)** code style for this project to ensure consistency and readability across the codebase.

### Enforcing Code Style
The project includes a configured linter (`eslint`) to enforce the code style. To check for any style violations, run:

```bash
npm run lint
```

## Screenshots
![image](https://github.com/user-attachments/assets/76f06b4b-d258-4b87-ba07-2871fd020b97)
![image](https://github.com/user-attachments/assets/d7511aa8-29b1-4f04-8910-aac6e8908783)

## Framework
This project is built using the **MERN** stack:

- **MongoDB**: NoSQL database for storing data in flexible ,JSON-like format.
- **Express.js**: Web application framework for handling routing and middleware on the server side.
- **React**: Front-end library for building a responsive and dynamic user interface.
- **Node.js**: JavaScript runtime environment for server-side scripting.
---

## UI Technologies

The user interface of this project is built using the following technologies:

- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework that enables rapid and responsive design directly within your markup. Tailwind CSS allows for highly customizable and maintainable styling without the need for writing custom CSS.

- **[Shadcn/UI](https://shadcn.com/ui)**: A collection of accessible and reusable React components built with Tailwind CSS. Shadcn/UI provides a consistent and modern design system, streamlining the development process and ensuring a cohesive user experience.

### Why These Technologies?

- **Tailwind CSS**:
  - **Flexibility**: Offers extensive customization options without leaving your HTML.
  - **Efficiency**: Speeds up the styling process with predefined utility classes.
  - **Responsive Design**: Simplifies the creation of responsive layouts with ease.

- **Shadcn/UI**:
  - **Accessibility**: Ensures components are accessible out of the box, adhering to best practices.
  - **Reusability**: Promotes the use of reusable components, reducing code duplication.
  - **Consistency**: Maintains a uniform look and feel across the application through a shared design system.


## Features

Our project offers a comprehensive suite of features tailored to enhance the user experience for all types of users involved in the tourism ecosystem. Here’s what makes our platform stand out:

### User Roles

- **Advertisers**: Promote their services and reach a broader audience through targeted advertising tools.
- **Sellers**: List and sell a variety of goods in our integrated marketplace, connecting directly with customers.
- **Tour Guides**: Share their expertise by offering personalized tours and engaging activities for tourists.
- **Tourists**: Discover, book, and enjoy a wide range of activities, itineraries, flights, hotels, and transportation options seamlessly.
- **Admins**: Oversee platform operations, manage content, ensure quality control, and provide support to all users.
- **Tourism Governors**: Coordinate and regulate tourism activities within their regions, ensuring sustainable and organized growth.

### Activity and Itinerary Management

- **Publish and Book Activities**: Create, list, and manage various activities and itineraries that tourists can easily browse and book.
- **Historical Places Section**: Explore detailed information about historical sites, enriching the cultural experience for tourists.

### Marketplace and Booking Services

- **Integrated Marketplace**: Buy and sell goods within our platform, offering a diverse range of products tailored to travelers’ needs.
- **Direct Booking**: Book flights, hotels, and transportation directly from our website, providing a one-stop solution for all travel arrangements.

### Administration and Supervision

- **Admin Supervision**: All activities, listings, and user interactions are monitored and managed by admins to maintain high standards of quality and security.

### Payment and Promotions

- **Multiple Payment Methods**: Enjoy flexibility with a variety of payment options, ensuring convenient transactions for all users.
- **Promocodes**: Receive exclusive promocodes on your birthday, offering special discounts and rewards as a token of appreciation.

### Real-Time Notifications

- **Stay Informed**: Get real-time notifications about your bookings, promotions, updates, and important announcements to keep you always in the loop.

### Unique Design

- **Duck-Themed Interface**: Experience a fun and engaging duck-themed design that makes navigating our platform enjoyable and memorable.

### Additional Highlights

- **Responsive Design**: Our platform is fully responsive, ensuring a seamless experience across all devices, whether you're on a desktop, tablet, or smartphone.
- **User-Friendly Interface**: Intuitive navigation and a clean layout make it easy for users of all technical levels to interact with the platform.
- **Secure Transactions**: Robust security measures are in place to protect your data and ensure safe transactions throughout the platform.

---

With these features, our project aims to create a dynamic and user-centric platform that caters to the diverse needs of the tourism industry. Whether you're an advertiser, seller, tour guide, tourist, admin, or tourism governor, our platform provides the tools and functionalities to enhance your experience and achieve your goals.

## API Reference

Unlock the full potential of our DuckTourism platform with our comprehensive API. Whether you're looking to integrate user management, activity bookings, payments, or marketplace functionalities, our API has you covered.

### 📘 Explore the API with Postman

For an interactive and detailed exploration of our API, access our [Postman Collection](https://www.postman.com/supply-cosmologist-23527190/packnquack/collection/6uu2arn/pack-n-quack?action=share&creator=38675775).

#### How to Use the Postman Collection

1. **Install Postman**: If you haven't already, download and install Postman from [here](https://www.postman.com/downloads/).

2. **Import the Collection**:
    - Click the [Postman Collection Link](https://www.postman.com/supply-cosmologist-23527190/packnquack/collection/6uu2arn/pack-n-quack?action=share&creator=38675775).
    - In Postman, click on the **Import** button located at the top left.
    - Select the **Link** tab and paste the URL provided above.
    - Click **Continue** and then **Import** to add the collection to your Postman workspace.

3. **Authenticate**:
    - Some endpoints require authentication. Ensure you have your API key or JWT token ready.
    - Use the **Authorization** tab in Postman to set your authentication headers.

4. **Explore and Test Endpoints**:
    - Browse through the collection to find various endpoints.
    - Click on any request to view details, modify parameters, and send requests directly from Postman.


## Code Snippets 

## Installation

To set up the project and install all dependencies, run the following command in the root directory:


```
npm run install:all
```
If you encounter errors, you can install the modules for the frontend and backend separately:
### Install frontend dependencies
```cd client
npm install
```

### Install backend dependencies
```
cd ../server
npm install
```

To start the project in development mode, open two separate terminals:

### First Terminal
```
cd client
npm run dev
```
### Second Terminal
```
cd ../server
npm run dev
```

**The frontend and backend should now be running concurrently in development mode.**

Create a `.env` file in the root directory and add the following variables:

### Environment Variables

```
PORT = 8000
MONGO_URI = 'mongodb+srv://captianquackerss:elbataaa@stillpacking.zfrig.mongodb.net/PackNQuack?retryWrites=true&w=majority&appName=StillPacking'

JWT_SECRET_KEY = 'CdkU;T(%P~sDnU(,.!y=8LUeFbZ4u!){'
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME = 'dz3l4ah26'
CLOUDINARY_API_KEY = '744238247253753'
CLOUDINARY_API_SECRET = 'CY2GvuO4arGjRtqzlig1mNl2gbk'

STRIPE_SECRET_KEY="sk_test_51Q9ZAaEnMz2UB6ryi0eUAWqKY29C1vHe3TMi1cxeTch5vqm2UkbF6Zs7bC28TpyIbKcYzjtAs4GJjMSoBi82X0gA00vCFO0O15"
EXHANGE_RATE_API_KEY="6fb8ac1b809a99dca51d9b6e"

AMADEUS_API_KEY="woAXdGMdfym1hv7fQtAMaAM72ISThMPO"
AMADEUS_API_SECRET="AMtYs9MkgscZPVCu"

EMAIL_PASSKEY="rzos ahdu mdln pjjg"

BIRTHDAY_COUPON_ID="l4KcArGy"
```


