// ./src/pages/ClassDetailPage.jsx
import { useParams } from "react-router-dom";

export default function ClassDetailPage() {
  const { name } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📘 {decodeURIComponent(name)} 수업 상세 정보</h1>
      <p>이곳에 수업에 대한 자세한 내용을 보여줄 수 있어요.</p>
    </div>
  );
}
