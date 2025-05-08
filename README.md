# Blaise Editing Service

The Blaise Editing Service enables the review and editing of Blaise questionnaire data through a web interface, supporting various user roles with specific access and permissions. It utilises two Blaise questionnaires, the original "main" interview questionnaire and a derived "edit" questionnaire. A [cloud function](https://github.com/ONSdigital/blaise-editing-cloud-functions) manages data synchronisation between these questionnaires.

## User Roles

Case access and filtering are defined in `src\server\configuration\ServerConfigurationProvider.ts`, if the filtering array is empty then all cases are accessible.

### Roles Overview

- **SVT Supervisor**
  - Assigns cases to editors and tracks progress.
  - Can edit cases in the "edit" questionnaire.
  - Access limited to cases in the "ONS" organisation with successful outcome codes.

- **SVT Editor**
  - Reviews and edits cases in the "edit" questionnaire assigned to them.
  - Access limited to cases in the "ONS" organisation with successful outcome codes.

- **Researcher**
  - Full access to all cases in the "edit" questionnaire.
  - No filters applied.

- **Survey Support**
  - Works with the "main" questionnaire.
  - Can update interviewer cases (e.g., outcome code).
  - Has the ability to set a case to be resent during the nightly synchronisation.
  - No filters applied.

## Questionnaire Requirements

Each questionnaire must exist in two versions:

### "Main" Version Questionnaire

- Completed by interviewers.
- Sample data should only be loaded here.
- Copied nightly to the "edit" version using the [`copy-cases-to-edit`](https://github.com/ONSdigital/blaise-editing-cloud-functions) Cloud Function.

### "Edit" Version Questionnaire

- Used exclusively for editing.
- Duplicate of the "main" questionnaire, but with some modifications and an `_EDIT` suffix.
- A PowerShell script to generate this version is available on the [FRS questionnaire respository](https://github.com/ONSdigital/FRS-Questionnaire).

### Fields

These fields help the service manage case assignment and editing state:

| Field | Purpose |
|---|---|
| `QEdit.AssignedTo` | The service populates this field when a supervisor assigns a case to an editor. This ensures that upon login, an editor's view is filtered to display only the cases assigned to them |
| `QEdit.Edited` | Set to `1` by the questionnaire when editing begins. Prevents overnight sync so that edits aren't overwritten. |
| `QEdit.LastUpdated` | Timestamp of last edit set by the questionnaire. Used to determine sync status. |
| `QEdit.EditedStatus` | An enum (``[NotStarted = 0, Started = 1, Query = 2, Finished = 3]``) indicating the case's editing stage. While triggered by editor actions, this field is updated by the questionnaire's internal logic, not directly by the editing service. The service uses this status for workload visibility and filtering. |

### Data Entry Settings

The questionnaire must include a `Data Entry Settings` specifically named `ReadOnly`. This setting should be configured with the `Accept input, don't save` option. It allows users, such as the research team, to run through the questionnaire and test data entries without these changes being saved to the database. This is valuable for observing the questionnaire's behavior and determining the consequences of potential modifications. To activate this mode for a case, `DataEntrySettings=ReadOnly` is appended to the URL.

## Case Visibility

Cases appear in the editing service for allocation and editing if **one** of the following is true:

- `QEdit.Edited` is set to `1`.
- `QEdit.LastUpdated` matches in both the "main" and "edit" questionnaires.

## Survey Support – Re-enabling Sync



The `Survey Support` role can trigger a re-sync for a case, allowing it to be overwritten by the "main" version during the next nightly data transfer. This is performed via a dedicated button within the editing service UI. Activating this button resets the following fields in the "edit" questionnaire:

- `QEdit.AssignedTo = ''` (unassigns the case)
- `QEdit.Edited = ''` (flags the case as not edited, allowing overnight updates)
- `QEdit.LastUpdated = 1900-01-01` (this specific date also temporarily removes the case from active editing lists and prevents reassignment until synced)

This feature is typically used to ensure changes made to a case in the "main" questionnaire (e.g., an updated outcome code) are mirrored in its "edit" version, even if editing has already started on that case.

## Local Setup

Prerequisites

* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Cloud SDK](https://cloud.google.com/sdk/)

Clone down the repository:

```shell script
git clone https://github.com/ONSdigital/blaise-editing-service
```

Install service dependencies locally:

```shell script
yarn install
```

Create an .env file in the root of the project and add the following environment variables:

| Variable | Description | Example |
| --- | --- | --- |
| PORT | Port for the express server | 5000 |
| BLAISE_API_URL | URL that the [Blaise Rest API](https://github.com/ONSdigital/blaise-api-rest) is running on (including protocol) | <http://localhost:90> |
| SERVER_PARK | Name of the Blaise server park | gusty |
| VM_EXTERNAL_WEB_URL | External URL used for CATI (not including protocol) | cati.example.com |

Example `.env` file:

```.env
PORT='5000'
BLAISE_API_URL='http://localhost:90'
SERVER_PARK='gusty'
VM_EXTERNAL_WEB_URL='cati.example.com'
```

### GCP Setup

This service interacts with Blaise via our custom Blaise RESTful API.

Open a tunnel to the RESTful API in your chosen GCP environment:

```shell script
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:<API_PORT> --zone europe-west2-a
```

**NB** Ensure the REST API tunnel is running on the correct address and port that you expect, i.e. the proxy address outlined in `package.json`

As this service outputs logs to GCP, you will need to login before running the service, you can do this with the following command:

```shell script
gcloud auth application-default login
```

## Running Service

Prequisites:

* Blaise REST API access (via GCP IAP tunnel)
* You are authenticated with GCP

To run the service locally:

```shell script
yarn dev
```

Once the service is running, you can access it by visiting the URL displayed in the terminal. If you're using the example `.env` configuration, the application will be available at [localhost:5000](http://localhost:5000/).

## Testing

Run the tests:

```shell
yarn test
```
