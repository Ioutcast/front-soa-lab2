import { Button, Select, Input, Form, Table } from "antd";
import WorkerService from "../API/WorkerService";
import { parseString } from "xml2js";
import { useState } from "react";
import { toast } from "react-toastify";

export const Hr = () => {
  const { Item } = Form;
  const [jsonData, setJsonData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [buttonText, setButtonText] = useState(
    "Показать один (любой) объект, значение поля salary которого является максимальным."
  );
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Coordinate",
      children: [
        {
          title: "X",
          dataIndex: ["Coordinate", "coordinates_x"],
          key: "5",
        },
        {
          title: "Y",
          dataIndex: ["Coordinate", "coordinates_y"],
          key: "5",
        },
      ],
    },
    {
      key: "6",
      title: "CreationDate",
      dataIndex: "creationDate",
    },
    {
      key: "7",
      title: "StartDate",
      dataIndex: "startDate",
    },
    {
      key: "8",
      title: "EndDate",
      dataIndex: "endDate",
    },
    {
      key: "9",
      title: "Salary",
      dataIndex: "salary",
    },
    {
      key: "10",
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Organization",
      children: [
        {
          key: "12",
          title: "id",
          dataIndex: ["Organization", "id"],
        },
        {
          key: "13",
          dataIndex: ["Organization", "fullName"],
          title: "fullName",
        },
        {
          key: "14",
          title: "annualTurnover",
          dataIndex: ["Organization", "annualTurnover"],
        },
      ],
    },
  ];
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchData = async (workerId, idFrom, idTo) => {
    try {
      setLoading(true);
      const response = await WorkerService.postMove(workerId, idFrom, idTo);
      if (response.data) {
        parseString(response.data, (err, result) => {
          if (err) {
            console.error("Ошибка при парсинге XML:", err);
          } else {
            let data = result.WorkerFullInfo;
            const transformedObj = {};
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                transformedObj[key] = data[key][0];
              }
            }
            setJsonData([transformedObj]);
            console.log(transformedObj);
          }
        });
        setShowTable(true);
      } else {
        console.warn("Ответ сервера не содержит данных.");
      }
    } catch (error) {
      error.response?.data
        ? parseString(error.response.data, (err, result) => {
            if (err) {
              console.log("Ошибка при парсинге XML:", err);
              toast("Ошибка");
            } else {
              console.log("Не Ошибка при парсинге XML:", result);
              toast(result.Error.message[0]);
            }
          })
        : toast("Ошибка");
      // toast("Ошибка");
    } finally {
      setLoading(false);
    }
  };
  const onFinish = (values) => {
    setLoading(true);
    const { workerId, idFrom, idTo } = values;
    fetchData(workerId, idFrom, idTo);
    setLoading(false);
    form.resetFields();
  };
  return (
    <>
      {showTable && (
        <Table
          loading={loading}
          columns={columns}
          dataSource={jsonData}
          pagination={false}
        ></Table>
      )}
      <div className="form-container">
        <Form form={form} onFinish={onFinish}>
          <Item
            name="workerId"
            label="ID сотрудника"
            rules={[
              {
                required: true,
                message: "Введите ID сотрудника",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="idFrom"
            label="ID организации (откуда)"
            rules={[
              {
                required: true,
                message: "Введите ID организации (откуда)",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="idTo"
            label="ID организации (куда)"
            rules={[
              {
                required: true,
                message: "Введите ID организации (куда)",
              },
            ]}
          >
            <Input />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Переместить сотрудника
            </Button>
          </Item>
        </Form>
      </div>
    </>
  );
};
