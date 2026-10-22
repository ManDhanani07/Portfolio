import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  isAuthenticated,
  getCurrentUser,
  logout,
  getAdminTaskReport,
  downloadAdminTaskReportCsv,
  generateAiDescription,
} from "../api";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Clock,
  ListTodo,
  X,
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  Calendar,
  Sparkles,
  Tag,
  AlignLeft,
  Sliders,
  ClipboardCheck,
  Layers,
  Zap,
  CheckSquare,
  Flame,
  AlertTriangle,
  ArrowDownCircle,
  Flag,
  Search,
  GripVertical,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Kanban,
  Columns3,
  FileText,
  Download,
  BarChart3,
  Printer,
  Shield,
  ShieldAlert,
} from "lucide-react";
import "./TaskManager.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  // Practical 13: AI API Generator States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  // Admin Report Generator States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [reportEndDate, setReportEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [lastGeneratedFile, setLastGeneratedFile] = useState(null);

  const navigate = useNavigate();

  // Helper to normalize backend status and priority values
  const normalizeTask = (task) => {
    if (!task) return task;

    let s = task.status;
    if (!s || s === "undefined") {
      s = task.completed ? "Completed" : "Pending";
    } else {
      const lower = String(s).toLowerCase().trim();
      if (lower === "completed") s = "Completed";
      else if (lower === "in progress" || lower === "inprogress") s = "In Progress";
      else s = "Pending";
    }

    let p = task.priority;
    if (!p) {
      p = "Medium";
    } else {
      const lowerPrio = String(p).toLowerCase().trim();
      if (lowerPrio === "high") p = "High";
      else if (lowerPrio === "low") p = "Low";
      else p = "Medium";
    }

    return {
      ...task,
      status: s,
      priority: p,
      completed: s === "Completed",
    };
  };

  // Toast
  const showToast = (type, message, operation = "") => {
    setToast({
      type,
      message,
      operation,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Auth & Task Loading
  useEffect(() => {
    const handleAuthEvent = () => {
      setCurrentUser(getCurrentUser());
      setLoggedIn(isAuthenticated());
    };

    window.addEventListener("auth_state_change", handleAuthEvent);
    loadTasks();

    return () => {
      window.removeEventListener("auth_state_change", handleAuthEvent);
    };
  }, []);

  const loadTasks = async () => {
    if (!isAuthenticated()) {
      setLoggedIn(false);
      setLoadingTasks(false);
      return;
    }

    try {
      setLoadingTasks(true);
      const data = await getTasks();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeTask);
      setTasks(normalized);
      setLoggedIn(true);
      showToast(
        "success",
        `${normalized.length} task${normalized.length !== 1 ? "s" : ""} loaded successfully`,
        "GET"
      );
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        setLoggedIn(false);
        showToast("error", "Session expired or invalid token. Please log in.", "401 AUTH");
      } else {
        showToast("error", "Failed to load tasks from backend", "GET");
      }
    } finally {
      setLoadingTasks(false);
    }
  };

  // Task Creation / Editing Modal Controls
  const openCreateModal = (defaultStatus = "Pending") => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus(defaultStatus);
    setPriority("Medium");
    setAiNotice(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
    setAiNotice(null);
  };

  // =========================================================================
  // Practical 13: AI API Generator Handler (OpenAI / Gemini with Graceful Degradation)
  // =========================================================================
  const handleGenerateAiDescription = async () => {
    if (!title || !title.trim()) {
      showToast("error", "Please enter a task title first before generating AI description", "AI REQUIREMENT");
      return;
    }

    try {
      setAiLoading(true);
      setAiNotice(null);

      const result = await generateAiDescription(title.trim());

      if (result && result.description) {
        setDescription(result.description);
        if (result.priority) {
          setPriority(result.priority);
        }
        setAiNotice({
          source: result.source || "AI Service",
          fallback: Boolean(result.fallback),
          disclaimer: result.disclaimer || "AI-generated suggestion. Please review before saving.",
        });
        showToast(
          "success",
          result.fallback ? "Smart fallback description generated" : "✨ AI description generated successfully",
          "AI SUCCESS"
        );
      }
    } catch (err) {
      console.error("AI API Error:", err);
      showToast("error", err.message || "Failed to generate AI description", "AI ERROR");
    } finally {
      setAiLoading(false);
    }
  };

  // POST / PUT Task Handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      showToast("error", "Please enter a task title", "VALIDATION");
      return;
    }

    try {
      setLoading(true);
      const isCompleted = status === "Completed";

      if (editingId) {
        const updatedRaw = await updateTask(editingId, {
          title: title.trim(),
          description: description.trim(),
          status: status,
          priority: priority,
          completed: isCompleted,
        });

        const updatedTask = normalizeTask(updatedRaw);

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === editingId ? updatedTask : task
          )
        );

        showToast("success", "Task updated successfully", "PUT");
        closeModal();
      } else {
        const newRaw = await createTask({
          title: title.trim(),
          description: description.trim(),
          status: status,
          priority: priority,
          completed: isCompleted,
        });

        const newTask = normalizeTask(newRaw);

        setTasks((previousTasks) => [newTask, ...previousTasks]);
        showToast("success", "Task created successfully", "POST");
        closeModal();
      }
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        editingId ? "Failed to update task" : "Failed to create task",
        editingId ? "PUT" : "POST"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    const norm = normalizeTask(task);
    setEditingId(norm._id);
    setTitle(norm.title);
    setDescription(norm.description || "");
    setStatus(norm.status);
    setPriority(norm.priority);
    setAiNotice(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteTask(id);

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== id)
      );

      showToast("success", "Task deleted successfully", "DELETE");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to delete task", "DELETE");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;

    try {
      setLoading(true);
      const updatedRaw = await updateTask(task._id, {
        title: task.title,
        description: task.description || "",
        status: newStatus,
        priority: task.priority || "Medium",
        completed: newStatus === "Completed",
      });

      const updatedTask = normalizeTask(updatedRaw);

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item._id === task._id ? updatedTask : item
        )
      );

      showToast("success", `Moved to ${newStatus}`, "PUT");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update task status", "PUT");
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(task._id);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== columnStatus) {
      setDragOverCol(columnStatus);
    }
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverCol(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    if (task.status !== targetStatus) {
      await handleStatusChange(task, targetStatus);
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  // Admin Report Handlers: Fetch data, generate PDF, and export CSV
  const handleFetchAdminReport = async (silent = false) => {
    setReportLoading(true);
    setReportError(null);
    try {
      const data = await getAdminTaskReport({
        startDate: reportStartDate,
        endDate: reportEndDate,
      });
      setReportData(data);
      if (!silent) {
        showToast("success", "Admin report data loaded", "REPORT");
      }
      return data;
    } catch (err) {
      console.error("Report Fetch Error:", err);
      setReportError(err.message || "Failed to generate report. Admin authorization required.");
      showToast("error", err.message || "Forbidden: Admin access required", "403");
      return null;
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadReportCsv = async () => {
    try {
      await downloadAdminTaskReportCsv({
        startDate: reportStartDate,
        endDate: reportEndDate,
      });
      const fileName = `Task_Report_${reportStartDate}_to_${reportEndDate}.csv`;
      setLastGeneratedFile(fileName);
      showToast("success", `CSV report exported: ${fileName}`, "EXPORT");
    } catch (err) {
      showToast("error", err.message || "Failed to export CSV", "EXPORT");
    }
  };

  const handleGeneratePdfReport = async () => {
    setReportLoading(true);
    let currentData = reportData;
    try {
      if (!currentData) {
        currentData = await handleFetchAdminReport(true);
      }
    } catch (err) {
      showToast("error", "Failed to retrieve report data", "PDF");
      return;
    } finally {
      setReportLoading(false);
    }

    if (!currentData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const total = currentData.metrics?.totalTasks || 0;
    const completed = currentData.metrics?.completedTasks || 0;
    const inProgress = currentData.metrics?.inProgressTasks || 0;
    const pending = currentData.metrics?.pendingTasks || 0;
    const compRate = currentData.metrics?.completionRate || "0%";
    const highPrio = currentData.metrics?.byPriority?.high || 0;
    const medPrio = currentData.metrics?.byPriority?.medium || 0;
    const lowPrio = currentData.metrics?.byPriority?.low || 0;
    const tasks = currentData.tasks || [];
    const reportId = `REP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedDateStr = new Date().toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Task Activity & Performance Audit Report - ${reportStartDate} to ${reportEndDate}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 15mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            body {
              background-color: #ffffff;
              color: #0f172a;
              padding: 24px 30px;
              line-height: 1.5;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .top-stripe {
              height: 5px;
              background: linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4);
              border-radius: 4px;
              margin-bottom: 24px;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1.5px solid #e2e8f0;
              padding-bottom: 18px;
              margin-bottom: 20px;
            }
            .brand-badge {
              display: inline-block;
              background: #eef2ff;
              color: #4338ca;
              border: 1px solid #c7d2fe;
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              padding: 3px 8px;
              border-radius: 4px;
              margin-bottom: 8px;
            }
            h1 {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.02em;
              line-height: 1.25;
              margin-bottom: 4px;
            }
            .header-subtitle {
              font-size: 12px;
              color: #64748b;
              font-weight: 500;
            }
            .header-meta-card {
              text-align: right;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px 14px;
              min-width: 220px;
            }
            .header-meta-item {
              font-size: 11px;
              color: #64748b;
              margin-bottom: 3px;
            }
            .header-meta-item strong {
              color: #1e293b;
              font-weight: 700;
            }
            .confidential-tag {
              display: inline-block;
              background: #fef2f2;
              color: #b91c1c;
              border: 1px solid #fecaca;
              font-size: 9px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 3px;
              letter-spacing: 0.05em;
              margin-top: 4px;
            }
            .summary-bar {
              background: #f1f5f9;
              border-left: 4px solid #4f46e5;
              border-radius: 6px;
              padding: 10px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .summary-bar span {
              color: #475569;
            }
            .summary-bar strong {
              color: #0f172a;
              font-weight: 700;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 20px;
            }
            .metric-card {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 14px 16px;
              position: relative;
            }
            .metric-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 3.5px;
              border-radius: 10px 10px 0 0;
            }
            .card-total::before { background: #4f46e5; }
            .card-completed::before { background: #10b981; }
            .card-progress::before { background: #0284c7; }
            .card-rate::before { background: #8b5cf6; }

            .metric-label {
              font-size: 10.5px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #64748b;
              margin-bottom: 6px;
            }
            .metric-number {
              font-size: 26px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.1;
              margin-bottom: 4px;
            }
            .metric-subtext {
              font-size: 11px;
              color: #94a3b8;
              font-weight: 500;
            }
            .analytics-strip {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px 18px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 22px;
              font-size: 12px;
            }
            .prio-tags-group {
              display: flex;
              gap: 14px;
              align-items: center;
            }
            .prio-pill {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              padding: 3px 9px;
              border-radius: 5px;
              font-size: 11px;
              font-weight: 700;
            }
            .prio-pill-high { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
            .prio-pill-med { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
            .prio-pill-low { background: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; }

            .section-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .section-header h2 {
              font-size: 14.5px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.01em;
            }
            .section-header span {
              font-size: 11px;
              color: #64748b;
              font-weight: 600;
            }
            .tasks-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-bottom: 24px;
            }
            .tasks-table th {
              background: #1e293b;
              color: #f8fafc;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              padding: 9px 12px;
              border: 1px solid #1e293b;
            }
            .tasks-table td {
              padding: 9px 12px;
              border: 1px solid #e2e8f0;
              color: #334155;
              vertical-align: middle;
            }
            .tasks-table tr:nth-child(even) td {
              background: #f8fafc;
            }
            .status-badge {
              display: inline-block;
              padding: 2.5px 8px;
              border-radius: 999px;
              font-size: 10.5px;
              font-weight: 700;
              text-align: center;
            }
            .status-completed { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
            .status-inprogress { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            .status-pending { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

            .report-footer {
              border-top: 1.5px solid #e2e8f0;
              padding-top: 16px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 11px;
              color: #64748b;
            }
            .signoff-box {
              text-align: right;
            }
            .signoff-line {
              width: 170px;
              border-bottom: 1px solid #94a3b8;
              margin-bottom: 4px;
              margin-left: auto;
            }
            .disclaimer {
              font-size: 10px;
              color: #94a3b8;
              max-width: 480px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="top-stripe"></div>
          
          <header class="header-container">
            <div>
              <div class="brand-badge">Official Administrative Audit</div>
              <h1>Task Activity & Performance Report</h1>
              <p class="header-subtitle">Enterprise Productivity Metrics & Task Lifecycle Inventory</p>
            </div>
            <div class="header-meta-card">
              <div class="header-meta-item">Document ID: <strong>${reportId}</strong></div>
              <div class="header-meta-item">Admin: <strong>${currentUser?.email || "admin@portfolio.com"}</strong></div>
              <div class="header-meta-item">Generated: <strong>${generatedDateStr}</strong></div>
              <div class="confidential-tag">RESTRICTED AUDIT ACCESS</div>
            </div>
          </header>

          <div class="summary-bar">
            <div>
              <span>Reporting Date Window:</span> 
              <strong>${reportStartDate}</strong> &nbsp;to&nbsp; <strong>${reportEndDate}</strong>
            </div>
            <div>
              <span>Database Cluster:</span> <strong>MongoDB Production Node</strong>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card card-total">
              <div class="metric-label">Total Created</div>
              <div class="metric-number">${total}</div>
              <div class="metric-subtext">Tasks in selected window</div>
            </div>
            <div class="metric-card card-completed">
              <div class="metric-label">Completed</div>
              <div class="metric-number" style="color: #059669;">${completed}</div>
              <div class="metric-subtext">Verified SLA deliveries</div>
            </div>
            <div class="metric-card card-progress">
              <div class="metric-label">In Progress</div>
              <div class="metric-number" style="color: #0284c7;">${inProgress}</div>
              <div class="metric-subtext">Active workflow items</div>
            </div>
            <div class="metric-card card-rate">
              <div class="metric-label">Completion Rate</div>
              <div class="metric-number" style="color: #7c3aed;">${compRate}</div>
              <div class="metric-subtext">Efficiency benchmark</div>
            </div>
          </div>

          <div class="analytics-strip">
            <span style="font-weight: 700; color: #1e293b;">Priority Distribution Summary:</span>
            <div class="prio-tags-group">
              <span class="prio-pill prio-pill-high">🔥 High: <strong>${highPrio}</strong> (${total > 0 ? Math.round((highPrio / total) * 100) : 0}%)</span>
              <span class="prio-pill prio-pill-med">⚡ Medium: <strong>${medPrio}</strong> (${total > 0 ? Math.round((medPrio / total) * 100) : 0}%)</span>
              <span class="prio-pill prio-pill-low">↓ Low: <strong>${lowPrio}</strong> (${total > 0 ? Math.round((lowPrio / total) * 100) : 0}%)</span>
            </div>
          </div>

          <div class="section-header">
            <h2>Audited Tasks Record</h2>
            <span>${tasks.length} item${tasks.length !== 1 ? "s" : ""} recorded</span>
          </div>

          <table class="tasks-table">
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">#</th>
                <th style="width: 25%; text-align: left;">Task Title</th>
                <th style="width: 32%; text-align: left;">Description / Scope</th>
                <th style="width: 14%; text-align: center;">Status</th>
                <th style="width: 12%; text-align: center;">Priority</th>
                <th style="width: 12%; text-align: center;">Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">
                    No tasks found within the selected date window (${reportStartDate} to ${reportEndDate}).
                  </td>
                </tr>
              ` : tasks.map((t, idx) => {
                const s = String(t.status || "Pending").trim();
                const sClass = s.toLowerCase() === "completed" ? "status-completed" : (s.toLowerCase() === "in progress" ? "status-inprogress" : "status-pending");
                const p = String(t.priority || "Medium").trim();
                const pClass = p.toLowerCase() === "high" ? "prio-pill-high" : (p.toLowerCase() === "low" ? "prio-pill-low" : "prio-pill-med");
                const d = t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";
                return `
                  <tr>
                    <td style="text-align: center; color: #94a3b8; font-weight: 600;">${idx + 1}</td>
                    <td style="font-weight: 700; color: #0f172a;">${t.title || "Untitled"}</td>
                    <td style="color: #475569;">${t.description || "-"}</td>
                    <td style="text-align: center;"><span class="status-badge ${sClass}">${s}</span></td>
                    <td style="text-align: center;"><span class="prio-pill ${pClass}" style="padding: 2px 7px; font-size: 10.5px;">${p}</span></td>
                    <td style="text-align: center; color: #64748b; font-weight: 500;">${d}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>

          <footer class="report-footer">
            <div class="disclaimer">
              <strong>CONFIDENTIAL DOCUMENT:</strong> Generated via Admin RBAC authentication in the Portfolio Task Suite. All metrics reflect database states within the specified timeframe.
            </div>
            <div class="signoff-box">
              <div class="signoff-line"></div>
              <div>Authorized Administrator Sign-off</div>
              <div style="font-size: 9.5px; color: #94a3b8;">System Verification Verified • Page 1 of 1</div>
            </div>
          </footer>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Filtering
  const totalTasks = tasks.length;
  const pendingTasksList = tasks.filter((task) => task.status === "Pending");
  const inProgressTasksList = tasks.filter((task) => task.status === "In Progress");
  const completedTasksList = tasks.filter((task) => task.status === "Completed");

  const filterTaskList = (taskList) => {
    return taskList.filter((task) => {
      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesPriority && matchesSearch;
    });
  };

  const pendingFiltered = filterTaskList(pendingTasksList);
  const inProgressFiltered = filterTaskList(inProgressTasksList);
  const completedFiltered = filterTaskList(completedTasksList);

  const getPriorityIcon = (taskPrio) => {
    if (taskPrio === "High") return <Flame size={12} />;
    if (taskPrio === "Low") return <ArrowDownCircle size={12} />;
    return <AlertTriangle size={12} />;
  };

  return (
    <div className="task-page">

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`task-toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" && <CheckCircle2 size={16} />}
            {toast.type === "error" && <AlertCircle size={16} />}
            {toast.type === "info" && <Sparkles size={16} />}
          </div>
          <div className="toast-content">
            <strong>
              {toast.type === "success"
                ? "Success"
                : toast.type === "error"
                ? "Error"
                : "Notice"}
            </strong>
            <span>{toast.message}</span>
          </div>
          {toast.operation && (
            <span className="toast-method">{toast.operation}</span>
          )}
          <button
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* HERO HEADER */}
      <header className="task-hero">
        <div className="task-hero-content">
          <div className="task-hero-badge">
            <Kanban size={22} />
          </div>
          <div>
            <span className="task-eyebrow">WORKFLOW MANAGEMENT</span>
            <h1>Kanban Workspace</h1>
            <p>Drag and drop cards across columns to track and update task progress.</p>
          </div>
        </div>

        <div className="task-hero-actions">
          <div className="sync-badge">
            <span className="sync-dot"></span>
            <Database size={13} />
            <span>MongoDB Connected</span>
          </div>

          {loggedIn ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "600",
                background: currentUser?.role === "admin" ? "rgba(139, 92, 246, 0.15)" : "rgba(16, 185, 129, 0.12)",
                color: currentUser?.role === "admin" ? "#c084fc" : "#10b981",
                border: currentUser?.role === "admin" ? "1px solid rgba(139, 92, 246, 0.35)" : "1px solid rgba(16, 185, 129, 0.25)",
              }}
            >
              <CheckCircle2 size={13} />
              <span>
                {currentUser?.role === "admin" ? "Admin" : "JWT"} ({currentUser?.email || "User"})
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
              }}
            >
              <span>Sign In to Edit</span>
            </Link>
          )}

          {/* ADMIN REPORT BUTTON (Visible to Administrators) */}
          {currentUser?.role === "admin" && (
            <button
              className="admin-report-hero-btn"
              onClick={() => {
                setIsReportModalOpen(true);
                handleFetchAdminReport(false);
              }}
              title="Admin Report Generator"
            >
              <FileText size={15} />
              <span>Admin Reports</span>
            </button>
          )}

          <button
            className="new-task-hero-btn"
            onClick={() => openCreateModal("Pending")}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* TOOLBAR CONTROLS: SEARCH & PRIORITY FILTERS */}
      <div className="kanban-toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={14} className="search-icon-pos" />
            <input
              type="text"
              placeholder="Search cards in board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="priority-filter-group">
            <span className="prio-label-tag">Priority:</span>
            {[
              { label: "All", cls: "prio-all" },
              { label: "High", cls: "prio-high" },
              { label: "Medium", cls: "prio-medium" },
              { label: "Low", cls: "prio-low" },
            ].map(({ label, cls }) => (
              <button
                key={label}
                className={`prio-pill-btn ${
                  priorityFilter === label ? `active ${cls}` : ""
                }`}
                onClick={() => setPriorityFilter(label)}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          <span style={{ fontSize: "12px", color: "var(--task-muted)", fontWeight: "600" }}>
            {totalTasks} Total Tasks
          </span>
          <button
            className="refresh-action-btn"
            onClick={loadTasks}
            disabled={loadingTasks}
            title="Refresh Kanban board"
          >
            <RefreshCw size={14} className={loadingTasks ? "spin-icon" : ""} />
          </button>
        </div>
      </div>

      {/* KANBAN 3-COLUMN BOARD */}
      <main className="kanban-board">
        {/* COLUMN 1: PENDING */}
        <section
          className={`kanban-column ${
            dragOverCol === "Pending" ? "drag-over-pending" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "Pending")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "Pending")}
        >
          <div className="column-header">
            <div className="column-header-title">
              <span className="col-indicator-dot dot-pending"></span>
              <h2>
                <Clock size={16} color="#818cf8" />
                <span>Pending</span>
              </h2>
              <span className="column-count-badge count-pending">
                {pendingFiltered.length}
              </span>
            </div>
          </div>

          <div className="column-body">
            {pendingFiltered.length === 0 ? (
              <div className="empty-column-box">
                <Clock size={24} className="empty-col-icon" />
                <span>No Pending Tasks</span>
                <p>Drag cards here</p>
              </div>
            ) : (
              pendingFiltered.map((task) => (
                <div
                  key={task._id}
                  className={`kanban-card ${
                    draggedTaskId === task._id ? "is-dragging" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="card-top-row">
                    <div className="card-top-left">
                      <span className="drag-grip" title="Drag to reorder">
                        <GripVertical size={13} />
                      </span>
                      <span
                        className={`priority-badge prio-badge-${task.priority.toLowerCase()}`}
                      >
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                      </span>
                    </div>

                    <div className="card-quick-actions">
                      <button
                        className="card-icon-action edit-btn"
                        onClick={() => handleEdit(task)}
                        title="Edit task"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="card-icon-action delete-btn"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>

                  <div className="card-footer">
                    <span className="card-meta-date">
                      <Calendar size={11} />
                      <span>
                        {new Date(task.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>

                    <div className="move-buttons-group">
                      <button
                        className="move-pill-btn"
                        onClick={() => handleStatusChange(task, "In Progress")}
                        title="Move to In Progress"
                      >
                        <span>Start</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUMN 2: IN PROGRESS */}
        <section
          className={`kanban-column ${
            dragOverCol === "In Progress" ? "drag-over-inprogress" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "In Progress")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "In Progress")}
        >
          <div className="column-header">
            <div className="column-header-title">
              <span className="col-indicator-dot dot-inprogress"></span>
              <h2>
                <Zap size={16} color="#38bdf8" />
                <span>In Progress</span>
              </h2>
              <span className="column-count-badge count-inprogress">
                {inProgressFiltered.length}
              </span>
            </div>
          </div>

          <div className="column-body">
            {inProgressFiltered.length === 0 ? (
              <div className="empty-column-box">
                <Zap size={24} className="empty-col-icon" />
                <span>No Tasks in Progress</span>
                <p>Drag active tasks here</p>
              </div>
            ) : (
              inProgressFiltered.map((task) => (
                <div
                  key={task._id}
                  className={`kanban-card ${
                    draggedTaskId === task._id ? "is-dragging" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="card-top-row">
                    <div className="card-top-left">
                      <span className="drag-grip" title="Drag to reorder">
                        <GripVertical size={13} />
                      </span>
                      <span
                        className={`priority-badge prio-badge-${task.priority.toLowerCase()}`}
                      >
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                      </span>
                    </div>

                    <div className="card-quick-actions">
                      <button
                        className="card-icon-action edit-btn"
                        onClick={() => handleEdit(task)}
                        title="Edit task"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="card-icon-action delete-btn"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>

                  <div className="card-footer">
                    <span className="card-meta-date">
                      <Calendar size={11} />
                      <span>
                        {new Date(task.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>

                    <div className="move-buttons-group">
                      <button
                        className="move-pill-btn"
                        onClick={() => handleStatusChange(task, "Pending")}
                        title="Move back to Pending"
                      >
                        <ArrowLeft size={11} />
                        <span>Back</span>
                      </button>

                      <button
                        className="move-pill-btn move-done"
                        onClick={() => handleStatusChange(task, "Completed")}
                        title="Move to Completed"
                      >
                        <span>Done</span>
                        <CheckCircle2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUMN 3: COMPLETED */}
        <section
          className={`kanban-column ${
            dragOverCol === "Completed" ? "drag-over-completed" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "Completed")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "Completed")}
        >
          <div className="column-header">
            <div className="column-header-title">
              <span className="col-indicator-dot dot-completed"></span>
              <h2>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Completed</span>
              </h2>
              <span className="column-count-badge count-completed">
                {completedFiltered.length}
              </span>
            </div>
          </div>

          <div className="column-body">
            {completedFiltered.length === 0 ? (
              <div className="empty-column-box">
                <CheckCircle2 size={24} className="empty-col-icon" />
                <span>No Completed Tasks</span>
                <p>Drag finished tasks here</p>
              </div>
            ) : (
              completedFiltered.map((task) => (
                <div
                  key={task._id}
                  className={`kanban-card ${
                    draggedTaskId === task._id ? "is-dragging" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="card-top-row">
                    <div className="card-top-left">
                      <span className="drag-grip" title="Drag to reorder">
                        <GripVertical size={13} />
                      </span>
                      <span
                        className={`priority-badge prio-badge-${task.priority.toLowerCase()}`}
                      >
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                      </span>
                    </div>

                    <div className="card-quick-actions">
                      <button
                        className="card-icon-action edit-btn"
                        onClick={() => handleEdit(task)}
                        title="Edit task"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="card-icon-action delete-btn"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>

                  <div className="card-footer">
                    <span className="card-meta-date">
                      <Calendar size={11} />
                      <span>
                        {new Date(task.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>

                    <div className="move-buttons-group">
                      <button
                        className="move-pill-btn"
                        onClick={() => handleStatusChange(task, "In Progress")}
                        title="Reopen task to In Progress"
                      >
                        <RotateCcw size={11} />
                        <span>Reopen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* =====================================================
         TASK CREATION / EDITING MODAL
      ===================================================== */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="card-eyebrow">
                  {editingId ? "UPDATE CARD" : "NEW KANBAN CARD"}
                </span>
                <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={closeModal}
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              <div className="input-group">
                <label htmlFor="modal-task-title">
                  <Tag size={13} />
                  <span>Task Title</span>
                </label>
                <input
                  id="modal-task-title"
                  type="text"
                  placeholder="e.g. Build authentication middleware..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="input-group">
                <div className="ai-desc-header">
                  <label htmlFor="modal-task-desc" style={{ marginBottom: 0 }}>
                    <AlignLeft size={13} />
                    <span>Description</span>
                  </label>
                  <button
                    type="button"
                    className="ai-generate-btn"
                    onClick={handleGenerateAiDescription}
                    disabled={aiLoading}
                    title="Generate intelligent task description and priority via AI API"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 size={12} className="spin-icon" />
                        <span>Generating AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        <span>✨ Auto-Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="modal-task-desc"
                  rows="3"
                  placeholder="Add notes, requirements, or click 'Auto-Generate with AI' above..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {aiNotice && (
                  <div className="ai-disclaimer-banner">
                    <Sparkles size={12} />
                    <span>{aiNotice.disclaimer} ({aiNotice.source})</span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>
                  <Sliders size={13} />
                  <span>Workflow Stage</span>
                </label>
                <div className="status-selector">
                  <button
                    type="button"
                    className={`status-option pending-option ${
                      status === "Pending" ? "active" : ""
                    }`}
                    onClick={() => setStatus("Pending")}
                  >
                    <Clock size={14} />
                    <span>Pending</span>
                  </button>

                  <button
                    type="button"
                    className={`status-option progress-option ${
                      status === "In Progress" ? "active" : ""
                    }`}
                    onClick={() => setStatus("In Progress")}
                  >
                    <Zap size={14} />
                    <span>In Progress</span>
                  </button>

                  <button
                    type="button"
                    className={`status-option completed-option ${
                      status === "Completed" ? "active" : ""
                    }`}
                    onClick={() => setStatus("Completed")}
                  >
                    <CheckCircle2 size={14} />
                    <span>Completed</span>
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>
                  <Flag size={13} />
                  <span>Priority Level</span>
                </label>
                <div className="priority-selector">
                  <button
                    type="button"
                    className={`priority-option prio-high ${
                      priority === "High" ? "active" : ""
                    }`}
                    onClick={() => setPriority("High")}
                  >
                    <Flame size={14} />
                    <span>High</span>
                  </button>

                  <button
                    type="button"
                    className={`priority-option prio-medium ${
                      priority === "Medium" ? "active" : ""
                    }`}
                    onClick={() => setPriority("Medium")}
                  >
                    <AlertTriangle size={14} />
                    <span>Medium</span>
                  </button>

                  <button
                    type="button"
                    className={`priority-option prio-low ${
                      priority === "Low" ? "active" : ""
                    }`}
                    onClick={() => setPriority("Low")}
                  >
                    <ArrowDownCircle size={14} />
                    <span>Low</span>
                  </button>
                </div>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="cancel-task-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-task-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="spin-icon" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      {editingId ? <Pencil size={15} /> : <Plus size={15} />}
                      <span>{editingId ? "Update Task" : "Add to Board"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
         ADMIN REPORT GENERATOR MODAL (ADMIN ONLY)
      ===================================================== */}
      {isReportModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsReportModalOpen(false)}>
          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "760px",
              maxHeight: "88vh",
              overflowY: "auto",
            }}
          >
            <div className="modal-header">
              <div>
                <span className="card-eyebrow" style={{ color: "#c084fc" }}>
                  ADMINISTRATOR TOOLKIT
                </span>
                <h2>Task Activity & Performance Report</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsReportModalOpen(false)}
                title="Close report modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Date Range Selection & Action Bar Controls */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                border: "1px solid var(--task-border)",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {/* Row 1: Start Date, End Date, and Quick Presets */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                      color: "var(--task-muted)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--task-border)",
                      background: "rgba(0, 0, 0, 0.4)",
                      color: "var(--task-text)",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                      color: "var(--task-muted)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    END DATE
                  </label>
                  <input
                    type="date"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--task-border)",
                      background: "rgba(0, 0, 0, 0.4)",
                      color: "var(--task-text)",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Quick Date Presets */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() - 7);
                      setReportStartDate(d.toISOString().split("T")[0]);
                      setReportEndDate(new Date().toISOString().split("T")[0]);
                    }}
                    style={{
                      padding: "7px 11px",
                      borderRadius: "6px",
                      border: "1px solid var(--task-border)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--task-muted)",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() - 30);
                      setReportStartDate(d.toISOString().split("T")[0]);
                      setReportEndDate(new Date().toISOString().split("T")[0]);
                    }}
                    style={{
                      padding: "7px 11px",
                      borderRadius: "6px",
                      border: "1px solid var(--task-border)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--task-muted)",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const year = new Date().getFullYear();
                      setReportStartDate(`${year}-01-01`);
                      setReportEndDate(new Date().toISOString().split("T")[0]);
                    }}
                    style={{
                      padding: "7px 11px",
                      borderRadius: "6px",
                      border: "1px solid var(--task-border)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--task-muted)",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    This Year
                  </button>
                </div>
              </div>

              {/* Row 2: Proper Alignment Action Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: "12px",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--task-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={13} color="#818cf8" />
                  <span>
                    Auditing <strong>{reportStartDate}</strong> to <strong>{reportEndDate}</strong>
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {/* GENERATE PDF BUTTON */}
                  <button
                    type="button"
                    onClick={handleGeneratePdfReport}
                    disabled={reportLoading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      height: "38px",
                      padding: "0 18px",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                      transition: "all 0.2s ease",
                    }}
                    title="Generate and download professional executive PDF report"
                  >
                    {reportLoading ? (
                      <Loader2 size={15} className="spin-icon" />
                    ) : (
                      <FileText size={15} />
                    )}
                    <span>Generate PDF</span>
                  </button>

                  {/* EXPORT CSV BUTTON */}
                  <button
                    type="button"
                    onClick={handleDownloadReportCsv}
                    disabled={reportLoading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      height: "38px",
                      padding: "0 18px",
                      borderRadius: "8px",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title="Export task data as CSV spreadsheet"
                  >
                    <Download size={15} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Report Success Banner */}
            {lastGeneratedFile && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#34d399",
                  fontSize: "13px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} />
                  <span>
                    Report generated & downloaded: <strong>{lastGeneratedFile}</strong>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handlePrintPdfReport}
                    style={{
                      background: "rgba(139, 92, 246, 0.2)",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      color: "#c084fc",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Save as PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReportCsv}
                    style={{
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {reportError && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  fontSize: "13px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ShieldAlert size={16} />
                <span>{reportError}</span>
              </div>
            )}

            {/* Report Statistics Cards */}
            {reportData && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(99, 102, 241, 0.12)",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#a5b4fc", display: "block" }}>
                      TOTAL CREATED
                    </span>
                    <strong style={{ fontSize: "20px", color: "#ffffff" }}>
                      {reportData.metrics?.totalTasks || 0}
                    </strong>
                  </div>

                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#34d399", display: "block" }}>
                      COMPLETED
                    </span>
                    <strong style={{ fontSize: "20px", color: "#ffffff" }}>
                      {reportData.metrics?.completedTasks || 0}
                    </strong>
                  </div>

                  <div
                    style={{
                      background: "rgba(6, 182, 212, 0.12)",
                      border: "1px solid rgba(6, 182, 212, 0.25)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#38bdf8", display: "block" }}>
                      IN PROGRESS
                    </span>
                    <strong style={{ fontSize: "20px", color: "#ffffff" }}>
                      {reportData.metrics?.inProgressTasks || 0}
                    </strong>
                  </div>

                  <div
                    style={{
                      background: "rgba(139, 92, 246, 0.12)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#c084fc", display: "block" }}>
                      COMPLETION RATE
                    </span>
                    <strong style={{ fontSize: "20px", color: "#ffffff" }}>
                      {reportData.metrics?.completionRate || "0%"}
                    </strong>
                  </div>
                </div>

                {/* Priority Breakdown */}
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid var(--task-border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "var(--task-muted)" }}>Priority Distribution:</span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ color: "#f87171" }}>
                      🔥 High: <strong>{reportData.metrics?.byPriority?.high || 0}</strong>
                    </span>
                    <span style={{ color: "#c084fc" }}>
                      ⚡ Medium: <strong>{reportData.metrics?.byPriority?.medium || 0}</strong>
                    </span>
                    <span style={{ color: "#2dd4bf" }}>
                      ↓ Low: <strong>{reportData.metrics?.byPriority?.low || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Tasks List Table in Date Range */}
                <div style={{ maxHeight: "240px", overflowY: "auto", border: "1px solid var(--task-border)", borderRadius: "10px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(0, 0, 0, 0.4)", borderBottom: "1px solid var(--task-border)" }}>
                        <th style={{ padding: "8px 12px", color: "var(--task-muted)" }}>Title</th>
                        <th style={{ padding: "8px 12px", color: "var(--task-muted)" }}>Status</th>
                        <th style={{ padding: "8px 12px", color: "var(--task-muted)" }}>Priority</th>
                        <th style={{ padding: "8px 12px", color: "var(--task-muted)" }}>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reportData.tasks || []).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "18px", textAlign: "center", color: "var(--task-muted)" }}>
                            No tasks found in the specified date range.
                          </td>
                        </tr>
                      ) : (
                        (reportData.tasks || []).map((t) => (
                          <tr key={t._id} style={{ borderBottom: "1px solid var(--task-border)" }}>
                            <td style={{ padding: "8px 12px", color: "var(--task-text)", fontWeight: "600" }}>
                              {t.title}
                            </td>
                            <td style={{ padding: "8px 12px" }}>
                              <span style={{ color: t.status === "Completed" ? "#34d399" : t.status === "In Progress" ? "#38bdf8" : "#a5b4fc" }}>
                                {t.status || "Pending"}
                              </span>
                            </td>
                            <td style={{ padding: "8px 12px" }}>
                              <span style={{ color: t.priority === "High" ? "#f87171" : t.priority === "Low" ? "#2dd4bf" : "#c084fc" }}>
                                {t.priority || "Medium"}
                              </span>
                            </td>
                            <td style={{ padding: "8px 12px", color: "var(--task-muted)" }}>
                              {new Date(t.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManager;