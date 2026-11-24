# Work Items Relations in Queries (Azure DevOps Extension)

Ekstenzija za Azure DevOps koja u kontekstni izbornik (`⋮` / `...`) na work itemima i u **Queries** dodaje dvije opcije:

- **Open Children in Queries** — otvara rekurzivno stablo (*Tree of work items*, `System.LinkTypes.Hierarchy-Forward`, `MODE (Recursive)`) za odabrani work item (ili više njih).
- **Open Related in Queries** — otvara povezane (*Related*) work iteme (`System.LinkTypes.Related`, `MODE (MayContain)`) za odabrani work item (ili više njih).

## Gdje se pojavljuje u sučelju

Kontribucije su registrirane na sljedeće Azure Boards ciljeve:
- `ms.vss-work-web.work-item-context-menu` (Backlogs, Boards, Work Items lista, Work Item forma)
- `ms.vss-work-web.work-item-toolbar-menu` (alatna traka na Work Item formi)
- `ms.vss-work-web.query-result-work-item-menu` (`⋮` izbornik na retku u *Queries*)
- `ms.vss-work-web.work-item-query-results-toolbar-menu` (`...` alatna traka u *Queries*)

## Kako spakirati i instalirati u svoju Azure DevOps organizaciju

1. Otvori [vss-extension.json](vss-extension.json) i zamijeni `"publisher": "your-publisher-id"` sa svojim Publisher ID-em s [Visual Studio Marketplace Manage Publishers](https://marketplace.visualstudio.com/manage).
   - Ako još nemaš publisher, na istom portalu kreiraj besplatni publisher (npr. za privatne ekstenzije).
   - `"public": false` znači da ekstenzija ostaje **privatna** — nije potrebna javna objava ni pregled Marketplacea.
2. Instaliraj ovisnosti (ako već nisu) i napravi `.vsix` paket:
   ```powershell
   npm install
   npm run package
   ```
   Paket nastaje u `dist-vsix/<publisher>.work-items-relations-1.0.0.vsix`.
3. Uploadaj `.vsix` na [Visual Studio Marketplace Manage Publishers](https://marketplace.visualstudio.com/manage), zatim klikni **Share** i podijeli ga sa svojom Azure DevOps organizacijom, pa ga instaliraj u *Organization Settings → Extensions*.

## Provjere (lokalno)

```powershell
npm run typecheck
node --test tests/wiql-and-context.test.mjs
npm run package
```
