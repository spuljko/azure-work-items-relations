function parsePositiveInt(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

function appendUniqueIds(source: unknown, target: number[], seen: Set<number>): void {
  if (Array.isArray(source)) {
    for (const item of source) {
      appendUniqueIds(item, target, seen);
    }
    return;
  }

  const parsed = parsePositiveInt(source);
  if (parsed !== null && !seen.has(parsed)) {
    seen.add(parsed);
    target.push(parsed);
  }
}

/**
 * Extracts unique positive work item IDs from the various `actionContext` shapes
 * passed by Azure Boards context menus, toolbars, and query result grids.
 */
export function extractWorkItemIds(actionContext: unknown): number[] {
  if (!actionContext || typeof actionContext !== "object") {
    return [];
  }

  const ctx = actionContext as Record<string, unknown>;
  const result: number[] = [];
  const seen = new Set<number>();

  // Prefer explicit selection arrays first when available (multi-select in grids/backlogs),
  // then fall back to single-item properties (work item form / row menu).
  appendUniqueIds(ctx.workItemIds, result, seen);
  appendUniqueIds(ctx.ids, result, seen);
  appendUniqueIds(ctx.selectedWorkItemIds, result, seen);
  appendUniqueIds(ctx.workItemId, result, seen);
  appendUniqueIds(ctx.id, result, seen);

  if (Array.isArray(ctx.workItems)) {
    for (const item of ctx.workItems) {
      if (item && typeof item === "object") {
        const wi = item as Record<string, unknown>;
        appendUniqueIds(wi.id ?? wi.workItemId, result, seen);
      }
    }
  }

  return result;
}
