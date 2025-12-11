# [Project Name]

This is a POC project for Luna AI. It is built using Next.js, TypeScript, Tailwind CSS, and utilizes Prisma with a MariaDB database.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (LTS version recommended, e.g., v18 or v20)
- **npm**
- **MariaDB/MySQL Instance**: You need a running database server (locally or remote) that the application can connect to.

### 1. Environment Variables

Create a file named `.env` in the root directory of the project based on the `.env.example` file provided. This file stores sensitive configuration details, including your database connection string.

### 2. Installation and Prisma Schema Generation

This step installs dependencies and builds the necessary client code for database interaction.

| Command                   | Description                                                                                                                                                             |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`npm install`**         | Installs all required project dependencies defined in `package.json`.                                                                                                   |
| **`npx prisma generate`** | **Reads `schema.prisma`** and generates the Prisma Client code (`@/app/generated/prisma/client`). This allows TypeScript to recognize your database models and methods. |

Run the commands in order:

```bash
# 1. Install all project dependencies
npm install

# 2. Generate the Prisma Client
npx prisma generate

```

## Thank you!
