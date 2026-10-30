"""Export the original notebook's saved content; never execute its code."""

from pathlib import Path

import nbformat
from nbconvert import HTMLExporter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "documents" / "Grocery_Store_Research_Phase3.ipynb"
TARGET = ROOT / "documents" / "notebook.html"

notebook = nbformat.read(SOURCE, as_version=4)
exporter = HTMLExporter(template_name="lab")
exporter.embed_images = True
exporter.sanitize_html = False
body, _ = exporter.from_notebook_node(
    notebook,
    resources={"metadata": {"name": "Grocery Store Research · Analysis notebook"}},
)
# Preserve all original cells and saved outputs while making wide tables usable
# inside the mobile reader. Notebook formulas use nbconvert's MathJax renderer.
body = body.replace(
    "</head>",
    """<style>
body { background: #fff; }
main { max-width: 1280px; margin: auto; }
.jp-RenderedHTMLCommon { overflow-wrap: anywhere; }
.jp-RenderedHTMLCommon table { display: block; overflow-x: auto; }
.jp-RenderedImage img { max-width: 100%; height: auto; }
@media (max-width: 600px) {
  body { padding: 12px !important; }
  .jp-Cell { padding: 4px 0; }
  .jp-InputPrompt, .jp-OutputPrompt { min-width: 35px !important; padding: 0 4px !important; font-size: 9px; }
  .jp-RenderedHTMLCommon { padding: 0 8px !important; }
  .jp-RenderedHTMLCommon h1 { font-size: 1.65em; }
}
</style></head>""",
)
TARGET.write_text(body, encoding="utf-8")
print(f"Exported {len(notebook.cells)} cells with saved outputs to {TARGET.name}.")
