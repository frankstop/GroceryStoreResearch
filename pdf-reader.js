import {getDocument, GlobalWorkerOptions} from "./assets/pdfjs/pdf.mjs";

GlobalWorkerOptions.workerSrc = new URL("./assets/pdfjs/pdf.worker.mjs", import.meta.url).href;

export async function renderPDF(container, doc) {
  const pdf = await getDocument({
    url: doc.file,
    standardFontDataUrl: new URL("./assets/pdfjs/standard_fonts/", import.meta.url).href,
    wasmUrl: new URL("./assets/pdfjs/wasm/", import.meta.url).href,
  }).promise;
  container.textContent = "";
  container.className = "pdf-reader";
  const toolbar = document.createElement("div");
  toolbar.className = "pdf-toolbar";
  toolbar.innerHTML = `<button type="button" data-action="previous" aria-label="Previous page">←</button>
    <label>Page <input type="number" min="1" max="${pdf.numPages}" value="1" aria-label="Page number"></label>
    <span>of ${pdf.numPages}</span><button type="button" data-action="next" aria-label="Next page">→</button>
    <label class="zoom-label">Zoom <select aria-label="Document zoom"><option value="1">Fit width</option><option value="1.5">150%</option><option value="2">200%</option><option value="3">300%</option></select></label>`;
  const stage = document.createElement("div");
  stage.className = "pdf-stage";
  stage.tabIndex = 0;
  stage.setAttribute("aria-label", "Document page. Use the page controls above to navigate.");
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  stage.append(canvas);
  const textDetails = document.createElement("details");
  textDetails.className = "pdf-text";
  const summary = document.createElement("summary");
  summary.textContent = "Read this page as text";
  const text = document.createElement("p");
  textDetails.append(summary, text);
  const status = document.createElement("p");
  status.className = "pdf-status";
  status.setAttribute("role", "status");
  container.append(toolbar, stage, status, textDetails);
  const previous = toolbar.querySelector('[data-action="previous"]');
  const next = toolbar.querySelector('[data-action="next"]');
  const input = toolbar.querySelector("input");
  const zoom = toolbar.querySelector("select");
  let currentPage = 1;
  let rendering = false;
  let resizePending = false;

  async function render(number) {
    if (rendering) return;
    rendering = true;
    previous.disabled = next.disabled = input.disabled = zoom.disabled = true;
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Loading page…";
    try {
      currentPage = Math.max(1, Math.min(pdf.numPages, Number(number) || 1));
      input.value = currentPage;
      const page = await pdf.getPage(currentPage);
      const original = page.getViewport({scale: 1});
      const scale = ((stage.clientWidth - 24) / original.width) * Number(zoom.value);
      const viewport = page.getViewport({scale});
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      canvas.setAttribute("aria-label", `${doc.title}, page ${currentPage} of ${pdf.numPages}. Text is available below.`);
      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
      }).promise;
      const content = await page.getTextContent();
      text.textContent = content.items.map(item => item.str + (item.hasEOL ? "\n" : " ")).join("");
      stage.scrollLeft = 0;
      status.textContent = `Page ${currentPage} of ${pdf.numPages}`;
    } catch (error) {
      status.textContent = "This page could not render. Open or download the original PDF using the links above.";
    } finally {
      rendering = false;
      stage.removeAttribute("aria-busy");
      previous.disabled = currentPage === 1;
      next.disabled = currentPage === pdf.numPages;
      input.disabled = zoom.disabled = false;
      if (resizePending) { resizePending = false; render(currentPage); }
    }
  }
  previous.addEventListener("click", () => render(currentPage - 1));
  next.addEventListener("click", () => render(currentPage + 1));
  input.addEventListener("change", () => render(Math.round(Number(input.value))));
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      render(Math.round(Number(input.value)));
    }
  });
  zoom.addEventListener("change", () => render(currentPage));
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (rendering) resizePending = true;
      else render(currentPage);
    }, 150);
  });
  await render(1);
}
