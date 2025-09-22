// scripts/hf_generate_snippet.js
// Node.js script untuk generate/optimize kode dengan Granite via Hugging Face Inference API
// usage: HF_API_TOKEN env var required
import axios from "axios";
import fs from "fs";

const HF_API_TOKEN = process.env.HF_API_TOKEN;
if (!HF_API_TOKEN) {
  console.error("Set HF_API_TOKEN in env (export HF_API_TOKEN='hf_...')");
  process.exit(1);
}

// Pilih model granite yang ada di HF — ganti sesuai model yang tersedia
const MODEL = "ibm/granite-1b-instruct"; // contoh, sesuaikan dengan model nyata di HF

async function generate(prompt) {
  const url = `https://api-inference.huggingface.co/models/${MODEL}`;
  try {
    const resp = await axios.post(url,
      { inputs: prompt, options: { wait_for_model: true, use_cache: false } },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}`, "Content-Type": "application/json" }, timeout: 120000 }
    );
    return resp.data;
  } catch (err) {
    console.error("Request failed:", err.response ? err.response.data : err.message);
    throw err;
  }
}

async function main() {
  const prompt = fs.readFileSync("./scripts/prompt_example.txt", "utf-8") || `
Refactor this JavaScript shuffle function to use Fisher-Yates and support an optional seed parameter for deterministic shuffling. Provide the implementation and a short example usage.

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
  `;

  console.log("Prompt:", prompt);
  const out = await generate(prompt);
  console.log("Raw output:", JSON.stringify(out, null, 2));

  // HF Inference can return string or array depending on model specifics:
  // Attempt to extract text
  let text = "";
  if (Array.isArray(out)) {
    // some models return array with generated text in .generated_text
    text = out.map(x => x.generated_text || x.text || JSON.stringify(x)).join("\n");
  } else if (typeof out === "object" && out.generated_text) {
    text = out.generated_text;
  } else if (typeof out === "string") {
    text = out;
  } else {
    text = JSON.stringify(out);
  }

  console.log("Generated:\n", text);
  // Save to file for review
  fs.writeFileSync("./scripts/generated_shuffled.txt", text);
}

main().catch(console.error);
