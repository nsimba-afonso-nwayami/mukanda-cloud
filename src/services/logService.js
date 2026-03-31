// services/logService.js

import { api } from "./api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

// set locale assim (SEM import do locale)
dayjs.locale("pt");

/**
 * =========================
 * HELPERS
 * =========================
 */

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
};

const getData = (response) => response?.data;

// USER DO LOCALSTORAGE (IGUAL AO TEU FILESERVICE)
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

/**
 * =========================
 * DATE PARSER
 * =========================
 */

const parseDate = (date) => {
  if (!date) return null;

  let parsed = dayjs(date);

  if (parsed.isValid()) return parsed;

  parsed = dayjs(date, "DD/MM/YYYY HH:mm:ss");

  if (parsed.isValid()) return parsed;

  return null;
};

/**
 * =========================
 * GROUPING (HOJE / ONTEM / ANTIGO)
 * =========================
 */

export const groupLogs = (logs = []) => {
  const groups = {
    hoje: [],
    ontem: [],
    antigos: [],
  };

  logs.forEach((log) => {
    const d = log.timestamp;

    if (!d) {
      groups.antigos.push(log);
      return;
    }

    if (d.isSame(dayjs(), "day")) {
      groups.hoje.push(log);
    } else if (d.isSame(dayjs().subtract(1, "day"), "day")) {
      groups.ontem.push(log);
    } else {
      groups.antigos.push(log);
    }
  });

  return groups;
};

/**
 * =========================
 * ADAPTER
 * =========================
 */

const adaptLog = (item) => ({
  id: item.id,

  // USER DO LOCALSTORAGE (fallback)
  user:
    getUser()?.email ||
    item.user?.email ||
    item.user ||
    "Sistema",

  action: item.action || "ação",
  target: item.node_name || item.target || "-",
  ip: item.ip_address || "-",

  timestamp: parseDate(item.created_at || item.timestamp),
});

/**
 * =========================
 * API
 * =========================
 */

export const getLogs = async (params = {}) => {
  const response = await api.get("audit/logs/", { params });

  const data = normalizeList(getData(response));

  return data.map(adaptLog);
};
