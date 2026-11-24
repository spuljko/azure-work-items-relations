import assert from "node:assert/strict";
import test from "node:test";
import { buildChildrenTreeWiql, buildRelatedItemsWiql } from "../src/wiql.ts";
import { extractWorkItemIds } from "../src/contextParser.ts";
import { buildTempQueryUrl } from "../src/urlBuilder.ts";

test("buildChildrenTreeWiql generates recursive Hierarchy-Forward WIQL for single ID", () => {
  const wiql = buildChildrenTreeWiql([42]);
  assert.match(wiql, /FROM workitemLinks/);
  assert.match(wiql, /\[Source\]\.\[System\.Id\] = 42/);
  assert.match(wiql, /'System\.LinkTypes\.Hierarchy-Forward'/);
  assert.match(wiql, /MODE \(Recursive\)$/);
});

test("buildChildrenTreeWiql generates IN clause for multiple IDs", () => {
  const wiql = buildChildrenTreeWiql([10, 20, 30]);
  assert.match(wiql, /\[Source\]\.\[System\.Id\] IN \(10, 20, 30\)/);
  assert.match(wiql, /MODE \(Recursive\)$/);
});

test("buildRelatedItemsWiql generates Related direct links WIQL", () => {
  const wiql = buildRelatedItemsWiql([77]);
  assert.match(wiql, /FROM workitemLinks/);
  assert.match(wiql, /\[Source\]\.\[System\.Id\] = 77/);
  assert.match(wiql, /'System\.LinkTypes\.Related'/);
  assert.match(wiql, /MODE \(MayContain\)$/);
});

test("buildChildrenTreeWiql throws on empty IDs", () => {
  assert.throws(() => buildChildrenTreeWiql([]), /At least one work item ID/);
});

test("extractWorkItemIds handles single, multi-select, string IDs, and deduplicates", () => {
  assert.deepEqual(extractWorkItemIds({ workItemId: 123 }), [123]);
  assert.deepEqual(extractWorkItemIds({ id: "456" }), [456]);
  assert.deepEqual(extractWorkItemIds({ workItemIds: [1, "2", 1, -5, "abc"] }), [1, 2]);
  assert.deepEqual(extractWorkItemIds({ ids: [9, 10], id: 9 }), [9, 10]);
  assert.deepEqual(extractWorkItemIds({ workItems: [{ id: 50 }, { workItemId: 51 }] }), [50, 51]);
  assert.deepEqual(extractWorkItemIds(null), []);
});

test("buildTempQueryUrl formats Azure DevOps Queries URL cleanly", () => {
  const url = buildTempQueryUrl(
    "https://dev.azure.com/my-org/",
    "My Project",
    "abc-123"
  );
  assert.equal(
    url,
    "https://dev.azure.com/my-org/My%20Project/_queries/query/?tempQueryId=abc-123&resultsEditorContext=query-edit"
  );
});
