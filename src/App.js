import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hr } from "./pages/Hr";
import SideBar from "./components/SideBar";
import { WorkerTable } from "./pages/WorkerTable";
import { Extra } from "./pages/Extra";
import usePreventZoom from "./utils/usePreventZoom";
import React, { useEffect, useRef, useState, createRef } from "react";

function App() {
  const circleMainRef = useRef(null);
  const connectingLineRef = useRef(null);
  const smallDotsRefs = Array.from({ length: 30 }, () => createRef());

  const [isDragging, setIsDragging] = useState(false);

  // Добавьте логику для отслеживания перетаскивания и изменения opacity.
  useEffect(() => {
    if (isDragging) {
      // Ваш код для перемещения "circle main" вниз.
      if (circleMainRef.current) {
        circleMainRef.current.style.transform = "translateY(100px)";
      }

      // Измените opacity у "small-dot" постепенно.
      smallDotsRefs.forEach((dotRef, index) => {
        const delay = index * 50; // Задержка для постепенной анимации.
        setTimeout(() => {
          if (dotRef.current) {
            dotRef.current.style.opacity = 0;
          }
        }, delay);
      });
    }
  }, [isDragging]);

  // Добавьте обработчики событий для начала и завершения перетаскивания.
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  usePreventZoom();
  return (
    // <BrowserRouter>
    //   <SideBar>
    //     <Routes>
    //       <Route path="/" element={<WorkerTable />} />
    //       <Route path="/extra" element={<Extra />} />
    //       <Route path="/hr" element={<Hr />} />
    //     </Routes>
    //   </SideBar>
    // </BrowserRouter>
    <>
      <div className="falter-nav">
        <div className="falter-intro">
          <div
            className="top-circle"
            style={{
              visibility: "inherit",
              opacity: 1,
              transform: "matrix(1, 0, 0, 1, 0, 0)",
            }}
            ref={circleMainRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
          >
            <div
              className="circle main"
              style={{ borderRadius: 50, height: 50, width: 50 }}
            />
            <div
              className="pulsate circle"
              style={{
                visibility: "hidden",
                opacity: 0,
                borderRadius: 200,
                height: 150,
                width: 150,
              }}
            />
          </div>
          <div className="connecting-line" ref={connectingLineRef}>
            {smallDotsRefs.map((dotRef, index) => (
              <span
                className="small-dot"
                key={index}
                ref={dotRef}
                style={{
                  visibility: "hidden",
                  opacity: 0,
                  transform: "matrix(1, 0, 0, 1, 0, 0)",
                }}
              />
            ))}
            <span
              className="small-dot"
              style={{
                visibility: "hidden",
                opacity: 0,
                transform: "matrix(1, 0, 0, 1, 0, 0)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.03125",
                transform: "matrix(1, 0, 0, 1, 0, 5)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.0625",
                transform: "matrix(1, 0, 0, 1, 0, 10)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.09375",
                transform: "matrix(1, 0, 0, 1, 0, 15)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.125",
                transform: "matrix(1, 0, 0, 1, 0, 20)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.15625",
                transform: "matrix(1, 0, 0, 1, 0, 25)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.1875",
                transform: "matrix(1, 0, 0, 1, 0, 30)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.21875",
                transform: "matrix(1, 0, 0, 1, 0, 35)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.25",
                transform: "matrix(1, 0, 0, 1, 0, 40)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.28125",
                transform: "matrix(1, 0, 0, 1, 0, 45)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.3125",
                transform: "matrix(1, 0, 0, 1, 0, 50)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.34375",
                transform: "matrix(1, 0, 0, 1, 0, 55)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.375",
                transform: "matrix(1, 0, 0, 1, 0, 60)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.40625",
                transform: "matrix(1, 0, 0, 1, 0, 65)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.4375",
                transform: "matrix(1, 0, 0, 1, 0, 70)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.46875",
                transform: "matrix(1, 0, 0, 1, 0, 75)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.5",
                transform: "matrix(1, 0, 0, 1, 0, 80)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.53125",
                transform: "matrix(1, 0, 0, 1, 0, 85)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.5625",
                transform: "matrix(1, 0, 0, 1, 0, 90)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.59375",
                transform: "matrix(1, 0, 0, 1, 0, 95)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.625",
                transform: "matrix(1, 0, 0, 1, 0, 100)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.65625",
                transform: "matrix(1, 0, 0, 1, 0, 105)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.6875",
                transform: "matrix(1, 0, 0, 1, 0, 110)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.71875",
                transform: "matrix(1, 0, 0, 1, 0, 115)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.75",
                transform: "matrix(1, 0, 0, 1, 0, 120)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.78125",
                transform: "matrix(1, 0, 0, 1, 0, 125)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.8125",
                transform: "matrix(1, 0, 0, 1, 0, 130)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.84375",
                transform: "matrix(1, 0, 0, 1, 0, 135)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.875",
                transform: "matrix(1, 0, 0, 1, 0, 140)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.90625",
                transform: "matrix(1, 0, 0, 1, 0, 145)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.9375",
                transform: "matrix(1, 0, 0, 1, 0, 150)",
              }}
            />
            <span
              className="small-dot"
              style={{
                visibility: "inherit",
                opacity: "0.96875",
                transform: "matrix(1, 0, 0, 1, 0, 155)",
              }}
            />
          </div>
          <div className="target-circle">
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 25, 0)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 24.6202, 4.3412)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 23.4923, 8.5505)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 21.6506, 12.5)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 19.1511, 16.0697)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 16.0697, 19.1511)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 12.5, 21.6506)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 8.5505, 23.4923)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 4.3412, 24.6202)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 1.53081e-15, 25)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -4.3412, 24.6202)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -8.5505, 23.4923)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -12.5, 21.6506)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -16.0697, 19.1511)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -19.1511, 16.0697)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -21.6506, 12.5)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -23.4923, 8.5505)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -24.6202, 4.3412)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -25, 3.06162e-15)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -24.6202, -4.3412)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -23.4923, -8.5505)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -21.6506, -12.5)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -19.1511, -16.0697)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -16.0697, -19.1511)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -12.5, -21.6506)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -8.5505, -23.4923)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -4.3412, -24.6202)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, -4.59243e-15, -25)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 4.3412, -24.6202)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 8.5505, -23.4923)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 12.5, -21.6506)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 16.0697, -19.1511)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 19.1511, -16.0697)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 21.6506, -12.5)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 23.4923, -8.5505)",
              }}
            />
            <span
              className="circle-small-dot"
              style={{
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 24.6202, -4.3412)",
              }}
            />
          </div>
          <div
            className="falter-intro-description"
            style={{ visibility: "inherit", opacity: 1, marginTop: 75 }}
          >
            <div
              style={{
                display: "block",
                textAlign: "center",
                position: "relative",
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 0, 0)",
              }}
            >
              Нажмите и перетащите кружок,
            </div>
            <div
              style={{
                display: "block",
                textAlign: "center",
                position: "relative",
                visibility: "inherit",
                opacity: 1,
                transform: "matrix(1, 0, 0, 1, 0, 0)",
              }}
            >
              чтобы открыть лабу по СОА!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
