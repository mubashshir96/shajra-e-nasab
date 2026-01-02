import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function exportAsImage() {
  const node = document.getElementById("shajra-tree");
  if (!node) {
    alert("Tree not found");
    return;
  }

  const dataUrl = await toPng(node, {
    backgroundColor: "#ecfdf5",
    pixelRatio: 2,
  });

  const link = document.createElement("a");
  link.download = "shajra-e-nasab.png";
  link.href = dataUrl;
  link.click();
}

export async function exportAsPDF() {
  const node = document.getElementById("shajra-tree");
  if (!node) {
    alert("Tree not found");
    return;
  }

  const dataUrl = await toPng(node, {
    backgroundColor: "#ecfdf5",
    pixelRatio: 2,
  });

  const pdf = new jsPDF("landscape", "px", "a4");
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();

  pdf.addImage(dataUrl, "PNG", 10, 10, w - 20, h - 20);
  pdf.save("shajra-e-nasab.pdf");
}
