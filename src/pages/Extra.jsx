import {useEffect, useState} from "react";
import WorkerService from "../API/WorkerService";
import {parseString} from "xml2js";
import {Form, DatePicker, Select, Button, Table} from "antd";

export const Extra = () => {
    const { Option } = Select;
    const [jsonData, setJsonData] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState(false)
    const [buttonText, setButtonText] = useState("Показать один (любой) объект, значение поля salary которого является максимальным.")
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
                    key: "5"
                },
                {
                    title: "Y",
                    dataIndex: ["Coordinate", "coordinates_y"],
                    key: "5",
                },
            ]
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
                    dataIndex: ["Organization", "annualTurnover"]
                }
            ]
        }
    ]

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await WorkerService.getCount()
            parseString(response.data, (err, result) => {
                if (err) {
                    console.error("Ошибка при парсинге XML:", err);
                } else {
                    let data = result.WorkerFullInfo
                    const transformedObj = {};
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            transformedObj[key] = data[key][0];
                        }
                    }
                    setJsonData([transformedObj]);
                    console.log(transformedObj)
                }
            });
            setShowTable(true);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleButtonClick = () => {
        !showTable ? setButtonText("Cкрыть объект") : setButtonText("Показать один (любой) объект, значение поля salary которого является максимальным.")
        setShowTable(!showTable);
    };
    useEffect(() => {
        if (showTable) {
            fetchData();
        }
    }, [showTable]);

    const [form] = Form.useForm();
    const [count, setCount] = useState(null);

    const onFinish = (values) => {
        const {date, condition} = values;

        // const filteredObjects = objects.filter((obj) => {
        //     const endDate = new Date(obj.endDate);
        //     const inputDate = new Date(date);
        //
        //     if (condition === 'greater') {
        //         return endDate > inputDate;
        //     } else if (condition === 'lower') {
        //         return endDate < inputDate;
        //     }
        //     return false;
        // });
        form.resetFields();
        setCount(2);
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
                                    message: 'Пожалуйста, выберите дату LocalDate',
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item
                            name="condition"
                            label="Выберите условие"
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, выберите условие',
                                },
                            ]}
                        >
                            <Select>
                                <Option value="greater">Больше</Option>
                                <Option value="lower">Меньше</Option>
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
                    {showTable && (<Table
                        loading={loading}
                        columns={columns}
                        dataSource={jsonData}
                        pagination={false}
                    ></Table>)}
                </div>
            </div>
        </>
    )
}