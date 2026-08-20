# Blaise Editing Service

The Blaise Editing Service enables the review and editing of Blaise questionnaire data through a web interface, supporting various user roles with specific access and permissions. It utilises two Blaise questionnaires, the original "main" interview questionnaire and a derived "edit" questionnaire. A [cloud function](https://github.com/ONSdigital/blaise-editing-cloud-functions) manages data synchronisation between these questionnaires.

## User Roles

Case access and filtering are defined in `src/server/utils/serverConfigurationProvider.ts`.

### Roles Overview

- **SVT Supervisor**
  - Assigns cases to editors and tracks progress.
  - Can edit cases in the "edit" questionnaire.
  - Access limited to cases in the "ONS" organisation with successful outcome codes.

- **SVT Editor**
  - Reviews and edits cases in the "edit" questionnaire assigned to them.
  - Access limited to cases in the "ONS" organisation with successful outcome codes.

- **FRS Researcher**
  - Full access to all cases in the "edit" questionnaire.
  - No filters applied.

- **Survey Support**
  - Works with the "main" questionnaire.
  - Can update interviewer cases (e.g., outcome code).
  - Has the ability to set a case to be re-synced during the nightly sync.
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
- A PowerShell script to generate this version is available in the [FRS questionnaire repository](https://github.com/ONSdigital/FRS-Questionnaire).

### Questionnaire Fields

These fields help the service manage case assignment and editing state:

| Field                | Purpose                                                                                                                                                                                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QEdit.AssignedTo`   | The service populates this field when a supervisor assigns a case to an editor. This ensures that upon login, an editor's view is filtered to display only the cases assigned to them.                                                                                                                           |
| `QEdit.Edited`       | Set to `1` (true) by the questionnaire when editing begins. Prevents overnight sync so that edits aren't overwritten.                                                                                                                                                                                            |
| `QEdit.LastUpdated`  | Timestamp of last edit set by the questionnaire. Used to determine sync status.                                                                                                                                                                                                                                  |
| `QEdit.EditedStatus` | An enum (`[NotStarted = 0, Started = 1, Query = 2, Finished = 3]`) indicating the case's editing stage. While triggered by editor actions, this field is updated by the questionnaire's internal logic, not directly by the editing service. The service uses this status for workload visibility and filtering. |

### Data Entry Settings

The questionnaire must include a `Data Entry Settings` specifically named `ReadOnly`. This setting should be configured with the `Accept input, don't save` option. It allows users, such as the research team, to run through the questionnaire and test data entries without these changes being saved to the database. This is valuable for observing the questionnaire's behaviour and determining the consequences of potential modifications. To activate this mode for a case, `DataEntrySettings=ReadOnly` is appended to the URL.

## Case Visibility

Cases appear in the editing service for allocation and editing if **one** of the following is true:

- `QEdit.Edited` is set to `1` (shown as `TRUE` or `TR` in the database).
- `QEdit.LastUpdated` matches in both the "main" and "edit" questionnaires, given they're not null.

This [query](https://github.com/ONSdigital/blaise-nuget-api/blob/a554517244478526677608796f66f2bf2a7c7b16/Blaise.Nuget.Api.Core/Services/SqlService.cs#L37) determines which cases are fetched from the datasets.

## Survey Support – Re-enabling Sync

The `Survey Support` role can set a case for re-sync, allowing it to be overwritten by the "main" version questionnaire during the next nightly sync. This is performed via a dedicated button within the editing service UI. Activating this button resets the following fields in the "edit" questionnaire:

- `QEdit.AssignedTo = ''` (unassigns the case)
- `QEdit.Edited = ''` (flags the case as not edited, allowing updates during nightly sync)
- `QEdit.LastUpdated = 1900-01-01` (this specific date also temporarily removes the case from active editing lists and prevents reassignment until synced)

This feature is typically used to ensure changes made to a case in the "main" questionnaire (e.g., an updated outcome code) are mirrored in its "edit" version, even if editing has already started on that case.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 24+ (see `engines` in [package.json](package.json))
- [Yarn](https://yarnpkg.com/) 4+
- [Google Cloud SDK (`gcloud` CLI)](https://cloud.google.com/sdk/)

### Clone and install packages

```shell
git clone https://github.com/ONSdigital/blaise-editing-service.git
cd blaise-editing-service
yarn install
```

### Authenticate with Google Cloud

This is required for opening an IAP tunnel and for production-style application-default credentials.

```shell
gcloud auth login
gcloud config set project ons-blaise-v2-dev
gcloud auth application-default login --impersonate-service-account=ons-blaise-v2-dev@appspot.gserviceaccount.com
```

### Start an IAP tunnel to Blaise REST API

Run this in a separate terminal and keep it running:

```shell
gcloud compute start-iap-tunnel restapi-1 80 --local-host-port=localhost:8080 --zone europe-west2-a
```

Expected output includes `Listening on port [8080]`.

### Configure environment variables

Create a `.env` file in the repository root.

Required variables:

- `BLAISE_API_URL`: Blaise REST API URL (for example `localhost:8080` or `http://localhost:8080`).
- `SERVER_PARK`: Blaise server park name.
- `CATI_URL`: External CATI web URL (without protocol).
- `PROJECT_ID`: GCP project ID used for auth/session keying and audit logging.
- `URL_DOMAIN`: Cookie/session domain (for local development, typically `localhost`).
- `SESSION_SECRET`: Session secret used by login middleware.

Example `.env` file:

```ini
BLAISE_API_URL=localhost:8080
SERVER_PARK=gusty
CATI_URL=dev-cati.social-surveys.gcp.onsdigital.uk
PROJECT_ID=ons-blaise-v2-dev
URL_DOMAIN=localhost
SESSION_SECRET=blah
```

### Run the app

```shell
yarn dev
```

UI is available at http://localhost:3000/.

If local processes become stale, stop known ports and watchers:

```shell
yarn kill
```

## Common Scripts

- `yarn dev`: Run frontend and backend in watch mode
- `yarn build`: Build client and server
- `yarn typecheck`: Run TypeScript checks for frontend and server
- `yarn lint`: Run typecheck, ESLint, Prettier checks, and knip
- `yarn lint-fix`: Auto-fix lint/prettier issues and run knip fix
- `yarn test`: Run Vitest suite with coverage
- `yarn test-watch`: Run Vitest in watch mode
- `yarn spellcheck`: Run cspell over code, config, and docs files
