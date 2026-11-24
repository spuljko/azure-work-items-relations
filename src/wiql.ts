const DEFAULT_SELECT_COLUMNS = [
  "[System.Id]",
  "[System.WorkItemType]",
  "[System.Title]",
  "[System.AssignedTo]",
  "[System.State]",
  "[System.Tags]",
].join(", ");

function formatSourceIdPredicate(workItemIds: readonly number[]): string {
  if (workItemIds.length === 0) {
    throw new Error("At least one work item ID is required.");
  }

  if (workItemIds.length === 1) {
    return `[Source].[System.Id] = ${workItemIds[0]}`;
  }

  return `[Source].[System.Id] IN (${workItemIds.join(", ")})`;
}

/**
 * Builds a WIQL tree query returning the selected work item(s) and all
 * recursive descendants (children, grandchildren, etc.).
 */
export function buildChildrenTreeWiql(workItemIds: readonly number[]): string {
  const sourceFilter = formatSourceIdPredicate(workItemIds);

  return [
    `SELECT ${DEFAULT_SELECT_COLUMNS}`,
    "FROM workitemLinks",
    "WHERE",
    `    (${sourceFilter})`,
    "    AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')",
    "MODE (Recursive)",
  ].join("\n");
}

/**
 * Builds a WIQL direct-links query returning the selected work item(s) and
 * all work items linked via the symmetric Related link type.
 */
export function buildRelatedItemsWiql(workItemIds: readonly number[]): string {
  const sourceFilter = formatSourceIdPredicate(workItemIds);

  return [
    `SELECT ${DEFAULT_SELECT_COLUMNS}`,
    "FROM workitemLinks",
    "WHERE",
    `    (${sourceFilter})`,
    "    AND ([System.Links.LinkType] = 'System.LinkTypes.Related')",
    "MODE (MayContain)",
  ].join("\n");
}
