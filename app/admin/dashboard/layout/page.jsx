"use client";

import React, { useState } from "react";

import TableTemplates from "@/components/layout/TableTemplates";
import DraggableTable from "@/components/layout/DraggableTable";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Layout</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={saveLayout}
      >
        Save Changes
      </button>
      {/* Drop Zone */}
      <div
        className="relative w-full h-[500px] border border-gray-300 bg-gray-50 mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {floors
          .find((floor) => floor.id === activeFloor)
          .tables.map((table) => (
            <DraggableTable
              key={table.id}
              table={table}
              onDragStart={handleDragStart}
              onRotate={handleRotateTable}
              onRemove={handleRemoveTable}
            />
          ))}
      </div>

      <TableTemplates
        predefinedTables={predefinedTables}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

export default Layout;
