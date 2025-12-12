import { Drawer, Spin } from "antd";
import { useEffect, useState } from "react";
import candidateService from "../../../../services/candidateService";

type Resume = any;

type Props = {
  open: boolean;
  candidateId?: number | null;
  onClose: () => void;
};

const ResumeDetail = ({ open, candidateId, onClose }: Props) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (candidateId == null) {
        setResume(null);
        return;
      }
      setLoading(true);
      try {
        const resp = await candidateService.getCandidateById(Number(candidateId));
        // Expecting API shape: { status, message, data: { candidate, resumes } }
        if (String(resp?.status || "").toLowerCase() === "success") {
          const apiData = resp.data ?? null;
          if (!apiData) {
            if (mounted) setResume(null);
            return;
          }

          const candidate = apiData.candidate ?? null;
          const resumes: any[] = Array.isArray(apiData.resumes) ? apiData.resumes : [];
          const latest = resumes.find((r) => r.isLatest) || resumes[0] || null;

          const resumesNormalized = Array.isArray(resumes)
            ? resumes.map((r) => ({
                resumeId: r.resumeId ?? r.id ?? null,
                fileUrl: r.fileUrl ?? r.file_url ?? null,
                createdAt: r.createdAt ?? r.created_at ?? null,
                status: r.status ?? null,
                isLatest: Boolean(r.isLatest),
              }))
            : [];

          const mapped = {
            candidateName: candidate?.fullName ?? candidate?.candidateName ?? candidate?.name ?? null,
            email: candidate?.email ?? null,
            phone: candidate?.phoneNumber ?? candidate?.phone ?? null,
            notes: candidate?.notes ?? null,
            jobTitle: latest?.jobTitle ?? null,
            fileUrl: latest?.fileUrl ?? null,
            resumeId: latest?.resumeId ?? latest?.id ?? null,
            createdAt: latest?.createdAt ?? candidate?.createdAt ?? null,
            status: latest?.status ?? null,
            resumes: resumesNormalized,
          };

          if (mounted) setResume(mapped);
        } else {
          if (mounted) setResume(null);
        }
      } catch (e) {
        console.error("Failed to load candidate detail:", e);
        if (mounted) setResume(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (open) load();

    return () => {
      mounted = false;
    };
  }, [candidateId, open]);

  return (
    <Drawer title={resume?.candidateName || "Candidate Detail"} open={open} onClose={onClose} width={600}>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : resume ? (
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <strong>Applied for Job:</strong> {resume.jobTitle || "N/A"}
          </div>
          <div>
            <strong>Full Name:</strong> {resume.candidateName}
          </div>
          <div>
            <strong>Email:</strong> {resume.email || "-"}
          </div>
          <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 16 }}>
            <strong>Phone:</strong> {resume.phone || "-"}
          </div>
          
          <div>
            <strong>Resume files:</strong>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.isArray(resume.resumes) && resume.resumes.length > 0 ? (
                resume.resumes.map((r: any, idx: number) => (
                  <div key={r.resumeId || idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">Resume #{idx + 1}</a>
                    <span style={{ color: '#888', fontSize: 12 }}>
                      {r.createdAt ? `— ${new Date(r.createdAt).toLocaleString()}` : ''}
                    </span>
                    {r.isLatest ? <span style={{ marginLeft: 8, color: '#1890ff', fontSize: 12 }}>Latest</span> : null}
                  </div>
                ))
              ) : (
                <span style={{ color: '#888' }}>No files available</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Select a candidate to view details</div>
      )}
    </Drawer>
  );
};

export default ResumeDetail;
