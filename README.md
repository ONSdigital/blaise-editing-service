# Blaise Editing Service

This service facilitates the review and editing of Blaise questionnaire data, supporting multiple user roles with distinct permissions and functionalities. It utilises two Blaise questionnaires: the original interview questionnaire and a derived "edit" questionnaire. A cloud function manages data synchronisation between these questionnaires.

## User Roles

The user roles case access and filtering is set in:"src\server\configuration\ServerConfigurationProvider.ts", if the filtering array is empty then all cases are accessable.

The roles are as follows:
* **SVT Supervisor**: Assigns cases to editors, tracks editing progress, and can directly edit cases in the "edit" questionnaire dataset. Filtered to cases in the "ONS" organisation with successful outcome codes
* **SVT Editor**: Reviews and edits completed cases in the "edit" questionnaire dataset. Filtered to cases in the "ONS" organisation with successful outcome codes
* **Researcher**: Accesses and edits any case in the "edit" questionnaire dataset, regardless of status or organization.
* **Survey Support**: Works with the original questionnaire ("main"), enabling the interviewer cases to be updated (usually to update the outcome code) and then can set cases to be set to be resent overnight and overwrite the "edit" questionnaire dataset for the case.

## Questionnaire Requirements

For this service to work the questionnaire needs to be in two parts:

## "Main" questionnaire

the "main" questionnaire, which the interviewers complete is completed the same way as the other surveys.
* The data in this is then copied overnight to an "edit" version of the questionnaire by the python cloud function "copy-cases-to-edit"

## "Edit" questionnaire

the "edit" questionnaire, is used in this application by the editors.  It needs to be named the same as the "main" questionnaire but with "_EDIT" on the end.

In the edit block there are fields which are used by this appliacation to know information about the case for editing purposes.
* **QEdit.AssignedTo**: This is popuated by the app when a supervisor assignes a case to an editor, it is used to filter when an editor logs in to only show them their assigned cases
* **QEdit.Edited**: This is set to 1 (in the questionnaire not byt the app) when the editor fisrt starts editing the case.  It is used to stop the cases being updated overnight as this would overwrite the edits if it did.
* **QEdit.LastUpdated**: This is updated to the current datetime in the "main" questionnaire with the value passed to the "edit" questionnaire in the overnight job.  Cases will only show in the editing serice if the lst updated matches in both.
* **QEdit.EditedStatus**: This enum is populated by the editor to show the status of editing the case with the options: [NotStarted = 0, Started = 1, Query = 2, Finished = 3].  This is then used in the editing service by editors and supervisors so they can see the workload and where it is at, they can also filter based on this status.



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
