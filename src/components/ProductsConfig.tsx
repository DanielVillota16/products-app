import { Typography, Image, Divider, Popconfirm } from "antd";
import { Item } from "../types/Item";
import { EditableCellProps } from "./EditableCell";
import { Constants } from "../constants/Constants";

interface ColumnsProps {
  editingKey: number;
  save: (item: Item) => void;
  edit: (item: Item) => void;
  remove: (key: number) => void;
  cancel: () => void;
}

interface ColumnsWithOperationsProps extends ColumnsProps {
  onUploadImage: (url: string) => void;
}

const isEditing = (record: Item, editingKey: number) => record.key === editingKey;

const getColumns = ({ save, edit, remove, cancel, editingKey }: ColumnsProps) => {

  return [
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
        const editable = isEditing(record, editingKey);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record)}>
              Save
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== Constants.INVALID_KEY} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => remove(record.key)}>
              <Typography.Link disabled={editingKey !== Constants.INVALID_KEY} >
                Delete
              </Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ]
};

const mergedColumns = (props: ColumnsWithOperationsProps) => getColumns({ ...props }).map((col) => {
  if (!col.editable) {
    return col;
  }
  return {
    ...col,
    onCell: (record: Item): EditableCellProps => ({
      record,
      onUploadImage: props.onUploadImage,
      inputType: ['price', 'quantity'].includes(col.dataIndex) ? 'number' : col.dataIndex === 'productImageURL' ? 'image' : 'text',
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record, props.editingKey),
    } as EditableCellProps),
  };
});

export default mergedColumns;