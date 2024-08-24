import React from 'react';
import { useMapContext } from '../Components/Map/MapContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



const CremsTable = ({}) => {
  const { transactions } = useMapContext();

  return (
    <div>
    {transactions[0]?
    <DataTable value={transactions} paginator rows={10} sortField="total" sortOrder={-1}  rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '40rem' }}>
     
      <Column field="agentfirstname" header="First Name" sortable></Column>
      <Column field="agentlastname" header="Last Name" sortable></Column>
      <Column field="listings" header="Listings" sortable></Column>
      <Column field="selling" header="Selling" sortable></Column>
      <Column field="total" header="Total" sortable></Column>
      <Column field="zipcode" header="Zip" sortable ></Column>
 
    </DataTable>
    :"No results found"
    }
    </div>
  );
};

export default CremsTable;
