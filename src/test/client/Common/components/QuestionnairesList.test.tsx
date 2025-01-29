import { render, RenderResult } from '@testing-library/react';
import userMockObject from '../../../server/mockObjects/userMockObject';
import QuestionnairesList from '../../../../client/Common/components/QuestionnairesList';
import { frsQuestionnaireDetails1MockObject } from '../../../server/mockObjects/questionnaireListMockObject';

let view:RenderResult;

describe('Renders the error screen if the users role is not in the accepted list', () => {
  it('should render the editor page correctly when given an invalid role', async () => {
    // arrange
    const user = userMockObject;
    const questionnaire = frsQuestionnaireDetails1MockObject;
    user.role = 'invalid_Role';

    // act
    view = render(<QuestionnairesList questionnaires={[questionnaire]} user={user} />);

    // assert
    expect(view).toMatchSnapshot(
      'EditorPageInvalidRole',
    );
  });

  it('Should display the expected error on the screen when given an invalid role', async () => {
    // arrange
    const user = userMockObject;
    const questionnaire = frsQuestionnaireDetails1MockObject;
    user.role = 'invalid_Role';

    // act
    view = render(<QuestionnairesList questionnaires={[questionnaire]} user={user} />);

    // assert
    const errorDetails = view.getByTestId('ErrorMessage');
    expect(errorDetails).toHaveTextContent('User role invalid_Role not recognised');
  });
});
