import { useState } from "react";
import { Button, Divider, Form, Image, Popconfirm, Table, Typography, message } from "antd";
import { Item } from "../types/Item";
import EditableCell, { EditableCellProps } from "./EditableCell";
import { Constants } from "../constants/Constants";
import mergedColumns from "./ProductsConfig";

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

  const edit = (record: Partial<Item> & { key: number }) => {
    setImageToUpload(record.productImageURL);
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    const index = typeof editingKey === 'number' ? editingKey : parseInt(editingKey);
    if (data[index].id === undefined) setData([...data.slice(1)]);
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
        setData(newData.map((item: Item, index: number) => ({ ...item, key: index })));
        unsetEditingKey();
      } else {
        const newProduct: Item = { ...row, id: Math.floor(Math.random() * 1000 + 1000) };
        const finalData = [newProduct, ...newData.slice(1)].map((item: Item, index: number) => ({ ...item, key: index }));
        setData(finalData);
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
    const dataWithfixedKeys = newData.map((item: Item, index: number): Item => ({ ...item, key: index }));
    setEditingKey(0);
    setData(dataWithfixedKeys);
  }

  const remove = (key: React.Key) => {
    const newData = [...data];
    const index = newData.findIndex((item: Item) => key === item.key);
    if (index > Constants.INVALID_KEY) {
      newData.splice(index, 1);
      setData(newData.map((item: Item, index: number) => ({ ...item, key: index })));
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