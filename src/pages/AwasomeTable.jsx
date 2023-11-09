import React from "react";
import WorkerFrame from "./WorkerFrame";
import { useEffect, useState } from "react";
import axios from "axios";
import xml2js, { parseString } from "xml2js";
import IcomoonReact, { iconList } from "icomoon-react";
import iconSet from "../mp3f/selection.json";
import CreateWorkerForm from "./CreateWorkerForm";
import { Tooltip } from "react-tooltip";
import { Tooltip as ReactTooltip } from "react-tooltip";
const AwasomeTable = () => {
  const [filterState, setFilterState] = useState({});
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [isSortAscending, setIsSortAscending] = useState(null);
  const [sortFields, setSortFields] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [codeMsg, setCodeMsg] = useState(500);
  const handleChangeSort = (event) => {
    const allowedWords = [
      "id",
      "name",
      "x",
      "y",
      "creationDate",
      "salary",
      "startDate",
      "endDate",
      "position",
      "organization.name",
      "organization.annualTurnover",
      "coordinates.x",
      "coordinates.y",
    ];
    let inputString = event.target.value;
    inputString = inputString.replace("x", "coordinates.x");
    inputString = inputString.replace("y", "coordinates.y");
    const words = inputString.split(", ").map((word) => word.trim());
    const invalidWords = words.filter((word) => !allowedWords.includes(word));

    if (invalidWords.length > 0) {
      event.target.value = "";
      setSortFields([]);
      return;
    }
    setSortFields(words);
  };
  const handleKeyDownSort = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };
  const handleChange = (event) => {
    const pattern =
      /^(!=|=|<|>|<=|>=)\s*(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(Z)?)?|[a-zA-Z0-9]+)$/;

    let inputValue = event.target.value;
    let columnKey = event.target.id;
    handleElementUnClick(event.target.id);
    if (!pattern.test(inputValue)) {
      event.target.value = "";
      const updatedFilterState = { ...filterState };
      delete updatedFilterState[columnKey];
      setFilterState(updatedFilterState);
      return;
    }
    const pattern1 =
      /^(!=|=|<|>|<=|>=)\s*(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(Z)?)?|[a-zA-Z0-9]+)$/;

    const match = inputValue.match(pattern1);
    if (match) {
      const operator = transformOperator(match[1]);
      let value = match[2];
      if (columnKey == "creationdate" && !value.endsWith("Z")) value += "Z";

      setFilterState((prevFilterState) => ({
        ...prevFilterState,
        [columnKey]: {
          operator: operator,
          value: value,
        },
      }));
    }
  };
  useEffect(() => {
    loadData(1);
  }, [filterState, sortFields]);
  const onClickRight = () => {
    if (pagination.total / pagination.pageSize > pagination.current)
      setPagination({
        ...pagination,
        current: pagination.current + 1,
      });
  };
  const onClickLeft = () => {
    if (pagination.current > 1)
      setPagination({
        ...pagination,
        current: pagination.current - 1,
      });
  };
  useEffect(() => {
    loadData(pagination.current);
  }, [pagination.current]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };
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
      sortFields.forEach((field) => {
        queryParams.append(`sortElements`, field);
      });

      queryParams.append("isUpper", "true");
      queryParams.append("pageSize", String(pagination.pageSize));
      queryParams.append("page", String(parseInt(pageCur) - 1));
      const queryString = queryParams.toString();

      const url = `https://localhost:9000/company/workers?${queryString}`;
      const response = await axios.get(url).catch((err) => {
        parseString(err.response.data, (err, result) => {
          setErrorMsg(result.Error.message[0]);
          setCodeMsg(400);
        });
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
        });
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
                // console.log(transformedDataArray);
              } catch (error) {
                console.log(codeMsg);
                setCodeMsg(200);
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
  const transformOperator = (operator) => {
    switch (operator) {
      case "!=":
        return "ne";
      case "=":
        return "eq";
      case ">":
        return "gt";
      case "<":
        return "lt";
      case ">=":
        return "gte";
      case "<=":
        return "lte";
      default:
        return operator;
    }
  };
  const [clickedElements, setClickedElements] = useState(new Set());

  const handleElementClick = (elementId) => {
    const updatedClickedElements = new Set(clickedElements);
    updatedClickedElements.add(elementId);
    setClickedElements(updatedClickedElements);
  };
  const handleElementUnClick = (elementId) => {
    const updatedClickedElements = new Set(clickedElements);

    if (clickedElements.has(elementId)) {
      updatedClickedElements.delete(elementId);
    }
    setClickedElements(updatedClickedElements);
  };

  return (
    <>
      <Tooltip id="my-tooltip" />
      <div className="statistics">
        <div className="statistics welcome-screen">
          <div className="count-stat click" style={{ paddingRight: 15 }}>
            <h1 style={{ color: "#65687B" }}>{pagination.total}</h1>
            <a style={{ color: "#65687B" }}>работников</a>
          </div>
          <div className="mini-statistics">
            <div className="positions click" style={{ marginTop: 10 }}>
              <h2>4</h2>
              <a style={{ color: "#65687B" }}>позиций</a>
            </div>
            <div class="dotted-dot"></div>
            <div className="organizations click" style={{ marginTop: 10 }}>
              <h2>5</h2>
              <a style={{ color: "#65687B" }}>организаций</a>
            </div>
          </div>
        </div>
      </div>
      <div className="filters">
        <div className="filter">
          <div style={{ marginBottom: 10 }}>Worker Filters</div>

          <div
            className="sort"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Доступные поля id, name, x, y, creationDate, 
            salary, startDate, endDate, position, organization.name,
             organization.annualTurnover. Перечисление через запятую."
          >
            <div className="sort__elements_title text-nowrap">
              <span class="icon-stack icon-spetc"></span>
              <span>Sort Elements</span>
            </div>
            <div className="input-v5 query__filter" style={{ width: "100%" }}>
              <input
                id="sortElements"
                onKeyDown={handleKeyDownSort}
                onBlur={handleChangeSort}
                className="input__filter"
                style={{ width: "100%" }}
                type="text"
                placeholder="id, name, x, y, creationDate, 
                salary, startDate, endDate, position, organization.name,
                 organization.annualTurnover"
              />
            </div>
          </div>

          <div className="input-v4 filter_flex">
            <div
              id={1}
              className={`outer ${clickedElements.has("name") ? "" : "-iNON"}`}
            >
              <div class="txt-nowrap">
                <span class="icon-user"></span>
                <span>Name:</span>
              </div>
              <div className="input-v3 name__filter">
                <Tooltip id="my-tooltip2" />
                <input
                  data-tooltip-id="my-tooltip2"
                  data-tooltip-content="Пример допустимого ввода: != = (вводимые данные)"
                  onClick={() => handleElementClick("name")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="name"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              id={2}
              className={`outer ${
                clickedElements.has("coordinates.x") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-location"></span>
                <span>Coord_x:</span>
              </div>
              <div className="input-v3 x__filter">
                <Tooltip id="my-tooltip3" />
                <input
                  data-tooltip-id="my-tooltip3"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные)"
                  onClick={() => handleElementClick("coordinates.x")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="coordinates.x"
                  className="input__filter -iNON"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              className={`outer ${
                clickedElements.has("coordinates.y") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-location2"></span>
                <span>Coord_y:</span>
              </div>
              <div className="input-v3 y__filter">
                <Tooltip id="my-tooltip4" />
                <input
                  data-tooltip-id="my-tooltip4"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные)"
                  onClick={() => handleElementClick("coordinates.y")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="coordinates.y"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
          </div>
          <div className="filter_flex">
            <div
              className={`outer ${
                clickedElements.has("creationdate") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-accessibility"></span>
                <span>Creation Date:</span>
              </div>
              <div className="input-v3 creationDate__filter">
                <Tooltip id="my-tooltip5" />
                <input
                  data-tooltip-id="my-tooltip5"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные). Поддерживаемый тип вводымых данных: yyyy-mm-ddThh:mm:ss "
                  onClick={() => handleElementClick("creationdate")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="creationdate"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              className={`outer ${
                clickedElements.has("startdate") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-neutral"></span>
                <span>Start Date:</span>
              </div>
              <div className="input-v3 startDate__filter">
                <Tooltip id="my-tooltip6" />
                <input
                  data-tooltip-id="my-tooltip6"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные). Поддерживаемый тип вводымых данных: yyyy-mm-dd "
                  onClick={() => handleElementClick("startdate")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="startdate"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              className={`outer ${
                clickedElements.has("enddate") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-baffled"></span>
                <span>End Date:</span>
              </div>
              <div className="input-v3 endDate__filter">
                <Tooltip id="my-tooltip67" />
                <input
                  data-tooltip-id="my-tooltip67"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные).Поддерживаемый тип вводымых данных: yyyy-mm-dd "
                  onClick={() => handleElementClick("enddate")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="enddate"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
          </div>
          <div className="filter_flex">
            <div
              className={`outer ${
                clickedElements.has("salary") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-arrow-up-right2"></span>
                <span>Salary:</span>
              </div>
              <div className="input-v3 salary__filter">
                <Tooltip id="my-tooltip63" />
                <input
                  data-tooltip-id="my-tooltip63"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные)"
                  onClick={() => handleElementClick("salary")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="salary"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              className={`outer ${
                clickedElements.has("position") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-embed"></span>
                <span>Position:</span>
              </div>
              <div className="input-v3 position__filter">
                <Tooltip id="my-tooltip633" />
                <input
                  data-tooltip-id="my-tooltip633"
                  data-tooltip-content="Пример допустимого ввода: = !=(вводимые данные)"
                  onClick={() => handleElementClick("position")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="position"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
          </div>
          <div>Organization</div>
          <div className="filter_flex">
            <div
              className={`outer ${
                clickedElements.has("organization.id") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-embed"></span>
                <span>Id:</span>
              </div>
              <div className="input-v3 Organization__id__filter">
                <Tooltip id="my-tooltip6233" />
                <input
                  data-tooltip-id="my-tooltip6233"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >=(вводимые данные)"
                  onClick={() => handleElementClick("organization.id")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="organization.id"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div
              className={`outer ${
                clickedElements.has("organization.name") ? "" : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-flickr4"></span>
                <span>Name:</span>
              </div>
              <div className="input-v3 Organization__name__filter">
                <Tooltip id="my-tooltip62323" />
                <input
                  data-tooltip-id="my-tooltip62323"
                  data-tooltip-content="Пример допустимого ввода: = != (вводимые данные)"
                  onClick={() => handleElementClick("organization.name")}
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="organization.name"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>

            <div
              className={`outer ${
                clickedElements.has("organization.annualTurnover")
                  ? ""
                  : "-iNON"
              }`}
            >
              <div class="txt-nowrap">
                <span class="icon-libreoffice"></span>
                <span>Annual Turnover:</span>
              </div>
              <div className="input-v3 Organization__annualTurnover__filter">
                <Tooltip id="my-tooltip623231" />
                <input
                  data-tooltip-id="my-tooltip623231"
                  data-tooltip-content="Пример допустимого ввода: < > = != <= >= (вводимые данные)"
                  onClick={() =>
                    handleElementClick("organization.annualTurnover")
                  }
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="organization.annualTurnover"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {pagination.total / pagination.pageSize >= 1 || pagination.total > 0 ? (
        <div className="pagination__arr">
          <div className={pagination.current <= 1 ? "left click-dsb" : "left"}>
            <div
              className={pagination.current <= 1 ? "" : "click"}
              style={{ fontSize: 34 }}
              onClick={onClickLeft}
            >
              {"<"}
            </div>
          </div>
          <div
            className="curr_page"
            style={{ marginLeft: 20, marginRight: 20 }}
          >
            <span style={{ fontSize: 34 }}>{pagination.current}</span>
            <span style={{ fontSize: 34 }}>/</span>
            <span style={{ fontSize: 34 }}>
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
          </div>

          <div
            className={
              pagination.current >= pagination.total / pagination.pageSize
                ? "right click-dsb"
                : "right"
            }
          >
            <div
              className={
                pagination.current >= pagination.total / pagination.pageSize
                  ? "click-dsb"
                  : "click"
              }
              style={{ fontSize: 34 }}
              onClick={onClickRight}
            >
              {">"}
            </div>
          </div>
        </div>
      ) : (
        <div className="statistics">
          <div className="statistics mrT-10">
            <div className="count-stat click" style={{ paddingRight: 15 }}>
              {codeMsg == 500 ? (
                <div className="img-error2"></div>
              ) : (
                <div className="img-error"></div>
              )}
            </div>
            <div className="mini-statistics">
              <div className="count-stat click" style={{ paddingRight: 15 }}>
                {codeMsg != 500 ? (
                  codeMsg != 200 ? (
                    <>
                      <h1 style={{ color: "#65687B" }}>
                        Здесь могла бы быть ваша реклама
                      </h1>
                      <a style={{ color: "#65687B" }}>
                        но здесь РЕКЛАМА REDGRY и ошибка:
                      </a>
                    </>
                  ) : (
                    <>
                      <h1 style={{ color: "#65687B" }}>
                        В вашем запросе 0 работников
                      </h1>
                      <a style={{ color: "#65687B" }}>-_-</a>
                    </>
                  )
                ) : (
                  <>
                    <h1 style={{ color: "#65687B" }}>Здесь могла бы быть</h1>
                    <a style={{ color: "#65687B" }}>ваша реклама</a>
                  </>
                )}
              </div>
              {codeMsg != 200 ? <div class="dotted-dot"></div> : <></>}
              <div className="organizations click" style={{ marginTop: 9 }}>
                {codeMsg != 200 ? (
                  <span style={{ color: "#65687B" }}>{errorMsg}</span>
                ) : (
                  <a style={{ color: "#65687B" }}>и РЕКЛАМА REDGRY</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {jsonData ? (
        <div className="cont">
          {jsonData.map((worker, index) => (
            <WorkerFrame key={index} worker={worker} loadData={loadData} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AwasomeTable;
