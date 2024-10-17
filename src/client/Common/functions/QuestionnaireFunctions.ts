export default function questionnaireDisplayName(questionnaireName: string): string {
  return questionnaireName.replace('_EDIT', '');
}
