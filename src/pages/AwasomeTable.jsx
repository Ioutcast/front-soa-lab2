import React from "react";
import WorkerFrame from "./WorkerFrame";
import { useEffect, useState } from "react";
import axios from "axios";
import xml2js, { parseString } from "xml2js";

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
    ];
    let inputString = event.target.value;
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
    const pattern = /^(!=|=|<|>|<=|>=)\s*\d+$/;

    let inputValue = event.target.value;
    let columnKey = event.target.id;

    if (!pattern.test(inputValue)) {
      event.target.value = "";
      const updatedFilterState = { ...filterState };
      delete updatedFilterState[columnKey];
      setFilterState(updatedFilterState);
      return;
    }
    const pattern1 = /^([<>!=]+)\s*(\d+)$/;

    const match = inputValue.match(pattern1);
    if (match) {
      const operator = transformOperator(match[1]);
      const value = match[2];
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };
  const loadData = async (pageCur) => {
    try {
      const queryParams = new URLSearchParams();
      console.log(filterState);
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
                // console.log(transformedDataArray);
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
  return (
    <>
      <div className="statistics">
        <div className="statistics welcome-screen">
          <div className="count-stat click" style={{ paddingRight: 15 }}>
            <h1 style={{ color: "#65687B" }}>100</h1>
            <a style={{ color: "#65687B" }}>работников</a>
          </div>
          <div className="mini-statistics">
            <div className="positions click" style={{ marginTop: 10 }}>
              <h4>4</h4>
              <a style={{ color: "#65687B" }}>позиций</a>
            </div>
            <div class="dotted-dot"></div>
            <div className="organizations click" style={{ marginTop: 10 }}>
              <h4>1000</h4>
              <a style={{ color: "#65687B" }}>организаций</a>
            </div>
          </div>
        </div>
      </div>
      <div className="filters">
        <div className="filter">
          <div style={{ marginBottom: 10 }}>Worker Filters</div>
          <div className="sort">
            <div className="sort__elements_title text-nowrap">
              <i class="icon-settings"></i>
              <span>Sort Elements</span>
            </div>
            <div className="input-v3 query__filter" style={{ width: "100%" }}>
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
          <div className="filter_flex">
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-size"></i>
                <span>Name:</span>
              </div>
              <div className="input-v3 name__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-star"></i>
                <span>Coord_x:</span>
              </div>
              <div className="input-v3 x__filter">
                <input
                  onKeyDown={handleKeyDown}
                  onBlur={handleChange}
                  id="coordinates.x"
                  className="input__filter"
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Type range"
                />
              </div>
            </div>
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-views"></i>
                <span>Coord_y:</span>
              </div>
              <div className="input-v3 y__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Creation Date:</span>
              </div>
              <div className="input-v3 creationDate__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Start Date:</span>
              </div>
              <div className="input-v3 startDate__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>End Date:</span>
              </div>
              <div className="input-v3 endDate__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Salary:</span>
              </div>
              <div className="input-v3 salary__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Position:</span>
              </div>
              <div className="input-v3 position__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Id:</span>
              </div>
              <div className="input-v3 Organization__id__filter">
                <input
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
            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Name:</span>
              </div>
              <div className="input-v3 Organization__name__filter">
                <input
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

            <div className="outer">
              <div class="txt-nowrap">
                <i class="icon-download"></i>
                <span>Annual Turnover:</span>
              </div>
              <div className="input-v3 Organization__annualTurnover__filter">
                <input
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
      {jsonData ? (
        <div className="cont">
          {jsonData.map((worker, index) => (
            <WorkerFrame key={index} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="net">net</div>
      )}
    </>
  );
};

export default AwasomeTable;
