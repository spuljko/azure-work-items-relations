import { RestClientBase } from "azure-devops-extension-api/Common/RestClientBase";
import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context";

export interface TempQueryResponse {
  id: string;
  url?: string;
}

/**
 * REST client for Azure DevOps Temporary Queries (`_apis/wit/tempqueries`),
 * which is not generated in `azure-devops-extension-api/WorkItemTracking`.
 */
export class TempQueryRestClient extends RestClientBase {
  public static readonly RESOURCE_AREA_ID = "5264459e-e5e0-4bd8-b118-0985e68a4ec5";

  constructor(options: IVssRestClientOptions) {
    super(options);
  }

  public createTempQuery(wiql: string, project: string): Promise<TempQueryResponse> {
    return this.beginRequest<TempQueryResponse>({
      apiVersion: "7.1",
      method: "POST",
      routeTemplate: "{project}/_apis/wit/tempqueries",
      routeValues: { project },
      body: { wiql },
    });
  }
}
