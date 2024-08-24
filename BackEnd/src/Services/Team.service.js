
const neo4j = require('neo4j-driver');

const TeamService = {};


// Configure Neo4j driver
const driver = neo4j.driver('neo4j+s://e0f2da96.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'EpuuDtyOoXBM63LPUZ2r06PyIdTsQkuFqbN7F4EfBF4'));

function cleanName(name) {
  return name.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ")
             .toLowerCase()
             .trim();
}


TeamService.getTeam= async (idAgent) => {
  const session = driver.session();

  const queryNode = `
  match (n:Agent{id:${idAgent}}) 
  return n.id as id, n.name as agentname,n.office as agentoffice
  union
  match (n{id:${idAgent}})-[r:list_with]-(m)
  return m.id as id, m.name as agentname,m.office as agentoffice
  union
  match (m)-[r:list_with]-(n:Agent{id:${idAgent}})
  return m.id as id, m.name as agentname,m.office as agentoffice
  `;

  const queryLinks = `
  MATCH (n:Agent{id:${idAgent}})-[r:list_with]->(m)
with r.count as count, n.id as source,m.id as target
RETURN source, count,target
union
MATCH (n)-[r:list_with]->(m:Agent{id:${idAgent}})
with r.count as count, n.id as source,m.id as target
RETURN source, count,target
`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);


    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
      const sourceNodeId = record.get('id').toString();
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id').toString();
      const     agentname =record.get('agentname').toString();
      const     agentoffice= record.get('agentoffice').toString();

        nodes.push({
            id: id,
            agentname: agentname,
            agentoffice: agentoffice,

        });
     
       
      
    });

    console.log(nodes)

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source').toString();
      const targetNodeId = record.get('target').toString();
      const count = record.get('count').toNumber(); // Assuming count is a numerical value

      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        count: count,
      });
    });
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};


module.exports = TeamService;