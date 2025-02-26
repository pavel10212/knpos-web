"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import TableTemplates from "@/components/layout/TableTemplates";
import DraggableTable from "@/components/layout/DraggableTable";
import {
  fetchTableData,
  saveTableLayout,
  deleteTable,
} from "@/services/dataService";
import { toast } from "sonner";



const GRID_SIZE = 50;
const CONTAINER_WIDTH = 1000;
const CONTAINER_HEIGHT = 600;
const TABLE_SIZE = 100; // Assuming average table size of 100px

const Layout = () => {
  const [tables, setTables] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Memoize formatTables function
  const formatTables = useCallback((tables) => {
    return tables.map((table) => ({
      id: table.table_num,
      type: `${table.capacity}-seater`,
      x: table.location.x,
      y: table.location.y,
      rotation: table.rotation.toString(),
      status: table.status,
      label: `Table ${table.table_num}\n${table.capacity} seats`,
    }));
  }, []);

  const loadTables = useCallback(async () => {
    try {
      const data = await fetchTableData();
      setTables(formatTables(data));
    } catch (error) {
      console.error("Error loading tables:", error);
      toast.error("Failed to load table layout");
    }
  }, [formatTables]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const saveToEC2 = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await saveTableLayout(tables);
      toast.success("Table layout saved successfully");
    } catch (error) {
      toast.error(`Failed to save layout: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [tables, isSaving]);

  // Memoize predefined tables
  const predefinedTables = useMemo(
    () => [
      { type: "4-seater", shape: "square", size: "w-32 h-32" },
      { type: "2-seater", shape: "circle", size: "w-24 h-24" },
      { type: "6-seater", shape: "rectangle", size: "w-48 h-32" },
    ],
    []
  );

  const snapToGrid = useCallback((value) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  const keepInBounds = useCallback((x, y) => {
    return {
      x: Math.max(0, Math.min(x, CONTAINER_WIDTH - TABLE_SIZE)),
      y: Math.max(0, Math.min(y, CONTAINER_HEIGHT - TABLE_SIZE))
    };
  }, []);

  const handleDragStart = useCallback((e, data, isTemplate = false) => {
    e.dataTransfer.setData("type", isTemplate ? "template" : "existing");
    e.dataTransfer.setData(
      isTemplate ? "tableType" : "tableId",
      data.toString()
    );
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("type");
      const dropZone = e.currentTarget.getBoundingClientRect();
      const rawX = e.clientX - dropZone.left - 50;
      const rawY = e.clientY - dropZone.top - 50;
      
      const { x: boundedX, y: boundedY } = keepInBounds(
        snapToGrid(rawX),
        snapToGrid(rawY)
      );

      if (type === "template") {
        const tableType = e.dataTransfer.getData("tableType");
        const newTable = {
          id: tables.length + 1,
          label: `TABLE ${tables.length + 1}\n${tableType.split("-")[0]} FITS`,
          x: boundedX,
          y: boundedY,
          rotation: 0,
          status: "available",
          type: tableType,
        };

        setTables((prev) => [...prev, newTable]);
      } else {
        const tableId = parseInt(e.dataTransfer.getData("tableId"));
        setTables((prev) =>
          prev.map((table) =>
            table.id === tableId ? { ...table, x: boundedX, y: boundedY } : table
          )
        );
      }
    },
    [tables.length, snapToGrid, keepInBounds]
  );

  const handleRemoveTable = useCallback(async (tableId) => {
    try {
      await deleteTable(tableId);
      setTables((prev) => {
        const updatedTables = prev.filter((table) => table.id !== tableId);
        const tablesToCache = updatedTables.map((table) => ({
          table_num: parseInt(table.id),
          status: "Available",
          capacity: parseInt(table.type[0]),
          location: { x: parseInt(table.x), y: parseInt(table.y) },
          rotation: parseInt(table.rotation),
        }));
        sessionStorage.setItem("tableLayout", JSON.stringify(tablesToCache));
        return updatedTables;
      });
      toast.success("Table deleted successfully");
    } catch (error) {
      toast.error("Failed to delete table");
    }
  }, []);

  const handleRotateTable = useCallback((tableId) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? { ...table, rotation: (parseInt(table.rotation) + 90) % 360 }
          : table
      )
    );
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Table Layout Management
          </h1>
          <button
            onClick={() => saveToEC2()}
            disabled={isSaving}
            className={`
              inline-flex items-center px-6 py-3 border border-transparent
              text-base font-medium rounded-full shadow-sm text-white
              transition-all duration-200 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500
              ${isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl w-[1000px] shadow-sm overflow-hidden mb-8">
          <div
            className="relative w-[1000px] h-[600px] bg-white border border-black"
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
        </div>

        <div>
          <TableTemplates
            predefinedTables={predefinedTables}
            onDragStart={handleDragStart}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
