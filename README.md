# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Do
- Supply backend port via environment variable
  - Other apps default of `5000`, that might be preferable by app engine.
- Add request logging
  - Other apps use pino, I'd suggest looking at winston and express-winston (see https://www.npmjs.com/package/express-winston)
  - Also take another look at Google Cloud Logging (see https://www.npmjs.com/package/@google-cloud/logging-winston)
- Deployment
  - Look at how the other apps do it, will require an App Engine template.
  - You might also need to make some changes to the package.json
- Ensure existing functionality is tested (frontend and backend)
  - The creation of the backend server should be moved to a function so that it can be created for each test.
  - Use supertest to test the express app
- Add GitHub actions to run lints and tests
  - STEAL FROM OTHER REPOS


## configuration
Create a new .env file and add the following variables.

| Variable               | Description                                                                                                             | Var Example          |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| PORT                   | Specify the Port for express server to run on. | 5000                 |
| BLAISE_API_URL         | URL that the [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) is running on to send calls to. Includes protocol i.e http:// | http://localhost:5011
| SERVER_PARK                   | Specify the name of the Blaise server park. | gusty                  |
| VM_EXTERNAL_WEB_URL                   | External URL used for CATI dashboard and survey links. Does NOT include any protocols i.e http:// | cati.com                 |                                                                                                  

The `.env` file should be setup as below

```.env
PORT='5000'
BLAISE_API_URL='http://localhost:5011'
SERVER_PARK='gusty'
VM_EXTERNAL_WEB_URL='cati.com'
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
