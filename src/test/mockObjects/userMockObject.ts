import { User } from 'blaise-api-node-client';

const userMockObject:User = {
  name: 'Jake Bullet',
  role: 'Manager',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
};

export const caseEditorsMockObject:User[] = [{
  name: 'Toby Maguire',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Richmond Ricecake',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Sarah Bosslady',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
];

export default userMockObject;
