import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE = "/api/v1";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export default function ApiTest() {
  const [output, setOutput] = useState("");
  const [qContent, setQContent] = useState("");
  const [summaryContent, setSummaryContent] = useState("");

  // 공통 fetch
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

  // 1) GET /question  (쿼리스트링: content, client_id)
  async function getQuestion() {
    setOutput("요청 중…");
    const qs = new URLSearchParams({
      content: qContent || "",
      client_id: CLIENT_ID,
    });

    const res = await apiRequest(`/question?${qs.toString()}`);
    const data = await res.json().catch(() => ({}));
    const only =
      typeof data?.content === "string"
        ? data.content
        : JSON.stringify(data, null, 2);

    setOutput(only);
  }

  // 2) POST /chrome/page/summary (body: { content })
  async function postPageSummary() {
    setOutput("요청 중…");
    const qs = new URLSearchParams({ client_id: CLIENT_ID });
    const body = { content: summaryContent };

    const res = await apiRequest(`/chrome/page/summary?${qs.toString()}`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    // ✅ summary만 출력
    if (typeof data?.summary === "string") setOutput(data.summary);
    else setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: 20, display: "grid", gap: 24 }}>
      <h1>Alan AI API</h1>

      {/* 섹션 A: /question */}
      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>GET /question </h2>
        <label style={{ display: "block", marginBottom: 8 }}>content</label>
        <textarea
          rows={3}
          style={{ width: "100%", marginBottom: 12 }}
          placeholder="질문 내용을 입력하세요 (content)"
          value={qContent}
          onChange={(e) => setQContent(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={getQuestion}>GET /question</button>
        </div>
      </section>


      {/* 섹션 B: /chrome/page/summary */}
      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>POST /chrome/page/summary</h2>
        <p style={{ margin: "4px 0 12px", color: "#666" }}>
          요구 필드: <code>body.content</code>
        </p>
        <label style={{ display: "block", marginBottom: 8 }}>content</label>
        <textarea
          rows={3}
          style={{ width: "100%", marginBottom: 12 }}
          placeholder='요약할 페이지 내용을 그대로 붙여넣거나, 프롬프트 형태로 입력하세요.'
          value={summaryContent}
          onChange={(e) => setSummaryContent(e.target.value)}
        />
        <button onClick={postPageSummary}>POST /chrome/page/summary</button>
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Output</h2>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {output || ""}
          </ReactMarkdown>
        </div>
      </section>
    </div>
  );
}
