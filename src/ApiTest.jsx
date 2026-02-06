import { useState } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_BASE = '/api/v1';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export default function AlanAPI() {
  const [output, setOutput] = useState('No output yet.');
  const [question, setQuestion] = useState('');
  const [summary, setSummary] = useState('');

  async function apiRequest(path,options={}) {
    const res = await fetch(`${API_BASE}${path}`,options);
    const data = await res.json();
    const only =
      typeof data?.content === "string"
        ? data.content
        : JSON.stringify(data, null, 2) ||
      typeof data?.summary === "string"
        ? data.summary
        : JSON.stringify(data, null, 2);

    console.log(only);
    return only;
  }
  async function getAnswer() {
    setOutput('처리중...');
    const qs = new URLSearchParams({
      content: question,
      client_id: CLIENT_ID
    }).toString();
    const data = await apiRequest(`/question?${qs}`);
    setOutput(data);
  }
  async function getSummary() {
    setOutput('처리중...');
    /*
    const res = await fetch(`${API_BASE}/chrome/page/summary`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: summary,
        client_id: CLIENT_ID
      })
    });
    const data = await res.json();
    setOutput(data?.summary || "요약이 없습니다.");
    */
    const data = await apiRequest(`/chrome/page/summary`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: summary,
        client_id: CLIENT_ID
      })
    });
    setOutput(data);
  }

  return (
    <div className="alan-api">
      <h2>Alan AI API Integration</h2>
      <p>Client ID: {CLIENT_ID ? "OK":"Client ID 없습니다"}</p>

      <section className="question-box">
        <h3>질문을 작성해주세요</h3>
        <form action="" onSubmit={e => { e.preventDefault(); getAnswer(); }}>
          <p>
            <input type="text" value={question} required onChange={(e) => setQuestion(e.target.value) } />
          </p>
          <button type="submit">입력</button>
        </form>
      </section>
      <section className="question-box">
        <h3>요약할 내용을 입력하세요</h3>
        <form action="" onSubmit={e => { e.preventDefault(); getSummary(); }}>
          <p>
            <textarea name="content" value={summary} onChange={(e) => setSummary(e.target.value)} rows="5" cols="45" required></textarea>
          </p>
          <button type="submit">요약해줘</button>
        </form>
      </section>

      <h3>Output</h3>
      <div className="output-box">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
      </div>
      <button onClick={() => setOutput('Button clicked!')}>Click me</button>
    </div>
  )
}
