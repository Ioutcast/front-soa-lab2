import React from "react";
import "../styles/Worker.css";
const WorkerFrame = () => {
  let Name = "IVAnaaaaaaaaaaaaa";
  return (
    <div className="cont">
      <div className="worker">
        <div className="worker__inner">
          <div className="worker__id">
            <div className="id" style={{ marginRight: 5 }}>
              <span>№{1}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>MANAGER</span>
            </div>
            <div className="name__id">
              <span>{Name}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>Coord</span>
            </div>
            <div className="coordinate">
              <div className="coordinate__x">
                <span>x : {12999} </span>
              </div>
              <div className="coordinate__y">
                <span>y : {112342}</span>
              </div>
            </div>
          </div>
          <div className="salary">
            <i>S </i>
            <span>333333333333333333333333333333333333.33333</span>
          </div>
          <div class="line-horizontal"></div>
          <div className="creation_date">
            <i>CR </i>
            <span>2023-10-25 05:56:01</span>
          </div>
          <div className="date">
            <div className="start__date date-new">
              <i>SD </i>
              <span>2023-10-22</span>
            </div>
            <div className="end__date date-new">
              <i>ED </i>
              <span>2023-12-22</span>
            </div>
          </div>
          <div class="line-horizontal"></div>
          <div className="organization">
            <div className="organization__id">
              <i>aa </i>
              <span>1 </span>
            </div>
            <div class="dotted-dot"></div>
            <div className="organization__name">
              <i>aa </i>
              <span>Google </span>
            </div>
            <div className="organization__annualTurnover">
              <span>12323451$ </span>
            </div>
          </div>
        </div>
      </div>
      <div className="worker">
        <div className="worker__inner">
          <div className="worker__id">
            <div className="id" style={{ marginRight: 5 }}>
              <span>№{2}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>MANAGER</span>
            </div>
            <div className="name__id">
              <span>{Name}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>Coord</span>
            </div>
            <div className="coordinate">
              <div className="coordinate__x">
                <span>x : {12999} </span>
              </div>
              <div className="coordinate__y">
                <span>y : {112342}</span>
              </div>
            </div>
          </div>
          <div className="salary">
            <i>S </i>
            <span>333333333333333333333333333333333333.33333</span>
          </div>
          <div class="line-horizontal"></div>
          <div className="creation_date">
            <i>CR </i>
            <span>2023-10-25 05:56:01</span>
          </div>
          <div className="date">
            <div className="start__date date-new">
              <i>SD </i>
              <span>2023-10-22</span>
            </div>
            <div className="end__date date-new">
              <i>ED </i>
              <span>2023-12-22</span>
            </div>
          </div>
          <div class="line-horizontal"></div>
          <div className="organization">
            <div className="organization__id">
              <i>aa </i>
              <span>1 </span>
            </div>
            <div class="dotted-dot"></div>
            <div className="organization__name">
              <i>aa </i>
              <span>Google </span>
            </div>
            <div className="organization__annualTurnover">
              <span>12323451$ </span>
            </div>
          </div>
        </div>
      </div>
      <div className="worker">
        <div className="worker__inner">
          <div className="worker__id">
            <div className="id" style={{ marginRight: 5 }}>
              <span>№{3}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>MANAGER</span>
            </div>
            <div className="name__id">
              <span>{Name}</span>
            </div>
          </div>
          <div className="position_w_name">
            <div className="position__inner">
              <span>Coord</span>
            </div>
            <div className="coordinate">
              <div className="coordinate__x">
                <span>x : {12999} </span>
              </div>
              <div className="coordinate__y">
                <span>y : {112342}</span>
              </div>
            </div>
          </div>
          <div className="salary">
            <i>S </i>
            <span>333333333333333333333333333333333333.33333</span>
          </div>
          <div class="line-horizontal"></div>
          <div className="creation_date">
            <i>CR </i>
            <span>2023-10-25 05:56:01</span>
          </div>
          <div className="date">
            <div className="start__date date-new">
              <i>SD </i>
              <span>2023-10-22</span>
            </div>
            <div className="end__date date-new">
              <i>ED </i>
              <span>2023-12-22</span>
            </div>
          </div>
          <div class="line-horizontal"></div>
          {/* <div className="organization">
            <div className="organization__id">
              <i>aa </i>
              <span>1 </span>
            </div>
            <div class="dotted-dot"></div>
            <div className="organization__name">
              <i>aa </i>
              <span>Google </span>
            </div>
            <div className="organization__annualTurnover">
              <span>12323451$ </span>
            </div>
          </div> */}
          <div className="organization" style={{ justifyContent: "center" }}>
            <p>Fired</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerFrame;
