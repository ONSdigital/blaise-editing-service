import { User } from 'blaise-api-node-client';

const userMockObject:User = {
  name: 'Jake Bullet',
  role: 'Manager',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
};

export const caseEditorsMockObject:User[] = [{
  name: 'Toby Maguire (4 cases)',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Richmond Ricecake (2 cases)',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
{
  name: 'Sarah Bosslady (0 cases)',
  role: 'Editor',
  serverParks: ['gusty'],
  defaultServerPark: 'gusty',
},
];

export default userMockObject;
