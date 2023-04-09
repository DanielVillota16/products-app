import { useEffect, useState } from "react";
import { Button, Form, Table, message } from "antd";
import EditableCell from "./EditableCell";
import mergedColumns from "./ProductsConfig";
import { FullItem, ShowItem } from "../../types/Item";
import { Constants } from "../../constants/Constants";
import { ProductsService } from "../../services/Products/Products";
import { base64ToFile, contentTypeToExtensionMap, getContentTypeFromBase64 } from "../../util/util";

const Products = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState<ShowItem[]>([]);
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
    request.then((items: FullItem[]) => {
      setData(addItemKeys(items));
    }).catch((_: any) => console.log('error while fetching'));
  }

  const unsetEditingKey = () => setEditingKey(Constants.INVALID_KEY);

  const addItemKeys = (data: FullItem[]): ShowItem[] => data.map((item: FullItem, index: number) => ({ ...item, key: index }));

  const edit = (record: ShowItem) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    const addingProduct = editingKey > Constants.INVALID_KEY && data[editingKey].id === -1;
    if (addingProduct) {
      setData(addItemKeys([...data.slice(1)]));
    }
    unsetEditingKey();
  };

  const save = async (record: ShowItem) => {
    const key = record.key;
    try {
      let { id, name, description } = data[key];
      const { name: newName, description: newDescription } = (await form.validateFields());
      name = newName || name;
      description = newDescription || description;
      let request: Promise<FullItem>;
      const posting: boolean = record.id === -1;
      if (posting) {
        if (imageToUpload === undefined) {
          throw 'missing image file';
        }
        request = ProductsService.post({ name, description, imageB64: imageToUpload });
      } else {
        request = ProductsService.put({ id, name, description, imageB64: imageToUpload });
      }
      request
        .then((_: FullItem) => fetchData())
        .catch((_: any) => {
          cancel();
          message.error("Request failed");
        })
        .finally(() => {
          unsetEditingKey();
          form.resetFields();
        });
    } catch (errInfo) {
      cancel();
      message.error(`Validate Failed: ${errInfo}`);
    } finally {
      setImageToUpload(undefined);
    }
  };

  const add = () => {
    setImageToUpload(undefined);
    const defaultItem: ShowItem = { id: -1, key: 0, name: '', description: '', productImageURL: '' };
    const newData: ShowItem[] = [defaultItem, ...data];
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

  const onUploadImage = (b64: string) => setImageToUpload(b64);

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