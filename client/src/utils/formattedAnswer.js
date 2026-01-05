// Improved formatResponse: protects code & math, transforms only outside math,
// then restores math with math/physics/chemistry fixes.
export default function formatResponse(response) {
  if (response == null) return "";

  // normalize newlines
  let text = String(response).replace(/\r\n/g, "\n");

  // placeholder store
  const store = [];
  const makeToken = (type, content) => {
    const id = store.length;
    store.push({ type, content });
    return `@@__PH_${id}__@@`;
  };

  // 1) Protect fenced code blocks ```...```
  text = text.replace(/```[\s\S]*?```/g, m => makeToken("code_fence", m));

  // 2) Protect inline code `...` (avoid multiline)
  text = text.replace(/`[^`\n]+`/g, m => makeToken("code_inline", m));

  // 3) Capture & normalize display math
  text = text.replace(
    /\\begin\{(equation\*?|align\*?|gather\*?)\}([\s\S]*?)\\end\{\1\}/gs,
    (_, env, inner) => makeToken("math_block", `$$${inner.trim()}$$`)
  );
  text = text.replace(/\\\[((?:.|\n)*?)\\\]/gs,
    (_, inner) => makeToken("math_block", `$$${inner.trim()}$$`));
  text = text.replace(/\$\$([\s\S]*?)\$\$/g,
    (_, inner) => makeToken("math_block", `$$${inner.trim()}$$`));

  // 4) Capture & normalize inline math
  text = text.replace(/\\\(((?:.|\n)*?)\\\)/gs,
    (_, inner) => makeToken("math_inline", `$${inner.trim()}$`));
  text = text.replace(/\\begin\{math\}([\s\S]*?)\\end\{math\}/gs,
    (_, inner) => makeToken("math_inline", `$${inner.trim()}$`));
  text = text.replace(/\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g,
    (_, inner) => makeToken("math_inline", `$${inner.trim()}$`));

  // ==== Now text has no code/math (all placeholders) ====

  // 5) Text-only fixes
  text = text.replace(/^##(?!\s)/gm, "##"); // headings
  text = text.replace(/\\\\/g, "\\");        // quadruple slashes
  text = text.replace(/\n{3,}/g, "\n\n");    // limit blank lines
  text = text.replace(/([^\n])\n([^\n])/g, "$1  \n$2"); // single newline → line break
  text = text.replace(/[ \t]+$/gm, "");      // trim line-end spaces

  // 5.5) Physics & Chemistry text fixes (outside math)

  // Chemistry: misplaced commas in molecules
  text = text.replace(/(\d),\s*([A-Z])/g, "$1$2");

  // Chemistry: remove semicolons in reactions
  text = text.replace(/;/g, " ");

  // Chemistry: normalize arrows
  text = text.replace(/<->/g, "\\leftrightarrow");
  text = text.replace(/<=>/g, "\\rightleftharpoons");
  text = text.replace(/->/g, "\\to");
  text = text.replace(/<- /g, "\\leftarrow ");

  // Physics: summations
  text = text.replace(/Σ\s*F/g, "$\\sum F$");
  text = text.replace(/Σ\s*τ/g, "$\\sum \\\\tau$");

  // Physics: torque symbol τ (standalone case)
  text = text.replace(/\bτ\b/g, "$\\\\tau$");

  // Physics: delta (replace plain Δ but not if already \Delta)
  text = text.replace(/Δ([a-zA-Z])/g, "\\Delta $1");
  text = text.replace(/Δ/g, "\\Delta ");

  // Units
  text = text.replace(/\bN\.m\b/g, "\\text{N·m}");
  text = text.replace(/J\/s/g, "\\tfrac{J}{s}");
  text = text.replace(/mol\/L/g, "\\tfrac{mol}{L}");

  // Scientific notation
  text = text.replace(/x\s*10\^(-?\d+)/g, "\\times 10^$1");

  // Temperature
  text = text.replace(/°C/g, "^\\circ\\text{C}");
  text = text.replace(/°K/g, "^\\circ\\text{K}");

  // ✅ Fix LaTeX-style temperatures outside math
  text = text.replace(/(\d+(\.\d+)?)\s*\^\\circ\s*\\text\{C\}/g,
    (_, num) => `$${num}^\\circ\\text{C}$`);
  text = text.replace(/(\d+(\.\d+)?)\s*\^\\circ\s*\\text\{K\}/g,
    (_, num) => `$${num}^\\circ\\text{K}$`);

  // 6) Restore placeholders with math/physics/chemistry fixes
  store.forEach((entry, idx) => {
    const token = `@@__PH_${idx}__@@`;
    let replacement = entry.content;

    if (entry.type === "math_block") {
      let inner = replacement.replace(/^\$\$(.*)\$\$$/s, (_, s) => s).trim();

      inner = inner.replace(/\n{2,}/g, "\n"); // collapse blank lines

      // inline \tfrac inside block → \frac
      inner = inner.replace(
        /(-?\d+)\s*\\tfrac\{(\d+)\}\{(\d+)\}/g,
        (_, w, a, b) => `${w}\\frac{${a}}{${b}}`
      );

      // ensure proper arrows & Δ inside math
      inner = inner.replace(/->/g, "\\to");
      inner = inner.replace(/<->/g, "\\leftrightarrow");
      inner = inner.replace(/<=>/g, "\\rightleftharpoons");
      inner = inner.replace(/Δ([a-zA-Z])/g, "\\Delta $1");
      inner = inner.replace(/Δ/g, "\\Delta ");
      inner = inner.replace(/x\s*10\^(-?\d+)/g, "\\times 10^$1");

      replacement = `\n$$\n${inner}\n$$\n`;

    } else if (entry.type === "math_inline") {
      let inner = replacement.replace(/^\$(.*)\$$/s, (_, s) => s).trim();

      // convert mixed number\frac → \tfrac
      inner = inner.replace(
        /(-?\d+)\s*\\frac\{(\d+)\}\{(\d+)\}/g,
        (_, w, a, b) => `${w}\\tfrac{${a}}{${b}}`
      );

      // ensure inline fixes
      inner = inner.replace(/\s*\n\s*/g, " "); // no newlines
      inner = inner.replace(/->/g, "\\to");
      inner = inner.replace(/<->/g, "\\leftrightarrow");
      inner = inner.replace(/<=>/g, "\\rightleftharpoons");
      inner = inner.replace(/Δ([a-zA-Z])/g, "\\Delta $1");
      inner = inner.replace(/Δ/g, "\\Delta ");
      inner = inner.replace(/x\s*10\^(-?\d+)/g, "\\times 10^$1");

      replacement = `$${inner}$`;
    } else {
      replacement = entry.content; // code_fence, code_inline
    }

    text = text.split(token).join(replacement);
  });

  // Final cleanups
  text = text.replace(/\${3,}/g, "$$");
  text = text.replace(/\n\s*\$\$/g, "\n$$");
  text = text.replace(/\$\$\s*\n/g, "$$\n");

  return text.trim();
}
