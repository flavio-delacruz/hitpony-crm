import { DataGrid } from "@mui/x-data-grid";

const filterModel = {
  items: [{ id: 1, field: "rating", operator: ">", value: "4" }],
};

const rows = [
  { id: 1, rating: 4.5, isAdmin: true },
  { id: 2, rating: 3.2, isAdmin: false },
  { id: 3, rating: 5.0, isAdmin: true },
  { id: 4, rating: 2.0, isAdmin: false },
];

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "rating", headerName: "Rating", width: 150 },
  { field: "isAdmin", headerName: "Is Admin", width: 150 },
];

const FilterUsuarios = () => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        filter: {
          filterModel: filterModel,
        },
      }}
    />
  );
};

export default FilterUsuarios;
