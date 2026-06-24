"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";

export default function ReviewPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const { user } = useAuth();
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") window.location.href = "/";
  }, [user]);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/admin/applications/all`);
        const found = (res.data || []).find((a: any) => String(a.id) === String(id));
        setApp(found || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApp();
  }, [id]);

  const handleForward = async () => {
    await api.post(`/admin/applications/${id}/forward`, { notes: "Forwarded by admin" });
    window.location.href = "/dashboard/admin";
  };

  const handleBlock = async () => {
    await api.post(`/admin/applications/${id}/block`, { blocked_reason: "Ineligible", notes: "Blocked by admin" });
    window.location.href = "/dashboard/admin";
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-4">Review Application</h1>
      {!app && <div>Loading...</div>}
      {app && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-medium">Application</h3>
            <p>Business: {app.business?.company_name}</p>
            <p>Bank: {app.bank?.institution_name}</p>
            <p>Amount: {app.amount_requested}</p>
            <p>Purpose: {app.purpose}</p>
            <p>AI Score: {app.business?.readiness_score}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">Actions</h3>
            <button className="btn btn-primary w-full mb-2" onClick={handleForward}>Forward to Bank</button>
            <button className="btn btn-danger w-full" onClick={handleBlock}>Block Request</button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
