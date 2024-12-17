"use client";

import React, { useEffect, useState } from "react";
import TableTemplates from "@/components/layout/TableTemplates";
import DraggableTable from "@/components/layout/DraggableTable";




const Layout = () => {
  const [tableCounter, setTableCounter] = useState(1);
  const [tables, setTables] = useState([]);
  const [isSaving, setIsSaving] = useState(false);


  const formatTables = (tables) => {
    const formattedTables = tables.map(table => ({
      id: table.table_num,
      type: `${table.capacity}-seater`,
      x: table.location.x,
      y: table.location.y,
      rotation: table.rotation.toString(),
      status: table.status,
      label: `Table ${table.table_num}\n${table.capacity} seats`
    }))
    return formattedTables
  }
  const loadTables = async () => {
    try {
      const cachedLayout = sessionStorage.getItem('tableLayout')
      if (cachedLayout) {
        const parsedLayout = JSON.parse(cachedLayout)
        const formattedTables = formatTables(parsedLayout)
        setTables(formattedTables)
      } else {
        console.log('fetching from server')
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/table-get`);
        console.log('got response', response)
        if (!response.ok) {
          throw new Error('Failed to fetch tables')
        }
        const data = await response.json()
        const formattedTables = formatTables(data);
        setTables(formattedTables)


        sessionStorage.setItem('tableLayout', JSON.stringify(data));
      }
    } catch (error) {
      console.log('Error loading tables:', error);
    }
  }


  useEffect(() => {
    loadTables();
  }, []);

  const saveToEC2 = async () => {
    setIsSaving(true);
    try {
      const tablesToSave = tables.map((table) => ({
        table_num: parseInt(table.id),
        status: "Available",
        capacity: parseInt(table.type[0]),
        location: {
          x: parseInt(table.x),
          y: parseInt(table.y),
        },
        rotation: parseInt(table.rotation),
      }));

      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/table-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tablesToSave),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to save tables");
      }

      sessionStorage.setItem('tableLayout', JSON.stringify(tablesToSave))

      console.log("Tables saved successfully");
    } catch (error) {
      console.error("Error saving tables:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };




  const predefinedTables = [
    { type: "4-seater", shape: "square", size: "w-32 h-32" },
    { type: "2-seater", shape: "circle", size: "w-24 h-24" },
    { type: "6-seater", shape: "rectangle", size: "w-48 h-32" },
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

    if (type === "template") {
      const tableType = e.dataTransfer.getData("tableType");
      const newTable = {
        id: tableCounter,
        label: `TABLE ${tableCounter}\n${tableType === "2-seater"
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

      setTables([...tables, newTable]);
      setTableCounter((prev) => prev + 1);
    } else {
      const tableId = parseInt(e.dataTransfer.getData("tableId"));
      setTables(
        tables.map((table) =>
          table.id === tableId ? { ...table, x: newX, y: newY } : table
        )
      );
    }
  };

  const handleRemoveTable = (tableId) => {
    setTables((prev) => prev.filter((table) => table.id !== tableId));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleRotateTable = (tableId) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? { ...table, rotation: (table.rotation + 90) % 360 }
          : table
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Layout</h1>
      <button
        className={`${isSaving ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        onClick={() => saveToEC2()}
        disabled={isSaving}
      >
        Save Changes
      </button>
      <div
        className="relative w-full h-[500px] border border-gray-300 bg-gray-50 mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {tables.map((table) => (
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
