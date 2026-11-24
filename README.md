# Work Items Relations in Queries (Azure DevOps Extension)

An Azure DevOps extension that adds two options to the context menu (`⋮` / `...`) for work items and in **Queries**:

- **Open Children in Queries** — opens a recursive tree (*Tree of work items*, `System.LinkTypes.Hierarchy-Forward`, `MODE (Recursive)`) for one or more selected work items.
- **Open Related in Queries** — opens the *Related* work items (`System.LinkTypes.Related`, `MODE (MayContain)`) for one or more selected work items.

## Where it appears in the interface

The contributions are registered on the following Azure Boards targets:
- `ms.vss-work-web.work-item-context-menu` (Backlogs, Boards, the Work Items list, and the Work Item form)
- `ms.vss-work-web.work-item-toolbar-menu` (the toolbar on the Work Item form)
- `ms.vss-work-web.query-result-work-item-menu` (the `⋮` menu on a row in *Queries*)
- `ms.vss-work-web.work-item-query-results-toolbar-menu` (the `...` toolbar in *Queries*)

## How to package and install it in your Azure DevOps organization

1. Open [vss-extension.json](vss-extension.json) and replace `"publisher": "your-publisher-id"` with your Publisher ID from [Visual Studio Marketplace Manage Publishers](https://marketplace.visualstudio.com/manage).
   - If you don't have a publisher yet, create a free publisher on the same portal (for example, for private extensions).
   - `"public": false` means the extension remains **private** — no public publication or Marketplace review is required.
2. Install the dependencies (if not already installed) and create a `.vsix` package:
   ```powershell
   npm install
   npm run package
   ```
   The package is created at `dist-vsix/<publisher>.work-items-relations-1.0.0.vsix`.
3. Upload the `.vsix` to [Visual Studio Marketplace Manage Publishers](https://marketplace.visualstudio.com/manage), then click **Share** and share it with your Azure DevOps organization. Install it under *Organization Settings → Extensions*.

## Checks (local)

```powershell
npm run typecheck
node --test tests/wiql-and-context.test.mjs
npm run package
```
