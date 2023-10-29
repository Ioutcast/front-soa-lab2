import { useEffect, useState } from "react";
import axios from "axios";
import xml2js, { parseString } from "xml2js";
import useSound from "use-sound";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
} from "antd";
import welcome from "../mp3f/osu.mp3";
import WorkerService from "../API/WorkerService";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Item } = Form;

export const WorkerTable = () => {
  const [firstPlay, setFirstPlay] = useState(true);
  const [play] = useSound(welcome);
  const [form4] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
      for (let columnKey in filterState) {
        const filter = filterState[columnKey];
        if (filter.operator && filter.value) {
          if (columnKey == "x") columnKey = "coordinates.x";
          if (columnKey == "y") columnKey = "coordinates.y";
          if (columnKey == "startDate") columnKey = "startdate";
          if (columnKey == "endDate") columnKey = "enddate";
          if (columnKey == "creationDate") columnKey = "creationdate";
          queryParams.append(
            "filter",
            `${columnKey}[${filter.operator}]=${filter.value}`
          );
        }
      }
      // sortFields.forEach((field, index) => {
      //     queryParams.append(`sortElements`, field);
      // });

      // //todo
      // queryParams.append("isUpper", "true");
      // queryParams.append(`sortElements`, "id");
      queryParams.append("pageSize", String(pagination.pageSize));
      queryParams.append("page", String(parseInt(pageCur) - 1));
      const queryString = queryParams.toString();

      const url = `https://localhost:9000/company/workers?${queryString}`;
      const response = await axios.get(url).catch((err) => {
        console.log(err);
      });
      response
        ? parseString(response.data, (err, result) => {
            if (err) {
              console.error("Ошибка при парсинге XML:", err);
            } else {
              const content =
                result.SortedWorkersResponse.content[0].WorkerFullInfo;
              const pageData = result.SortedWorkersResponse;
              const newPagination = {
                current: parseInt(pageData.pagenumber[0]) + 1,
                pageSize: 10,
                total: parseInt(pageData.totalElements[0]),
              };
              setPagination(newPagination);
              let index = 0;
              try {
                const transformedDataArray = content.map((contentItem) => {
                  const transformedObj = {};
                  transformedObj.key = index++;
                  transformedObj.id = contentItem.id[0];
                  transformedObj.name = contentItem.name[0];
                  transformedObj.Coordinate = {
                    x: contentItem.Coordinates[0].x[0],
                    y: parseFloat(contentItem.Coordinates[0].y[0]),
                  };
                  transformedObj.creationDate = contentItem.creationDate[0];
                  transformedObj.salary = parseFloat(contentItem.salary[0]);
                  transformedObj.startDate = contentItem.startDate[0];
                  transformedObj.endDate = contentItem.endDate[0];
                  transformedObj.position = contentItem.position[0];
                  transformedObj.Organization = {
                    id: contentItem.Organization[0].id[0],
                    fullName: contentItem.Organization[0].fullName[0],
                    annualTurnover: parseFloat(
                      contentItem.Organization[0].annualTurnover[0]
                    ),
                  };
                  return transformedObj;
                });
                setJsonData(transformedDataArray);
                // console.log(transformedDataArray)
              } catch (error) {
                setPagination({
                  current: 1,
                  pageSize: 10,
                  total: 0,
                });
                setJsonData([]);
              }
            }
          })
        : setJsonData([]);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      setLoading(false);
    }
  };
  const [componentDisabled, setComponentDisabled] = useState(true);
  const handlePlay = () => {
    setFirstPlay(true);
    play();
    console.log(play);
  };
  useEffect(() => {
    setLoading(true);
    loadData(pagination.current).catch((err) => {
      console.log(err);
    });
    if (firstPlay == true) handlePlay();
  }, [pagination.current, filterState]);
  const [editingRow, setEditingRow] = useState(null);

  // const handleSort = (field) => {
  //     console.log(field)
  //     const newSortFields = [...sortFields];
  //     const index = newSortFields.indexOf(field);
  //     if (index !== -1) {
  //         newSortFields.splice(index, 1);
  //     } else {
  //         newSortFields.push(field);
  //     }
  //     setSortFields(newSortFields);
  //     setIsSortAscending(!isSortAscending);
  //     // setPagination({ ...pagination, current: 1 }); // Сбросите текущую страницу на 1 при изменении сортировки
  // };
  const createFilterDropdown =
    (columnKey) =>
    ({ confirm, clearFilters }) =>
      (
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
            <Option value="lte">{"<="}</Option>
            <Option value="gte">{">="}</Option>
            <Option value="eq">{"="}</Option>
            <Option value="ne">{"!="}</Option>
            <Option value="gt">{">"}</Option>
            <Option value="lt">{"<"}</Option>
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
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => {
              confirm();
            }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              setFilterState((prevState) => ({
                ...prevState,
                [columnKey]: {
                  operator: undefined,
                  value: undefined,
                },
              }));
              clearFilters();
              setPagination({
                current: 1,
                pageSize: 10,
                total: 0,
              });
            }}
          >
            Reset
          </Button>
        </div>
      );
  const columns = [
    {
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
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="id"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortOrder: sortFields.includes("name")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("name"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Coordinate",
      children: [
        {
          title: "X",
          dataIndex: ["Coordinate", "x"],
          sorter: true,
          filterDropdown: createFilterDropdown("x"),
          render: (text, record) => {
            if (editingRow === record.key) {
              return (
                <Form.Item
                  name="coordinate_x"
                  rules={[
                    {
                      required: true,
                      message: "Please enter x",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              );
            } else {
              return <p>{text}</p>;
            }
          },
        },
        {
          title: "Y",
          dataIndex: ["Coordinate", "y"],
          sorter: true,
          filterDropdown: createFilterDropdown("y"),
          render: (text, record) => {
            if (editingRow === record.key) {
              return (
                <Form.Item
                  name="coordinate_y"
                  rules={[
                    {
                      required: true,
                      message: "Please enter y",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              );
            } else {
              return <p>{text}</p>;
            }
          },
        },
      ],
    },
    {
      title: "CreationDate",
      dataIndex: "creationDate",
      sorter: true,
      sortOrder: sortFields.includes("creationDate")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("creationDate"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="creationDate"
              rules={[
                {
                  required: true,
                  message: "Please enter your creationDate",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "StartDate",
      dataIndex: "startDate",
      sorter: true,
      sortOrder: sortFields.includes("startDate")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("startDate"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Please enter your startDate",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "EndDate",
      dataIndex: "endDate",
      sorter: true,
      sortOrder: sortFields.includes("endDate")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("endDate"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "Please enter endDate",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: true,
      sortOrder: sortFields.includes("salary")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("salary"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="salary"
              rules={[
                {
                  required: true,
                  message: "Please enter salary",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Position",
      dataIndex: "position",
      sorter: true,
      sortOrder: sortFields.includes("position")
        ? isSortAscending
          ? "ascend"
          : "descend"
        : null,
      filterDropdown: createFilterDropdown("position"),
      render: (text, record) => {
        if (editingRow === record.key) {
          return (
            <Form.Item
              name="position"
              rules={[
                {
                  required: true,
                  message: "Please enter position",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Organization",
      children: [
        {
          title: "id",
          dataIndex: ["Organization", "id"],
          sorter: true,
          filterDropdown: createFilterDropdown("organization.id"),
          render: (text, record) => {
            if (editingRow === record.key) {
              return (
                <Form.Item
                  name="organization_id"
                  rules={[
                    {
                      required: true,
                      message: "Please enter organization.id",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              );
            } else {
              return <p>{text}</p>;
            }
          },
        },
        {
          dataIndex: ["Organization", "fullName"],
          title: "fullName",
          sorter: true,
          filterDropdown: createFilterDropdown("organization.name"),
          render: (text, record) => {
            if (editingRow === record.key) {
              return (
                <Form.Item
                  name="organization_fullName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter organization.name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              );
            } else {
              return <p>{text}</p>;
            }
          },
        },
        {
          title: "annualTurnover",
          sorter: true,
          dataIndex: ["Organization", "annualTurnover"],
          filterDropdown: createFilterDropdown("organization.annualTurnover"),
          render: (text, record) => {
            if (editingRow === record.key) {
              return (
                <Form.Item
                  name="organization_annualTurnover"
                  rules={[
                    {
                      required: true,
                      message: "Please enter organization.annualTurnover",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              );
            } else {
              return <p>{text}</p>;
            }
          },
        },
      ],
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                editingRow == null
                  ? setEditingRow(record.key)
                  : setEditingRow(null);
                form3.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  coordinate_x: record.Coordinate.x,
                  coordinate_y: record.Coordinate.y,
                  creationDate: record.creationDate,
                  endDate: record.endDate,
                  startDate: record.startDate,
                  salary: record.salary,
                  position: record.position,
                  organization_id: record.Organization.id,
                  organization_fullName: record.Organization.fullName,
                  organization_annualTurnover:
                    record.Organization.annualTurnover,
                });
              }}
            >
              {editingRow == null ? (
                <p>Edit</p>
              ) : (
                <p style={{ color: "red" }}>Cancel</p>
              )}
            </Button>
            {editingRow != null ? (
              <Button type="link" htmlType="submit">
                Save
              </Button>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination);
    setPagination(pagination);
  };
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
    setComponentDisabled(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const onFinish1 = () => {
    form4
      .validateFields()
      .then(async (values) => {
        values.endDate = values.StartDateEndDate[1].$d
          .toISOString()
          .split("T")[0];
        values.startDate = values.StartDateEndDate[0].$d
          .toISOString()
          .split("T")[0];
        delete values.StartDateEndDate;
        values.Organization = {
          id: values.organization_id,
          fullName: values.organization_fullName,
          annualTurnover: values.organization_annualTurnover,
        };
        delete values.organization_annualTurnover;
        delete values.organization_fullName;
        delete values.organization_id;
        const coord = {
          x: values.CoordinateX,
          y: values.CoordinateY,
        };
        delete values.CoordinateX;
        delete values.CoordinateY;
        values.Coordinates = coord;
        const builder = new xml2js.Builder({ rootName: "CreateWorkerRequest" });
        const xmlData = builder.buildObject(values);
        const response = await axios
          .post(`https://localhost:9000/company/workers`, xmlData, {
            headers: {
              "Content-Type": "text/xml",
            },
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };
  const onFinish3 = async (values) => {
    let id = values.id;
    delete values.id;
    const organization = {
      id: values.organization_id,
      fullName: values.organization_fullName,
      annualTurnover: values.organization_annualTurnover,
    };
    delete values.organization_annualTurnover;
    delete values.organization_fullName;
    delete values.organization_id;
    values.Organization = organization;
    const coord = {
      x: values.coordinate_x,
      y: values.coordinate_y,
    };
    delete values.coordinate_x;
    delete values.coordinate_y;
    values.Coordinates = coord;
    values.creationDate = values.creationDate + "Z";
    const builder = new xml2js.Builder({ rootName: "WorkerInfo" });
    const xmlData = builder.buildObject(values);
    const response = await axios
      .put(`https://localhost:9000/company/workers/${id}`, xmlData, {
        headers: {
          "Content-Type": "application/xml",
        },
      })
      .catch((error) => {
        console.log(error);
      });

    loadData(1);
    setEditingRow(null);
  };
  return (
    <div>
      <Form form={form3} onFinish={onFinish3}>
        <Table
          pagination={pagination}
          bordered={true}
          loading={loading}
          columns={columns}
          dataSource={jsonData}
          style={{ marginTop: 2, textAlign: "center" }}
          onChange={handleTableChange}
        ></Table>
      </Form>
      <div className="container2">
        <div className="form-worker-changer">
          <Button className="add-btn" onClick={showModal} type="primary">
            Создать сотрудника
          </Button>
        </div>
        <div className="form-worker-changer">
          <Form form={form1}>
            <Item
              name="employeeId"
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
            <Item style={{ textAlign: "center" }}>
              <Button type="dashed" htmlType="submit" loading={loading}>
                Удалить сотрудника
              </Button>
            </Item>
          </Form>
        </div>
        <div className="form-worker-changer">
          <Form form={form2}>
            <Item
              name="employeeId"
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
            <Item style={{ textAlign: "center" }}>
              <Button type="dashed" htmlType="submit" loading={loading}>
                Уволить сотрудника
              </Button>
            </Item>
          </Form>
        </div>
      </div>
      <Modal
        open={open}
        title="Параметры сотрудника"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onFinish1}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form4}
          onFinish={onFinish1}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={componentDisabled}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" rules={[{ required: true }]} label="Name">
            <Input />
          </Form.Item>
          <Form.Item
            name="CoordinateX"
            rules={[{ required: true }]}
            label="CoordinateX"
          >
            <Input
              rules={[{ required: true }]}
              style={{ marginBottom: 10 }}
              placeholder="x"
            />
          </Form.Item>
          <Form.Item
            name="CoordinateY"
            rules={[{ required: true }]}
            label="CoordinateY"
          >
            <Input rules={[{ required: true }]} placeholder="y" />
          </Form.Item>
          <Form.Item
            name="StartDateEndDate"
            rules={[{ required: true }]}
            label="Start/End"
          >
            <RangePicker showTime />
          </Form.Item>
          <Form.Item name="salary" rules={[{ required: true }]} label="Salary">
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="position"
            rules={[{ required: true }]}
            label="Position"
          >
            <Input />
          </Form.Item>
          <Form.Item name="organization_id" label="id">
            <Input rules={[{ required: true }]} placeholder="id" />
          </Form.Item>
          <Form.Item name="organization_fullName" label="fullname">
            <Input rules={[{ required: true }]} placeholder="fullname" />
          </Form.Item>
          <Form.Item name="organization_annualTurnover" label="annualTurnover">
            <Input rules={[{ required: true }]} placeholder="annualTurnover" />
          </Form.Item>
        </Form>
      </Modal>
      {/* <div id="game-container">
                <iframe id="iframe-in-game" src="https://webosu.online/" style={{ marginWidth:0,
                        marginHeight:0 ,frameBorder:0 ,scrolling:'no', width:1920 , height:1080,
                        allow:'autoplay; fullscreen', allowFullScreen:""}} >
                </iframe>
            </div> */}
    </div>
  );
};
