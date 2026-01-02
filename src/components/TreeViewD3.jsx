import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TreeViewD3({ members, onView, onEdit }) {
  const ref = useRef();

  useEffect(() => {
    if (!members.length) return;

    d3.select(ref.current).selectAll("*").remove();
    d3.selectAll(".shajra-tooltip").remove();

    // 👁 Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "shajra-tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("borderRadius", "8px")
      .style("padding", "8px")
      .style("fontSize", "12px")
      .style("boxShadow", "0 2px 10px rgba(0,0,0,0.2)")
      .style("pointerEvents", "none")
      .style("opacity", 0);

    const rootMember = members.find((m) => m.parent_id === null);
    if (!rootMember) return;

    const buildTree = (parent) => ({
      ...parent,
      children: members
        .filter((m) => m.parent_id === parent.id)
        .map((c) => buildTree(c)),
    });

    const treeData = buildTree(rootMember);

    const width = 1000;
    const height = 600;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(
        d3.zoom().on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
      );

    const g = svg.append("g").attr("transform", "translate(50,50)");

    const root = d3.hierarchy(treeData);
    d3.tree().size([width - 100, height - 100])(root);

    // 🔗 Links
    g.selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "#555");

    // 👤 Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      // 👁 Single click = view
      .on("click", (_, d) => onView(d.data))
      // ✏️ Double click = edit
      .on("dblclick", (_, d) => onEdit(d.data))
      // 🧾 Hover tooltip
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`
            <div style="text-align:center;">
              ${
                d.data.photo_url
                  ? `<img src="${d.data.photo_url}"
                       style="width:50px;height:50px;border-radius:50%;
                              object-fit:cover;margin-bottom:5px;" />`
                  : ""
              }
              <div><b>${d.data.name}</b></div>
              <div>DOB: ${d.data.dob || "-"}</div>
              <div>${d.data.village || ""}</div>
              <div>${d.data.occupation || ""}</div>
            </div>
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // 🟢 Card
    node
      .append("rect")
      .attr("x", -50)
      .attr("y", -20)
      .attr("width", 100)
      .attr("height", 40)
      .attr("rx", 8)
      .attr("fill", "#f0fdf4")
      .attr("stroke", "#333");

    // 📝 Name
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fontSize", "12px")
      .text(
        (d) =>
          `${d.data.gender === "male" ? "👨" : "👩"} ${d.data.name}`
      );

    // 🧹 Cleanup
    return () => {
      tooltip.remove();
    };
  }, [members, onView, onEdit]);

  return (
    <div
      id="shajra-tree"
      ref={ref}
      style={{
        background: "#ecfdf5",
        padding: 20,
        overflow: "auto",
      }}
    />
  );
}
