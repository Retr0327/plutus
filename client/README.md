# Frontend

The Client is a modern, responsive frontend application built to interact with the API. While my primary focus as an engineer is on the backend architecture, I wanted to ensure the frontend was robust, accessible, and provided a smooth user experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **UI Component Library**: Mantine UI (v9)
- **Data Fetching & State Management**: React Query (TanStack Query v5)
- **Form Handling**: React Hook Form

## Design Decisions

### Next.js & React

I chose Next.js 16 for its powerful routing capabilities, server-side rendering (SSR), and seamless integration with React 19. This ensures the application is fast, SEO-friendly, and provides a great developer experience.

### Mantine UI

To rapidly build a polished and accessible user interface without spending excessive time on custom CSS, I utilized Mantine UI. Mantine provides a comprehensive set of highly customizable components that look great out of the box. This allowed me to focus my efforts on the complex backend logic while still delivering a professional-looking frontend.

### React Query for Server State Management

Managing server state (fetching, caching, synchronizing, and updating data) can be complex. I integrated React Query to handle these tasks efficiently. React Query simplifies data fetching, automatically handles caching and background updates, and provides built-in loading and error states, significantly reducing the amount of boilerplate code needed for API interactions.

### React Hook Form

For handling user input and form validation, I used React Hook Form. It is highly performant, minimizes re-renders, and integrates easily with Mantine's form components, ensuring a smooth and responsive form submission experience.

## Features

- Responsive and accessible user interface built with Mantine.
- Efficient data fetching and caching using React Query.
- Seamless integration with the NestJS API.
- Modern React 19 features and Next.js App Router architecture.
