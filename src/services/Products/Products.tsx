import { Constants } from "../../constants/Constants";
import type { Item } from "../../types/Item";
import { makeRequest, requestWithFile } from "../Service";

const URL = Constants.API_URL;

const getAll = (): Promise<Item[]> => {
  return makeRequest(URL, 'GET');
}

const getById = (id: string): Promise<Item> => {
  return makeRequest(`${URL}/${id}`, 'GET');
}

const post = (item: Item): Promise<Item> => {
  return makeRequest(URL, 'POST', item);
}

const postWithFile = (item: Item, file: File) => {
  return requestWithFile(URL, 'POST', item, file);
}

const put = (item: Item): Promise<Item> => {
  return makeRequest(`${URL}/${item.id}`, 'PUT', item);
}

const putWithFile = (item: Item, file?: File): Promise<Item> => {
  return requestWithFile(`${URL}/${item.id}`, 'PUT', item, file);
}

const remove = (id: number): Promise<any> => {
  return makeRequest(`${URL}/${id}`, 'DELETE');
}

export const ProductsService = { getAll, getById, post, postWithFile, put, putWithFile, remove, URL };
