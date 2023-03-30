import { useState } from "react";
import { Divider, Form, Image, Input, InputNumber, Popconfirm, Table, Typography, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Item } from "../types/Item";
import { RcFile } from "antd/es/upload/interface";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'image';
  record: Item;
  index: number;
  children: React.ReactNode;
  onUploadImage: (url: string) => void;
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UploadProductImage: React.FC<{ onUpload: (url: string) => void }> = ({ onUpload }) => {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={(info) => {
        setLoading(true);
        getBase64(info.file as RcFile, (url) => {
          setLoading(false);
          setImageUrl(url);
          onUpload(url);
        })
      }}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )

}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onUploadImage,
  ...restProps
}) => {

  const mapInputTypeToInput = {
    number: <InputNumber />,
    text: <Input />,
    image: <UploadProductImage onUpload={onUploadImage} />,
  }

  const inputNode = mapInputTypeToInput[inputType];

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
  const [imageToUpload, setImageToUpload] = useState<string>();
  const [editingKey, setEditingKey] = useState<React.Key>('');

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = { ...(await form.validateFields()), productImageURL: imageToUpload } as Item;
      console.log(row);
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
      editable: true,
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
      onCell: (record: Item): EditableCellProps => ({
        record,
        onUploadImage: (url) => setImageToUpload(url),
        inputType: ['price', 'quantity'].includes(col.dataIndex) ? 'number' : col.dataIndex === 'productImageURL' ? 'image' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      } as EditableCellProps),
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
        scroll={{ x: true }}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}

export default Products;