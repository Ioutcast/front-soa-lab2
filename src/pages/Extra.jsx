import { useEffect, useState } from "react";
import WorkerService from "../API/WorkerService";
import { parseString } from "xml2js";
import { Form, DatePicker, Select, Button, Table } from "antd";
import { toast } from "react-toastify";

export const Extra = () => {
  const { Option } = Select;
  const [xmlData, setXmlData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
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
          dataIndex: ["Coordinates", "x"],
          key: "5",
        },
        {
          title: "Y",
          dataIndex: ["Coordinates", "y"],
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

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("fetchData Extra");
      const response = await WorkerService.getCount({
        headers: {
          Accept: "application/xml",
          "Access-Control-Allow-Origin": "*",
        },
      }).catch((error) => {
        console.log(error);
      });

      console.log(response);
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
          //   console.log(transformedObj);
          setXmlData([transformedObj]);
        }
      });
      setShowTable(true);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleButtonClick = () => {
    !showTable
      ? setButtonText("Cкрыть объект")
      : setButtonText(
          "Показать один (любой) объект, значение поля salary которого является максимальным."
        );
    setShowTable(!showTable);
  };
  useEffect(() => {
    if (showTable) {
      fetchData();
    }
  }, [showTable]);
  const [form] = Form.useForm();
  const [count, setCount] = useState(null);
  const fetchCount = async (data, condition) => {
    try {
      setLoading(true);
      console.log("fetchCount Extra");
      const response = await WorkerService.getByEndDateGl(data, condition, {
        headers: {
          Accept: "application/xml",
          "Access-Control-Allow-Origin": "*",
        },
      }).catch((error) => {
        console.log(error);
      });

      console.log("fetchCount Extra response");
      console.log(response);
      //todo undefined
      parseString(response.data, (err, result) => {
        if (err) {
          console.error("Ошибка при парсинге XML:", err);
        } else {
          let data = result.NumberOfWorkers;
          const transformedObj = {};
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              transformedObj[key] = data[key][0];
            }
          }
          setCount(transformedObj.number);
          // console.log(transformedObj.number)
        }
      });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      parseString(error.response.data, (err, result) => {
        if (err) {
          console.log("Ошибка при парсинге XML:", err);
          toast("Ошибка");
        } else {
          console.log("Не Ошибка при парсинге XML:", result);
          toast(result.Error.message[0]);
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const onFinish = (values) => {
    let { date, condition } = values;
    date = new Date(date);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    fetchCount(formattedDate, condition);
    form.resetFields();
  };
  return (
    <>
      <div className="page-container">
        <div className="left-section">
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="date"
              label="Дата LocalDate"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите дату LocalDate",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="condition"
              label="Выберите условие"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите условие",
                },
              ]}
            >
              <Select>
                <Option value="greater">Больше</Option>
                <Option value="equals">Равно</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Подсчитать
              </Button>
            </Form.Item>
          </Form>
          {count !== null && (
            <p>Количество объектов, удовлетворяющих условию: {count}</p>
          )}
        </div>
        <div className="middle-section">
          <Button onClick={handleButtonClick}>{buttonText}</Button>
          {showTable && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={xmlData}
              pagination={false}
            ></Table>
          )}
        </div>
      </div>
    </>
  );
};
