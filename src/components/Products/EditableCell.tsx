import { Form, Input, InputNumber } from "antd";
import UploadProductImage from "./UploadProductImage";
import { Item } from "../../types/Item";

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'image';
  record: Item;
  index: number;
  children: React.ReactNode;
  onUploadImage: (url: string) => void;
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

  const rulesForImage = inputType === 'image' ?
    {
      rules: [
        {
          required: false,
        },
      ]
    } : {};

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
          {...rulesForImage}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;