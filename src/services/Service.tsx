type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const makeRequest = async <T,>(url: string, method: RequestMethod, body?: T) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return method !== 'DELETE' ? res.json() : {};
}

const requestWithFile = async <T extends { [key: string]: any },>(url: string, method: 'POST' | 'PUT', body: T, file?: File) => {
  const formData = new FormData();
  if (file !== undefined) {
    console.log(body, file.name);
    formData.append('file', file);
  }
  for (const prop in body) {
    if (body.hasOwnProperty(prop)) {
      formData.append(prop, body[prop]);
      console.log(body[prop]);
    }
  }
  const res = await fetch(url, {
    method,
    body: formData
  });
  return res.json();
}

export { makeRequest, requestWithFile };