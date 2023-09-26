import {useEffect, useState} from "react";
import axios from "axios";
import {parseString} from 'xml2js';
import {Button, Table, Tag,Popconfirm} from "antd"
import WorkerService from "../API/WorkerService";

export const WorkerTable = () => {
    const [loading, setLoading] = useState(false)
    const [jsonData, setJsonData] = useState(null);

    const handleDelete = (key: React.Key) => {
       console.log("del")
    };
    const handleUpdate = (key: React.Key) => {
        console.log("up")
    };
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
                        <Tag color={ tag.length>5 ? 'green':'green'} key={tag}>
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
        },
        {
            title: '',
            dataIndex: 'Delete',
            render: (_, record: { key: React.Key }) =>
                jsonData.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
        {
            title: '',
            dataIndex: 'Update',
            render: (_, record: { key: React.Key }) =>
                jsonData.length >= 1 ? (
                    <Popconfirm title="Sure to update?" onConfirm={() => handleUpdate(record.key)}>
                        <a>Update</a>
                    </Popconfirm>
                ) : null,
        }
    ]
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
    return (
        <div>
            <Table
                pagination={{ position: 'bottomCenter' }}
                loading={loading}
                columns={columns}
                dataSource={jsonData}
                style={{marginTop: 2}}
            >
            </Table>
            <Button onClick={handleAdd} type="primary" style={{marginBottom: 16, marginLeft: "45%"}}>
                Add a worker</Button>
        </div>
    )
}