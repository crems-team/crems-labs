import http from "./http-common";

export const api = {
  get: async <T>(url: string, params?: unknown) =>
    (await http.get<T>(url, { params })).data,
  post: async <T, B = unknown>(url: string, body?: B) =>
    (await http.post<T>(url, body)).data,
  put: async <T, B = unknown>(url: string, body?: B) =>
    (await http.put<T>(url, body)).data,
  patch: async <T, B = unknown>(url: string, body?: B) =>
    (await http.patch<T>(url, body)).data,
  delete: async <T>(url: string) =>
    (await http.delete<T>(url)).data,
};
