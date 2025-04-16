# Copilot Instructions for TidyUp Project

**Project Context:**

-   Project Name: TidyUp
-   Primary Technologies: ReactJS, InertiaJS, Laravel, Xampp
-   Component Library: Shadcn UI

**General Instructions:**

-   **Adhere to the specified technology stack.** Do not suggest or use alternative frameworks or libraries unless explicitly requested.
-   **Prioritize Shadcn UI:** Always use Shadcn UI components and styling. Do _not_ use inline styles or specific Tailwind CSS utility classes like `text-blue-500`, `grid`, `flex`, `items-center`, `justify-between`, `space-x-2`, `p-4`, `rounded-md`, `border`, `mt-4`, `mb-4`, `gap-4`, etc. Rely on Shadcn component composition and variants for layout and styling. Assume all necessary Shadcn components are available.
-   **Think like a senior developer:** Prioritize robustness, scalability, maintainability, and best practices in all generated code and suggestions.
-   **Optimize for Performance:** Write efficient and concise code. Avoid unnecessary complexity or redundancy.
-   **Assume Modern JavaScript:** Use ES6+ features (e.g., arrow functions, `const`/`let`, destructuring).
-   **Clear and Concise Code:** Keep code clean, readable, and well-commented.
-   **Prioritize Functionality:** Ensure the code functions correctly and fulfills the intended purpose.
-   **Use Inertia.js conventions:** When generating React components, ensure they are compatible with Inertia.js. This generally means they are designed to receive props from a Laravel backend.
-   **Xampp Environment:** Assume the code will be running in a Xampp environment, so file paths and server configurations should be compatible.
-   **Component Structure:** Create reusable and modular components.
-   **Error Handling:** Include basic error handling where appropriate (e.g., try/catch blocks, handling potential null values).
-   **File Naming:** Follow standard naming conventions (e.g., `ComponentName.jsx` for React components).
-   **Comments:** Add comments to explain complex logic or non-obvious code.
-   **Focus on the essentials:** Do not add extra features or styling unless requested.
-   **Assume correct imports:** You do not need to add import statements.
-   **Assume that the components are in the same directory.**
-   **Do not include the <body> or <html> tags**

**Specific Instructions:**

-   **React Components:**
    -   Use functional components with hooks.
    -   Structure components for reusability.
    -   Use prop types or TypeScript (if specified) for type checking.
    -   When using Shadcn components, use the correct casing. For example, use `<Button>` and not `<button>`.
-   **Laravel:**
    -   Generate Laravel code as needed to support the React components (e.g., controllers, routes).
    -   Follow Laravel best practices.
-   **Inertia.js:**
    -   Ensure that React components are set up to receive data from Laravel via Inertia.
    -   Use Inertia's `usePage` hook to access data in React components.
-   **Shadcn UI:**
    -   Use Shadcn components for all UI elements.
    -   Do _not_ use custom CSS or Tailwind utility classes unless absolutely necessary and approved.
    -   Use the correct Shadcn component variants (e.g., `variant="outline"`, `size="sm"`).
    -   Use the correct Shadcn component names.
-   **Optimization:**
    -   Avoid unnecessary re-renders in React components (e.g., using `useMemo`, `useCallback`).
    -   Write efficient database queries in Laravel.
    -   Keep component logic lean.

**Example Scenario:**

If I ask you to "create a form with fields for name and email," you should generate a React component that uses Shadcn UI's `Input` and `Button` components, structured to work within an Inertia.js application, and optimized for performance. You do _not_ need to use any raw HTML input elements or Tailwind utility classes. You should also not generate the Laravel controller unless specifically asked.

**Important Note:** I expect you to remember these instructions throughout our conversation. You do not need to ask me for clarification on these points again.
