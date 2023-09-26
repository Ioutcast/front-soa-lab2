import {useEffect, useState} from "react";
import axios from "axios";
import {parseString} from 'xml2js';
import {Button, Table, Tag, Form, Input} from "antd"
import WorkerService from "../API/WorkerService";
import {FilterValue} from "antd/es/table/interface";
import {TablePaginationConfig} from "antd";
import {SorterResult} from "antd/es/table/interface";

const {Item} = Form;
export const WorkerTable = () => {

    // interface TableParams {
    //     pagination?: TablePaginationConfig;
    //     sortField?: string;
    //     sortOrder?: string;
    //     filters?: Record<string, FilterValue>;
    // }
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [jsonData, setJsonData] = useState(null);
    // const [tableParams, setTableParams] = useState<TableParams>({
    //     pagination: {
    //         current: 1,
    //         pageSize: 10,
    //     },
    // });


    const handleDelete = () => {
        console.log("handleDelete")
    };
    const handleUpdate = () => {
        console.log("up")
    };

    useEffect(() => {
        setLoading(true)
        const loadData = async () => {
            const response = await WorkerService.getAll()
                .catch((err) => {
                    console.log(err);
                });
            parseString(response.data, (err, result) => {
                if (err) {
                    console.error("Ошибка при парсинге XML:", err);
                } else {
                    let transformedDataArray = result.content.WorkerFullInfo.map(obj => {
                        const transformedObj = {};
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                transformedObj[key] = obj[key][0];
                            }
                        }
                        return transformedObj;
                    });
                    setJsonData(transformedDataArray);
                    // console.log(transformedDataArray)
                }
            });
        }
        loadData();
        setLoading(false)
    }, [])
    const handleAdd = () => {
        console.log("add")
    };
    // const handleTableChange = (
    //     pagination: TablePaginationConfig,
    //     filters: Record<string, FilterValue>,
    //     sorter: SorterResult<DataType>,
    // ) => {
    //     setTableParams({
    //         pagination,
    //         filters,
    //         ...sorter,
    //     });
    //     // `dataSource` is useless since `pageSize` changed
    //     if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //         setJsonData([]);
    //     }
    // };
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
            render: (tag) => (
                <Tag color={tag.length > 5 ? 'green' : 'green'} key={tag}>
                    {tag.toUpperCase()}
                </Tag>)
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
    return (
        <div>

            <Table
                pagination={{position: ["bottomCenter"]}}
                // onChange={handleTableChange}
                bordered={true}
                loading={loading}
                columns={columns}
                dataSource={jsonData}
                style={{marginTop: 2}}
            >
            </Table>
            <div className="container2">
            <div className="form-worker-changer">
                <Button className="add-btn" onClick={handleAdd} type="primary" >Создать сотрудника</Button>
            </div>
            <div className="form-worker-changer">
                <Form form={form}>
                    <Item
                        name="employeeId"
                        label="ID сотрудника"
                        rules={[
                            {
                                required: true,
                                message: 'Введите ID сотрудника',
                            },
                        ]}
                    >
                        <Input/>
                    </Item>
                    <Item style={{textAlign : "center"}}>
                        <Button type="dashed" htmlType="submit" loading={loading}>
                            Обновить сотрудника
                        </Button>
                    </Item>
                </Form>
            </div>
            <div className="form-worker-changer">
                <Form form={form} >
                    <Item
                        name="employeeId"
                        label="ID сотрудника"
                        rules={[
                            {
                                required: true,
                                message: 'Введите ID сотрудника',
                            },
                        ]}
                    >
                        <Input />
                    </Item>
                    <Item style={{textAlign : "center"}}>
                        <Button type="dashed" htmlType="submit" loading={loading}>
                            Удалить сотрудника
                        </Button>
                    </Item>
                </Form>
            </div>
            <div className="form-worker-changer">
                <Form form={form} >
                    <Item
                        name="employeeId"
                        label="ID сотрудника"
                        rules={[
                            {
                                required: true,
                                message: 'Введите ID сотрудника',
                            },
                        ]}
                    >
                        <Input />
                    </Item>
                    <Item style={{textAlign : "center"}}>
                        <Button type="dashed" htmlType="submit" loading={loading}>
                           Уволить сотрубника
                        </Button>
                    </Item>
                </Form>
            </div>
            </div>
        </div>
    )
}