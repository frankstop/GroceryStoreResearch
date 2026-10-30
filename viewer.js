"use strict";

const documents = Object.freeze({
  report: {title: "Final research report", kind: "PDF · 13 pages", file: "documents/Phase_3_Final_Report_Grocery_Store_Research.pdf"},
  slides: {title: "Presentation slides", kind: "PDF · 12 slides", file: "documents/Phase_3_Presentation_Slides_Grocery_Store_Research.pdf"},
  poster: {title: "Research poster", kind: "PDF · 1 landscape page", file: "documents/Phase_3_Poster_Grocery_Store_Research.pdf"},
  notebook: {title: "Analysis notebook", kind: "Python · Saved code and results", file: "documents/notebook.html", original: "documents/Grocery_Store_Research_Phase3.ipynb"}
});

const key = new URLSearchParams(window.location.search).get("doc") || "report";
const doc = Object.hasOwn(documents, key) ? documents[key] : null;

if (doc) {
  document.title = `${doc.title} · Grocery Store Research`;
  document.getElementById("doc-title").textContent = doc.title;
  document.getElementById("doc-kind").textContent = doc.kind;
  document.getElementById("reader-tools").hidden = false;
  document.getElementById("open-document").href = doc.file;
  document.getElementById("download-document").href = doc.original || doc.file;
  const note = document.getElementById("viewer-note");
  note.textContent = key === "notebook"
    ? "Read-only preview with saved charts and tables. Rerunning the notebook requires its supporting datasets. "
    : "If the PDF does not appear in your browser, ";
  const fallback = document.createElement("a");
  fallback.href = doc.file;
  fallback.target = "_blank";
  fallback.rel = "noopener";
  fallback.textContent = key === "notebook" ? "Open the preview in its own tab." : "open the PDF directly.";
  note.append(fallback);
  for (const tab of document.querySelectorAll("[data-doc]")) {
    if (tab.dataset.doc === key) tab.setAttribute("aria-current", "page");
  }
  const container = document.getElementById("frame-container");
  if (key === "notebook") {
    const frame = document.createElement("iframe");
    frame.className = "document-frame";
    frame.title = doc.title;
    frame.src = doc.file;
    frame.setAttribute("sandbox", "allow-scripts");
    container.append(frame);
  } else {
    container.textContent = "Loading document…";
    import("./pdf-reader.js")
      .then(({renderPDF}) => renderPDF(container, doc))
      .catch(() => { container.textContent = "The preview could not load. Use Open full screen or Download original above to read this document."; });
  }
} else {
  document.getElementById("doc-title").textContent = "Document not found";
  document.getElementById("viewer-note").textContent = "Choose one of the four research documents above to continue.";
}
