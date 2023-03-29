import { useState } from "react";
import { Divider, Form, Image, Input, InputNumber, Popconfirm, Table, Typography } from "antd";

interface Item {
  key: React.Key;
  name: string;
  description: string;
  productImageURL: string;
  price: number;
  quantity: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Product ${i}`,
    description: `Epic product ${i}`,
    price: (i + 1) * 1000,
    productImageURL: "https://exitocol.vtexassets.com/arquivos/ids/15754680/Extruido-Maiz-Flamin-Hot-CHEETOS-75-gr-1780935_a.jpg?v=638053581797000000",
    quantity: i + 1,
  });
}

const Products = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState<React.Key>('');

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const add = () => {
    const defaultItem: Item = { description: '', key: '0', name: '', price: 0, quantity: 0, productImageURL: '' };
    const newData: Item[] = [defaultItem, ...data];
    const fixedKeys = newData.map((item: Item, index: number) => ({ ...item, key: `${index}` }));
    setEditingKey('0');
    setData(fixedKeys);
  }

  const remove = (key: React.Key) => {
    const newData = [...data];
    const index = newData.findIndex((item: Item) => key === item.key);
    if (index > -1) {
      newData.splice(index, 1);
      setData(newData);
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      render: (_: any, record: Item) => `$ ${record.price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'Image',
      dataIndex: 'productImageURL',
      render: (_: any, record: Item) => (
        <Image
          width={100}
          preview={{
            height: '50%'
          }}
          src={record.productImageURL}
        />
      )
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)}>
              Save
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => remove(record.key)}>
              <Typography.Link disabled={editingKey !== ''} >
                Delete
              </Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: ['price', 'quantity'].includes(col.dataIndex) ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        scroll={{ x: true }}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}

export default Products;