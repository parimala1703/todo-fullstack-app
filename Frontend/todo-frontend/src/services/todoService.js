import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

// Get Todos (with optional filter)
export const getTodos = (completed) => {
  if (completed === undefined) {
    return axios.get(API_URL);
  }
  return axios.get(`${API_URL}?completed=${completed}`);
};

export const createTodo = (todo) =>
  axios.post(API_URL, todo);

export const updateTodo = (id, todo) =>
  axios.put(`${API_URL}/${id}`, todo);

export const deleteTodo = (id) =>
  axios.delete(`${API_URL}/${id}`);
