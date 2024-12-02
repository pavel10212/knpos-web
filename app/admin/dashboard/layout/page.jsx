"use client";

import React, { useState } from "react";

const Layout = () => {
  const [activeFloor, setActiveFloor] = useState(1);
  const [floors, setFloors] = useState([{ id: 1, tables: [] }]);
  const [tableCounter, setTableCounter] = useState(1);

  const predefinedTables = [
    { type: "4-seater", shape: "square", size: "w-32 h-32" },
    { type: "2-seater", shape: "circle", size: "w-24 h-24" },
    { type: "6-seater", shape: "rectangle", size: "w-48 h-32" }, // made wider
  ];

  const GRID_SIZE = 20;

  const snapToGrid = (value) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleDragStart = (e, data, isTemplate = false) => {
    if (isTemplate) {
      e.dataTransfer.setData("type", "template");
      e.dataTransfer.setData("tableType", data);
    } else {
      e.dataTransfer.setData("type", "existing");
      e.dataTransfer.setData("tableId", data.toString());
    }
  };

  const handleDrop = (e) => {
    const type = e.dataTransfer.getData("type");
    const dropZone = e.currentTarget.getBoundingClientRect();
    const newX = snapToGrid(e.clientX - dropZone.left - 50);
    const newY = snapToGrid(e.clientY - dropZone.top - 50);

    const currentFloor = floors.find((floor) => floor.id === activeFloor);
    const setTables = (newTables) => {
      setFloors(
        floors.map((floor) =>
          floor.id === activeFloor ? { ...floor, tables: newTables } : floor
        )
      );
    };

    if (type === "template") {
      // Handle new table from template
      const tableType = e.dataTransfer.getData("tableType");
      const newTable = {
        id: tableCounter,
        label: `TABLE ${tableCounter}\n${
          tableType === "2-seater"
            ? "FITS 2"
            : tableType === "6-seater"
            ? "FITS 6"
            : "FITS 4"
        }`,
        x: newX,
        y: newY,
        rotation: 0,
        status: "available",
        type: tableType,
      };

      setTables([...currentFloor.tables, newTable]);
      setTableCounter((prev) => prev + 1);
    } else {
      // Handle moving existing table
      const tableId = parseInt(e.dataTransfer.getData("tableId"));
      setTables(
        currentFloor.tables.map((table) =>
          table.id === tableId ? { ...table, x: newX, y: newY } : table
        )
      );
    }
  };

  const handleRemoveTable = (tableId) => {
    const setTables = (newTables) => {
      setFloors(
        floors.map((floor) =>
          floor.id === activeFloor ? { ...floor, tables: newTables } : floor
        )
      );
    };
    setTables((prev) => prev.filter((table) => table.id !== tableId));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleRotateTable = (tableId) => {
    const setTables = (newTables) => {
      setFloors(
        floors.map((floor) =>
          floor.id === activeFloor ? { ...floor, tables: newTables } : floor
        )
      );
    };
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? { ...table, rotation: (table.rotation + 90) % 360 }
          : table
      )
    );
  };

  const saveLayout = () => {
    const layout = floors.reduce((acc, floor) => {
      acc[`floor${floor.id}`] = floor.tables;
      return acc;
    }, {});
    localStorage.setItem("restaurantLayout", JSON.stringify(layout));
    alert("Layout saved successfully!");
  };

  const addNewFloor = () => {
    const newFloorId = floors.length + 1;
    setFloors([...floors, { id: newFloorId, tables: [] }]);
    setActiveFloor(newFloorId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Layout</h1>

      <div className="flex space-x-2 mb-6">
        {floors.map((floor) => (
          <button
            key={floor.id}
            className={`${
              activeFloor === floor.id ? "bg-blue-500" : "bg-blue-300"
            } text-white py-2 px-4 rounded-md shadow-md focus:outline-none`}
            onClick={() => setActiveFloor(floor.id)}
          >
            Floor {floor.id}
          </button>
        ))}
        <button
          onClick={addNewFloor}
          className="bg-gray-200 text-black py-2 px-4 rounded-md shadow-md focus:outline-none"
        >
          +
        </button>
        <button
          onClick={saveLayout}
          className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none"
        >
          Save Layout
        </button>
      </div>

      {/* Drop Zone */}
      <div
        className="relative w-full h-[500px] border border-gray-300 bg-gray-50 mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {floors
          .find((floor) => floor.id === activeFloor)
          .tables.map((table) => (
            <div
              key={table.id}
              className={`absolute flex flex-col items-center justify-center border-2 ${
                table.status === "occupied"
                  ? "border-red-400 bg-red-50"
                  : table.status === "reserved"
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-400 bg-white"
              } cursor-move hover:border-blue-600 hover:shadow-lg transition-all ${
                table.type === "2-seater"
                  ? "rounded-full w-24 h-24"
                  : table.type === "6-seater"
                  ? "rounded-lg w-48 h-32" // made wider
                  : "rounded-lg w-32 h-32"
              }`}
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
                transform: `rotate(${table.rotation}deg)`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, table.id, false)}
            >
              <span className="text-center text-base font-semibold whitespace-pre text-gray-800">
                {table.label}
              </span>
              <div className="absolute top-1 right-1 flex space-x-1">
                <button
                  onClick={() => handleRotateTable(table.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ⟳
                </button>
                <button
                  onClick={() => handleRemoveTable(table.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Predefined Tables */}
      <div className="p-4 border-t-2 border-gray-300 bg-gray-100">
        <h2 className="text-black text-lg font-bold mb-4">Table Templates</h2>
        <div className="flex space-x-4">
          {predefinedTables.map((table, index) => (
            <div
              key={index}
              className={`flex items-center justify-center border-2 border-gray-400 bg-white cursor-move 
              hover:border-blue-600 hover:shadow-lg hover:bg-blue-50 transition-all ${
                table.shape === "circle" ? "rounded-full" : "rounded-lg"
              } ${table.size}`}
              draggable
              onDragStart={(e) => handleDragStart(e, table.type, true)}
            >
              <span className="text-center text-base font-semibold text-gray-800">
                {table.type === "2-seater"
                  ? "2"
                  : table.type === "6-seater"
                  ? "6"
                  : "4"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
