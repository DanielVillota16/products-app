import type { Item } from "../../types/Item";
import makeRequest from "../Service";

const URL = "http://localhost:5000/tasks";

const getAll = () => {
  return makeRequest(URL, 'GET');
}

const getById = (id: string) => {
  return makeRequest(`${URL}/${id}`, 'GET');
}

const post = (item: Item) => {
  return makeRequest(URL, 'POST', item);
}

const put = (item: Item) => {
  return makeRequest(`${URL}/${item.key}`, 'PUT', item);
}

const remove = (id: string) => {
  return makeRequest(`${URL}/${id}`, 'DELETE');
}

export { getAll, getById, post, put, remove, URL };
