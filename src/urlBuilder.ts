export function buildTempQueryUrl(
  collectionBaseUrl: string,
  projectName: string,
  tempQueryId: string
): string {
  const normalizedBase = collectionBaseUrl.replace(/\/+$/, "");
  const encodedProject = encodeURIComponent(projectName);
  const encodedQueryId = encodeURIComponent(tempQueryId);
  return `${normalizedBase}/${encodedProject}/_queries/query/?tempQueryId=${encodedQueryId}&resultsEditorContext=query-edit`;
}
