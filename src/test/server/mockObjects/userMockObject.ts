import { User } from 'blaise-api-node-client';

const userMockObject:User = {
  name: 'Jake Bullet',
  role: 'SVT_Supervisor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
};

export const caseEditorsMockObject:User[] = [{
  name: 'Toby Maguire',
  role: 'SVT_Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Richmond Ricecake',
  role: 'SVT_Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Sarah Bosslady',
  role: 'SVT_Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
];

export default userMockObject;
