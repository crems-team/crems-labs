import React from 'react';
import { Button } from 'primereact/button';
import AgentModel from "../Models/AgentModel";



interface ActionBodyTemplateProps {
  rowData: AgentModel;
  handelclick: (rowData: AgentModel) => void;
}

const actionBodyTemplate = ({ rowData, handelclick }: ActionBodyTemplateProps) => {
  return (
    <React.Fragment>
      <Button rounded outlined className="mr-2" onClick={() => handelclick(rowData)} />
    </React.Fragment>
  );
};

export default actionBodyTemplate;
