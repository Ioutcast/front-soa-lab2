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
    const [filterState, setFilterState] = useState({});
    const loadData = async (pageCur) => {
        try {
            const queryParams = new URLSearchParams();
            for (const columnKey in filterState) {
                const filter = filterState[columnKey];
                if (filter.operator && filter.value) {
                    queryParams.append("filter",`${columnKey}[${filter.operator}]=${filter.value}`);
                }
            }
            // sortFields.forEach((field, index) => {
            //     queryParams.append(`sortElement`, field);
            // });
            queryParams.append(`sortElement`, "id");
            queryParams.append('pageSize', String(pagination.pageSize));
            queryParams.append('page', String(parseInt(pageCur)-1));
            const queryString = queryParams.toString();
            console.log(queryString)
            const url = `https://localhost:9000/company/workers?${queryString}`;
            const response = await axios.get(url)
                .catch((err) => {
                    console.log(err);
                });
            response ?
                parseString(response.data, (err, result) => {
                    if (err) {
                        console.error("Ошибка при парсинге XML:", err);
                    } else {
                        const content = result.SortedWorkersResponse.content[0].WorkerFullInfo;
                        const pageData = result.SortedWorkersResponse;
                        console.log(pageData.pagenumber[0])
                        const newPagination = {
                            current: parseInt(pageData.pagenumber[0])+1,
                            pageSize: parseInt(pageData.totalElements[0]),
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
    }, [pagination.current,filterState])
    const handleAdd = () =>{
        console.log("a")
    }
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
    const createFilterDropdown = (columnKey) => ({ confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Select
                style={{ width: 80, marginRight: 8 }}
                onChange={(value) => {
                    setFilterState({
                        ...filterState,
                        [columnKey]: {
                            ...filterState[columnKey],
                            operator: value,
                        },
                    });
                }}
            >
                <Option value="lte">{'<='}</Option>
                <Option value="gte">{'>='}</Option>
                <Option value="eq">{'='}</Option>
                <Option value="ne">{'!='}</Option>
                <Option value="gt">{'>'}</Option>
                <Option value="lt">{'<'}</Option>
            </Select>
            <Input
                placeholder="Filter"
                value={filterState[columnKey]?.value}
                onChange={(e) => {
                    setFilterState({
                        ...filterState,
                        [columnKey]: {
                            ...filterState[columnKey],
                            value: e.target.value,
                        },
                    });
                }}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
                type="primary"
                onClick={() => {
                    confirm();
                }}
            >
                Filter
            </Button>
            <Button onClick={() => {
                setFilterState((prevState) => ({
                    ...prevState,
                    [columnKey]: {
                        operator: undefined,
                        value: undefined,
                    },
                }));
                clearFilters();
            }}>
                Reset
            </Button>
        </div>
    );
    const columns = [
        {
            key: "1",
            title: "ID",
            dataIndex: "id",
            sorter: true,
            // onSort: (field: string)=> {
            //     console.log(field)
            //     const newSortFields = [...sortFields];
            //     const index = newSortFields.indexOf(field);
            //     if (index !== -1) {
            //         newSortFields.splice(index, 1);
            //     } else {
            //         newSortFields.push(field);
            //     }
            //     setSortFields(newSortFields);
            // },
            filterDropdown: createFilterDropdown("id"),
        },
        {
            key: "2",
            title: "Name",
            dataIndex: "name",
            sorter: true,
            sortOrder: sortFields.includes('name') ? (isSortAscending ? 'ascend' : 'descend') : null,
            filterDropdown: createFilterDropdown("name")
        },
        {
            title: "Coordinate",
            children: [
                {
                    title: "X",
                    dataIndex: ["Coordinate", "x"],
                    key: "5",
                    sorter: true,
                    filterDropdown: createFilterDropdown("x")
                },
                {
                    title: "Y",
                    dataIndex: ["Coordinate", "y"],
                    key: "55",
                    sorter: true,
                    filterDropdown: createFilterDropdown("y")
                }
            ]
        },
                {
                    key: "6",
                    title: "CreationDate",
                    dataIndex: "creationDate",
                    sorter: true,
                    sortOrder: sortFields.includes('creationDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
                    filterDropdown: createFilterDropdown("creationDate")
                },
                {
                    key: "7",
                    title: "StartDate",
                    dataIndex: "startDate",
                    sorter: true,
                    sortOrder: sortFields.includes('startDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
                    filterDropdown: createFilterDropdown("startDate")
                },
                {
                    key: "8",
                    title: "EndDate",
                    dataIndex: "endDate",
                    sorter: true,
                    sortOrder: sortFields.includes('endDate') ? (isSortAscending ? 'ascend' : 'descend') : null,
                    filterDropdown: createFilterDropdown("endDate")
                },
                {
                    key: "9",
                    title: "Salary",
                    dataIndex: "salary",
                    sorter: true,
                    sortOrder: sortFields.includes('salary') ? (isSortAscending ? 'ascend' : 'descend') : null,
                    filterDropdown: createFilterDropdown("salary")
                },
                {
                    key: "10",
                    title: "Position",
                    dataIndex: "position",
                    sorter: true,
                    sortOrder: sortFields.includes('position') ? (isSortAscending ? 'ascend' : 'descend') : null,
                    filterDropdown: createFilterDropdown("position"),
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
                            sorter: true,
                            filterDropdown: createFilterDropdown("organization.id")
                        },
                        {
                            key: "13",
                            dataIndex: ["Organization", "fullName"],
                            title: "fullName",
                            sorter: true,
                            filterDropdown: createFilterDropdown("organization.name")
                        },
                        {
                            key: "14",
                            title: "annualTurnover",
                            sorter: true,
                            dataIndex: ["Organization", "annualTurnover"],
                            filterDropdown: createFilterDropdown("organization.annualTurnover")
                        }
                    ]
                },
            ]
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
        console.log('Various parameters', pagination, filters, sorter);
    };
    return (
        <div>
            <Table
                pagination={pagination}
                bordered={true}
                loading={loading}
                columns={columns}
                dataSource={jsonData}
                style={{marginTop: 2}}
                onChange={handleTableChange}
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