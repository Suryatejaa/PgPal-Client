import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import GlobalAlert from "../../../../components/GlobalAlert";

const RulesSection = ({
  propertyId,
  isOwner,
  userId,
}: {
  propertyId: string;
  isOwner: boolean;
  userId: string;
}) => {
  const [rules, setRules] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  const fetchRules = async () => {
    try {
      const res = await axiosInstance.get(
        `/property-service/${propertyId}/rules`
      );
      setRules(res.data);
    } catch (err: any) {
      const expected = "Rules not found";
      if (err?.response?.data?.error !== expected) {
        setAlert({
          message:
            err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch rules.",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchRules();
  }, [propertyId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await axiosInstance.post(`/property-service/${propertyId}/rules`, {
        rule: input.trim(),
      });
      setInput("");
      setAlert({ message: "Rule added!", type: "success" });
      fetchRules();
    } catch {
      setAlert({ message: "Failed to add rule", type: "error" });
    }
  };

  const handleDelete = async (ruleId: string, updatedBy: string) => {
    if (!isOwner && updatedBy !== userId) return;
    try {
      await axiosInstance.delete(
        `/property-service/${propertyId}/rules/${ruleId}`
      );
      setAlert({ message: "Rule deleted!", type: "success" });
      fetchRules();
    } catch {
      setAlert({ message: "Failed to delete rule", type: "error" });
    }
  };
  console.log(isOwner, userId);

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4 text-black">
      {alert && <GlobalAlert {...alert} onClose={() => setAlert(null)} />}
      <div className="font-bold text-purple-700 mb-2">Rules</div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add rule"
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          className="bg-purple-600 text-white px-3 py-1 rounded"
          type="submit"
        >
          Add
        </button>
      </form>
      <ul className="space-y-1">
        {rules.map((rule) => (
          <li
            key={rule._id}
            className="flex items-center justify-between bg-purple-50 rounded px-2 py-1"
          >
            <span>{rule.rule}</span>
            {(isOwner || rule.updatedBy === userId) && (
              <button
                className=" bg-transparent text-s py-1 px-1 text-red-600 hover:text-red-800"
                onClick={() => handleDelete(rule._id, rule.updatedBy)}
                title="Delete"
                type="button"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RulesSection;
