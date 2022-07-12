import { Switch } from "@headlessui/react";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import formatDate from "../utils/formatDate";
import { truncate } from "../utils/helperFunctions";
import updatePermission from "../utils/updatePermission";
import Table from "./Table";

interface Props {
  currentUserId: string;
}

export type TabUser = {
  _id: string | any;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: string;
};

const AccountPermissions = ({ currentUserId }: Props) => {
  const [data, setData] = useState<TabUser[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const url = `${baseUrl}/api/users`;
    const token = Cookies.get("token")!;
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setData(response.data);
  }

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    // Skip age index reset until after next rerender

    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          // MAKE API CALL TO CHANGE USER ROLE HERE
          const newRole = row.role === "admin" ? "user" : "admin";
          const _id = row._id;

          updatePermission(_id, row.role);
          return {
            ...old[rowIndex]!,
            [columnId]: newRole,
          };
        }
        return row;
      })
    );
  };

  const columns: ColumnDef<TabUser>[] = [
    {
      accessorKey: "name",
      header: () => "Name",
    },
    {
      accessorKey: "email",
      header: () => "Email",
    },
    {
      accessorKey: "createdAt",
      cell: info => formatDate(info.getValue()),
      header: () => "Joined",
    },
    {
      accessorKey: "updatedAt",
      cell: info => formatDate(info.getValue()),
      header: () => "Updated",
    },
    {
      accessorKey: "role",
      header: () => <span className="pr-5">Role</span>,
      cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue: string = getValue();

        // We need to keep and update the state of the cell normally
        const [admin, setAdmin] = useState(initialValue === "admin");

        const onUpdate = async () => {
          setAdmin(!admin);
          table.options.meta?.updateData(index, id, initialValue);
        };

        return (
          <div className="flex items-center justify-between gap-x-2">
            <Switch
              checked={admin}
              onChange={onUpdate}
              className={`${
                admin ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}>
              <span className="sr-only">Toggle Roles, User to Admin</span>
              <span
                className={`${
                  admin ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
            <p className="font-semibold">{admin ? "Admin" : "User"}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-4">
      <header className="flex items-center mt-4">
        <AdjustmentsIcon className="h-8 w-8 mr-2" />
        <h1 className="text-xl sm:text-2xl font-semibold">User Permissions</h1>
      </header>
      <Table
        data={data}
        setData={setData}
        columns={columns}
        updateData={updateData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};

export default AccountPermissions;
