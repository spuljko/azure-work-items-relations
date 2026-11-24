import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  getClient,
  IGlobalMessagesService,
  IHostNavigationService,
  ILocationService,
  IProjectPageService,
} from "azure-devops-extension-api";
import { extractWorkItemIds } from "./contextParser";
import { TempQueryRestClient } from "./tempQueryClient";
import { buildTempQueryUrl } from "./urlBuilder";
import { buildChildrenTreeWiql, buildRelatedItemsWiql } from "./wiql";

const CHILDREN_HANDLER_ID = "open-children-in-queries";
const RELATED_HANDLER_ID = "open-related-in-queries";

type RelationKind = "children" | "related";

async function showToast(message: string): Promise<void> {
  try {
    const messagesService = await SDK.getService<IGlobalMessagesService>(
      CommonServiceIds.GlobalMessagesService
    );
    messagesService.addToast({
      message,
      duration: 4000,
    });
  } catch {
    console.warn(message);
  }
}

async function openRelationQuery(
  kind: RelationKind,
  actionContext: unknown
): Promise<void> {
  try {
    const workItemIds = extractWorkItemIds(actionContext);
    if (workItemIds.length === 0) {
      await showToast("Select at least one work item to open its relations in Queries.");
      return;
    }

    const projectService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectService.getProject();
    if (!project) {
      await showToast("Could not determine the active Azure DevOps project.");
      return;
    }

    const wiql =
      kind === "children"
        ? buildChildrenTreeWiql(workItemIds)
        : buildRelatedItemsWiql(workItemIds);

    const tempQueryClient = getClient(TempQueryRestClient);
    const tempQuery = await tempQueryClient.createTempQuery(wiql, project.id);

    const locationService = await SDK.getService<ILocationService>(
      CommonServiceIds.LocationService
    );
    const collectionBaseUrl = await locationService.getServiceLocation();
    const targetUrl = buildTempQueryUrl(
      collectionBaseUrl,
      project.name,
      tempQuery.id
    );

    const navService = await SDK.getService<IHostNavigationService>(
      CommonServiceIds.HostNavigationService
    );
    navService.navigate(targetUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to open query.";
    console.error("[work-items-relations]", error);
    await showToast(`Unable to open ${kind} in Queries: ${message}`);
  }
}

function createHandler(kind: RelationKind) {
  return {
    execute: (actionContext: unknown) => openRelationQuery(kind, actionContext),
  };
}

async function bootstrap(): Promise<void> {
  try {
    await SDK.init({ loaded: false, applyTheme: false });

    const childrenHandler = createHandler("children");
    const relatedHandler = createHandler("related");

    SDK.register(CHILDREN_HANDLER_ID, childrenHandler);
    SDK.register(RELATED_HANDLER_ID, relatedHandler);

    const activeContributionId = SDK.getContributionId();
    if (
      activeContributionId &&
      activeContributionId !== CHILDREN_HANDLER_ID &&
      activeContributionId !== RELATED_HANDLER_ID
    ) {
      if (activeContributionId.endsWith(CHILDREN_HANDLER_ID)) {
        SDK.register(activeContributionId, childrenHandler);
      } else if (activeContributionId.endsWith(RELATED_HANDLER_ID)) {
        SDK.register(activeContributionId, relatedHandler);
      }
    }

    await SDK.notifyLoadSucceeded();
  } catch (error) {
    console.error("[work-items-relations] Initialization failed:", error);
    try {
      await SDK.notifyLoadFailed(
        error instanceof Error ? error.message : String(error)
      );
    } catch {
      // Ignore if host channel failed before handshake
    }
  }
}

void bootstrap();
