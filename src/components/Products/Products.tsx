import { useEffect, useState } from "react";
import { Button, Form, Table, message } from "antd";
import EditableCell from "./EditableCell";
import mergedColumns from "./ProductsConfig";
import { Item } from "../../types/Item";
import { Constants } from "../../constants/Constants";
import { ProductsService } from "../../services/Products/Products";
import { base64ToFile, contentTypeToExtensionMap, getContentTypeFromBase64 } from "../../util/util";

const Products = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState<Item[]>([]);
  const [imageToUpload, setImageToUpload] = useState<string>();
  const [imageToUploadFile, setImageToUploadFile] = useState<File>();
  const [editingKey, setEditingKey] = useState<number>(Constants.INVALID_KEY);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (imageToUpload === undefined) {
      return;
    }
    const contentType = getContentTypeFromBase64(imageToUpload);
    const fileName = `${Math.floor(Math.random() * 10000000).toString()}.${contentTypeToExtensionMap[contentType]}`;
    const file = base64ToFile(imageToUpload, fileName);
    setImageToUploadFile(file);
  }, [imageToUpload]);

  const fetchData = () => {
    const request = ProductsService.getAll();
    request.then((items: Item[]) => {
      setData(addItemKeys(items));
    }).catch((_:any) => console.log('error while fetching'));
  }

  const unsetEditingKey = () => setEditingKey(Constants.INVALID_KEY);

  const addItemKeys = (data: Item[]) => data.map((item: Item, index: number) => ({ ...item, key: index }));

  const edit = (record: Partial<Item> & { key: number }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    const addingProduct = editingKey > Constants.INVALID_KEY && data[editingKey]?.id === undefined;
    if (addingProduct) {
      setData(addItemKeys([...data.slice(1)]));
    }
    unsetEditingKey();
  };

  const save = async (record: Item) => {
    const key = record.key;
    try {
      const row = { ...(await form.validateFields())} as Item;
      const { productImageURL, ...item} = data[key];
      let request: Promise<Item>;
      const posting: boolean = record.id === undefined;
      if (posting) {
        //request = ProductsService.post({ ...item, ...row });
        if (!imageToUploadFile) throw "no image loaded";
        request = ProductsService.postWithFile({ ...item, ...row }, imageToUploadFile);
      } else {
        request = ProductsService.putWithFile({ ...item, ...row }, imageToUploadFile);
      }
      request
        .then((_: Item) => fetchData())
        .catch((_: any) => {
          cancel();
          message.error("Request failed");
        })
        .finally(() => {
          unsetEditingKey();
          form.resetFields();
        });
    } catch (errInfo) {
      message.error(`Validate Failed: ${errInfo}`);
    } finally {
      setImageToUpload(undefined);
    }
  };

  const add = () => {
    setImageToUpload(undefined);
    const defaultItem: Item = { key: 0, name: '', description: '', productImageURL: '' };
    const newData: Item[] = [defaultItem, ...data];
    const dataWithfixedKeys = addItemKeys(newData);
    setData(dataWithfixedKeys);
    setEditingKey(0);
  }

  const remove = (key: number) => {
    const { id, name } = data[key];
    if (id === undefined) {
      message.error("Deletion failed, stored data is incomplete");
      return;
    }
    const request = ProductsService.remove(id);
    request
      .then((_: any) => {
        fetchData();
        message.success(`${name} was deleted`);
      })
      .catch((_: any) => message.error("Request failed"));
  }

  const onUploadImage = (url: string) => setImageToUpload(url);

  return (
    <>
      <div style={{ right: 25, top: 100, position: 'absolute' }}><Button onClick={add}>Add</Button></div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns({ editingKey, cancel, edit, onUploadImage, remove, save })}
          scroll={{ x: true }}
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
}

export default Products;