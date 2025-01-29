import { User } from 'blaise-api-node-client';

const userMockObject:User = {
  name: 'Jake Bullet',
  role: 'SVT Supervisor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
};

export const caseEditorsMockObject:User[] = [{
  name: 'Toby Maguire',
  role: 'SVT Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Richmond Ricecake',
  role: 'SVT Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Sarah Bosslady',
  role: 'SVT Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
];

export default userMockObject;
