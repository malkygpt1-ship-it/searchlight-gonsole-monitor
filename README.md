# Searchlight — GSC monitor

A zero-build dashboard for the published Google Sheets workbook populated by `script.txt`. It reads the Impressions, Clicks, and Avg Position tabs live, finds the newest populated day, and keeps all historical dates available.

## Run locally

From this folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

The dashboard needs internet access in the browser to read the published CSV tabs and load the typefaces. No API key is required because the workbook is publicly published.
