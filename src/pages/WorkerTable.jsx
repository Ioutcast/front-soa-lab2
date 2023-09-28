import {useEffect, useState} from "react";
import axios from "axios";
import {parseString} from 'xml2js';
import {Button, Table, Tag, Form, Input,Select} from "antd"

const { Option } = Select;
const {Item} = Form;
export const WorkerTable = () => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [jsonData, setJsonData] = useState(null);
    const [isSortAscending, setIsSortAscending] = useState(null);
    const [sortFields, setSortFields] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filterOperator, setFilterOperator] = useState('lte'); // По умолчанию, <=
    const [filter, setFilter] = useState(''); // По умолчанию, <=

    const handleDelete = () => {
        console.log("handleDelete")
    };
    const handleUpdate = () => {
        console.log("up")
    };
    const loadData = async (pageCur) => {
        try {
            const queryParams = new URLSearchParams();
            sortFields.forEach((field, index) => {
                queryParams.append(`sortElement`, field);
            });
            queryParams.append('pageSize', String(pagination.pageSize));
            queryParams.append('page', String(parseInt(pageCur)-1))
            const queryString = queryParams.toString();
            console.log(queryString)
            const url = `http://localhost:9000/company/workers?${queryString}`;
            const response = await axios.get(url)
                .catch((err) => {
                    console.log(err);
                });
            response ?
                parseString(response.data, (err, result) => {
                    if (err) {
                        console.error("Ошибка при парсинге XML:", err);
                    } else {
                        const content = result.PageImpl.content[0].content;
                        const pageData = result.PageImpl;
                        const newPagination = {
                            current: parseInt(pageData.number[0])+1,
                            pageSize: parseInt(pageData.size[0]),
                            total: parseInt(pageData.totalElements[0]),
                        };
                        setPagination(newPagination);
                        const transformedDataArray = content.map((contentItem) => {
                            const transformedObj = {};
                            transformedObj.id = contentItem.id[0];
                            transformedObj.name = contentItem.name[0];
                            transformedObj.Coordinate = {
                                x: contentItem.Coordinate[0].x[0],
                                y: parseFloat(contentItem.Coordinate[0].y[0]),
                            };
                            transformedObj.creationDate = contentItem.creationDate[0];
                            transformedObj.salary = parseFloat(contentItem.salary[0]);
                            transformedObj.startDate = contentItem.startDate[0];
                            transformedObj.endDate = contentItem.endDate[0];
                            transformedObj.position = contentItem.position[0];
                            transformedObj.Organization = {
                                id: contentItem.Organization[0].id[0],
                                fullName: contentItem.Organization[0].fullName[0],
                                annualTurnover: parseFloat(contentItem.Organization[0].annualTurnover[0]),
                            };
                            return transformedObj;
                        });
                        setJsonData(transformedDataArray);
                        // console.log(transformedDataArray)
                    }
                }) : setJsonData([])
            setLoading(false)
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setLoading(false)
        }
    };
    useEffect(() => {
        setLoading(true)
        loadData(pagination.current)
            .catch((err) => {
                console.log(err);
            });
    }, [pagination.current])
    const handleAdd = () => {
        console.log("handleAdd")
    };
    const handleOnFilter = () => {
        console.log("handleOnFilter")
    };
    const handleSort = (field) => {
        console.log(field)
        const newSortFields = [...sortFields];
        const index = newSortFields.indexOf(field);
        if (index !== -1) {
            newSortFields.splice(index, 1);
        } else {
            newSortFields.push(field);
        }
        setSortFields(newSortFields);
        setIsSortAscending(!isSortAscending);
        // setPagination({ ...pagination, current: 1 }); // Сбросите текущую страницу на 1 при изменении сортировки
    };
    const columns = [

        {
            key: "1",
            title: "ID",
            dataIndex: "id",
            sorter: true,
            sortOrder: sortFields.includes('id') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: (field: string)=> {
                console.log(field)
                const newSortFields = [...sortFields];
                const index = newSortFields.indexOf(field);
                if (index !== -1) {
                    newSortFields.splice(index, 1);
                } else {
                    newSortFields.push(field);
                }
                setSortFields(newSortFields);
            },filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            key: "2",
            title: "Name",
            dataIndex: "name",
            sorter: true,
            sortOrder: sortFields.includes('name') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('name'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            title: "Coordinate",
            sorter: true,
            sortOrder: sortFields.includes('Coordinate') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('Coordinate'),
            children: [
                {
                    title: "X",
                    dataIndex: ["Coordinate", "x"],
                    key: "5",
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Select
                                defaultValue="lte"
                                style={{ width: 80, marginRight: 8 }}
                                onChange={(value) => setFilterOperator(value)}
                            >
                                <Option value="lte">{'<='}</Option>
                                <Option value="gte">{'>='}</Option>
                            </Select>
                            <Input
                                placeholder="Filter"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                            >
                                Filter
                            </Button>
                            <Button onClick={() => {
                                setFilter('');
                                clearFilters();
                            }}>
                                Reset
                            </Button>
                        </div>
                    ),
                },
                {
                    title: "Y",
                    dataIndex: ["Coordinate", "y"],
                    key: "55",
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Select
                                defaultValue="lte"
                                style={{ width: 80, marginRight: 8 }}
                                onChange={(value) => setFilterOperator(value)}
                            >
                                <Option value="lte">{'<='}</Option>
                                <Option value="gte">{'>='}</Option>
                            </Select>
                            <Input
                                placeholder="Filter"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                            >
                                Filter
                            </Button>
                            <Button onClick={() => {
                                setFilter('');
                                clearFilters();
                            }}>
                                Reset
                            </Button>
                        </div>
                    ),
                },
            ]
        },
        {
            key: "6",
            title: "CreationDate",
            dataIndex: "creationDate",
            sorter: true,
            sortOrder: sortFields.includes('creationDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('creationDate'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            key: "7",
            title: "StartDate",
            dataIndex: "startDate",
            sorter: true,
            sortOrder: sortFields.includes('startDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('startDate'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            key: "8",
            title: "EndDate",
            dataIndex: "endDate",
            sorter: true,
            sortOrder: sortFields.includes('endDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('endDate'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            key: "9",
            title: "Salary",
            dataIndex: "salary",
            sorter: true,
            sortOrder: sortFields.includes('salary') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('salary'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        defaultValue="lte"
                        style={{ width: 80, marginRight: 8 }}
                        onChange={(value) => setFilterOperator(value)}
                    >
                        <Option value="lte">{'<='}</Option>
                        <Option value="gte">{'>='}</Option>
                    </Select>
                    <Input
                        placeholder="Filter"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                            confirm();
                        }}
                    >
                        Filter
                    </Button>
                    <Button onClick={() => {
                        setFilter('');
                        clearFilters();
                    }}>
                        Reset
                    </Button>
                </div>
            ),
        },
        {
            key: "10",
            title: "Position",
            dataIndex: "position",
            filters: [
                {text: 'Joe', value: 'Joe'},
                {text: 'Jim', value: 'Jim'},
            ],
            sorter: true,
            sortOrder: sortFields.includes('position') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('position'),

            onFilter: (value: string) => {
                handleOnFilter(value);
            },
            render: (tag) => (
                <Tag color={tag.length > 5 ? 'green' : 'green'} key={tag}>
                    {tag.toUpperCase()}
                </Tag>)
        },
        {
            title: "Organization",
            sorter: true,
            sortOrder: sortFields.includes('Organization') ? (isSortAscending ? 'ascend' : 'descend') : null,
            onSort: () => handleSort('Organization'),
            children: [
                {
                    key: "12",
                    title: "id",
                    dataIndex: ["Organization", "id"],
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Select
                                defaultValue="lte"
                                style={{ width: 80, marginRight: 8 }}
                                onChange={(value) => setFilterOperator(value)}
                            >
                                <Option value="lte">{'<='}</Option>
                                <Option value="gte">{'>='}</Option>
                            </Select>
                            <Input
                                placeholder="Filter"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                            >
                                Filter
                            </Button>
                            <Button onClick={() => {
                                setFilter('');
                                clearFilters();
                            }}>
                                Reset
                            </Button>
                        </div>
                    ),
                },
                {
                    key: "13",
                    dataIndex: ["Organization", "fullName"],
                    title: "fullName",
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Select
                                defaultValue="lte"
                                style={{ width: 80, marginRight: 8 }}
                                onChange={(value) => setFilterOperator(value)}
                            >
                                <Option value="lte">{'<='}</Option>
                                <Option value="gte">{'>='}</Option>
                            </Select>
                            <Input
                                placeholder="Filter"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                            >
                                Filter
                            </Button>
                            <Button onClick={() => {
                                setFilter('');
                                clearFilters();
                            }}>
                                Reset
                            </Button>
                        </div>
                    ),
                },
                {
                    key: "14",
                    title: "annualTurnover",
                    dataIndex: ["Organization", "annualTurnover"],
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Select
                                defaultValue="lte"
                                style={{ width: 80, marginRight: 8 }}
                                onChange={(value) => setFilterOperator(value)}
                            >
                                <Option value="lte">{'<='}</Option>
                                <Option value="gte">{'>='}</Option>
                            </Select>
                            <Input
                                placeholder="Filter"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Button
                                type="primary"
                                onClick={() => {
                                    setFilter(`coordinates.y[lte]=${selectedKeys[0]}`);
                                    confirm();
                                }}
                            >
                                Filter
                            </Button>
                            <Button onClick={() => {
                                setFilter('');
                                clearFilters();
                            }}>
                                Reset
                            </Button>
                        </div>
                    ),
                }
            ]
        }
    ]
    return (
        <div>

            <Table
                pagination={pagination}
                // onChange={handleTableChange}
                bordered={true}
                loading={loading}
                columns={columns}
                dataSource={jsonData}
                style={{marginTop: 2}}
                onChange={(newPagination, filters, sorter) => {
                    // if (sorter.field && sorter.order) {
                    //     handleSort(sorter.field, sorter.order);
                    // }
                    setPagination(newPagination);
                }}
            >
            </Table>
            <div className="container2">
                <div className="form-worker-changer">
                    <Button className="add-btn" onClick={handleAdd} type="primary">Создать сотрудника</Button>
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
                        <Item style={{textAlign: "center"}}>
                            <Button type="dashed" htmlType="submit" loading={loading}>
                                Обновить сотрудника
                            </Button>
                        </Item>
                    </Form>
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
                        <Item style={{textAlign: "center"}}>
                            <Button type="dashed" htmlType="submit" loading={loading}>
                                Удалить сотрудника
                            </Button>
                        </Item>
                    </Form>
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
                        <Item style={{textAlign: "center"}}>
                            <Button type="dashed" htmlType="submit" loading={loading}>
                                Уволить сотрудника
                            </Button>
                        </Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}