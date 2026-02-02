import { useState } from "react";

const API_BASE = "/api/v1";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export default function ApiTest() {
  const [output, setOutput] = useState("");
  const [qContent, setQContent] = useState("");

  async function apiRequest(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    return res;
  }

  async function getQuestion() {
    setOutput("요청 중…");

    const qs = new URLSearchParams({
      content: qContent || "",
      client_id: CLIENT_ID,
    });

    const res = await apiRequest(`/question?${qs.toString()}`);
    const data = await res.json().catch(() => ({}));

    // content만 있으면 content를, 없으면 전체 JSON 출력
    const only =
      typeof data?.content === "string"
        ? data.content
        : JSON.stringify(data, null, 2);

    setOutput(only);
  }

  return (
    <div style={{ padding: 20, display: "grid", gap: 16 }}>
      <h1>Alan AI API</h1>

      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>GET /question</h2>

        <label style={{ display: "block", marginBottom: 8 }}>content</label>
        <textarea
          rows={3}
          style={{ width: "100%", marginBottom: 12 }}
          placeholder="질문 내용을 입력하세요 (content)"
          value={qContent}
          onChange={(e) => setQContent(e.target.value)}
        />

        <button onClick={getQuestion}>GET /question</button>
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Output</h2>
        <pre style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          {output}
        </pre>
      </section>
    </div>
  );
}
