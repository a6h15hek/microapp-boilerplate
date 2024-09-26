# MicroApp Boilerplate

This boilerplate is designed to facilitate the creation of micro apps that include both frontend and backend code within a single repository. These micro apps can be deployed independently and used as plugins in other applications.

## Use Case
Imagine having a page with graphs and data that needs to be replicated in another application. Instead of rewriting its service and UI in the new app, a micro app can be created with all the necessary frontend and backend code in one repository. This micro app can then be deployed independently and used as a plugin in multiple applications. This approach is useful for creating anything from a full page to a simple component that needs to be reused across different apps.

## Advantages
- **Independent Updates**: Updates to the micro app do not require rebuilding the parent application.
- **Independent Deployment**: Each micro app can be deployed on its own.
- **Modularity**: Issues in one app do not affect others, ensuring modularity.
- **Reusable Template**: The boilerplate template can be reused to create multiple micro apps.
- **Easy Updates**: Updates to the boilerplate can be easily rebased across all micro apps.

## Developer Benefits
Developers can use this boilerplate to create various small UI examples, screens, pages, or components, which can then be integrated into their parent applications. As the name suggests, it is used to create micro apps that can be integrated into a parent application. These micro apps can be deployed and managed separately.

## Repository Usage
This repository can serve as a template for new repositories. Developers can create new repositories named after the micro app, add the relevant code, and host them independently. These micro apps can then be used as plugins in multiple applications.

## Technology
This boilerplate uses Create ReactJS with Webpack for building the frontend and Spring Boot with Maven for the backend. It is customized for simplicity, with ESLint rules for writing code. 

### Environment Variables
- **Frontend**: Uses `.env` files for environment variables.
- **Backend**: Uses default Spring Boot configuration.

The environment variables for the frontend and backend can be separated within the application.

### Development and Production
Commands to build, run test cases, and run the development server for both the frontend and backend are configured in `package.json`. Module aliasing is added for the frontend to ensure consistent imports.


## Rules

### Folder Naming Conventions

```bash
root
├── service
│   ├── main
│   │   ├── config
│   │   ├── controllers
│   │   ├── services
│   │   ├── models
│   │   └── utils
│   └── test
├── views
│   ├── components
│   ├── utils
│   ├── pages
│   ├── contexts
│   └── test

```

### Test Files
- **Backend**: Tests should be written in the `service/test` folder.
- **Frontend**: Tests should be written in the `views/test` folder.

This structure ensures that your project remains organized and adheres to the specified conventions. Let me know if you need any more details or further customization!

## Running the Project

To run the project, use the following commands:

### Build for Production
- **Frontend**: `npm run build:react:prod`
- **Backend**: `mvn clean install -Pprod -Dspring.profiles.active=prod`

### Start Development Server
- **Frontend**: `npm run start:react`
- **Backend**: `mvn clean spring-boot:run -Pdev -Dspring.profiles.active=dev`

### Build for Development
- **Frontend**: `npm run build:react`
- **Backend**: `mvn clean install -Pdev -Dspring.profiles.active=dev`

### Run Tests
- **Backend**: `mvn clean test -X`


## Updating a Repository Created from a Template

Once you create a repository using a template, it will be disconnected from that template. To manually update your repository with changes from the template, follow these steps:

1. **Add the template as a remote:**
```bash
git remote add template [template_url]
```

1. **Fetch all changes from the template:**
```bash
git fetch --all
```

1. **Merge changes from the template’s main branch:**
```bash
git merge template/main --allow-unrelated-histories
```
**Note:** If your project has diverged significantly from the template, you may encounter merge conflicts. These will need to be resolved manually.
