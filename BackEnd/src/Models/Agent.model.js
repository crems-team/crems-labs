class Agent {
    constructor(agentIdC, agentfirstName, agentlastName,officeName, officeCity, officeState, officeId, agentPhone,agentEmail , officeAddress, officePhone ) {
        this.agentIdC 		=   agentIdC ;
        this.agentfirstName =   agentfirstName ;
        this.agentlastName  =   agentlastName;
        this.officeName     =   officeName ;
        this.officeCity     =   officeCity ;
        this.officeState    =   officeState ;
        this.officeId       =   officeId ;
        this.agentPhone     =   agentPhone;
        this.agentEmail     =   agentEmail  ;
        this.officeAddress =   officeAddress ;
        this.officePhone    =   officePhone;
        
    }
}
module.exports = Agent;