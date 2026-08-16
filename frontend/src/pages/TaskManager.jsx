import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
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
} from "lucide-react";

const taskStyles = `
/* =====================================================
   TASK MANAGER MODERN ENTERPRISE DESIGN SYSTEM
   Clean Dark Surface, Indigo/Violet Accent, Zero Harsh Orange
===================================================== */

.task-page {
  --task-bg: var(--bg-primary, #090d16);
  --task-card: var(--bg-secondary, #111726);
  --task-text: var(--text-main, #f8fafc);
  --task-muted: var(--text-muted, #94a3b8);
  --task-border: var(--border, rgba(255, 255, 255, 0.08));

  /* Modern Palette Tokens */
  --color-indigo: #6366f1;
  --color-violet: #8b5cf6;
  --color-purple: #a855f7;
  --color-cyan: #06b6d4;
  --color-sky: #38bdf8;
  --color-emerald: #10b981;
  --color-teal: #14b8a6;
  --color-rose: #f43f5e;
  --color-red: #ef4444;

  min-height: calc(100vh - 70px);
  max-width: var(--max-width, 1100px);
  margin: 0 auto;
  padding: 16px 24px 40px;
  color: var(--task-text);
  background:
    radial-gradient(circle at 12% 12%, rgba(99, 102, 241, 0.14), transparent 45%),
    radial-gradient(circle at 88% 18%, rgba(6, 182, 212, 0.12), transparent 45%),
    radial-gradient(circle at 50% 85%, rgba(139, 92, 246, 0.10), transparent 45%),
    var(--task-bg);
  box-sizing: border-box;
}

/* =====================================================
   HERO HEADER
===================================================== */

.task-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--task-border);
}

.task-hero-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.task-hero-badge {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-indigo), var(--color-cyan));
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  flex-shrink: 0;
}

.task-eyebrow,
.card-eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #a5b4fc;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.task-hero h1 {
  margin: 0;
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 800;
  line-height: 1.2;
  color: var(--task-text);
}

.task-hero p {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--task-muted);
}

.task-hero-actions {
  display: flex;
  align-items: center;
}

.sync-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #34d399;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.sync-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #34d399;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* =====================================================
   STATS OVERVIEW CARDS (4 ESSENTIAL CARDS)
===================================================== */

.task-page section {
  padding: 0;
}

.task-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0;
  margin: 0 0 16px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--task-card);
  border: 1px solid var(--task-border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-icon {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.pending-icon {
  background: rgba(139, 92, 246, 0.15);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.progress-icon {
  background: rgba(6, 182, 212, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.completed-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--task-muted);
}

.stat-card strong {
  font-size: 20px;
  font-weight: 800;
  color: var(--task-text);
  line-height: 1.1;
}

/* =====================================================
   MAIN GRID & CARD LAYOUT
===================================================== */

.task-main-grid {
  display: grid;
  grid-template-columns: 370px 1fr;
  gap: 16px;
  align-items: start;
}

.task-form-card,
.task-list-card {
  background: var(--task-card);
  border: 1px solid var(--task-border);
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.task-list-card {
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

/* Card Header */
.card-header,
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.card-header h2,
.list-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--task-text);
}

.work-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-count-badge {
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 10px;
  font-weight: 700;
}

/* Refresh Button */
.refresh-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--task-border);
  border-radius: 8px;
  background: transparent;
  color: var(--task-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  border-color: #6366f1;
}

.spin-icon {
  animation: task-spin 0.8s linear infinite;
}

@keyframes task-spin {
  to { transform: rotate(360deg); }
}

/* =====================================================
   TASK FORM STYLING
===================================================== */

.task-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: var(--task-text);
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--task-border);
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.2);
  color: var(--task-text);
  font-family: inherit;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: var(--task-muted);
  opacity: 0.6;
}

/* Status & Priority Selector Buttons */
.status-selector,
.priority-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.status-option,
.priority-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  border: 1px solid var(--task-border);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.15);
  color: var(--task-muted);
  font-size: 11px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-option:hover,
.priority-option:hover {
  border-color: var(--task-muted);
  color: var(--task-text);
}

/* Status Active Colors */
.status-option.active.pending-option {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
  color: #a5b4fc;
}

.status-option.active.progress-option {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #38bdf8;
}

.status-option.active.completed-option {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
}

/* Priority Active Colors */
.priority-option.active.prio-high {
  background: rgba(239, 68, 68, 0.18);
  border-color: #ef4444;
  color: #f87171;
}

.priority-option.active.prio-medium {
  background: rgba(139, 92, 246, 0.18);
  border-color: #8b5cf6;
  color: #c084fc;
}

.priority-option.active.prio-low {
  background: rgba(20, 184, 166, 0.18);
  border-color: #14b8a6;
  color: #2dd4bf;
}

/* Form Action Buttons */
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.primary-task-btn {
  flex: 1;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-task-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 7px 20px rgba(124, 58, 237, 0.45);
}

.primary-task-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-task-btn {
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid var(--task-border);
  border-radius: 9px;
  background: transparent;
  color: var(--task-muted);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-task-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: #f43f5e;
  color: #f43f5e;
}

/* Form Footer */
.form-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--task-border);
  font-size: 11px;
  color: var(--task-muted);
  line-height: 1.3;
}

.footer-db-icon {
  color: #34d399;
  flex-shrink: 0;
}

/* =====================================================
   CONTROLS BAR (FILTERS)
===================================================== */

.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid var(--task-border);
  border-radius: 7px;
  background: transparent;
  color: var(--task-muted);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--task-muted);
  color: var(--task-text);
}

.filter-btn.active.filter-all {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
  color: #a5b4fc;
}

.filter-btn.active.filter-pending {
  background: rgba(139, 92, 246, 0.15);
  border-color: #8b5cf6;
  color: #c084fc;
}

.filter-btn.active.filter-progress {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #38bdf8;
}

.filter-btn.active.filter-completed {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
}

.filter-count {
  padding: 1px 5px;
  border-radius: 10px;
  background: var(--task-border);
  font-size: 10px;
  font-weight: 800;
}

.filter-btn.active .filter-count {
  background: currentColor;
  color: #090d16;
}

/* Priority Filters */
.priority-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.priority-filter-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--task-muted);
  letter-spacing: 0.5px;
  margin-right: 2px;
}

.prio-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--task-border);
  background: transparent;
  color: var(--task-muted);
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.prio-filter-btn.active.prio-all {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
  color: #a5b4fc;
}

.prio-filter-btn.active.prio-high {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #f87171;
}

.prio-filter-btn.active.prio-medium {
  background: rgba(139, 92, 246, 0.15);
  border-color: #8b5cf6;
  color: #c084fc;
}

.prio-filter-btn.active.prio-low {
  background: rgba(20, 184, 166, 0.15);
  border-color: #14b8a6;
  color: #2dd4bf;
}

/* =====================================================
   TASK LIST ITEMS (CLEAN SURFACE)
===================================================== */

.task-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--task-border);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
}

.task-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
  border-color: rgba(99, 102, 241, 0.35);
}

/* Toggle Check Status Button */
.task-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--task-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1px;
}

.task-check:hover {
  transform: scale(1.1);
}

.task-check.status-pending {
  color: #a5b4fc;
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.12);
}

.task-check.status-in-progress {
  color: #38bdf8;
  border-color: rgba(6, 182, 212, 0.4);
  background: rgba(6, 182, 212, 0.12);
}

.task-check.status-completed {
  color: #ffffff;
  border-color: #10b981;
  background: #10b981;
}

/* Task Info Content */
.task-info {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.task-title-row h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--task-text);
  line-height: 1.25;
}

.task-completed .task-title-row h3 {
  opacity: 0.85;
}

.task-info p {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--task-muted);
  line-height: 1.4;
  word-break: break-word;
}

.task-meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--task-muted);
  opacity: 0.75;
}

.task-badges {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

/* Status Badges */
.task-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 16px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.status-badge-pending {
  background: rgba(99, 102, 241, 0.14);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.28);
}

.status-badge-in-progress {
  background: rgba(6, 182, 212, 0.14);
  color: #38bdf8;
  border: 1px solid rgba(6, 182, 212, 0.28);
}

.status-badge-completed {
  background: rgba(16, 185, 129, 0.14);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.28);
}

/* Priority Badges */
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 16px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.prio-badge-high {
  background: rgba(239, 68, 68, 0.14);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.28);
}

.prio-badge-medium {
  background: rgba(139, 92, 246, 0.14);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.28);
}

.prio-badge-low {
  background: rgba(20, 184, 166, 0.14);
  color: #2dd4bf;
  border: 1px solid rgba(20, 184, 166, 0.28);
}

/* Action Buttons */
.task-actions {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.task-action {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid var(--task-border);
  background: transparent;
  color: var(--task-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-action:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
  color: #a5b4fc;
}

.delete-action:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: #f43f5e;
  color: #f43f5e;
}

/* =====================================================
   EMPTY & LOADING STATES
===================================================== */

.task-loading,
.empty-tasks {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  text-align: center;
}

.loading-spinner {
  color: #6366f1;
  margin-bottom: 10px;
}

.task-loading h3,
.empty-tasks h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--task-text);
}

.task-loading p,
.empty-tasks p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--task-muted);
  max-width: 280px;
}

.empty-task-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

/* =====================================================
   TOAST NOTIFICATION
===================================================== */

.task-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--task-card);
  border: 1px solid var(--task-border);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  color: var(--task-text);
  font-size: 12px;
  animation: toast-slide-in 0.3s ease;
}

@keyframes toast-slide-in {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast-icon {
  display: flex;
  align-items: center;
}

.toast-success .toast-icon { color: #34d399; }
.toast-error .toast-icon { color: #f43f5e; }
.toast-info .toast-icon { color: #a5b4fc; }

.toast-content {
  display: flex;
  flex-direction: column;
}

.toast-content strong {
  font-size: 11px;
  line-height: 1.2;
}

.toast-content span {
  font-size: 11px;
  color: var(--task-muted);
}

.toast-method {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--task-border);
  font-size: 9px;
  font-weight: 800;
  color: var(--task-muted);
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--task-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =====================================================
   RESPONSIVE BREAKPOINTS
===================================================== */

@media (max-width: 960px) {
  .task-main-grid {
    grid-template-columns: 1fr;
  }

  .task-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 800px) {
  .task-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .task-page {
    padding: 14px 12px 30px;
  }

  .status-selector,
  .priority-selector {
    grid-template-columns: 1fr;
  }

  .task-item {
    flex-wrap: wrap;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 4px;
    padding-top: 6px;
    border-top: 1px dashed var(--task-border);
  }
}
`;

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [toast, setToast] = useState(null);

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

  // =====================================================
  // TOAST
  // =====================================================

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

  // =====================================================
  // GET
  // =====================================================

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const data = await getTasks();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeTask);
      setTasks(normalized);
      showToast(
        "success",
        `${normalized.length} task${normalized.length !== 1 ? "s" : ""} loaded successfully`,
        "GET"
      );
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to load tasks from backend", "GET");
    } finally {
      setLoadingTasks(false);
    }
  };

  // =====================================================
  // POST / PUT
  // =====================================================

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
        // PUT
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
        setEditingId(null);
      } else {
        // POST
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
      }

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
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

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (task) => {
    const norm = normalizeTask(task);
    setEditingId(norm._id);
    setTitle(norm.title);
    setDescription(norm.description || "");
    setStatus(norm.status);
    setPriority(norm.priority);

    showToast("info", "Task loaded into editor", "EDIT");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
    showToast("info", "Editing cancelled", "CANCEL");
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

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

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = async (task, newStatus) => {
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

      showToast("success", `Task moved to ${newStatus}`, "PUT");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update task status", "PUT");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  // =====================================================
  // FILTERING
  // =====================================================

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filter === "All" || task.status === filter;
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  // =====================================================
  // STATUS & PRIORITY ICON HELPERS
  // =====================================================

  const getStatusIcon = (taskStatus) => {
    if (taskStatus === "Completed") {
      return <CheckCircle2 size={15} />;
    }
    if (taskStatus === "In Progress") {
      return <Zap size={15} />;
    }
    return <Clock size={15} />;
  };

  const getPriorityIcon = (taskPrio) => {
    if (taskPrio === "High") {
      return <Flame size={13} />;
    }
    if (taskPrio === "Low") {
      return <ArrowDownCircle size={13} />;
    }
    return <AlertTriangle size={13} />;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="task-page">
      <style>{taskStyles}</style>

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
            <Sparkles size={18} />
          </div>
          <div>
            <span className="task-eyebrow">WORKFLOW MANAGEMENT</span>
            <h1>Task Workspace</h1>
            <p>Organize, prioritize, and execute your tasks with MongoDB sync.</p>
          </div>
        </div>

        <div className="task-hero-actions">
          <div className="sync-badge">
            <span className="sync-dot"></span>
            <Database size={13} />
            <span>MongoDB Connected</span>
          </div>
        </div>
      </header>

      {/* ESSENTIAL STATS CARDS */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-icon total-icon">
            <ListTodo size={18} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <Clock size={18} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending</span>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress-icon">
            <Zap size={18} />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <CheckSquare size={18} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="task-main-grid">
        {/* CREATE / EDIT TASK FORM CARD */}
        <div className="task-form-card">
          <div className="card-header">
            <div className="header-title-group">
              <span className="card-eyebrow">
                {editingId ? "EDIT TASK" : "CREATE NEW"}
              </span>
              <h2>{editingId ? "Update Task Details" : "Create a New Task"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            {/* TITLE */}
            <div className="input-group">
              <label htmlFor="task-title">
                <Tag size={13} />
                <span>Task Title</span>
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Build backend API endpoints..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="input-group">
              <label htmlFor="task-desc">
                <AlignLeft size={13} />
                <span>Description</span>
              </label>
              <textarea
                id="task-desc"
                rows="3"
                placeholder="Add detailed task instructions, links, or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* TASK STATUS */}
            <div className="input-group">
              <label>
                <Sliders size={13} />
                <span>Task Status</span>
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

            {/* TASK PRIORITY */}
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

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button
                type="submit"
                className="primary-task-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="spin-icon" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {editingId ? <Pencil size={15} /> : <Plus size={15} />}
                    <span>{editingId ? "Update Task" : "Add Task"}</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-task-btn"
                  onClick={handleCancelEdit}
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </form>

          {/* FORM FOOTER */}
          <div className="form-footer">
            <Database size={13} className="footer-db-icon" />
            <span>Changes are automatically saved to MongoDB</span>
          </div>
        </div>

        {/* YOUR TASKS LIST CARD */}
        <div className="task-list-card">
          <div className="list-header">
            <div>
              <span className="card-eyebrow">YOUR WORK</span>
              <div className="work-title-row">
                <h2>Your Tasks</h2>
                <span className="task-count-badge">{totalTasks} Total</span>
              </div>
            </div>

            <button
              className="refresh-btn"
              onClick={loadTasks}
              disabled={loadingTasks}
              title="Refresh task list"
              aria-label="Refresh tasks"
            >
              <RefreshCw
                size={15}
                className={loadingTasks ? "spin-icon" : ""}
              />
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="controls-bar">
            <div className="filter-rows">
              {/* STATUS FILTERS */}
              <div className="task-filters">
                {[
                  { label: "All", count: totalTasks, icon: Layers, cls: "filter-all" },
                  { label: "Pending", count: pendingTasks, icon: Clock, cls: "filter-pending" },
                  { label: "In Progress", count: inProgressTasks, icon: Zap, cls: "filter-progress" },
                  { label: "Completed", count: completedTasks, icon: CheckCircle2, cls: "filter-completed" },
                ].map(({ label, count, icon: FilterIcon, cls }) => (
                  <button
                    key={label}
                    className={`filter-btn ${filter === label ? `active ${cls}` : ""}`}
                    onClick={() => setFilter(label)}
                  >
                    <FilterIcon size={12} />
                    <span>{label}</span>
                    <span className="filter-count">{count}</span>
                  </button>
                ))}
              </div>

              {/* PRIORITY FILTERS */}
              <div className="priority-filters">
                <span className="priority-filter-label">PRIORITY:</span>
                {[
                  { label: "All", cls: "prio-all" },
                  { label: "High", cls: "prio-high" },
                  { label: "Medium", cls: "prio-medium" },
                  { label: "Low", cls: "prio-low" },
                ].map(({ label, cls }) => (
                  <button
                    key={label}
                    className={`prio-filter-btn ${
                      priorityFilter === label ? `active ${cls}` : ""
                    }`}
                    onClick={() => setPriorityFilter(label)}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loadingTasks && (
            <div className="task-loading">
              <Loader2 size={32} className="loading-spinner" />
              <h3>Loading your tasks</h3>
              <p>Fetching the latest task status from MongoDB...</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loadingTasks && filteredTasks.length === 0 && (
            <div className="empty-tasks">
              <div className="empty-task-icon">
                <ClipboardCheck size={26} />
              </div>
              <h3>No tasks found</h3>
              <p>
                {filter !== "All" || priorityFilter !== "All"
                  ? "No tasks match selected filter criteria."
                  : "You don't have any tasks yet. Create one on the left!"}
              </p>
            </div>
          )}

          {/* TASK ITEMS LIST */}
          {!loadingTasks && filteredTasks.length > 0 && (
            <div className="task-items">
              {filteredTasks.map((task) => {
                const statusClass = task.status.toLowerCase().replace(" ", "-");
                const prioClass = task.priority.toLowerCase();

                return (
                  <article
                    className={`task-item ${
                      task.status === "Completed" ? "task-completed" : ""
                    }`}
                    key={task._id}
                  >
                    {/* STATUS BUTTON TOGGLE */}
                    <button
                      className={`task-check status-${statusClass}`}
                      onClick={() =>
                        handleStatusChange(
                          task,
                          task.status === "Completed" ? "Pending" : "Completed"
                        )
                      }
                      title={`Current: ${task.status}. Click to toggle.`}
                    >
                      {getStatusIcon(task.status)}
                    </button>

                    {/* TASK INFORMATION */}
                    <div className="task-info">
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <div className="task-badges">
                          {/* PRIORITY BADGE */}
                          <span
                            className={`priority-badge prio-badge-${prioClass}`}
                            title={`Priority: ${task.priority}`}
                          >
                            {getPriorityIcon(task.priority)}
                            <span>{task.priority}</span>
                          </span>

                          {/* STATUS BADGE */}
                          <span
                            className={`task-status status-badge-${statusClass}`}
                          >
                            {getStatusIcon(task.status)}
                            <span>{task.status}</span>
                          </span>
                        </div>
                      </div>

                      <p>{task.description || "No description provided."}</p>

                      {task.createdAt && (
                        <div className="task-meta">
                          <Calendar size={11} />
                          <span>
                            Created{" "}
                            {new Date(task.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="task-actions">
                      <button
                        className="task-action edit-action"
                        onClick={() => handleEdit(task)}
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        className="task-action delete-action"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;