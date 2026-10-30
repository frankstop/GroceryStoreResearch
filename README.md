# Grocery Store Research

### The Price Pulse of Long Island

**Can this week's grocery catalog prices help predict next week's price changes?**

This repository presents the completed Phase 3 research project by **Frank Valdez**, investigating weekly grocery price movements using longitudinal online catalogs from Long Island retailers. It includes the original final report, presentation, research poster, and Python notebook, together with a public website for reading all four documents.

**[Visit the research website](https://frankiejvaldez.com/GroceryStoreResearch/)** · **[Browse all documents](https://frankiejvaldez.com/GroceryStoreResearch/#documents)**

## Research documents

| Document | What it contains | View online | Original file |
| --- | --- | --- | --- |
| Final research report | Full methodology, data preparation, exploratory analysis, model comparisons, error analysis, and conclusions; 13 pages. | [Read report](https://frankiejvaldez.com/GroceryStoreResearch/view.html?doc=report) | [PDF](documents/Phase_3_Final_Report_Grocery_Store_Research.pdf) |
| Presentation slides | A 12-slide walkthrough of the research question, approach, findings, and recommendations. | [View slides](https://frankiejvaldez.com/GroceryStoreResearch/view.html?doc=slides) | [PDF](documents/Phase_3_Presentation_Slides_Grocery_Store_Research.pdf) |
| Research poster | A single landscape page summarizing the dataset, experiments, visualizations, and results. | [View poster](https://frankiejvaldez.com/GroceryStoreResearch/view.html?doc=poster) | [PDF](documents/Phase_3_Poster_Grocery_Store_Research.pdf) |
| Analysis notebook | Python implementation with saved charts, tables, and evaluation outputs; 20 cells. | [Read notebook](https://frankiejvaldez.com/GroceryStoreResearch/view.html?doc=notebook) | [Jupyter notebook](documents/Grocery_Store_Research_Phase3.ipynb) |

All four supplied original files are preserved unchanged. The readable notebook HTML and document thumbnails are additional presentation assets.

## Research question and data

The supervised task predicts whether a product's listed price will change by **at least 5% in either direction exactly seven calendar days later**. These are online catalog offers, rather than transaction prices or actual household purchases.

The underlying collection spans **May 16–September 6, 2026** and contains:

- **1,031,264 raw records** across **82 retailer snapshots**.
- Four grocery banners: **King Kullen, Stop & Shop, Gala Baldwin, and Gala Freeport**.
- **952,034 unique retailer–listing–date observations** after consolidation.
- A King Kullen prediction benchmark of **254,453 exact-seven-day labeled pairs**, split into **207,942 training** and **46,511 held-out test observations**.

King Kullen supplies the supervised benchmark because its archive provides the longitudinal coverage and dual current/regular pricing needed for the task. The four-retailer collection does not imply that the reported predictive results apply to every retailer.

## Approach

The study preserves product identifiers as strings, parses prices into exact integer cents, reconciles duplicate category listings, and builds predictors using information available at or before each observation date. Training and testing follow a strict chronological split, with the last three target weeks held out.

Five classifier families—Logistic Regression, Linear SVM, Decision Tree, Random Forest, and Histogram-Based Gradient Boosting—are compared with a majority-class baseline and an observed-discount heuristic. Five-fold expanding-window validation refits preprocessing inside each fold. Supplementary K-Means clustering explores product pricing regimes.

## Selected findings

These values are **reported in the supplied final research documents**; publication of this archive did not rerun the experiments.

- Currently discounted King Kullen products changed price by at least 5% the following week **42.04%** of the time, compared with **7.00%** for undiscounted products.
- Nonlinear tree ensembles outperformed the linear classifiers and discount heuristic in the reported evaluation.
- The unweighted Histogram-Based Gradient Boosting model achieved **ROC-AUC 0.7935** and **PR-AUC / average precision 0.5364**. Applying the validation-selected threshold of **0.31** produced **F1 0.4785**.
- A separate **balanced-class-weight** gradient boosting variant achieved **balanced accuracy 0.7153** and **recall 58.99%**. These results belong to different model configurations and should not be interpreted as a single operating point.

See the final report for the complete comparisons, subgroup analyses, methodological assumptions, and limitations, including multi-week promotions, cold-start products, and cross-retailer matching.

## Reproducibility and scope

The notebook is published with its existing outputs, so visitors can inspect the code and results without installing Python. The static HTML preview is generated without executing notebook cells.

**This is a document archive, not a standalone data or model distribution.** The four supplied files do not include the `phase-2-support/` and `phase-3-outputs/` folders referenced by the notebook. Running all cells requires the corresponding cleaned Parquet datasets, CSV tables, preprocessed matrices, and fitted model files at the relative paths specified in the code. Those supporting files and the raw catalog collection are not included here.

The notebook metadata records Python **3.12.13**. Its imports include pandas, NumPy, matplotlib, seaborn, scikit-learn, joblib, and IPython; Parquet loading also requires a compatible engine. The preview dependency file below is solely for rendering saved notebook content and does not define the original analysis environment.

## Website and local preview

The site uses static HTML, CSS, and a small document-selection script. There is no application build step, backend, or account requirement. PDF previews use a bundled Mozilla PDF.js reader with page navigation, zoom controls, and a text alternative for each page. Direct-open and download links also provide access to the originals. Notebook math rendering uses the standard nbconvert MathJax CDN; code, tables, and chart images are included in the exported HTML.

From the repository root:

```sh
python3 -m http.server 8000
```

Open [the local website](http://localhost:8000/). All site assets use relative paths so the same files work under the GitHub Pages repository URL.

To regenerate the notebook preview after updating the original notebook:

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-preview.txt
python scripts/render_notebook.py
```

The export reads saved outputs and does not run the research code.

## GitHub Pages

Pages publishes the **root of the `main` branch**, using the account’s existing `frankiejvaldez.com` Pages domain with HTTPS enabled. The `.nojekyll` file serves the static files directly. After edits are committed and pushed to `main`, GitHub Pages republishes the site.

To inspect or change the publishing source, open the repository's **Settings → Pages → Build and deployment**, select **Deploy from a branch**, and use **`main` / `(root)`**. GitHub's [Pages configuration documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) describes this setup.

## Repository layout

```text
.
├── index.html                 # Research homepage and four-document library
├── view.html                  # Document reader with navigation and downloads
├── viewer.js                  # Fixed document selection and embed behavior
├── pdf-reader.js              # Local PDF rendering, pagination, zoom, and text
├── styles.css                 # Responsive site and reader styles
├── assets/                    # Original-document thumbnails and site icon
├── documents/                 # Four original documents and notebook HTML
├── scripts/render_notebook.py # Rebuilds the saved-output notebook preview
├── requirements-preview.txt   # Preview-generation dependency only
├── README.md
├── THIRD_PARTY_NOTICES.md      # Licenses and attribution for bundled libraries
└── .nojekyll
```

## Authorship and reuse

**Frank Valdez** — project owner, dataset creator, and domain reviewer. The final report includes the project's provenance and acknowledgment of AI preparation/coding assistance. Phase 3 was finalized on **October 30, 2026**.

No open-source license is granted for the original research or website content. Bundled third-party software retains its own licenses; see [third-party notices](THIRD_PARTY_NOTICES.md). Public availability does not by itself grant permission to redistribute the research, documents, or underlying retailer data. Refer to the original documents for their references and attribution.
