# To Do

- Supply backend port via environment variable
  - Other apps default of `5000`, that might be preferable by app engine
- Add request logging
  - Other apps use pino, I'd suggest looking at winston and express-winston (see https://www.npmjs.com/package/express-winston)
  - Also take another look at Google Cloud Logging (see https://www.npmjs.com/package/@google-cloud/logging-winston)
- Deployment
  - Look at how the other apps do it, will require an App Engine template.
  - You might also need to make some changes to the package.json
- Ensure existing functionality is tested (frontend and backend)
  - The creation of the backend server should be moved to a function so that it can be created for each test
  - Use supertest to test the express app
- Add GitHub actions to run lints and tests
  - Steal from other repos

# Blaise Editing Service

This service facilitates the review and editing of Blaise questionnaire data, supporting multiple user roles with distinct permissions and functionalities. It utilises two Blaise questionnaires: the original interview questionnaire and a derived "edit" questionnaire. A cloud function manages data synchronisation between these questionnaires.

## User Roles

* **SVT Supervisor**: Assigns cases to editors, tracks editing progress, and can directly edit cases.
* **SVT Editor**: Reviews and edits completed cases, flagged by specific outcome codes.
* **Researcher**: Accesses and edits any case, regardless of status or organization.
* **Survey Support**: Works with the original questionnaire, enabling case recoding.

# Local Setup

Prerequisites
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Cloud SDK](https://cloud.google.com/sdk/)

Clone the repository:

```shell script
git clone https://github.com/ONSdigital/blaise-editing-service
```

Create an .env file in the root of the project and add the following environment variables:

| Variable | Description | Example |
| --- | --- | --- |
| PORT | Port for the express server | 5000 |
| BLAISE_API_URL | URL that the [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) is running on (including protocol) | http://localhost:90 |
| SERVER_PARK | Name of the Blaise server park | gusty |
| VM_EXTERNAL_WEB_URL | External URL used for CATI (not including protocol) | cati.example.com |

Example `.env` file:

```.env
PORT='5000'
BLAISE_API_URL='http://localhost:90'
SERVER_PARK='gusty'
VM_EXTERNAL_WEB_URL='cati.example.com'
```

Open a tunnel to our Blaise RESTful API in your GCP project:
```shell
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:90 --zone europe-west2-a
```
