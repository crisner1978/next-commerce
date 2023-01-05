import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  RowData,
} from "@tanstack/react-table";
import { TabUser } from "./AccountPermissions";

interface Props {
  data: any[];
  columns: ColumnDef<TabUser>[];
  rowSelection: {};
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setData: React.Dispatch<React.SetStateAction<TabUser[]>>;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const Table = ({
  data,
  columns,
  rowSelection,
  setRowSelection,
  setData,
  updateData,
}: Props) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData },
    debugTable: true,
  });
  return (
    <table className="border-2 w-full border-gray-300 mt-2">
      <thead className="border-b-4 border-gray-400">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-x-2">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border-x-2 text-left p-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2 border-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
