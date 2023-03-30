import { useState } from "react";
import { Button, Form, Table, message } from "antd";

import EditableCell from "./EditableCell";

import mergedColumns from "./ProductsConfig";
import { Item } from "../../types/Item";
import { Constants } from "../../constants/Constants";

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    id: i,
    key: i,
    name: `Product ${i}`,
    description: `Epic product ${i}`,
    productImageURL: "https://exitocol.vtexassets.com/arquivos/ids/15754680/Extruido-Maiz-Flamin-Hot-CHEETOS-75-grINVALID_KEY780935_a.jpg?v=638053581797000000",
  });
}

const Products = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [imageToUpload, setImageToUpload] = useState<string>();
  const [editingKey, setEditingKey] = useState<number>(Constants.INVALID_KEY);

  const unsetEditingKey = () => setEditingKey(Constants.INVALID_KEY);

  const addItemKeys = (data: Item[]) => data.map((item: Item, index: number) => ({ ...item, key: index }));

  const edit = (record: Partial<Item> & { key: number }) => {
    setImageToUpload(record.productImageURL);
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (editingKey > Constants.INVALID_KEY && data[editingKey]?.id === undefined) {
      setData([...data.slice(1)]);
    }
    unsetEditingKey();
  };

  const save = async (record: Item) => {
    const key = record.key;
    try {
      if (!imageToUpload) throw "no image loaded";
      const row = { ...(await form.validateFields()), productImageURL: imageToUpload } as Item;
      const newData = [...data];
      if (record.id !== undefined) {
        const item = newData[key];
        newData.splice(key, 1, {
          ...item,
          ...row,
        });
        const newDataWithKeys = addItemKeys(newData);
        setData(newDataWithKeys);
        unsetEditingKey();
      } else {
        const newProduct: Item = { ...row, id: Math.floor(Math.random() * 1000 + 1000) };
        const newDataWithKeys = addItemKeys([newProduct, ...newData.slice(1)]);
        setData(newDataWithKeys);
        unsetEditingKey();
      }
      form.resetFields();
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
    setEditingKey(0);
    setData(dataWithfixedKeys);
  }

  const remove = (key: React.Key) => {
    const newData = [...data];
    const index = newData.findIndex((item: Item) => key === item.key);
    if (index > Constants.INVALID_KEY) {
      newData.splice(index, 1);
      const newDataWithKeys = addItemKeys(newData);
      setData(newDataWithKeys);
    }
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